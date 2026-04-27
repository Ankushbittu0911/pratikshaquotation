import React from 'react';
import { Plus, Edit2, Trash2, FileText, ChevronRight } from 'lucide-react';
import { templates } from '../data/templates';

function Dashboard({ quotations, onCreateNew, onEdit, onDelete }) {
  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl mb-2">Quotations</h2>
          <p className="text-secondary">Manage and create panel quotations.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => onCreateNew('MCC_AUTO')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--secondary-color)', color: '#000' }}
            >
              <Plus size={16} /> Auto MCC Wizard
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => onCreateNew('PCC_AUTO')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--secondary-color)', color: '#000' }}
            >
              <Plus size={16} /> Auto PCC Wizard
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => onCreateNew('APFC_AUTO')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--secondary-color)', color: '#000' }}
            >
              <Plus size={16} /> Auto APFC Wizard
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => onCreateNew('VFD_AUTO')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'var(--secondary-color)', color: '#000' }}
            >
              <Plus size={16} /> Auto VFD Wizard
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onCreateNew('PRICING_LIB')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', marginLeft: '1rem' }}
            >
              Manage Price Library
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onCreateNew('CLIENT_MGR')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', marginLeft: '1rem' }}
            >
              Manage Clients
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onCreateNew('USER_MGR')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', marginLeft: '1rem', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}
            >
              Staff Access
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onCreateNew('ANALYTICS')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', marginLeft: '1rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8' }}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {quotations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ 
            width: '80px', height: '80px', 
            borderRadius: '50%', 
            background: 'var(--surface-color-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <FileText size={40} color="var(--text-secondary)" />
          </div>
          <h3 className="text-2xl mb-2">No Quotations Yet</h3>
          <p className="text-secondary mb-6">Create your first quotation by selecting a panel type above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {quotations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(q => (
            <div key={q.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.3s ease' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{q.project}</h4>
                  <span style={{ 
                    background: 'rgba(59, 130, 246, 0.2)', 
                    color: 'var(--primary-color)',
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {q.refNo} - {q.revision}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {q.date}
                </div>
              </div>
              
              <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Client:</span> {q.client || 'Not specified'}
                </p>
                <p>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Items:</span> {q.sections.reduce((acc, sec) => acc + sec.items.length, 0)}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-auto">
                <div className="flex gap-2">
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.5rem' }}
                    onClick={() => onEdit(q.id)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.5rem' }}
                    onClick={() => onDelete(q.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '0.5rem 1rem' }}
                  onClick={() => onEdit(q.id)}
                >
                  Open <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
