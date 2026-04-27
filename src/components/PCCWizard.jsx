import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Settings } from 'lucide-react';
import { generateMainIncomer, generateMainBusbar, generateOGFeeder, generateCommonUtilities } from '../utils/mccLogic';

function PCCWizard({ onGenerate, onCancel }) {
  const [incomerMode, setIncomerMode] = useState('Manual');
  const [incomerType, setIncomerType] = useState('ACB');
  const [incomerRating, setIncomerRating] = useState(1000);
  
  const [feeders, setFeeders] = useState([
    { id: 1, type: 'O/G', rating: 250, qty: 2, incomerType: 'MCCB', poles: 'TP' },
    { id: 2, type: 'O/G', rating: 63, qty: 4, incomerType: 'MCB', poles: 'FP' }
  ]);

  const addFeeder = () => {
    setFeeders([
      ...feeders, 
      { id: Date.now(), type: 'O/G', rating: 125, qty: 1, incomerType: 'MCCB', poles: 'TP' }
    ]);
  };

  const removeFeeder = (id) => {
    setFeeders(feeders.filter(f => f.id !== id));
  };

  const updateFeeder = (id, field, value) => {
    setFeeders(feeders.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleGenerate = () => {
    let finalIncomerRating = incomerRating;
    
    if (incomerMode === 'Auto') {
      let totalRating = feeders.reduce((sum, f) => sum + (f.rating * f.qty), 0);
      const reqRating = totalRating * 1.25; // 1.25x diversity factor
      const standardRatings = [63, 100, 125, 160, 200, 250, 400, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000];
      finalIncomerRating = standardRatings.find(r => r >= reqRating) || 5000;
      
      if (finalIncomerRating >= 800) setIncomerType('ACB');
      else if (finalIncomerRating >= 125) setIncomerType('MCCB');
      else setIncomerType('MCB');
    }

    const sections = [];
    
    // 1. Main Incomer
    sections.push(generateMainIncomer(incomerType, finalIncomerRating));
    
    // 2. Main Busbar
    sections.push(generateMainBusbar(finalIncomerRating));

    // 3. Outgoing Feeders (Single combined section or separate? We'll use separate to match MCC logic as requested)
    feeders.forEach(f => {
      sections.push(generateOGFeeder(f.rating, f.qty, f.incomerType, f.poles));
    });

    // 4. Common Utilities
    const common = generateCommonUtilities();
    common.forEach(c => sections.push(c));

    onGenerate(sections);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px', maxWidth: '800px' }}>
      <h2 className="text-3xl mb-2 flex items-center gap-2">
        <Settings /> Auto PCC Panel Generator
      </h2>
      <p className="text-secondary mb-8">Enter your outgoing feeder requirements to automatically generate a Power Control Centre (PCC) Bill of Materials.</p>

      {/* Main Incomer Config */}
      <div className="glass-panel p-6 mb-6">
        <h3 className="text-xl mb-4" style={{ color: 'var(--primary-color)' }}>1. Main Incomer & Busbar</h3>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={incomerMode === 'Auto'} 
              onChange={() => setIncomerMode('Auto')} 
            />
            Auto-Calculate (Based on total load)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={incomerMode === 'Manual'} 
              onChange={() => setIncomerMode('Manual')} 
            />
            Manual Selection
          </label>
        </div>

        {incomerMode === 'Manual' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label>Type</label>
              <select value={incomerType} onChange={(e) => setIncomerType(e.target.value)}>
                <option value="ACB">ACB</option>
                <option value="MCCB">MCCB</option>
                <option value="SFU">SFU</option>
                <option value="MCB">MCB</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label>Rating (Amps)</label>
              <input 
                type="number" 
                value={incomerRating} 
                onChange={(e) => setIncomerRating(Number(e.target.value))} 
                step="10"
              />
            </div>
          </div>
        )}
      </div>

      {/* Feeders Config */}
      <div className="glass-panel p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl" style={{ color: 'var(--primary-color)' }}>2. Outgoing (O/G) Feeders</h3>
          <button className="btn btn-secondary" onClick={addFeeder} style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}>
            <Plus size={16} /> Add Feeder
          </button>
        </div>

        {feeders.map((feeder, index) => (
          <div key={feeder.id} style={{ 
            background: 'var(--surface-color-light)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div className="flex justify-between items-center">
              <span style={{ fontWeight: 'bold' }}>Outgoing Feeder #{index + 1}</span>
              {feeders.length > 1 && (
                <button 
                  onClick={() => removeFeeder(feeder.id)}
                  style={{ color: 'var(--danger-color)', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.8rem' }}>Rating (Amps)</label>
                <input 
                  type="number" 
                  value={feeder.rating} 
                  onChange={(e) => updateFeeder(feeder.id, 'rating', Number(e.target.value))} 
                  step="5"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.8rem' }}>Quantity</label>
                <input 
                  type="number" 
                  value={feeder.qty} 
                  onChange={(e) => updateFeeder(feeder.id, 'qty', Number(e.target.value))} 
                  min="1"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.8rem' }}>Breaker Type</label>
                <select value={feeder.incomerType} onChange={(e) => updateFeeder(feeder.id, 'incomerType', e.target.value)}>
                  <option value="MCCB">MCCB</option>
                  <option value="ACB">ACB</option>
                  <option value="SFU">SFU</option>
                  <option value="MCB">MCB</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label style={{ fontSize: '0.8rem' }}>Poles</label>
                <select value={feeder.poles} onChange={(e) => updateFeeder(feeder.id, 'poles', e.target.value)}>
                  <option value="TP">TP (3 Pole)</option>
                  <option value="FP">FP (4 Pole)</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleGenerate}>
          Generate PCC BOM <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default PCCWizard;
