import React, { useRef } from 'react';
import { ArrowLeft, Printer, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function QuotationPreview({ quotation, onBack }) {
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert("For the highest quality PDF that supports multiple pages, please select 'Save as PDF' in the Destination dropdown of the print dialog.");
    window.print();
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];
    
    // Header
    wsData.push(['PRATIKSHA TECHNOLOGIES, PALGHAR']);
    wsData.push(['Client:', quotation.client, '', 'Date:', new Date(quotation.date).toLocaleDateString('en-GB')]);
    wsData.push(['Project:', quotation.project, '', 'Ref No:', quotation.refNo, 'Rev:', quotation.revision]);
    wsData.push([]);
    
    // Table Header
    wsData.push(['Sr.No', 'Description', 'Model No.', 'Make', 'Qty', 'UOM', 'Unit Rate (₹)', 'Disc (%)', 'Amount (₹)']);
    
    let excelTotal = 0;
    
    quotation.sections.forEach((section, sIndex) => {
      wsData.push([String.fromCharCode(65 + sIndex), section.name]); // Section Header
      
      section.items.forEach((item, iIndex) => {
        const amount = (item.qty * (item.unitRate || 0)) * (1 - ((item.discount || 0) / 100));
        excelTotal += amount;
        wsData.push([
          iIndex + 1,
          item.description,
          item.modelNo || '',
          item.make,
          item.qty,
          item.uom,
          item.unitRate || 0,
          item.discount || 0,
          amount
        ]);
      });
    });
    
    wsData.push([]);
    wsData.push(['', '', '', '', '', '', '', 'OFFER COST (₹):', excelTotal]);
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Merges
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }
    ];
    
    // Column Widths
    ws['!cols'] = [
      { wch: 8 },  // Sr.No
      { wch: 50 }, // Description
      { wch: 20 }, // Model No
      { wch: 15 }, // Make
      { wch: 8 },  // Qty
      { wch: 8 },  // UOM
      { wch: 15 }, // Unit Rate
      { wch: 10 }, // Disc
      { wch: 15 }  // Amount
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Internal Pricing");
    
    const safeRef = quotation.refNo ? quotation.refNo.replace(/[^a-zA-Z0-9-]/g, '_') : 'Draft';
    const fileName = `Pricing_${safeRef}.xlsx`;
    
    // Convert to base64 to avoid Blob URL cross-origin / GUID bugs in certain browsers
    const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    const dataUri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + base64;
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate totals
  let totalCost = 0;
  quotation.sections.forEach(section => {
    section.items.forEach(item => {
      totalCost += (item.qty * (item.unitRate || 0)) * (1 - ((item.discount || 0) / 100));
    });
  });

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <div className="flex justify-between items-center mb-6 no-print">
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Editor
        </button>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={18} /> Print
          </button>
          <button className="btn btn-primary" onClick={handleDownloadPDF} style={{ background: 'var(--danger-color)' }}>
            <Download size={18} /> Download PDF
          </button>
          <button className="btn btn-primary" onClick={handleDownloadExcel} style={{ background: 'var(--success-color)' }}>
            <FileSpreadsheet size={18} /> Internal Excel (Prices)
          </button>
        </div>
      </div>

      {/* A4 Paper Preview Container */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--bg-color)'
      }}>
        <div 
          ref={printRef}
          className="print-container"
          style={{ 
            width: '210mm',
            minHeight: '297mm',
            background: 'white', 
            color: 'black',
            padding: '10mm',
            boxShadow: 'var(--shadow-lg)',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            margin: '0 auto'
          }}
        >
          {/* Header */}
          <div style={{ 
            textAlign: 'center', 
            border: '2px solid black', 
            padding: '10px',
            background: '#ffff00',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '18px', textTransform: 'uppercase' }}>PRATIKSHA TECHNOLOGIES, PALGHAR</div>
            <div>Address :- Plot No. J-4, Gate No. 2, M.I.D.C, Tarapur Industrial Estate, Boisar - 401506</div>
            <div>Contact - 7276586591 , 7020755992 , Mail - sales@pratikshatechnologies.com</div>
            <div>GST No. 27CSRPP6644L1ZR</div>
          </div>

          {/* Client & Project Info */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginBottom: '10px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '5px', fontWeight: 'bold', width: '15%' }}>Client</td>
                <td style={{ border: '1px solid black', padding: '5px' }} colSpan="3">{quotation.client || '_______________________'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '5px', fontWeight: 'bold' }}>Project</td>
                <td style={{ border: '1px solid black', padding: '5px', width: '35%' }}>{quotation.project}</td>
                <td style={{ border: '1px solid black', padding: '5px', width: '25%' }}>{new Date(quotation.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                <td style={{ border: '1px solid black', padding: '5px', width: '25%' }}>Revision - {quotation.revision}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '5px', fontWeight: 'bold' }}>Ref No.</td>
                <td style={{ border: '1px solid black', padding: '5px' }} colSpan="3">{quotation.refNo}</td>
              </tr>
              <tr>
                <td colSpan="4" style={{ border: '1px solid black', padding: '5px' }}>
                  Kind Attn:- <br/>
                  Please find below offer for {quotation.project}.
                </td>
              </tr>
            </tbody>
          </table>

          {/* BOM Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', marginBottom: '10px' }}>
            <thead>
              <tr style={{ background: '#b2dfdb', fontWeight: 'bold' }}>
                <th style={{ border: '1px solid black', padding: '5px', width: '5%' }}>Sr.No</th>
                <th style={{ border: '1px solid black', padding: '5px', width: '45%' }}>Description</th>
                <th style={{ border: '1px solid black', padding: '5px', width: '15%' }}>Model No.</th>
                <th style={{ border: '1px solid black', padding: '5px', width: '15%' }}>Make</th>
                <th style={{ border: '1px solid black', padding: '5px', width: '10%' }}>Qty</th>
                <th style={{ border: '1px solid black', padding: '5px', width: '10%' }}>UOM</th>
              </tr>
            </thead>
            <tbody>
              {quotation.sections.map((section, sIndex) => (
                <React.Fragment key={sIndex}>
                  <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                    <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{String.fromCharCode(65 + sIndex)}</td>
                    <td colSpan="5" style={{ border: '1px solid black', padding: '5px' }}>{section.name}</td>
                  </tr>
                  {section.items.map((item, iIndex) => {
                    const amount = (item.qty * (item.unitRate || 0)) * (1 - ((item.discount || 0) / 100));
                    return (
                    <tr key={`${sIndex}-${iIndex}`}>
                      <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{iIndex + 1}</td>
                      <td style={{ border: '1px solid black', padding: '5px' }}>{item.description}</td>
                      <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{item.modelNo || '-'}</td>
                      <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{item.make}</td>
                      <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{item.qty}</td>
                      <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>{item.uom}</td>
                    </tr>
                  )})}
                </React.Fragment>
              ))}
              <tr style={{ background: '#ffff00', fontWeight: 'bold' }}>
                <td colSpan="5" style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>OFFER COST (₹) :-</td>
                <td style={{ border: '1px solid black', padding: '5px', textAlign: 'right' }}>
                  {totalCost > 0 ? totalCost.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '-'} <br/>
                  <span style={{ fontSize: '10px' }}>Plus GST</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Terms & Conditions */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
            <thead>
              <tr style={{ background: '#e0e0e0' }}>
                <th style={{ border: '1px solid black', padding: '5px', textAlign: 'left' }}>TERMS & CONDITION :-</th>
              </tr>
            </thead>
            <tbody>
              {quotation.terms.map((term, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '5px' }}>{index + 1}. {term}</td>
                </tr>
              ))}
              <tr>
                <td style={{ border: '1px solid black', padding: '20px 5px 5px 5px', textAlign: 'right', fontWeight: 'bold' }}>
                  For Pratiksha Technologies<br/><br/><br/>
                  Authorised Signatory
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Global Print Styles specific to this view */}
      <style>{`
        @media print {
          @page { margin: 0; size: A4 portrait; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body { 
            margin: 0; 
            background: white !important;
            padding: 0;
          }
          .app-container { min-height: auto !important; }
          .print-container {
            box-shadow: none !important;
            width: 100% !important;
            padding: 10mm !important;
            margin: 0 !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default QuotationPreview;
