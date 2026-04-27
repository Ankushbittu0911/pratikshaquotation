import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Settings, Zap } from 'lucide-react';
import { 
  generateAPFCMainIncomer, 
  generateAPFCController, 
  generateCapacitorFeeder, 
  generateAPFCMiscellaneous,
  autoCalculateSteps 
} from '../utils/apfcLogic';

function APFCWizard({ onGenerate, onCancel }) {
  const [mode, setMode] = useState('Manual'); // 'Manual' or 'Auto'
  
  // Auto Mode Inputs
  const [totalKvar, setTotalKvar] = useState(250);
  const [voltage, setVoltage] = useState(415);
  const [frequency, setFrequency] = useState(50);
  const [loadType, setLoadType] = useState('stable');
  const [harmonics, setHarmonics] = useState(false);
  const [futureExpansion, setFutureExpansion] = useState(false);
  const [requestedStages, setRequestedStages] = useState('Auto');

  // Manual Mode Feeders (pre-filled with auto-steps when switching)
  const [feeders, setFeeders] = useState([
    { id: 1, kvar: 10, qty: 1 },
    { id: 2, kvar: 20, qty: 1 },
    { id: 3, kvar: 20, qty: 1 },
    { id: 4, kvar: 50, qty: 4 }
  ]);

  const handleAutoCalculate = () => {
    const steps = autoCalculateSteps(totalKvar, requestedStages);
    setFeeders(steps);
    setMode('Manual'); // Switch to manual to let them review
  };

  const addFeeder = () => {
    setFeeders([
      ...feeders, 
      { id: Date.now(), kvar: 25, qty: 1 }
    ]);
  };

  const removeFeeder = (id) => {
    setFeeders(feeders.filter(f => f.id !== id));
  };

  const updateFeeder = (id, field, value) => {
    setFeeders(feeders.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleGenerate = () => {
    // Determine actual total kVAR from the manually reviewed feeders
    const actualTotalKvar = feeders.reduce((sum, f) => sum + (f.kvar * f.qty), 0);
    const totalStages = feeders.reduce((sum, f) => sum + f.qty, 0);

    const sections = [];
    
    // 1. Main Incomer
    sections.push(generateAPFCMainIncomer(actualTotalKvar, harmonics, futureExpansion));
    
    // 2. APFC Controller
    sections.push(generateAPFCController(totalStages));

    // 3. Capacitor Feeders
    feeders.forEach(f => {
      sections.push(generateCapacitorFeeder(f.kvar, f.qty, harmonics));
    });

    // 4. Busbar & Miscellaneous
    const misc = generateAPFCMiscellaneous(actualTotalKvar);
    misc.forEach(m => sections.push(m));

    onGenerate(sections);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px', maxWidth: '800px' }}>
      <h2 className="text-3xl mb-2 flex items-center gap-2">
        <Zap /> Auto APFC Panel Generator
      </h2>
      <p className="text-secondary mb-8">
        Generate a complete Bill of Materials for Automatic Power Factor Correction (APFC) panels based on total kVAR or manual feeder selection.
      </p>

      {/* Mode Selection */}
      <div className="glass-panel p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={mode === 'Auto'} 
              onChange={() => setMode('Auto')} 
            />
            Auto-Calculate (Based on total kVAR)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={mode === 'Manual'} 
              onChange={() => setMode('Manual')} 
            />
            Manual Feeder Entry
          </label>
        </div>

        {mode === 'Auto' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.9rem' }}>Total Capacitor Bank (kVAR)</label>
              <input 
                type="number" 
                value={totalKvar} 
                onChange={(e) => setTotalKvar(Number(e.target.value))} 
                step="5"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.9rem' }}>Voltage</label>
              <select value={voltage} onChange={(e) => setVoltage(Number(e.target.value))}>
                <option value="415">415V, 3-Phase</option>
                <option value="440">440V, 3-Phase</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.9rem' }}>Load Type</label>
              <select value={loadType} onChange={(e) => setLoadType(e.target.value)}>
                <option value="stable">Stable / Linear</option>
                <option value="fluctuating">Fluctuating</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.9rem' }}>Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(Number(e.target.value))}>
                <option value="50">50 Hz</option>
                <option value="60">60 Hz</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.9rem' }}>Requested Stages</label>
              <select value={requestedStages} onChange={(e) => setRequestedStages(e.target.value)}>
                <option value="Auto">Auto-Select</option>
                <option value="6">6 Stages</option>
                <option value="8">8 Stages</option>
                <option value="12">12 Stages</option>
                <option value="14">14 Stages</option>
                <option value="16">16 Stages</option>
                <option value="18">18 Stages</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="harmonics"
                checked={harmonics} 
                onChange={(e) => setHarmonics(e.target.checked)} 
              />
              <label htmlFor="harmonics" style={{ fontSize: '0.9rem' }}>Harmonics Present (Adds Detuned Reactor)</label>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="future"
                checked={futureExpansion} 
                onChange={(e) => setFutureExpansion(e.target.checked)} 
              />
              <label htmlFor="future" style={{ fontSize: '0.9rem' }}>Future Expansion (Upsizes Incomer by 20%)</label>
            </div>

            <div className="col-span-2 mt-4">
              <button className="btn btn-secondary w-full" onClick={handleAutoCalculate}>
                Calculate Feeder Steps & Review
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual Feeders Review */}
      {mode === 'Manual' && (
        <div className="glass-panel p-6 mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl" style={{ color: 'var(--primary-color)' }}>Capacitor Feeders</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Total: {feeders.reduce((sum, f) => sum + (f.kvar * f.qty), 0)} kVAR | Stages: {feeders.reduce((sum, f) => sum + f.qty, 0)}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="harmonics-manual"
                  checked={harmonics} 
                  onChange={(e) => setHarmonics(e.target.checked)} 
                />
                <label htmlFor="harmonics-manual" style={{ fontSize: '0.8rem' }}>Include Reactors</label>
              </div>
              <button className="btn btn-secondary" onClick={addFeeder} style={{ padding: '0.25rem 0.5rem', fontSize: '0.9rem' }}>
                <Plus size={16} /> Add Step
              </button>
            </div>
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
                <span style={{ fontWeight: 'bold' }}>Capacitor Step #{index + 1}</span>
                {feeders.length > 1 && (
                  <button 
                    onClick={() => removeFeeder(feeder.id)}
                    style={{ color: 'var(--danger-color)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label style={{ fontSize: '0.8rem' }}>Capacitor Bank (kVAR)</label>
                  <select 
                    value={feeder.kvar} 
                    onChange={(e) => updateFeeder(feeder.id, 'kvar', Number(e.target.value))}
                  >
                    <option value="2">2 kVAR</option>
                    <option value="3">3 kVAR</option>
                    <option value="5">5 kVAR</option>
                    <option value="10">10 kVAR</option>
                    <option value="15">15 kVAR</option>
                    <option value="20">20 kVAR</option>
                    <option value="25">25 kVAR</option>
                    <option value="50">50 kVAR</option>
                    <option value="100">100 kVAR</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label style={{ fontSize: '0.8rem' }}>Quantity (Stages)</label>
                  <input 
                    type="number" 
                    value={feeder.qty} 
                    onChange={(e) => updateFeeder(feeder.id, 'qty', Number(e.target.value))} 
                    min="1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-4 mt-8">
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={mode === 'Auto'}>
          Generate APFC BOM <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default APFCWizard;
