import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Search, Users } from 'lucide-react';
import axios from 'axios';

function ClientManager({ onBack }) {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error('Failed to load clients', err));
  }, []);

  const handleSave = async () => {
    try {
      const cleaned = clients.filter(c => c.companyName?.trim() !== '');
      for (const client of cleaned) {
        if (client._id) {
          await axios.put(`/api/clients/${client._id}`, client);
        } else {
          await axios.post('/api/clients', client);
        }
      }
      const res = await axios.get('/api/clients');
      setClients(res.data);
      alert('Client Directory saved successfully to MongoDB!');
    } catch (err) {
      alert('Failed to save to cloud.');
    }
  };

  const removeClient = async (id, _id) => {
    if (_id) {
      await axios.delete(`/api/clients/${_id}`);
    }
    setClients(clients.filter(c => c.id !== id && c._id !== _id));
  };

  const addClient = () => {
    setClients([{ 
      id: Date.now(), 
      companyName: '', 
      address: '', 
      gstNumber: '',
      contactPerson: '',
      phone: '',
      email: ''
    }, ...clients]);
  };


  const updateClient = (id, field, value) => {
    setClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const filteredClients = clients.filter(c => 
    (c.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.gstNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl flex items-center gap-2">
            <Users /> Client Directory
          </h2>
          <p className="text-secondary mt-1">Manage company details, addresses, and GST profiles.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-secondary" onClick={onBack}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} /> Save Directory
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2" style={{ background: 'var(--surface-color)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border-color)', width: '300px' }}>
            <Search size={16} className="text-secondary" />
            <input 
              type="text" 
              placeholder="Search company or GST..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
            />
          </div>
          
          <button className="btn btn-primary" onClick={addClient} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={16} /> Add New Client
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0.5rem', width: '20%' }}>Company Name</th>
                <th style={{ padding: '1rem 0.5rem', width: '25%' }}>Full Address</th>
                <th style={{ padding: '1rem 0.5rem', width: '15%' }}>GST Number</th>
                <th style={{ padding: '1rem 0.5rem', width: '15%' }}>Contact Person</th>
                <th style={{ padding: '1rem 0.5rem', width: '10%' }}>Phone</th>
                <th style={{ padding: '1rem 0.5rem', width: '10%' }}>Email</th>
                <th style={{ padding: '1rem 0.5rem', width: '5%' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'top' }}>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={client.companyName} 
                      onChange={(e) => updateClient(client.id, 'companyName', e.target.value)}
                      placeholder="e.g. Vasu Chemical"
                      style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <textarea 
                      value={client.address} 
                      onChange={(e) => updateClient(client.id, 'address', e.target.value)}
                      placeholder="Plot No. 123, Tarapur MIDC..."
                      style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem', resize: 'vertical', minHeight: '40px' }}
                      rows="2"
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={client.gstNumber} 
                      onChange={(e) => updateClient(client.id, 'gstNumber', e.target.value)}
                      placeholder="e.g. 27ABCDE1234F1Z5"
                      style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={client.contactPerson} 
                      onChange={(e) => updateClient(client.id, 'contactPerson', e.target.value)}
                      placeholder="Person Name"
                      style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={client.phone} 
                      onChange={(e) => updateClient(client.id, 'phone', e.target.value)}
                      placeholder="Phone No"
                      style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={client.email} 
                      onChange={(e) => updateClient(client.id, 'email', e.target.value)}
                      placeholder="Email ID"
                      style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-color)', padding: '0.5rem' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => removeClient(client.id, client._id)}
                      style={{ color: 'var(--danger-color)', cursor: 'pointer', background: 'transparent', border: 'none', marginTop: '0.5rem' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No clients found. Click "Add New Client" to start building your directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClientManager;
