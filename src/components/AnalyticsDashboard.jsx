import React, { useMemo, useState } from 'react';
import { ArrowLeft, TrendingUp, FileText, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb923c', '#4ade80'];

function AnalyticsDashboard({ quotations, onBack }) {
  const [dateFilter, setDateFilter] = useState('all'); // all, month, year

  const filteredQuotations = useMemo(() => {
    const now = new Date();
    return quotations.filter(q => {
      const qDate = new Date(q.date || q.createdAt);
      if (dateFilter === 'month') {
        return qDate.getMonth() === now.getMonth() && qDate.getFullYear() === now.getFullYear();
      }
      if (dateFilter === 'year') {
        return qDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [quotations, dateFilter]);

  const stats = useMemo(() => {
    let totalValue = 0;
    const projectTypes = {};
    const monthlyData = {};

    filteredQuotations.forEach(q => {
      const value = q.offerCost || 0;
      totalValue += value;

      // Project Types
      const type = q.project || 'Other';
      if (!projectTypes[type]) projectTypes[type] = { name: type, value: 0, count: 0 };
      projectTypes[type].value += value;
      projectTypes[type].count += 1;

      // Monthly Data
      const date = new Date(q.date || q.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      if (!monthlyData[monthYear]) monthlyData[monthYear] = { name: monthYear, Total: 0 };
      monthlyData[monthYear].Total += value;
    });

    const pieData = Object.values(projectTypes);
    const barData = Object.values(monthlyData).sort((a,b) => new Date(a.name) - new Date(b.name));

    return {
      totalCount: filteredQuotations.length,
      totalValue,
      pieData,
      barData
    };
  }, [filteredQuotations]);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl flex items-center gap-2">
            <TrendingUp /> Analytics & Reports
          </h2>
          <p className="text-secondary mt-1">Overview of all quotation values and project distributions.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '4px', color: 'var(--text-color)' }}
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
          </select>
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
            <FileText size={24} />
          </div>
          <div>
            <p className="text-secondary text-sm">Total Quotations</p>
            <h3 className="text-3xl font-bold">{stats.totalCount}</h3>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4">
          <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '1rem', borderRadius: '50%', color: '#4ade80' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-secondary text-sm">Total Quoted Value</p>
            <h3 className="text-3xl font-bold">₹{stats.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
          </div>
        </div>
        
        <div className="glass-panel p-6 flex items-center gap-4">
          <div style={{ background: 'rgba(192, 132, 252, 0.1)', padding: '1rem', borderRadius: '50%', color: '#c084fc' }}>
            <PieChartIcon size={24} />
          </div>
          <div>
            <p className="text-secondary text-sm">Avg. Panel Value</p>
            <h3 className="text-3xl font-bold">
              ₹{stats.totalCount ? (stats.totalValue / stats.totalCount).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : 0}
            </h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Bar Chart */}
        <div className="glass-panel p-6">
          <h3 className="text-xl mb-6">Monthly Quotation Value (₹)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Value']}
                />
                <Bar dataKey="Total" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-panel p-6">
          <h3 className="text-xl mb-6">Distribution by Panel Type</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Value']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Detail Table */}
      <div className="glass-panel p-6 mt-8">
        <h3 className="text-xl mb-6">Panel Type Breakdown</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0.5rem' }}>Panel Type</th>
              <th style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>Total Quotes</th>
              <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {stats.pieData.map((data, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }}></div>
                  {data.name}
                </td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>{data.count}</td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: 'bold' }}>₹{data.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AnalyticsDashboard;
