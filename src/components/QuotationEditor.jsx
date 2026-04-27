import React, { useState } from 'react';
import { Save, X, Plus, Trash2, ArrowRight } from 'lucide-react';

function QuotationEditor({ quotation: initialQuotation, onSave, onCancel }) {
  const [quotation, setQuotation] = useState({ ...initialQuotation });
  const [savedClients, setSavedClients] = useState(() => {
    const saved = localStorage.getItem('pt_clients_db');
    return saved ? JSON.parse(saved) : [];
  });

  const loadClientIntoQuotation = (clientId) => {
    const client = savedClients.find(c => c.id.toString() === clientId);
    if (client) {
      const formattedAddress = [
        client.companyName,
        client.address,
        client.gstNumber ? `GST: ${client.gstNumber}` : '',
        client.contactPerson ? `Attn: ${client.contactPerson} (${client.phone || ''})` : ''
      ].filter(Boolean).join('\n');
      
      setQuotation(prev => ({ ...prev, client: formattedAddress }));
    }
  };

  const handleChange = (field, value) => {
    setQuotation(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (sectionIndex, itemIndex, field, value) => {
    const newSections = [...quotation.sections];
    newSections[sectionIndex].items[itemIndex][field] = value;
    setQuotation(prev => ({ ...prev, sections: newSections }));
  };

  const addItem = (sectionIndex) => {
    const newSections = [...quotation.sections];
    newSections[sectionIndex].items.push({
      description: '', modelNo: '', make: '', qty: 1, uom: 'Nos', unitRate: 0, discount: 0
    });
    setQuotation(prev => ({ ...prev, sections: newSections }));
  };

  const removeItem = (sectionIndex, itemIndex) => {
    const newSections = [...quotation.sections];
    newSections[sectionIndex].items.splice(itemIndex, 1);
    setQuotation(prev => ({ ...prev, sections: newSections }));
  };

  const addSection = () => {
    setQuotation(prev => ({
      ...prev,
      sections: [...prev.sections, { name: 'NEW SECTION', items: [] }]
    }));
  };

  const updateSectionName = (index, name) => {
    const newSections = [...quotation.sections];
    newSections[index].name = name;
    setQuotation(prev => ({ ...prev, sections: newSections }));
  };

  const removeSection = (index) => {
    const newSections = [...quotation.sections];
    newSections.splice(index, 1);
    setQuotation(prev => ({ ...prev, sections: newSections }));
  };

  const updateTerm = (index, value) => {
    const newTerms = [...quotation.terms];
    newTerms[index] = value;
    setQuotation(prev => ({ ...prev, terms: newTerms }));
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl">Edit {quotation.project}</h2>
        <div className="flex gap-4">
          <button className="btn btn-secondary" onClick={onCancel}>
            <X size={18} /> Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onSave(quotation)}>
            <Save size={18} /> Save & Preview
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 mb-8">
        <h3 className="text-xl mb-4" style={{ color: 'var(--primary-color)' }}>General Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 col-span-2">
            <div className="flex justify-between items-end">
              <label>Client Name & Address</label>
              <div className="flex gap-2">
                <select 
                  onChange={(e) => {
                    if(e.target.value) loadClientIntoQuotation(e.target.value);
                  }}
                  className="bg-transparent border border-border rounded text-sm p-1"
                  style={{ maxWidth: '300px' }}
                >
                  <option value="">-- Load Saved Client --</option>
                  {savedClients.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName}</option>
                  ))}
                </select>
              </div>
            </div>
            <textarea 
              value={quotation.client} 
              onChange={(e) => handleChange('client', e.target.value)} 
              placeholder="e.g. Vasu Chemical&#10;Plot 123, Tarapur MIDC...&#10;GST: 27ABC..."
              rows="4"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Project Name</label>
            <input 
              type="text" 
              value={quotation.project} 
              onChange={(e) => handleChange('project', e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Reference No.</label>
            <input 
              type="text" 
              value={quotation.refNo} 
              onChange={(e) => handleChange('refNo', e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Date</label>
            <input 
              type="date" 
              value={quotation.date} 
              onChange={(e) => handleChange('date', e.target.value)} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Revision</label>
            <input 
              type="text" 
              value={quotation.revision} 
              onChange={(e) => handleChange('revision', e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <h3 className="text-2xl">Bill of Materials</h3>
        <button className="btn btn-secondary" onClick={addSection}>
          <Plus size={18} /> Add Section
        </button>
      </div>

      {quotation.sections.map((section, sIndex) => (
        <div key={sIndex} className="glass-panel p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <input 
              type="text" 
              value={section.name} 
              onChange={(e) => updateSectionName(sIndex, e.target.value)}
              style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid var(--primary-color)',
                color: 'var(--text-primary)',
                borderRadius: 0,
                padding: '0.25rem 0'
              }}
            />
            <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => removeSection(sIndex)}>
              <Trash2 size={16} />
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left', fontSize: '0.9rem' }}>
                <th style={{ padding: '0.5rem', width: '30%' }}>Description</th>
                <th style={{ padding: '0.5rem', width: '15%' }}>Model No.</th>
                <th style={{ padding: '0.5rem', width: '10%' }}>Make</th>
                <th style={{ padding: '0.5rem', width: '8%' }}>Qty</th>
                <th style={{ padding: '0.5rem', width: '8%' }}>UOM</th>
                <th style={{ padding: '0.5rem', width: '10%' }}>Unit Rate (₹)</th>
                <th style={{ padding: '0.5rem', width: '7%' }}>Disc (%)</th>
                <th style={{ padding: '0.5rem', width: '10%' }}>Total (₹)</th>
                <th style={{ padding: '0.5rem', width: '2%' }}></th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item, iIndex) => (
                <tr key={iIndex} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={item.description} 
                      onChange={(e) => handleItemChange(sIndex, iIndex, 'description', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={item.modelNo || ''} 
                      onChange={(e) => handleItemChange(sIndex, iIndex, 'modelNo', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={item.make} 
                      onChange={(e) => handleItemChange(sIndex, iIndex, 'make', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="number" 
                      value={item.qty} 
                      onChange={(e) => handleItemChange(sIndex, iIndex, 'qty', Number(e.target.value))}
                      style={{ width: '100%' }}
                      min="1"
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={item.uom} 
                      onChange={(e) => handleItemChange(sIndex, iIndex, 'uom', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="number" 
                      value={item.unitRate} 
                      onChange={(e) => handleItemChange(sIndex, iIndex, 'unitRate', Number(e.target.value))}
                      style={{ width: '100%' }}
                      min="0"
                    />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input 
                      type="number" 
                      value={item.discount || 0} 
                      onChange={(e) => handleItemChange(sIndex, iIndex, 'discount', Number(e.target.value))}
                      style={{ width: '100%' }}
                      min="0" max="100"
                    />
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {((item.qty * (item.unitRate || 0)) * (1 - ((item.discount || 0) / 100))).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => removeItem(sIndex, iIndex)}
                      style={{ color: 'var(--danger-color)', padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button 
            onClick={() => addItem(sIndex)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              color: 'var(--primary-color)', background: 'transparent', 
              border: 'none', cursor: 'pointer', padding: '0.5rem',
              fontWeight: '500'
            }}
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      ))}

      <div className="glass-panel p-6">
        <h3 className="text-xl mb-4" style={{ color: 'var(--primary-color)' }}>Terms & Conditions</h3>
        <div className="flex flex-col gap-2">
          {quotation.terms.map((term, index) => (
            <div key={index} className="flex gap-2">
              <span style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{index + 1}.</span>
              <input 
                type="text" 
                value={term} 
                onChange={(e) => updateTerm(index, e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                onClick={() => {
                  const newTerms = [...quotation.terms];
                  newTerms.splice(index, 1);
                  setQuotation(prev => ({ ...prev, terms: newTerms }));
                }}
                style={{ color: 'var(--danger-color)', padding: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => setQuotation(prev => ({ ...prev, terms: [...prev.terms, ''] }))}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              color: 'var(--primary-color)', background: 'transparent', 
              border: 'none', cursor: 'pointer', padding: '0.5rem',
              fontWeight: '500', width: 'fit-content'
            }}
          >
            <Plus size={16} /> Add Term
          </button>
        </div>
      </div>
      
      {/* Floating Action Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(quotation)}>
            Generate Preview <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuotationEditor;
