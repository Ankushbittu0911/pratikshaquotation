import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, User } from 'lucide-react';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      localStorage.setItem('pt_token', res.data.token);
      localStorage.setItem('pt_user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed. Server might be offline.');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 className="text-2xl mb-6 text-center" style={{ color: 'var(--primary-color)' }}>
          {isLogin ? 'Pratiksha ERP Login' : 'Create Admin Account'}
        </h2>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div className="flex items-center" style={{ background: 'var(--surface-color)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <User size={18} className="text-secondary mr-2" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required={!isLogin}
                style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
              />
            </div>
          )}

          <div className="flex items-center" style={{ background: 'var(--surface-color)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            <Mail size={18} className="text-secondary mr-2" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
            />
          </div>

          <div className="flex items-center" style={{ background: 'var(--surface-color)', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            <Lock size={18} className="text-secondary mr-2" />
            <input 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              style={{ background: 'transparent', border: 'none', width: '100%', outline: 'none' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
            {isLogin ? 'Secure Login' : 'Register Account'}
          </button>
        </form>

        {/* Registration is now disabled since Admin account is created */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Authorized Pratiksha Technologies Staff Only
        </div>
      </div>
    </div>
  );
}

export default Auth;
