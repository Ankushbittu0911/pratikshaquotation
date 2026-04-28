import React, { useState, useEffect } from 'react';
import { Plus, FileText, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import Dashboard from './components/Dashboard';
import QuotationEditor from './components/QuotationEditor';
import QuotationPreview from './components/QuotationPreview';
import MCCWizard from './components/MCCWizard';
import PCCWizard from './components/PCCWizard';
import APFCWizard from './components/APFCWizard';
import VFDWizard from './components/VFDWizard';
import PricingLibrary from './components/PricingLibrary';
import ClientManager from './components/ClientManager';
import UserManagement from './components/UserManagement';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Auth from './components/Auth';
import { templates, defaultTerms } from './data/templates';
import axios from 'axios';

// Set dynamic base URL for production deployment
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('pt_token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, editor, preview
  const [quotations, setQuotations] = useState([]);
  const [currentQuotation, setCurrentQuotation] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('pt_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('pt_token');
    localStorage.removeItem('pt_user');
    setUser(null);
  };

  // Load from MongoDB on mount if logged in
  useEffect(() => {
    if (user) {
      axios.get('/api/quotations')
        .then(res => setQuotations(res.data))
        .catch(err => console.error('Failed to load quotations', err));
    }
  }, [user]);

  const handleCreateNew = (panelType) => {
    if (panelType === 'MCC_AUTO') {
      setCurrentView('mcc_wizard');
      return;
    }
    if (panelType === 'PCC_AUTO') {
      setCurrentView('pcc_wizard');
      return;
    }
    if (panelType === 'APFC_AUTO') {
      setCurrentView('apfc_wizard');
      return;
    }
    if (panelType === 'VFD_AUTO') {
      setCurrentView('vfd_wizard');
      return;
    }
    if (panelType === 'PRICING_LIB') {
      setCurrentView('pricing');
      return;
    }
    if (panelType === 'CLIENT_MGR') {
      setCurrentView('clients');
      return;
    }
    if (panelType === 'USER_MGR') {
      setCurrentView('users');
      return;
    }
    if (panelType === 'ANALYTICS') {
      setCurrentView('analytics');
      return;
    }

    const template = templates[panelType];
    const newQuotation = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      client: '',
      project: template.name,
      refNo: `PT-00${quotations.length + 1}`,
      revision: 'R00',
      sections: JSON.parse(JSON.stringify(template.sections)), // Deep copy
      terms: [...defaultTerms],
      offerCost: 0,
      createdAt: new Date().toISOString(),
    };
    setCurrentQuotation(newQuotation);
    setCurrentView('editor');
  };

  const handleWizardGenerate = (sections, projectName = 'MCC Panel') => {
    // 1. Fetch live prices from Local Price Library
    const savedPricing = localStorage.getItem('pt_pricing_db');
    const pricingDb = savedPricing ? JSON.parse(savedPricing) : [];

    // 2. Auto-inject prices into generated sections
    const pricedSections = sections.map(section => ({
      ...section,
      items: section.items.map(item => {
        // Try to match description and make precisely
        const match = pricingDb.find(p => 
          p.description.trim().toLowerCase() === item.description.trim().toLowerCase() && 
          (p.make.trim().toLowerCase() === item.make.trim().toLowerCase() || item.make === '-' || p.make === '-')
        );
        return {
          ...item,
          unitRate: match ? match.unitRate : 0
        };
      })
    }));

    const newQuotation = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      client: '',
      project: projectName,
      refNo: `PT-00${quotations.length + 1}`,
      revision: 'R00',
      sections: pricedSections,
      terms: [...defaultTerms],
      offerCost: 0,
      createdAt: new Date().toISOString(),
    };
    setCurrentQuotation(newQuotation);
    setCurrentView('editor');
  };

  const handleEdit = (id) => {
    const q = quotations.find((item) => item.id === id);
    if (q) {
      setCurrentQuotation({ ...q });
      setCurrentView('editor');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      setQuotations(quotations.filter((q) => q.id !== id));
    }
  };

  const handleSaveQuotation = (quotationToSave) => {
    // 1. Auto-Learn Pricing Logic
    const savedPricing = localStorage.getItem('pt_pricing_db');
    let pricingDb = savedPricing ? JSON.parse(savedPricing) : [];
    let pricingUpdated = false;
    let totalOfferCost = 0;

    quotationToSave.sections.forEach(section => {
      section.items.forEach(item => {
        const itemCost = (item.qty || 0) * (item.unitRate || 0) * (1 - ((item.discount || 0) / 100));
        totalOfferCost += itemCost;
        if (item.unitRate > 0 && item.description.trim() !== '') {
          const existingIndex = pricingDb.findIndex(p => 
            p.description.trim().toLowerCase() === item.description.trim().toLowerCase() && 
            (p.make.trim().toLowerCase() === item.make.trim().toLowerCase() || item.make === '-' || p.make === '-')
          );

          if (existingIndex >= 0) {
            if (pricingDb[existingIndex].unitRate !== item.unitRate) {
              pricingDb[existingIndex].unitRate = item.unitRate;
              pricingUpdated = true;
            }
          } else {
            pricingDb.push({
              id: Date.now() + Math.random(),
              description: item.description,
              make: item.make,
              unitRate: item.unitRate
            });
            pricingUpdated = true;
          }
        }
      });
    });
    
    // Assign calculated offerCost
    quotationToSave.offerCost = totalOfferCost;

    if (pricingUpdated) {
      localStorage.setItem('pt_pricing_db', JSON.stringify(pricingDb));
    }

    // 2. Save Quotation to MongoDB
    let updatedList;
    if (quotations.find(q => q._id === quotationToSave._id || q.id === quotationToSave.id)) {
      // Update existing
      axios.put(`/api/quotations/${quotationToSave._id || quotationToSave.id}`, quotationToSave)
        .then(res => {
          updatedList = quotations.map(q => (q._id === res.data._id || q.id === res.data.id) ? res.data : q);
          setQuotations(updatedList);
          setCurrentQuotation(res.data);
          setCurrentView('preview');
        })
        .catch(err => {
          console.error('Failed to update quotation', err);
          alert('Failed to save to cloud.');
        });
    } else {
      // Create new
      axios.post('/api/quotations', quotationToSave)
        .then(res => {
          updatedList = [res.data, ...quotations];
          setQuotations(updatedList);
          setCurrentQuotation(res.data);
          setCurrentView('preview');
        })
        .catch(err => {
          console.error('Failed to save quotation', err);
          alert('Failed to save to cloud.');
        });
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="glass-panel no-print header-mobile-wrap" style={{ 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderRadius: 0,
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'var(--primary-color)',
            color: 'white',
            width: '40px', height: '40px',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '1.2rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            PT
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Pratiksha Technologies</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Quotation Builder</p>
          </div>
        </div>
        
        {user && (
          <nav className="nav-mobile-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }} className="hide-on-mobile">
              Welcome, {user.name}
            </span>
            <button 
              className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            {currentQuotation && (
              <>
                <button 
                  className={`btn ${currentView === 'editor' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCurrentView('editor')}
                >
                  <Settings size={18} /> Editor
                </button>
                <button 
                  className={`btn ${currentView === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCurrentView('preview')}
                >
                  <FileText size={18} /> Preview
                </button>
              </>
            )}
            <button 
              className="btn btn-secondary"
              onClick={handleLogout}
              style={{ color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        )}
      </header>

      <main style={{ flex: 1, position: 'relative' }}>
        {!user ? (
          <Auth onLogin={setUser} />
        ) : (
          <>
            {currentView === 'dashboard' && (
              <Dashboard 
                quotations={quotations} 
                onCreateNew={handleCreateNew} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
        
        {currentView === 'mcc_wizard' && (
          <MCCWizard 
            onGenerate={(sections) => handleWizardGenerate(sections, 'MCC Panel')}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'pcc_wizard' && (
          <PCCWizard 
            onGenerate={(sections) => handleWizardGenerate(sections, 'PCC Panel')}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'apfc_wizard' && (
          <APFCWizard 
            onGenerate={(sections) => handleWizardGenerate(sections, 'APFC Panel')}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'vfd_wizard' && (
          <VFDWizard 
            onGenerate={(sections) => handleWizardGenerate(sections, 'VFD Panel')}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'pricing' && (
          <PricingLibrary 
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'clients' && (
          <ClientManager 
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'users' && (
          <UserManagement 
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsDashboard 
            quotations={quotations}
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'editor' && currentQuotation && (
          <QuotationEditor 
            quotation={currentQuotation} 
            onSave={handleSaveQuotation}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}
        
        {currentView === 'preview' && currentQuotation && (
          <QuotationPreview 
            quotation={currentQuotation}
            onBack={() => setCurrentView('editor')}
          />
        )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
