// Helper to calculate approximate FLC (Full Load Current) for 415V 3-Phase Motors
export const getFLC = (hp) => hp * 1.5;

// Generate Main Incomer Section
export const generateMainIncomer = (type, rating) => {
  const items = [];
  
  items.push({
    description: `${rating}A ${type}, TP, 50kA`,
    modelNo: '', make: 'Standard', qty: 1, uom: 'Nos', unitRate: 0, discount: 0
  });

  items.push({ description: 'Multifunction Meter (V, I, kW, kWh)', modelNo: '', make: 'Standard', qty: 1, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `CT ${rating}/5A, Class 1.0, 15VA`, modelNo: '', make: 'Standard', qty: 3, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: 'RYB Indicator Lamp Set - LED type, 220V AC', modelNo: '', make: 'Standard', qty: 1, uom: 'Set', unitRate: 0, discount: 0 });
  items.push({ description: 'Control MCB 6A SP', modelNo: '', make: 'Standard', qty: 3, uom: 'Nos', unitRate: 0, discount: 0 });

  return { name: 'MAIN INCOMER', items };
};

// Generate Main Busbar based on Incomer Rating
export const generateMainBusbar = (rating) => {
  let busbarSize = '25 X 5'; // default small
  if (rating > 1000) busbarSize = '100 X 10 (2 Runs)';
  else if (rating >= 800) busbarSize = '100 X 10';
  else if (rating >= 630) busbarSize = '80 X 10';
  else if (rating >= 400) busbarSize = '50 X 10';
  else if (rating >= 250) busbarSize = '40 X 10';
  else if (rating >= 125) busbarSize = '30 X 10';

  return {
    name: 'MAIN BUSBAR',
    items: [
      { description: `Aluminium Busbar ${busbarSize} for RYB`, modelNo: '', make: 'Standard', qty: 1, uom: 'Lot', unitRate: 0, discount: 0 },
      { description: `Aluminium Busbar ${busbarSize} for Neutral`, modelNo: '', make: 'Standard', qty: 1, uom: 'Lot', unitRate: 0, discount: 0 },
      { description: 'Busbar Supports (SMC/DMC)', modelNo: '', make: 'Standard', qty: 1, uom: 'Lot', unitRate: 0, discount: 0 },
      { description: 'Color Coded Heat Shrinkable Sleeves', modelNo: '', make: 'Standard', qty: 1, uom: 'Lot', unitRate: 0, discount: 0 }
    ]
  };
};

// Generate Outgoing Feeder (MCCB/SFU/ACB/MCB)
export const generateOGFeeder = (rating, qty, breakerType, poles) => {
  const items = [];
  
  items.push({ description: `${rating}A ${poles} ${breakerType} Base with O/L & S/C Protection`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  
  if (breakerType === 'MCCB' || breakerType === 'ACB' || breakerType === 'SFU') {
    items.push({ description: `Extended ROH`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  }

  if (rating < 125) {
    let wireSize = rating <= 16 ? '2.5 Sqmm' : rating <= 32 ? '6 Sqmm' : rating <= 63 ? '16 Sqmm' : '35 Sqmm';
    let termQty = poles === 'FP' || poles === '4P' ? 4 : 3;
    items.push({ description: `Power terminals, ${wireSize}`, modelNo: '', make: 'Connectwell', qty: termQty * qty, uom: 'Nos', unitRate: 0, discount: 0 });
    items.push({ description: `Cable ${wireSize}`, modelNo: '', make: 'Polycab', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  } else {
    // rating >= 125A uses Busbar
    let busbarSize = rating >= 630 ? '80 X 10' : rating >= 400 ? '50 X 10' : rating >= 250 ? '40 X 10' : '25 X 10';
    items.push({ description: `Aluminium Busbar ${busbarSize} for RYB & Neutral (Links)`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  }

  return {
    name: `${rating}A ${breakerType} FEEDER${qty > 1 ? ` (Qty: ${qty})` : ''}`,
    items
  };
};

// Generate DOL Feeder
export const generateDOL = (hp, qty, incomerType, protectionType) => {
  const flc = getFLC(hp);
  let incomerRating = hp <= 5 ? 16 : hp <= 10 ? 32 : hp <= 15 ? 40 : hp <= 20 ? 63 : 100;
  if (hp === 10) incomerRating = 40; // from example
  let contactorRating = hp <= 5 ? 18 : hp <= 10 ? 32 : hp <= 15 ? 45 : hp <= 20 ? 65 : 100;
  let wireSize = hp <= 5 ? '4 sqmm' : hp <= 10 ? '6 sqmm' : hp <= 15 ? '10 sqmm' : '16 sqmm';
  if (hp === 10) wireSize = '6 sqmm'; // from example

  const items = [];
  items.push({ description: `${incomerRating}A TP ${incomerType} 10KA`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `${contactorRating}A TP Power Contactor`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Auxiliary Contact with 2NO+2NC`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });

  if (protectionType === 'MPD') {
    items.push({ description: `Motor Protection Relay (MPD) With RS485 AND CBCT-55MM`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  } else if (protectionType === 'OLR') {
    items.push({ description: `Thermal Overload Relay (OLR) for ${hp}HP`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  } else if (protectionType === 'MPCB') {
    items.push({ description: `Motor Protection Circuit Breaker (MPCB) for ${hp}HP`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  }

  items.push({ description: `Indicating Lamp, 'ON', 'OFF', 'TRIP'`, modelNo: '', make: 'Standard', qty: 3 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Start And Stop Push Button`, modelNo: '', make: 'Standard', qty: 2 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `E-STOP Push Button with 1NC Contact`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Control 6A SP MCB 'C' Curve 10KA`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Power terminals ${wireSize.replace('sqmm', 'Sqmm')}`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `Control terminals`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `Power Wire ${wireSize}`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `Control Wire 1 Sqmm`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `6" Cooling Fan`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `6" Filter Kit`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });

  return { name: `${hp}HP DOL FEEDER${qty > 1 ? ` (Qty: ${qty})` : ''}`, items };
};

// Generate Star Delta Feeder
export const generateStarDelta = (hp, qty, incomerType, protectionType) => {
  let incomerRating = hp <= 10 ? 32 : hp <= 15 ? 40 : hp <= 20 ? 63 : hp <= 30 ? 100 : 125;
  if (hp === 15) incomerRating = 40;
  let mainDeltaContactor = hp <= 10 ? 25 : hp <= 15 ? 45 : hp <= 20 ? 65 : 100;
  let starContactor = hp <= 10 ? 18 : hp <= 15 ? 25 : hp <= 20 ? 40 : 65;
  let wireSize = hp <= 10 ? '6Sqmm' : hp <= 15 ? '10Sqmm' : hp <= 25 ? '16Sqmm' : '25Sqmm';

  const items = [];
  items.push({ description: `${incomerRating}A TP ${incomerType} C-Curve 10KA`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `${mainDeltaContactor}A TP Power Contactor Rating AC3 (Main & Delta)`, modelNo: '', make: 'Standard', qty: 2 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `${starContactor}A TP Power Contactor Rating AC3 (Star)`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Auxiliary Contact with 2NO+2NC`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });

  if (protectionType === 'MPD') {
    items.push({ description: `Motor Protection Relay (MPD) With RS485 AND CBCT-55MM`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  } else if (protectionType === 'OLR') {
    items.push({ description: `Thermal Overload Relay (OLR) for ${hp}HP`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  } else if (protectionType === 'MPCB') {
    items.push({ description: `Motor Protection Circuit Breaker (MPCB) for ${hp}HP`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  }

  items.push({ description: `Star Delta Timer`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Indicating Lamp, 'ON', 'OFF', 'TRIP'`, modelNo: '', make: 'Standard', qty: 3 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `E-STOP Push Button with 1NC Contact`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `2 Pole 2 Way With OFF Selector Switch`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Control 6A SP MCB 'C' Curve 10KA`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Power terminals ${wireSize}`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `Control terminals 2.5Sqmm`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `Power Wire ${wireSize.toLowerCase()}`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `Control Wire 1 Sqmm`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `6" Cooling Fan`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `6" Filter Kit`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });

  return { name: `${hp}HP S/D FEEDER${qty > 1 ? ` (Qty: ${qty})` : ''}`, items };
};

// Generate VFD Feeder
export const generateVFD = (hp, qty, incomerType) => {
  let incomerRating = hp <= 10 ? 32 : hp <= 15 ? 40 : hp <= 20 ? 63 : 100;
  if (hp === 15) incomerRating = 40;
  let wireSize = hp <= 10 ? '6 Sqmm' : hp <= 15 ? '10 Sqmm' : '16 Sqmm';

  const items = [];
  items.push({ description: `${incomerRating}A TP ${incomerType} 10KA 'C' Curve`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `${hp}HP HD VFD With Door mounting Kit (Heavy duty)`, modelNo: '', make: 'Danfoss/Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `${hp}HP Input Choke`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `${hp}HP Output Choke`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Indicating Lamp, 'ON', 'TRIP'`, modelNo: '', make: 'Standard', qty: 2 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Emergency Stop Button with 1NC Contact`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Start And Stop Push Button`, modelNo: '', make: 'Standard', qty: 2 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `4 C/O Relay 230V AC`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Control 6A SP MCB 'C' Curve 10KA`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `Power terminals ${wireSize}`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `Control terminals 2.5Sqmm`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `Power Wire ${wireSize.toLowerCase()}`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `Control Wire 1 Sqmm`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Lot', unitRate: 0, discount: 0 });
  items.push({ description: `6" Cooling Fan`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });
  items.push({ description: `6" Filter Kit`, modelNo: '', make: 'Standard', qty: 1 * qty, uom: 'Nos', unitRate: 0, discount: 0 });

  return { name: `${hp}HP VFD FEEDER${qty > 1 ? ` (Qty: ${qty})` : ''}`, items };
};

// Generate Common Utilities, Enclosure, and Others
export const generateCommonUtilities = () => {
  return [
    {
      name: 'Common Utility',
      items: [
        { description: `DINRAIL`, modelNo: '', make: 'STANDARD', qty: 1, uom: 'Lot', unitRate: 0, discount: 0 },
        { description: `PVC DUCT`, modelNo: '', make: 'ROLLY TRAY', qty: 1, uom: 'Lot', unitRate: 0, discount: 0 }
      ]
    },
    {
      name: 'Enclosure',
      items: [
        { description: `MS PANEL, Floor Mounting Sheet Steel Enclosure`, modelNo: '', make: 'FABRICATED', qty: 1, uom: 'Nos', unitRate: 0, discount: 0 }
      ]
    },
    {
      name: 'OTHERS :-',
      items: [
        { description: `Electrical Hardware, Lug & Mis.`, modelNo: '', make: '-', qty: 1, uom: 'Lot', unitRate: 0, discount: 0 },
        { description: `Labor Charges`, modelNo: '', make: '-', qty: 1, uom: 'Lot', unitRate: 0, discount: 0 }
      ]
    }
  ];
};
