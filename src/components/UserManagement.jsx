import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, UserPlus, Trash2, Shield } from 'lucide-react';

function UserManagement({ onBack }) {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', formData);
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
      alert('New staff member added successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to revoke this user's access?")) {
      try {
        await axios.delete(`/api/auth/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl flex items-center gap-2">
            <Shield /> Staff Management
          </h2>
          <p className="text-secondary mt-1">Add or remove access for Pratiksha Technologies staff.</p>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="glass-panel p-6">
          <h3 className="text-xl mb-4 flex items-center gap-2"><UserPlus size={18}/> Create New Account</h3>
          <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '4px', width: '100%' }}
            />
            <input 
              type="email" 
              placeholder="Company Email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
              style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '4px', width: '100%' }}
            />
            <input 
              type="password" 
              placeholder="Temporary Password" 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required
              style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '4px', width: '100%' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>Add Staff Member</button>
          </form>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-xl mb-4">Authorized Staff List</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                <th style={{ padding: '1rem 0.5rem' }}>Email Address</th>
                <th style={{ padding: '1rem 0.5rem' }}>Role</th>
                <th style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>Revoke</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>{u.name}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary-color)', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(u._id)}
                      style={{ color: 'var(--danger-color)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
