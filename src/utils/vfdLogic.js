export const generateVFDBOM = (hp, application, loadType, panelType = 'MTD', auxHp = 1) => {
  const totalHp = panelType === 'ITD' ? hp + auxHp : hp;
  const current = totalHp * 1.5; // Approx full load current
  
  // 1. Incomer Sizing
  let incomerRating = 32;
  let incomerType = 'MCB';
  let terminalSqmm = 16;
  
  if (totalHp <= 5) {
    incomerRating = 16;
    incomerType = 'MCB';
    terminalSqmm = 10;
  } else if (totalHp <= 15) {
    incomerRating = 32;
    incomerType = 'MCB';
    terminalSqmm = 16;
  } else if (totalHp <= 30) {
    incomerRating = 63;
    incomerType = 'MCB';
    terminalSqmm = 35;
  } else if (hp <= 50) {
    incomerRating = 125;
    incomerType = 'MCCB';
    terminalSqmm = 70;
  } else if (hp <= 100) {
    incomerRating = 250;
    incomerType = 'MCCB';
    terminalSqmm = 150;
  }

  // 2. Cable Sizing
  let cableSqmm = 4;
  if (hp <= 5) cableSqmm = 2.5;
  else if (hp <= 10) cableSqmm = 4;
  else if (hp <= 15) cableSqmm = 6;
  else if (hp <= 25) cableSqmm = 10;
  else if (hp <= 30) cableSqmm = 16;
  else if (hp <= 50) cableSqmm = 35;
  else if (hp <= 75) cableSqmm = 50;
  else cableSqmm = 70;

  // 3. Braking Resistor Logic (Lookup table for exact industry standard matches)
  let resistorKW = 2.2;
  let resistorOhms = 50;
  
  if (hp <= 5) { resistorKW = 1.2; resistorOhms = 100; }
  else if (hp <= 7.5) { resistorKW = 2.0; resistorOhms = 75; }
  else if (hp <= 10) { resistorKW = 2.2; resistorOhms = 50; }
  else if (hp <= 15) { resistorKW = 5.5; resistorOhms = 32; }
  else if (hp <= 20) { resistorKW = 7.5; resistorOhms = 20; }
  else if (hp <= 25) { resistorKW = 9.0; resistorOhms = 15; }
  else if (hp <= 30) { resistorKW = 11.0; resistorOhms = 12; }
  else if (hp <= 40) { resistorKW = 15.0; resistorOhms = 10; }
  else if (hp <= 50) { resistorKW = 18.5; resistorOhms = 8; }
  else { resistorKW = 30.0; resistorOhms = 5; }

  // Aux Motor DOL Sizing (ITD Panel - e.g., Lid Motor)
  let auxContactor = '9A';
  let auxOLR = '1.6-2.5A';
  if (auxHp <= 0.5) { auxContactor = '9A'; auxOLR = '0.63-1A'; }
  else if (auxHp <= 1.5) { auxContactor = '9A'; auxOLR = '1.6-2.5A'; }
  else if (auxHp <= 2.5) { auxContactor = '9A'; auxOLR = '2.5-4A'; }
  else if (auxHp <= 4) { auxContactor = '9A'; auxOLR = '4-6A'; }
  else if (auxHp <= 6) { auxContactor = '12A'; auxOLR = '6-10A'; }
  else if (auxHp <= 10) { auxContactor = '18A'; auxOLR = '13-19A'; }
  else { auxContactor = '25A'; auxOLR = '16-25A'; }

  // Cooling
  let fans = 1;
  if (hp >= 10) fans = 2;
  if (hp >= 30) fans = 4;
  
  // Panel Size roughly based on HP
  let panelSize = '1100 (H) + 100 (B) X 550 (W) X 350 (D)';
  if (panelType === 'ITD') panelSize = '1000 (H) + 100 (B) x 550 (W) x 500 (D)';
  if (hp >= 30) panelSize = '1600 (H) + 100 (B) X 800 (W) X 400 (D)';
  if (hp >= 75) panelSize = '2000 (H) + 100 (B) X 1000 (W) X 500 (D)';

  const items = [];

  const vfdMake = panelType === 'ITD' ? 'ABB ACS 560' : 'Yaskawa';
  items.push({ description: `${hp}HP, 415VAC, 50Hz`, make: vfdMake, qty: 1, uom: 'Nos', material: 'Variable frequency drive' });
  
  if (hp <= 30) {
    items.push({ description: `TP, ${incomerRating}Amps`, make: 'SALZER', qty: 1, uom: 'Nos', material: 'Main Switch' });
  }
  
  items.push({ description: `TP, ${incomerRating}Amps`, make: 'SIEMENS', qty: 1, uom: 'Nos', material: `TP ${incomerType}` });
  items.push({ description: `DP, 6Amps, 10K`, make: 'SIEMENS', qty: 2, uom: 'Nos', material: 'DP MCB 2 & 3' });
  
  if (panelType === 'ITD') {
    items.push({ description: `${auxContactor}, 230VAC`, make: 'SIEMENS', qty: 1, uom: 'Nos', material: 'Contactor (Aux Motor)' });
    items.push({ description: `${auxOLR}`, make: 'SIEMENS', qty: 1, uom: 'Nos', material: 'OLR (Aux Motor)' });
    items.push({ description: `2No + 2NC`, make: 'SIEMENS', qty: 1, uom: 'Nos', material: 'Add On Block' });
  }

  const relayQty = panelType === 'ITD' ? 2 : 3;
  items.push({ description: `230VAC, 50Hz.`, make: 'PHOENIX CONTACT', qty: relayQty, uom: 'Nos', material: 'Relay,4 Changeover' });
  items.push({ description: `${cableSqmm} Sqmm.`, make: 'POLYCAB', qty: 1, uom: 'Lot', material: 'Power Cable (Main Motor)' });
  items.push({ description: `1 Sqmm.`, make: 'POLYCAB', qty: 1, uom: 'Lot', material: 'Control Cable' });
  items.push({ description: `${terminalSqmm} Sqmm. RYB color`, make: 'CONNECTWELL', qty: 1, uom: 'Lot', material: 'Power & Main Motor terminal' });
  items.push({ description: `4 Sqmm., Grey color`, make: 'Connect well', qty: 1, uom: 'Lot', material: 'Control Terminal' });
  
  if (panelType === 'ITD') {
    items.push({ description: `230 VAC, 50 Hz`, make: 'Radix', qty: 1, uom: 'Nos', material: 'Amplifier, Dual Channel' });
  }
  items.push({ description: `230VAC. 1Feet.`, make: 'Havells', qty: 1, uom: 'Nos', material: 'Panel Light with limit micro switch' });
  items.push({ description: `230VAC, 4 inch.`, make: 'JAINSON', qty: fans, uom: 'Nos', material: 'Exhaust Fan' });
  const lampColor = panelType === 'ITD' ? 'Amber color' : 'Yellow color';
  items.push({ description: `230VAC, 50HZ, ${lampColor}`, make: 'TEKNIC', qty: 1, uom: 'Nos', material: 'Indication lamp' });
  items.push({ description: `-`, make: 'Sulzer', qty: 1, uom: 'Lot', material: 'PVC duct' });
  items.push({ description: `-`, make: 'Standard', qty: 1, uom: 'Lot', material: 'Din Rail' });
  items.push({ description: `-`, make: 'Standard', qty: 1, uom: 'Lot', material: 'Ferule, Lugs.& Etc.' });
  items.push({ description: `MS with coating`, make: 'Standard', qty: 2, uom: 'Nos', material: 'Panel Lifting Hook' });
  items.push({ description: `-`, make: 'Standard', qty: fans, uom: 'Nos', material: 'Airvent' });
  items.push({ description: panelSize, make: 'Ptech', qty: 1, uom: 'Nos', material: 'Panel' });
  
  if (loadType === 'High Inertia' || application === 'Centrifuge') {
    const resMake = panelType === 'ITD' ? 'YESDEE' : 'Standard';
    const resDesc = panelType === 'ITD' ? `${resistorKW}KW ${resistorOhms}E` : `${resistorKW} KW, ${resistorOhms} ohms`;
    items.push({ description: resDesc, make: resMake, qty: 1, uom: 'Nos', material: 'Breaking resistor' });
  }
  
  items.push({ description: `385 X 385 X 175\nPush Button 3 Nos\nIndicator - 3 Nos\nSelector Switch - 1 Nos\nWindow Glass - 1 Nos`, make: 'Standard', qty: 1, uom: 'Nos', material: 'FLP Enclosure' });
  items.push({ description: `230VAC`, make: 'Selec', qty: 1, uom: 'Nos', material: 'RPM Indicator' });

  // Map material back to description visually for QuotationEditor (since we combined columns in the editor)
  const formattedItems = items.map(i => ({
    ...i,
    description: `${i.material} - ${i.description}`
  }));

  return [{
    name: `${hp}HP ${panelType} VFD Panel (${application})`,
    items: formattedItems
  }];
};
