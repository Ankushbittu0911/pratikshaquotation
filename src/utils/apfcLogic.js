export const generateAPFCMainIncomer = (totalKvar, harmonics, futureExpansion) => {
  // 1. Calculate Full Load Current
  // I = kVAR * 1000 / (sqrt(3) * 415) = kVAR * 1.391
  let current = totalKvar * 1.391;
  
  // 2. Margins (Tolerance, Continuous duty, Inrush)
  // Standard factor is 1.5 for capacitors.
  let requiredRating = current * 1.5;
  
  if (harmonics) {
    requiredRating *= 1.1; // 10% extra margin for harmonics
  }
  
  if (futureExpansion) {
    requiredRating *= 1.2; // 20% future capacity
  }

  // Find nearest higher standard rating
  const standardRatings = [63, 100, 125, 160, 200, 250, 320, 400, 630, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000];
  const finalRating = standardRatings.find(r => r >= requiredRating) || 4000;
  
  let type = 'MCCB';
  if (finalRating >= 800) type = 'ACB';
  if (finalRating < 125) type = 'MCB';

  const items = [];
  items.push({ description: `${finalRating}A 3P ${type} ${finalRating >= 800 ? '50kA' : '36kA'}`, make: 'LK', qty: 1, uom: 'Nos' });
  items.push({ description: `MFM Meter`, make: 'Nippen', qty: 1, uom: 'Nos' });
  
  // CT Ratio
  let ctPrimary = standardRatings.find(r => r >= finalRating) || finalRating;
  items.push({ description: `CT, ${ctPrimary}/5`, make: 'Nippen', qty: 3, uom: 'Nos' });
  
  items.push({ description: `R Y B Indicators`, make: 'Standard', qty: 3, uom: 'Nos' });
  items.push({ description: `6A, SP, MCB`, make: 'LK', qty: 4, uom: 'Nos' });

  return { name: 'Main Incomer', items };
};

export const generateAPFCController = (totalStages) => {
  const standardStages = [6, 8, 12, 14, 16, 18];
  const stages = standardStages.find(s => s >= totalStages) || 18;
  return {
    name: 'APFC Controller',
    items: [
      { description: `APFC Controller ${stages} Stages`, make: 'LK', qty: 1, uom: 'Nos' }
    ]
  };
};

const getCapacitorComposition = (kvar) => {
  if (kvar <= 25) return ''; // Standard single unit
  
  // Prefer identical standard units
  if (kvar === 30) return ' (15KVAR X 2)';
  if (kvar === 40) return ' (20KVAR X 2)';
  if (kvar === 50) return ' (25KVAR X 2)';
  if (kvar === 60) return ' (20KVAR X 3)';
  if (kvar === 75) return ' (25KVAR X 3)';
  if (kvar === 100) return ' (25KVAR X 4)';
  if (kvar === 150) return ' (25KVAR X 6)';
  
  // Fallback for non-standard large kvar
  let remaining = kvar;
  let comp = [];
  const bases = [25, 20, 15, 10, 5, 3, 2];
  for (let b of bases) {
    let count = Math.floor(remaining / b);
    if (count > 0) {
      comp.push(`${b}KVAR X ${count}`);
      remaining -= count * b;
    }
  }
  return ` (${comp.join(' + ')})`;
};

export const generateCapacitorFeeder = (kvar, qty, harmonics) => {
  const items = [];
  
  // Base sizing logic mapping from the user's reference image
  let breaker = '';
  let cableOrBusbar = '';
  
  if (kvar <= 3) {
    breaker = '16A, TP, MCB';
    cableOrBusbar = '2.5sqmm Polycab Wire';
  } else if (kvar <= 5) {
    breaker = '16A, TP, MCB';
    cableOrBusbar = '4sqmm Polycab Wire';
  } else if (kvar <= 10) {
    breaker = '32A, TP, MCB';
    cableOrBusbar = '6sqmm Polycab Wire';
  } else if (kvar <= 15) {
    breaker = '32A, TP, MCB';
    cableOrBusbar = '6sqmm Polycab Wire';
  } else if (kvar <= 20) {
    breaker = '63A, TP, MCB';
    cableOrBusbar = '10sqmm Polycab Wire';
  } else if (kvar <= 25) {
    breaker = '63A, TP, MCB';
    cableOrBusbar = '10sqmm Polycab Wire';
  } else if (kvar <= 50) {
    breaker = '125A, TP, MCCB, 25kA';
    cableOrBusbar = '15x10, Aluminium';
  } else {
    breaker = '250A, TP, MCCB, 25kA';
    cableOrBusbar = '25x10, Aluminium Busbar';
  }

  // Core components
  const comp = getCapacitorComposition(kvar);
  items.push({ description: `${kvar} KVAR Heavy Duty Capacitor (LTCCH)${comp}`, make: 'LK', qty: qty, uom: 'Nos' });
  items.push({ description: `${kvar} KVAR MOC Contactor`, make: 'LK', qty: qty, uom: 'Nos' });
  items.push({ description: breaker, make: 'LK', qty: qty, uom: 'Nos' });
  items.push({ description: `On Indication Lamp`, make: 'Standard', qty: qty, uom: 'Nos' });
  items.push({ description: `Auto Manual selector Switch`, make: 'LK', qty: qty, uom: 'Nos' });
  
  // Power connection
  items.push({ description: cableOrBusbar, make: kvar > 25 ? 'Standard' : 'Polycab', qty: kvar > 25 ? qty * 2 : qty, uom: 'Nos' });
  
  // Reactor for harmonics
  if (harmonics) {
    items.push({ description: `${kvar}KVAR Reactor Detuned 7% (Aluminium)`, make: 'OM', qty: qty, uom: 'Nos' });
  }

  return { name: `${kvar} KVAR Feeder`, items };
};

export const generateAPFCMiscellaneous = (totalKvar) => {
  const sections = [];
  
  // Busbar based on total rating (roughly 1.5 * current)
  let current = totalKvar * 1.5 * 1.5; 
  let busbarSize = '100 X 10 X 1600'; 
  if (current > 1000) busbarSize = '200 X 10 X 2000';
  else if (current > 500) busbarSize = '150 X 10 X 1800';
  
  sections.push({
    name: 'Bus Bar',
    items: [{ description: busbarSize, make: '-', qty: 1, uom: 'Nos' }]
  });
  
  sections.push({
    name: 'Materials',
    items: [
      { description: 'Control Cable 1 sqmm', make: 'Polycab', qty: 1, uom: 'Lot' },
      { description: 'Din Rail', make: '-', qty: 1, uom: 'Nos' },
      { description: 'Ferulle, Lugs', make: '-', qty: 1, uom: 'Lot' },
      { description: 'PVC Duct', make: '-', qty: 1, uom: 'Lot' },
      { description: 'Panel Box 1600 (H) X 1900 (W) X 1000 (D) in MM.', make: 'FABRICATED', qty: 1, uom: 'Nos' }
    ]
  });
  
  return sections;
};

// Helper algorithm to split total KVAR into standard stages automatically
export const autoCalculateSteps = (totalKvar, requestedStages = 'Auto') => {
  const standardSizes = [100, 50, 25, 20, 15, 10, 5, 3, 2];
  let remaining = totalKvar;
  const initialSteps = [];
  
  // We want fine resolution. Force the first few steps to be small.
  let seq = [];
  if (totalKvar <= 50) seq = [2, 2, 5];
  else if (totalKvar <= 100) seq = [5, 5, 10, 10];
  else if (totalKvar <= 250) seq = [10, 10, 20, 20];
  else if (totalKvar <= 500) seq = [10, 20, 20, 25, 25];
  else seq = [25, 25, 50, 50]; // Extremely large panel
  
  for (let s of seq) {
    if (remaining >= s) {
      initialSteps.push(s);
      remaining -= s;
    }
  }
  
  // Fill the rest, avoiding 100 and 50 unless absolutely necessary
  let maxSize = 25;
  if (totalKvar >= 300) maxSize = 50;
  if (totalKvar >= 800) maxSize = 100;
  
  for (let size of standardSizes) {
    if (size > maxSize) continue;
    while (remaining >= size) {
      initialSteps.push(size);
      remaining -= size;
    }
  }
  
  // Failsafe: If there's still remainder, force it with whatever fits
  for (let size of standardSizes) {
    while (remaining >= size) {
      initialSteps.push(size);
      remaining -= size;
    }
  }

  let finalSteps = [...initialSteps].sort((a, b) => a - b);

  // Apply requested stages target if set
  if (requestedStages !== 'Auto') {
    const targetCount = parseInt(requestedStages);

    const findStandardPair = (val) => {
      for (let s of standardSizes) {
        let rem = val - s;
        if (standardSizes.includes(rem)) return [s, rem];
      }
      return null;
    };

    // Split steps if we need more
    while (finalSteps.length < targetCount) {
      let splitDone = false;
      for (let i = finalSteps.length - 1; i >= 0; i--) {
        let pair = findStandardPair(finalSteps[i]);
        if (pair) {
          finalSteps.splice(i, 1, pair[0], pair[1]);
          finalSteps.sort((a, b) => a - b);
          splitDone = true;
          break;
        }
      }
      if (!splitDone) break;
    }

    // Merge steps if we have too many
    while (finalSteps.length > targetCount) {
      let mergeDone = false;
      for (let i = 0; i < finalSteps.length - 1; i++) {
        let sum = finalSteps[i] + finalSteps[i+1];
        if (standardSizes.includes(sum)) {
          finalSteps.splice(i, 2, sum);
          mergeDone = true;
          break;
        }
      }
      if (!mergeDone) {
        // Force merge the two smallest
        let sum = finalSteps[0] + finalSteps[1];
        finalSteps.splice(0, 2, sum);
      }
    }
  }
  
  // Group them into the feeders object format expected by the UI
  const grouped = {};
  finalSteps.forEach(size => {
    if (!grouped[size]) grouped[size] = { id: Date.now() + Math.random(), kvar: size, qty: 0 };
    grouped[size].qty += 1;
  });
  
  return Object.values(grouped).sort((a, b) => a.kvar - b.kvar);
};
