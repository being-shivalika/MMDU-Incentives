/**
 * Detailed Export utilities for MMDU Research Incentive Portal
 * Supports CSV export & formatted printable PDF generation for Accounts Annual Disbursements
 */

export const exportToCSV = (items = [], filename = "MMDU_Incentives_Annual_Disbursement.csv") => {
  if (!items || items.length === 0) {
    alert("No data available to export.");
    return;
  }

  const headers = [
    "Claim ID",
    "Applicant Faculty / Student Name",
    "Department",
    "Designation / Role",
    "Publication Category",
    "Subtype",
    "Title / Paper Name",
    "Journal / Conference / Publisher",
    "Indexing / Quartile",
    "Financial Year",
    "Submission Date",
    "Total Policy Incentive (INR)",
    "MMDU Author Count",
    "Faculty Individual Share (INR)",
    "Payment / Payout Status",
    "Transaction ID",
    "Disbursal Date"
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = items.map((item) => {
    const claimNo = item.claimNumber || item.id || "N/A";
    const applicant = item.creatorName || item.applicantName || item.applicant || "N/A";
    const dept = item.creatorDept || item.department || "N/A";
    const role = item.creatorRole || item.applicantRole || "Faculty";
    const cat = (item.category || "").replace(/_/g, " ").toUpperCase();
    const sub = (item.subtype || "").replace(/_/g, " ").toUpperCase();
    const title = item.title || "N/A";
    
    const meta = item.metadata || item.fields || {};
    const jName = meta.journalTitle || meta.conferenceTitle || meta.publisher || meta.patentOffice || "N/A";
    const quartile = meta.quartile || meta.indexingTier || "Indexed";
    
    const fy = item.financialYear || "2026-2027";
    const subDate = item.dateSubmitted ? new Date(item.dateSubmitted).toLocaleDateString() : (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A");
    
    const totalInc = item.totalIncentive || item.approvedAmount || item.calculatedAmount || 0;
    const authorsCount = item.mmduAuthorCount || 1;
    const share = item.userShare || item.individualShare || item.approvedAmount || item.totalIncentive || 0;
    
    const status = item.isHeld ? "HELD (1st Pub Policy)" : (item.isPaid || item.paymentStatus === "PAID" ? "PAID" : "UNPAID");
    const txnDetails = item.paymentDetails || {};
    const txnId = txnDetails.transactionId || "N/A";
    const disbursalDate = txnDetails.dateReleased ? new Date(txnDetails.dateReleased).toLocaleDateString() : "N/A";

    return [
      escapeCSV(claimNo),
      escapeCSV(applicant),
      escapeCSV(dept),
      escapeCSV(role),
      escapeCSV(cat),
      escapeCSV(sub),
      escapeCSV(title),
      escapeCSV(jName),
      escapeCSV(quartile),
      escapeCSV(fy),
      escapeCSV(subDate),
      escapeCSV(`₹${Number(totalInc).toLocaleString("en-IN")}`),
      escapeCSV(authorsCount),
      escapeCSV(`₹${Number(share).toLocaleString("en-IN")}`),
      escapeCSV(status),
      escapeCSV(txnId),
      escapeCSV(disbursalDate)
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (items = [], filename = "MMDU_Annual_Incentive_Statement", batchInfo = {}) => {
  if (!items || items.length === 0) {
    alert("No data available to export to PDF.");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate the PDF statement.");
    return;
  }

  const totalAmount = items.reduce((acc, item) => {
    const share = Number(item.userShare || item.individualShare || item.approvedAmount || item.totalIncentive || item.amount || 0);
    return acc + (isNaN(share) ? 0 : share);
  }, 0);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>MMDU Annual Research Incentive Disbursement Statement</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 30px;
          color: #0f172a;
          line-height: 1.4;
        }
        .header {
          text-align: center;
          border-bottom: 3px double #0f172a;
          padding-bottom: 12px;
          margin-bottom: 18px;
        }
        .header h1 {
          margin: 0;
          font-size: 20px;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .header h2 {
          margin: 4px 0 0 0;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }
        .header p {
          margin: 3px 0 0 0;
          font-size: 11px;
          color: #64748b;
        }
        .meta-grid {
          display: flex;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 11px;
        }
        .meta-item strong {
          color: #0f172a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 8px 10px;
          text-align: left;
        }
        th {
          background-color: #0f172a;
          color: #ffffff;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .total-row {
          background-color: #f1f5f9;
          font-weight: bold;
        }
        .total-row td {
          border-top: 2px solid #0f172a;
          font-size: 12px;
        }
        .signatures {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
          padding-top: 15px;
        }
        .sig-box {
          text-align: center;
          width: 30%;
          border-top: 1.5px dashed #64748b;
          padding-top: 6px;
          font-size: 10px;
          font-weight: bold;
          color: #334155;
        }
        .watermark {
          position: fixed;
          bottom: 10px;
          right: 10px;
          font-size: 9px;
          color: #94a3b8;
        }
        @media print {
          body { margin: 15px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>MAHARISHI MARKANDESHWAR (DEEMED TO BE UNIVERSITY)</h1>
        <h2>MULLANA - AMBALA, HARYANA (INDIA)</h2>
        <p>Finance & Accounts Division — Annual Research Promotion Policy Disbursement Statement</p>
      </div>

      <div class="meta-grid">
        <div class="meta-item"><strong>Filter Scope:</strong> ${batchInfo.filterScope || "All Filtered Records"}</div>
        <div class="meta-item"><strong>Financial Year:</strong> ${batchInfo.financialYear || "2026-2027"}</div>
        <div class="meta-item"><strong>Date Generated:</strong> ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        <div class="meta-item"><strong>Total Records:</strong> ${items.length}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Claim ID</th>
            <th>Faculty / Applicant</th>
            <th>Department</th>
            <th>Category & Title</th>
            <th>Quartile / Tier</th>
            <th>Faculty Share</th>
            <th>Payout Status</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, idx) => {
            const meta = item.metadata || item.fields || {};
            const q = meta.quartile || meta.indexingTier || "Indexed";
            const share = Number(item.userShare || item.individualShare || item.approvedAmount || item.totalIncentive || item.amount || 0);
            const statusLabel = item.isHeld ? "HELD (1st Pub Rule)" : (item.isPaid || item.paymentStatus === "PAID" ? "PAID" : "UNPAID");
            
            return `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.claimNumber || item.id || 'N/A'}</strong></td>
                <td>${item.creatorName || item.applicantName || item.applicant || 'N/A'}</td>
                <td>${item.creatorDept || item.department || 'CSE'}</td>
                <td><strong>${(item.category || '').replace(/_/g, ' ').toUpperCase()}</strong><br><span style="font-size:9px; color:#475569;">${item.title || item.subtype || ''}</span></td>
                <td>${q}</td>
                <td style="text-align: right;"><strong>₹${share.toLocaleString("en-IN")}</strong></td>
                <td><span style="color: ${item.isPaid || item.paymentStatus === 'PAID' ? 'green' : 'orange'}; font-weight: bold;">${statusLabel}</span></td>
              </tr>
            `;
          }).join('')}
          <tr class="total-row">
            <td colSpan="6" style="text-align: right;">TOTAL DISBURSEMENT AMOUNT:</td>
            <td style="text-align: right;">₹${totalAmount.toLocaleString("en-IN")}</td>
            <td>${items.length} Claims Total</td>
          </tr>
        </tbody>
      </table>

      <div class="signatures">
        <div class="sig-box">
          Prepared By<br>
          <span style="font-weight: normal; font-size: 9px;">Accounts Assistant</span>
        </div>
        <div class="sig-box">
          Verified By<br>
          <span style="font-weight: normal; font-size: 9px;">R&D Cell Coordinator</span>
        </div>
        <div class="sig-box">
          Authorized Signatory<br>
          <span style="font-weight: normal; font-size: 9px;">Accounts Officer / Finance Officer</span>
        </div>
      </div>

      <div class="watermark">
        MMDU RPMS Official Accounts Document • Generated ${new Date().toLocaleString()}
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
