import React, { useState } from 'react';
import { ArrowRight, Settings, Cpu } from 'lucide-react';
import { generateVFDBOM } from '../utils/vfdLogic';

function VFDWizard({ onGenerate, onCancel }) {
  const [hp, setHp] = useState(10);
  const [voltage, setVoltage] = useState(415);
  const [application, setApplication] = useState('Centrifuge');
  const [loadType, setLoadType] = useState('High Inertia');
  const [panelType, setPanelType] = useState('ITD');
  const [auxHp, setAuxHp] = useState(1);

  const handleGenerate = () => {
    const sections = generateVFDBOM(hp, application, loadType, panelType, auxHp);
    onGenerate(sections);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px', maxWidth: '800px' }}>
      <h2 className="text-3xl mb-2 flex items-center gap-2">
        <Cpu /> Auto VFD Panel Generator
      </h2>
      <p className="text-secondary mb-8">
        Generate a complete Bill of Materials for VFD panels, engineered specifically for high inertia loads like centrifuges.
      </p>

      {/* Panel Type Selection */}
      <div className="glass-panel p-6 mb-6">
        <h3 className="text-xl mb-4" style={{ color: 'var(--primary-color)' }}>Panel Configuration</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={panelType === 'MTD'} 
              onChange={() => setPanelType('MTD')} 
            />
            MTD Panel (Standard VFD Only)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={panelType === 'ITD'} 
              onChange={() => setPanelType('ITD')} 
            />
            ITD Panel (Main VFD + Aux DOL Motor)
          </label>
        </div>
      </div>

      <div className="glass-panel p-6 mb-6">
        <h3 className="text-xl mb-4" style={{ color: 'var(--primary-color)' }}>Motor Specifications</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Main Motor Rating (HP)</label>
            <input 
              type="number" 
              value={hp} 
              onChange={(e) => setHp(Number(e.target.value))} 
              step="0.5"
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Auto-sizes VFD, Power Cables, and Braking Resistor.
            </span>
          </div>

          {panelType === 'ITD' && (
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Auxiliary Motor (Lid/Blower) Rating (HP)</label>
              <input 
                type="number" 
                value={auxHp} 
                onChange={(e) => setAuxHp(Number(e.target.value))} 
                step="0.5"
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Auto-sizes the DOL Contactor and OLR.
              </span>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Voltage</label>
            <select value={voltage} onChange={(e) => setVoltage(Number(e.target.value))}>
              <option value="415">415VAC, 3-Phase</option>
              <option value="230">230VAC, 1-Phase (Micro VFD)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Application Type</label>
            <select value={application} onChange={(e) => setApplication(e.target.value)}>
              <option value="Centrifuge">Centrifuge</option>
              <option value="Hoist / Crane">Hoist / Crane</option>
              <option value="Conveyor">Heavy Conveyor</option>
              <option value="Pump / Fan">Pump / Fan (Generic)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Load Type Behavior</label>
            <select value={loadType} onChange={(e) => setLoadType(e.target.value)}>
              <option value="High Inertia">High Inertia (Adds Braking Resistor)</option>
              <option value="Standard">Standard</option>
            </select>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              High inertia loads strictly require a robust braking resistor to dissipate regenerative energy.
            </span>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 mb-6" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
        <h4 className="text-md font-bold mb-2">Engineered Safety Features Included:</h4>
        <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
          {panelType === 'ITD' && (
            <li><strong style={{color: 'var(--primary-color)'}}>Dual Motor Logic:</strong> Separately sized DOL Contactor and OLR for the Auxiliary motor (e.g., Lid operation), integrated seamlessly with the main VFD logic.</li>
          )}
          <li><strong>Dynamic Braking:</strong> Automatic calculation of Braking Resistor (Ohms & kW rating) for safe deceleration.</li>
          <li><strong>Control Circuits:</strong> Proper mapping with Changeover Relays, Limit micro-switches, and Amplifiers (ITD).</li>
          <li><strong>Protection:</strong> Incomer switch and DP MCB protection scaled accurately to VFD inrush tolerance.</li>
        </ul>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleGenerate}>
          Generate VFD BOM <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default VFDWizard;
