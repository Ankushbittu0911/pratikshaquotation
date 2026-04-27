import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Search, Database } from 'lucide-react';
import axios from 'axios';

function PricingLibrary({ onBack }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/prices')
      .then(res => setItems(res.data))
      .catch(err => console.error('Failed to fetch prices:', err));
  }, []);

  const handleSave = async () => {
    try {
      const cleanedItems = items.filter(i => i.description.trim() !== '' || i.make.trim() !== '');
      await axios.post('/api/prices/sync', cleanedItems);
      setItems(cleanedItems);
      alert('Price Library saved successfully to MongoDB!');
    } catch (error) {
      console.error(error);
      alert('Failed to save price library.');
    }
  };

  const addItem = () => {
    setItems([{ id: Date.now(), description: '', make: '', unitRate: 0 }, ...items]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const filteredItems = items.filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl flex items-center gap-2">
            <Database /> Master Price Library
          </h2>
          <p className="text-secondary mt-1">Manage standard unit rates for automated BOM pricing.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> Save Library
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2" style={{ background: 'var(--surface-color)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border-color)', width: '300px' }}>
            <Search size={16} className="text-secondary" />
            <input 
              type="text" 
              placeholder="Search components or makes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
            />
          </div>
          
          <button className="btn btn-primary" onClick={addItem} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add New Component
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0.5rem', width: '50%' }}>Description (Must match BOM exactly)</th>
              <th style={{ padding: '1rem 0.5rem', width: '25%' }}>Make</th>
              <th style={{ padding: '1rem 0.5rem', width: '20%' }}>Unit Rate (₹)</th>
              <th style={{ padding: '1rem 0.5rem', width: '5%' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={item.description} 
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="e.g. 63A, TP, MCB"
                    style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem' }}
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={item.make} 
                    onChange={(e) => updateItem(item.id, 'make', e.target.value)}
                    placeholder="e.g. SIEMENS"
                    style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem' }}
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <input 
                    type="number" 
                    value={item.unitRate} 
                    onChange={(e) => updateItem(item.id, 'unitRate', Number(e.target.value))}
                    min="0"
                    style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem' }}
                  />
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  <button 
                    onClick={() => removeItem(item.id)}
                    style={{ color: 'var(--danger-color)', cursor: 'pointer', background: 'transparent', border: 'none' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No components found. Click "Add New Component" to start building your library.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PricingLibrary;
