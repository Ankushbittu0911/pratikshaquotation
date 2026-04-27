export const templates = {
  PCC: {
    name: 'PCC Panel',
    sections: [
      {
        name: 'MAIN INCOMER',
        items: [
          { description: '4000A 3P ACB 50kA, MF', make: 'L&T', qty: 1, uom: 'Nos', unitRate: 0 },
          { description: '6A SP Control MCB, 10kA', make: 'L&T', qty: 3, uom: 'Nos', unitRate: 0 },
          { description: 'MF Meter', make: 'TRINITI', qty: 1, uom: 'Nos', unitRate: 0 },
          { description: 'CT 4000/5, Cl-1.0, 15VA, + CT Short-Link', make: 'Rishabh', qty: 3, uom: 'Nos', unitRate: 0 },
          { description: 'RYB Indicator Lamp Set - LED type, 220V AC', make: 'TNI', qty: 1, uom: 'Set', unitRate: 0 },
          { description: 'Neutral Link', make: 'Standard', qty: 1, uom: 'Nos', unitRate: 0 }
        ]
      },
      {
        name: 'O/G FEEDER',
        items: [
          { description: '500A, MCCB, TP, 36kA with ROH & Spreader Link', make: 'L&T', qty: 1, uom: 'Nos', unitRate: 0 },
          { description: '450A, MCCB, TP, 36kA with ROH & Spreader Link', make: 'L&T', qty: 4, uom: 'Nos', unitRate: 0 },
          { description: '250A, MCCB, TP, 36kA with ROH & Spreader Link', make: 'L&T', qty: 2, uom: 'Nos', unitRate: 0 }
        ]
      },
      {
        name: 'BUSBAR',
        items: [
          { description: 'Aluminium Busbar 250X10', make: 'Standard', qty: 1, uom: 'Lot', unitRate: 0 }
        ]
      },
      {
        name: 'ENCLOSURE',
        items: [
          { description: 'MS PANEL, 2100 (H) X 4500 (W) X 1200 (D) in MM', make: 'FABRICATED', qty: 1, uom: 'Nos', unitRate: 0 }
        ]
      },
      {
        name: 'OTHERS',
        items: [
          { description: 'Electrical Hardware, Lug & Misc.', make: '-', qty: 1, uom: 'Lot', unitRate: 0 },
          { description: 'Labor Charges', make: '-', qty: 1, uom: 'Lot', unitRate: 0 }
        ]
      }
    ]
  },
  APFC: {
    name: 'APFC Panel',
    sections: [
      {
        name: 'MAIN INCOMER',
        items: [
          { description: '1600A 3P ACB 50kA', make: 'L&T', qty: 1, uom: 'Nos', unitRate: 0 },
          { description: 'MFM Meter', make: 'Nippen', qty: 1, uom: 'Nos', unitRate: 0 },
          { description: 'CT, 1600/5', make: 'Nippen', qty: 3, uom: 'Nos', unitRate: 0 }
        ]
      },
      {
        name: 'APFC CONTROLLER',
        items: [
          { description: 'APFC Controller 16 Stages', make: 'L&T', qty: 1, uom: 'Nos', unitRate: 0 }
        ]
      },
      {
        name: 'CAPACITOR BANKS & REACTORS',
        items: [
          { description: '50 kVAR Heavy Duty Capacitor', make: 'L&T', qty: 6, uom: 'Nos', unitRate: 0 },
          { description: '50 kVAR MOC Contactor', make: 'L&T', qty: 6, uom: 'Nos', unitRate: 0 },
          { description: '125A, TP, MCCB, 25kA', make: 'L&T', qty: 6, uom: 'Nos', unitRate: 0 },
          { description: '50 kVAR Reactor Detuned 7% (Aluminium)', make: 'OM', qty: 6, uom: 'Nos', unitRate: 0 }
        ]
      }
    ]
  },
  VFD: {
    name: 'VFD Panel',
    sections: [
      {
        name: 'DRIVE & SWITCHGEAR',
        items: [
          { description: 'Variable frequency drive 10HP, 415VAC, 50Hz', make: 'Yaskawa', qty: 1, uom: 'Nos', unitRate: 0 },
          { description: 'MAIN SWITCH (ON/OFF) TP, 32Amps', make: 'SALZER', qty: 1, uom: 'Nos', unitRate: 0 },
          { description: 'TP MCB, 32Amps', make: 'SIEMENS', qty: 1, uom: 'Nos', unitRate: 0 }
        ]
      },
      {
        name: 'ACCESSORIES',
        items: [
          { description: 'Exhaust Fan 230VAC, 4 inch', make: 'JAINSON', qty: 2, uom: 'Nos', unitRate: 0 },
          { description: 'Breaking resistor 2.2 KW, 50 ohms', make: '-', qty: 1, uom: 'Nos', unitRate: 0 }
        ]
      }
    ]
  },
  DB: {
    name: 'DB Panel',
    sections: [
      {
        name: 'INCOMER & DISTRIBUTION',
        items: [
          { description: 'MCB, FP, 4A, 10kA', make: 'Selec', qty: 1, uom: 'Nos', unitRate: 0 },
          { description: 'MCB, SP, 6A, 10kA', make: 'Siemens', qty: 2, uom: 'Nos', unitRate: 0 },
          { description: 'Contactor, 9A, 230VAC', make: 'Siemens', qty: 2, uom: 'Nos', unitRate: 0 }
        ]
      },
      {
        name: 'ENCLOSURE',
        items: [
          { description: 'MS PANEL, 400 (H) X 400 (W) X 150 (D) in MM', make: 'FABRICATED', qty: 1, uom: 'Nos', unitRate: 0 }
        ]
      }
    ]
  }
};

export const defaultTerms = [
  "GST - Extra 18% at present",
  "Packing & Forwarding - Extra or Customer Scope",
  "Transportation - Extra or Customer Scope",
  "Delivery Period - 1-2 Weeks from date of Drawing approval. VFD & PLC -Based on availability stock",
  "Insurance - Extra or Customer Scope",
  "Payment Terms - 50% Advance, Balance against material",
  "Commissioning & Installation - Extra per day basis",
  "Lodging & Boarding - Extra at Actual or Customer Scope",
  "Traveling & Transport - Extra at Actual or Customer Scope",
  "Offer Validity - 2 Weeks from offer date"
];
