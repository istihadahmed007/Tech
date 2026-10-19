/**
 * Glacial Tech - Printable Invoice & Packing Slip Generator
 * Generates self-contained, high-contrast, print-optimized HTML documents
 * with inline SVG QR codes and Code-128 linear barcodes.
 */

import { generateQRCodeSvg } from './qrcode.js';
import { generateCode128Svg } from './barcode.js';

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

export function numberToWordsBDT(num) {
  const n = Math.floor(Math.abs(Number(num) || 0));
  if (n === 0) return 'Zero Taka Only';

  function convertChunk(val) {
    let str = '';
    if (val >= 100) {
      str += ONES[Math.floor(val / 100)] + ' Hundred ';
      val %= 100;
    }
    if (val >= 20) {
      str += TENS[Math.floor(val / 10)] + ' ';
      val %= 10;
    }
    if (val > 0) {
      str += ONES[val] + ' ';
    }
    return str.trim();
  }

  let words = '';
  const crore = Math.floor(n / 10000000);
  let rem = n % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;
  const hundredAndRest = rem;

  if (crore > 0) words += convertChunk(crore) + ' Crore ';
  if (lakh > 0) words += convertChunk(lakh) + ' Lakh ';
  if (thousand > 0) words += convertChunk(thousand) + ' Thousand ';
  if (hundredAndRest > 0) words += convertChunk(hundredAndRest) + ' ';

  return words.trim() + ' Taka Only';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function generateInvoiceHtml(order, options = {}) {
  const {
    type = 'invoice', // 'invoice' or 'packing-slip'
    origin = '',
    storeInfo = {
      name: 'Tech Nest',
      nameBn: 'টেক নেস্ট',
      tagline: 'Authentic Premium Mobile Gear & Tech Essentials',
      address: 'Suite 402, Concord Tower, Road 11, Dhanmondi, Dhaka-1209',
      phone: '+880 1712-345678',
      email: 'care@technest.com.bd',
      website: 'technest.com.bd',
      tradeLicense: 'TRAD/DNCC/092841/2026'
    }
  } = options;

  const isPackingSlip = type === 'packing-slip';
  const isCod = order.paymentMethod === 'cod';
  const isPaid = order.paymentStatus === 'paid';
  const currencySymbol = '৳';

  // Tracking URL for QR code
  const baseUrl = origin ? origin.replace(/\/+$/, '') : 'http://localhost:3000';
  const trackingUrl = order.guestToken
    ? `${baseUrl}/#track=${encodeURIComponent(order.id)}&token=${encodeURIComponent(order.guestToken)}`
    : `${baseUrl}/#track=${encodeURIComponent(order.id)}`;

  // SVG codes
  const qrSvg = generateQRCodeSvg(trackingUrl, { size: 130, margin: 2, darkColor: '#0f172a' });
  const barcodeSvg = generateCode128Svg(order.id, { height: 38, barWidth: 1.5, showText: true, color: '#0f172a' });

  // Order dates
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = orderDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = orderDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const amountInWords = numberToWordsBDT(order.total);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${isPackingSlip ? 'Packing Slip' : 'Invoice'} - ${escapeHtml(order.id)}</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background-color: #f1f5f9;
      font-size: 12px;
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
    }
    .screen-toolbar {
      position: sticky;
      top: 0;
      z-index: 999;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .screen-toolbar-title {
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .screen-toolbar-actions {
      display: flex;
      gap: 10px;
    }
    .btn {
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn-primary {
      background: #2563eb;
      color: #ffffff;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: #334155;
      color: #f8fafc;
    }
    .btn-secondary:hover {
      background: #475569;
    }
    .sheet-wrapper {
      padding: 24px 16px;
      display: flex;
      justify-content: center;
    }
    .sheet {
      width: 210mm;
      min-height: 297mm;
      padding: 16mm 18mm;
      background: #ffffff;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      position: relative;
    }

    /* Print Header */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #0f172a;
    }
    .brand-logo-title {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 10px;
      font-weight: 600;
      color: #2563eb;
      margin-top: 1px;
    }
    .brand-meta {
      font-size: 10px;
      color: #475569;
      margin-top: 4px;
      line-height: 1.35;
    }
    .doc-badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: ${isPackingSlip ? '#f8fafc' : '#eff6ff'};
      color: ${isPackingSlip ? '#0f172a' : '#1d4ed8'};
      border: 1.5px solid ${isPackingSlip ? '#cbd5e1' : '#bfdbfe'};
      border-radius: 4px;
    }
    .doc-meta-table {
      margin-top: 6px;
      font-size: 11px;
      border-collapse: collapse;
      float: right;
    }
    .doc-meta-table td {
      padding: 2px 4px;
    }
    .doc-meta-table .label {
      font-weight: 600;
      color: #64748b;
      text-align: right;
    }
    .doc-meta-table .val {
      font-weight: 700;
      color: #0f172a;
      font-family: ui-monospace, monospace;
    }

    /* Highlights Banner */
    .highlight-banner {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      margin-bottom: 16px;
      border-radius: 6px;
      border: 1.5px solid ${isCod && !isPaid ? '#f59e0b' : '#10b981'};
      background: ${isCod && !isPaid ? '#fffbeb' : '#ecfdf5'};
    }
    .highlight-banner-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .highlight-status {
      font-size: 14px;
      font-weight: 800;
      color: ${isCod && !isPaid ? '#b45309' : '#047857'};
      text-transform: uppercase;
    }
    .highlight-note {
      font-size: 11px;
      color: #334155;
    }
    .highlight-amount {
      font-size: 18px;
      font-weight: 900;
      color: ${isCod && !isPaid ? '#92400e' : '#065f46'};
    }

    /* 2 Column Customer / Courier Box */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 16px;
    }
    .info-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 12px;
      background: #fafafa;
    }
    .info-card-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
    }
    .info-row {
      margin-bottom: 3px;
      font-size: 11px;
      color: #1e293b;
    }
    .info-row strong {
      color: #0f172a;
    }

    /* Table */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .items-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 7px 8px;
      border-top: 1.5px solid #0f172a;
      border-bottom: 1.5px solid #0f172a;
      text-align: left;
    }
    .items-table td {
      padding: 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
      vertical-align: top;
    }
    .items-table tr:last-child td {
      border-bottom: 1.5px solid #0f172a;
    }
    .col-center { text-align: center !important; }
    .col-right { text-align: right !important; }
    .item-title {
      font-weight: 700;
      color: #0f172a;
    }
    .item-meta {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
    }

    /* Bottom Summary Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 220px;
      gap: 16px;
      margin-bottom: 16px;
    }
    .qr-box {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
      display: flex;
      align-items: center;
      gap: 14px;
      background: #ffffff;
    }
    .qr-text {
      font-size: 10px;
      color: #475569;
      line-height: 1.4;
    }
    .qr-text strong {
      color: #0f172a;
      display: block;
      margin-bottom: 2px;
      font-size: 11px;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    .totals-table td {
      padding: 4px 6px;
    }
    .totals-table .label {
      color: #475569;
      text-align: left;
    }
    .totals-table .amount {
      text-align: right;
      font-weight: 600;
      color: #0f172a;
    }
    .totals-table .grand-total td {
      padding-top: 8px;
      border-top: 1.5px solid #0f172a;
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
    }

    /* In Words */
    .words-box {
      border-left: 3px solid #2563eb;
      background: #f8fafc;
      padding: 6px 12px;
      font-size: 11px;
      color: #334155;
      margin-bottom: 16px;
    }
    .words-box strong {
      color: #0f172a;
    }

    /* Packing Slip Manifest Box */
    .dispatch-manifest {
      border: 1.5px dashed #475569;
      border-radius: 6px;
      padding: 12px;
      background: #f8fafc;
      margin-bottom: 16px;
    }
    .manifest-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
    .manifest-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      font-size: 10px;
    }
    .manifest-field {
      border-bottom: 1px solid #94a3b8;
      padding-bottom: 18px;
      margin-top: 4px;
    }

    /* Footer & Signatures */
    .signatures-table {
      width: 100%;
      margin-top: 24px;
      border-collapse: collapse;
    }
    .signatures-table td {
      width: 33.33%;
      text-align: center;
      vertical-align: bottom;
      padding: 0 10px;
    }
    .sig-line {
      border-top: 1px solid #475569;
      padding-top: 4px;
      font-size: 10px;
      font-weight: 600;
      color: #475569;
    }
    .terms-box {
      margin-top: 18px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 9px;
      color: #64748b;
      line-height: 1.35;
      text-align: center;
    }

    /* Print Styles */
    @media print {
      body {
        background-color: #ffffff;
      }
      .screen-toolbar {
        display: none !important;
      }
      .sheet-wrapper {
        padding: 0 !important;
      }
      .sheet {
        box-shadow: none !important;
        padding: 0 !important;
        width: 100% !important;
        min-height: auto !important;
      }
      @page {
        size: A4 portrait;
        margin: 12mm 14mm 12mm 14mm;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Toolbar -->
  <div class="screen-toolbar no-print">
    <div class="screen-toolbar-title">
      <span>📄</span>
      <span>${isPackingSlip ? 'Warehouse Packing Slip' : 'Customer Tax Invoice'} — ${escapeHtml(order.id)}</span>
    </div>
    <div class="screen-toolbar-actions">
      <button class="btn btn-primary" onclick="window.print()">
        <span>🖨️</span>
        <span>Print Document</span>
      </button>
      <button class="btn btn-secondary" onclick="window.close()">
        <span>✕</span>
        <span>Close</span>
      </button>
    </div>
  </div>

  <div class="sheet-wrapper">
    <div class="sheet">
      <!-- Header -->
      <table class="header-table">
        <tr>
          <td style="vertical-align: top; width: 55%;">
            <div style="margin-bottom: 8px;">
              <img src="/assets/tech-nest-logo-horizontal.png?v=20261019_v3" alt="Tech Nest" style="height: 44px; width: auto; object-fit: contain; aspect-ratio: 1389 / 304;" />
            </div>
            <div class="brand-subtitle">${escapeHtml(storeInfo.nameBn)} • ${escapeHtml(storeInfo.tagline)}</div>
            <div class="brand-meta">
              ${escapeHtml(storeInfo.address)}<br />
              Helpline: ${escapeHtml(storeInfo.phone)} | Email: ${escapeHtml(storeInfo.email)}<br />
              Trade Reg: ${escapeHtml(storeInfo.tradeLicense)} | Web: ${escapeHtml(storeInfo.website)}
            </div>
          </td>
          <td style="vertical-align: top; width: 45%; text-align: right;">
            <div class="doc-badge">
              ${isPackingSlip ? 'DISPATCH PACKING SLIP' : 'COMMERCIAL TAX INVOICE'}
            </div>
            <table class="doc-meta-table">
              <tr>
                <td class="label">Order Ref:</td>
                <td class="val">${escapeHtml(order.id)}</td>
              </tr>
              <tr>
                <td class="label">Date:</td>
                <td class="val">${formattedDate}</td>
              </tr>
              <tr>
                <td class="label">Time:</td>
                <td class="val">${formattedTime}</td>
              </tr>
              <tr>
                <td class="label">Payment:</td>
                <td class="val">${isCod ? 'CASH ON DELIVERY' : (order.paymentMethod ? order.paymentMethod.toUpperCase() : 'ONLINE')}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Barcode Row -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 14px;">
        <div>${barcodeSvg}</div>
        <div style="font-size: 10px; color: #475569; text-align: right;">
          <div>Dispatch Center: <strong>Dhaka Central Hub #1</strong></div>
          <div>Courier Routing: <strong>${escapeHtml(order.customer?.division || 'Dhaka')} Zone</strong></div>
        </div>
      </div>

      <!-- Highlight Banner -->
      <div class="highlight-banner">
        <div class="highlight-banner-left">
          <div>
            <div class="highlight-status">
              ${isPaid 
                ? 'PAID IN FULL (পরিশোধিত)' 
                : isCod 
                  ? 'COLLECT CASH ON DELIVERY (নগদ আদায়)' 
                  : 'PAYMENT PENDING'}
            </div>
            <div class="highlight-note">
              ${isPaid 
                ? `Transaction ID: ${escapeHtml(order.transactionId || 'VERIFIED-ONLINE')}`
                : isCod 
                  ? 'Courier rider must collect the exact total before handover to recipient.'
                  : 'Awaiting payment confirmation.'}
            </div>
          </div>
        </div>
        <div class="highlight-amount">
          ${currencySymbol}${Number(order.total || 0).toLocaleString()}
        </div>
      </div>

      <!-- Info Cards: Recipient & Shipping Logistics -->
      <div class="info-grid">
        <div class="info-card">
          <div class="info-card-title">
            <span>Recipient Delivery Details (গ্রাহক তথ্য)</span>
            <span>📍 Ship-To</span>
          </div>
          <div class="info-row"><strong>Name:</strong> ${escapeHtml(order.customer?.name || 'Valued Customer')}</div>
          <div class="info-row"><strong>Mobile:</strong> <span style="font-family: monospace; font-weight: 700;">${escapeHtml(order.customer?.phone || '')}</span></div>
          <div class="info-row"><strong>Address:</strong> ${escapeHtml(order.customer?.address || '')}</div>
          <div class="info-row"><strong>Division / Zone:</strong> ${escapeHtml(order.customer?.division || 'Dhaka')} (${order.customer?.outsideCity ? 'Outside City' : 'Inside City'})</div>
          ${order.customer?.notes ? `<div class="info-row" style="color: #b45309; font-style: italic;"><strong>Delivery Instructions:</strong> ${escapeHtml(order.customer.notes)}</div>` : ''}
        </div>

        <div class="info-card">
          <div class="info-card-title">
            <span>Logistics & Courier Information</span>
            <span>🚚 Shipping</span>
          </div>
          <div class="info-row"><strong>Courier Partner:</strong> Steadfast / Pathao Logistics</div>
          <div class="info-row"><strong>Delivery Speed:</strong> ${order.customer?.division === 'Dhaka' ? 'Next-Day Express (24h)' : 'Nationwide Courier (48-72h)'}</div>
          <div class="info-row"><strong>Shipping Rate:</strong> ${order.deliveryFee === 0 ? 'FREE COURIER (৳2,000+ Promo)' : `${currencySymbol}${order.deliveryFee}`}</div>
          <div class="info-row"><strong>Security Token:</strong> <span style="font-family: monospace; font-size: 9px; color: #64748b;">${escapeHtml((order.guestToken || '').substring(0, 20))}...</span></div>
          <div class="info-row"><strong>Order Status:</strong> <span style="text-transform: capitalize; font-weight: 700;">${escapeHtml(order.status || 'confirmed')}</span></div>
        </div>
      </div>

      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            ${isPackingSlip ? '<th style="width: 32px;" class="col-center">Pick</th>' : ''}
            ${isPackingSlip ? '<th style="width: 32px;" class="col-center">Check</th>' : ''}
            <th style="width: 28px;" class="col-center">#</th>
            <th style="width: 70px;">SKU / Code</th>
            <th>Item Description</th>
            <th style="width: 110px;">Variant / Color</th>
            <th style="width: 45px;" class="col-center">Qty</th>
            <th style="width: 75px;" class="col-right">Unit (${currencySymbol})</th>
            <th style="width: 85px;" class="col-right">Total (${currencySymbol})</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map((item, idx) => {
            const lineTotal = (item.price || 0) * (item.quantity || 1);
            return `<tr>
              ${isPackingSlip ? '<td class="col-center" style="font-size: 16px;">☐</td>' : ''}
              ${isPackingSlip ? '<td class="col-center" style="font-size: 16px;">☐</td>' : ''}
              <td class="col-center" style="color: #64748b;">${idx + 1}</td>
              <td style="font-family: monospace; font-size: 10px; font-weight: 700; color: #2563eb;">
                ${escapeHtml(item.id || `P-${idx + 1}`)}
              </td>
              <td>
                <div class="item-title">${escapeHtml(item.title)}</div>
                ${item.specsSummary ? `<div class="item-meta">${escapeHtml(item.specsSummary)}</div>` : ''}
              </td>
              <td style="color: #334155;">${escapeHtml(item.variant || 'Standard')}</td>
              <td class="col-center" style="font-weight: 700;">${item.quantity || 1}</td>
              <td class="col-right">${Number(item.price || 0).toLocaleString()}</td>
              <td class="col-right" style="font-weight: 700;">${Number(lineTotal).toLocaleString()}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>

      <!-- Summary & QR Section -->
      <div class="summary-grid">
        <div class="qr-box">
          <div>${qrSvg}</div>
          <div class="qr-text">
            <strong>Scan to Track &amp; Verify Parcel</strong>
            Scan this secure QR code using any smartphone camera to check real-time courier dispatch status, payment reconciliation, and authenticity certificate.
            <div style="font-family: monospace; font-size: 9px; color: #2563eb; margin-top: 4px; word-break: break-all;">
              Ref: ${escapeHtml(order.id)}
            </div>
          </div>
        </div>

        <div>
          <table class="totals-table">
            <tr>
              <td class="label">Subtotal:</td>
              <td class="amount">${currencySymbol}${Number(order.subtotal || 0).toLocaleString()}</td>
            </tr>
            ${order.discount > 0 ? `<tr>
              <td class="label" style="color: #059669;">Promo Discount:</td>
              <td class="amount" style="color: #059669;">-${currencySymbol}${Number(order.discount).toLocaleString()}</td>
            </tr>` : ''}
            <tr>
              <td class="label">Delivery Fee:</td>
              <td class="amount">${order.deliveryFee === 0 ? 'FREE' : `${currencySymbol}${Number(order.deliveryFee).toLocaleString()}`}</td>
            </tr>
            <tr class="grand-total">
              <td class="label">Total Payable:</td>
              <td class="amount">${currencySymbol}${Number(order.total || 0).toLocaleString()}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- In Words -->
      <div class="words-box">
        <strong>Amount in Words:</strong> ${amountInWords}
      </div>

      ${isPackingSlip ? `
      <!-- Packing Slip Courier Handover Checklist -->
      <div class="dispatch-manifest">
        <div class="manifest-title">
          <span>Courier Handover &amp; Dispatch Sign-off</span>
          <span>Warehouse Check: PASS ✓</span>
        </div>
        <div class="manifest-grid">
          <div>
            <div>Packer / Quality Inspector:</div>
            <div class="manifest-field">Sign: ______________ Date: ______</div>
          </div>
          <div>
            <div>Assigned Courier Rider Name:</div>
            <div class="manifest-field">Name: ______________ Phone: ______</div>
          </div>
          <div>
            <div>Courier Consignment Number:</div>
            <div class="manifest-field">CN: _________________________</div>
          </div>
        </div>
      </div>
      ` : `
      <!-- Invoice Signatures -->
      <table class="signatures-table">
        <tr>
          <td>
            <div class="sig-line">Customer Signature</div>
          </td>
          <td>
            <div class="sig-line">Prepared By / Store Staff</div>
          </td>
          <td>
            <div class="sig-line">Authorized Signatory &amp; Seal</div>
          </td>
        </tr>
      </table>
      `}

      <!-- Terms & Return Policy -->
      <div class="terms-box">
        <strong>Warranty &amp; Return Terms:</strong> All accessories carry our 7-Day Replacement Guarantee for manufacturing defects with original packaging intact.
        Please inspect the parcel in the presence of the delivery agent before paying COD.
        For customer service, call <strong>+880 1712-345678</strong> or email <strong>care@technest.com.bd</strong>.
      </div>
    </div>
  </div>

</body>
</html>`;
}

export function generateBatchPrintHtml(orders, options = {}) {
  const { type = 'invoice', origin = '' } = options;
  if (!orders || orders.length === 0) return '';

  const pagesHtml = orders.map(ord => {
    // extract body content from single invoice html
    const full = generateInvoiceHtml(ord, { type, origin });
    const match = full.match(/<div class="sheet-wrapper">([\s\S]*?)<\/div>\s*<\/body>/);
    const inner = match ? match[1] : '';
    return `<div class="print-page" style="page-break-after: always; padding: 10px 0;">
      ${inner}
    </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Batch Print (${orders.length} ${type === 'packing-slip' ? 'Packing Slips' : 'Invoices'})</title>
  <style>
    @media print {
      .screen-toolbar { display: none !important; }
      .print-page { page-break-after: always; }
      @page { size: A4 portrait; margin: 12mm 14mm; }
    }
    body { font-family: -apple-system, sans-serif; background: #e2e8f0; margin: 0; padding: 0; }
    .screen-toolbar {
      position: sticky; top: 0; z-index: 999;
      background: #0f172a; color: #ffffff; padding: 12px 20px;
      display: flex; justify-content: space-between; align-items: center;
    }
  </style>
</head>
<body>
  <div class="screen-toolbar no-print">
    <div><strong>Batch Printing: ${orders.length} ${type === 'packing-slip' ? 'Packing Slips' : 'Invoices'}</strong></div>
    <div>
      <button style="background: #2563eb; color: #fff; padding: 8px 16px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;" onclick="window.print()">Print All</button>
    </div>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px 0;">
    ${pagesHtml}
  </div>
</body>
</html>`;
}

export function openPrintWindow(order, type = 'invoice', options = {}) {
  if (typeof window === 'undefined') return;

  const html = generateInvoiceHtml(order, { 
    type, 
    origin: window.location.origin,
    ...options 
  });

  const printWindow = window.open('', '_blank', 'width=920,height=960,menubar=no,toolbar=no,location=no,status=no');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  } else {
    // Popup was blocked, trigger iframe fallback
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 500);
  }
}

export function openBatchPrintWindow(orders, type = 'invoice', options = {}) {
  if (typeof window === 'undefined') return;

  const html = generateBatchPrintHtml(orders, { 
    type, 
    origin: window.location.origin,
    ...options 
  });

  const printWindow = window.open('', '_blank', 'width=920,height=960');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  }
}
