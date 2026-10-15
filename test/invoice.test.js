import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { generateQRCodeSvg, createQRMatrix } from '../src/utils/qrcode.js';
import { generateCode128Svg } from '../src/utils/barcode.js';
import { generateInvoiceHtml, generateBatchPrintHtml, numberToWordsBDT } from '../src/utils/invoice.js';
import { handleApiRequest } from '../server/api.js';
import { generateAdminToken } from '../server/auth.js';
import { createOrderWithReservation, findOrderById } from '../server/db.js';

test('1. QR Code Generator: generates valid Model 2 SVG matrix and vectors', (t) => {
  const url = 'http://localhost:3000/#track=AGY-602807&token=e26cc1c006a66ef5b4c9902deed42567a2a903eb63dd0ebc';
  const svg = generateQRCodeSvg(url, { size: 140, margin: 2 });

  assert.ok(svg.startsWith('<svg'), 'QR code must start with <svg tag');
  assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'), 'Must have SVG namespace');
  assert.ok(svg.includes('viewBox="0 0'), 'Must define viewBox');
  assert.ok(svg.includes('<path d="M'), 'Must contain vectorized black modules');
  assert.ok(svg.includes('fill="#FFFFFF"'), 'Must have white background canvas');

  const matrix = createQRMatrix('AGY-TEST-123');
  assert.ok(matrix.length >= 21, 'QR matrix dimension must be at least 21x21');
  // Check top-left finder pattern: (0,0) is 1, (0,1) is 1, (1,1) is 0
  assert.strictEqual(matrix[0][0], 1, 'Top-left corner must be dark');
  assert.strictEqual(matrix[1][1], 0, 'Separator module inside finder must be light');
});

test('2. Barcode Generator: generates standards-compliant Code-128 SVG with checksum', (t) => {
  const orderId = 'AGY-602807';
  const svg = generateCode128Svg(orderId, { height: 40 });

  assert.ok(svg.startsWith('<svg'), 'Barcode must start with <svg tag');
  assert.ok(svg.includes('<rect'), 'Must render barcode strips');
  assert.ok(svg.includes(orderId), 'Must display readable human text');
  assert.ok(svg.includes('letter-spacing="2"'), 'Must format font tracking');

  // Should reject non-ASCII characters
  assert.throws(() => {
    generateCode128Svg('বাংলা-১২৩');
  }, /Unsupported character/);
});

test('3. BDT Currency in Words: accurately converts currency numbers to English words', (t) => {
  assert.strictEqual(numberToWordsBDT(0), 'Zero Taka Only');
  assert.strictEqual(numberToWordsBDT(950), 'Nine Hundred Fifty Taka Only');
  assert.strictEqual(numberToWordsBDT(2030), 'Two Thousand Thirty Taka Only');
  assert.strictEqual(numberToWordsBDT(15500), 'Fifteen Thousand Five Hundred Taka Only');
  assert.strictEqual(numberToWordsBDT(125000), 'One Lakh Twenty Five Thousand Taka Only');
});

test('4. Invoice Generator: produces high-contrast printable Tax Invoice HTML', (t) => {
  const mockOrder = {
    id: 'AGY-999001',
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    subtotal: 1890,
    discount: 100,
    deliveryFee: 60,
    total: 1850,
    customer: {
      name: 'Ashikur Rahman',
      phone: '01819283746',
      address: 'House 12, Road 4, Sector 7, Uttara',
      division: 'Dhaka',
      outsideCity: false,
      notes: 'Call before delivery'
    },
    items: [
      { id: 'p11-y80-ultra-smartwatch', title: 'Y80 Ultra Smartwatch', variant: 'Orange Strap', price: 890, quantity: 1 },
      { id: 'p04-ultrapods-pro-tws', title: 'Ultrapods Pro Earbuds', variant: 'Transparent Pink', price: 500, quantity: 2 }
    ],
    guestToken: 'test-guest-token-secure-1234'
  };

  const html = generateInvoiceHtml(mockOrder, { type: 'invoice', origin: 'http://localhost:3000' });

  assert.ok(html.includes('COMMERCIAL TAX INVOICE'), 'Must include tax invoice document badge');
  assert.ok(html.includes('AGY-999001'), 'Must display order reference ID');
  assert.ok(html.includes('Ashikur Rahman'), 'Must display customer name');
  assert.ok(html.includes('01819283746'), 'Must display customer phone');
  assert.ok(html.includes('Uttara'), 'Must display customer address');
  assert.ok(html.includes('Call before delivery'), 'Must display special delivery instructions');
  assert.ok(html.includes('COLLECT CASH ON DELIVERY (নগদ আদায়)'), 'Must highlight COD collection for rider');
  assert.ok(html.includes('Y80 Ultra Smartwatch'), 'Must list first ordered product');
  assert.ok(html.includes('Ultrapods Pro Earbuds'), 'Must list second ordered product');
  assert.ok(html.includes('৳1,850'), 'Must display grand total');
  assert.ok(html.includes('One Thousand Eight Hundred Fifty Taka Only'), 'Must display amount in words');
  assert.ok(html.includes('Scan to Track &amp; Verify Parcel'), 'Must include QR tracking instructions');
  assert.ok(html.includes('window.print()'), 'Must include 1-click print button trigger');
  assert.ok(html.includes('@page {'), 'Must configure A4 portrait print styling');
});

test('5. Packing Slip Generator: produces warehouse dispatch checklist with courier handover', (t) => {
  const mockOrder = {
    id: 'AGY-999002',
    createdAt: new Date().toISOString(),
    status: 'processing',
    paymentMethod: 'sslcommerz',
    paymentStatus: 'paid',
    transactionId: 'TXN-SSL-89201',
    subtotal: 2400,
    discount: 0,
    deliveryFee: 0,
    total: 2400,
    customer: {
      name: 'Nusrat Jahan',
      phone: '01912345678',
      address: 'GEC Circle, Nasirabad',
      division: 'Chittagong',
      outsideCity: true
    },
    items: [
      { id: 'p09-tucci-a5-fighter-headset', title: 'Tucci A5 Gaming Headset', variant: 'Matte Camo', price: 1200, quantity: 2 }
    ],
    guestToken: 'guest-token-paid-5678'
  };

  const html = generateInvoiceHtml(mockOrder, { type: 'packing-slip', origin: 'http://localhost:3000' });

  assert.ok(html.includes('DISPATCH PACKING SLIP'), 'Must include dispatch packing slip badge');
  assert.ok(html.includes('PAID IN FULL (পরিশোধিত)'), 'Must indicate paid in full status');
  assert.ok(html.includes('TXN-SSL-89201'), 'Must include transaction reference');
  assert.ok(html.includes('Courier Handover &amp; Dispatch Sign-off'), 'Must include courier handover section');
  assert.ok(html.includes('Packer / Quality Inspector:'), 'Must include warehouse packer signature line');
  assert.ok(html.includes('Courier Consignment Number:'), 'Must include consignment ID field');
  assert.ok(html.includes('Pick'), 'Must include warehouse pick column header');
  assert.ok(html.includes('Check'), 'Must include warehouse check column header');
});

test('6. Batch Print Generator: combines multiple orders with clean page breaks', (t) => {
  const orders = [
    { id: 'AGY-101', total: 500, customer: { name: 'User 1' }, items: [] },
    { id: 'AGY-102', total: 800, customer: { name: 'User 2' }, items: [] }
  ];

  const batchHtml = generateBatchPrintHtml(orders, { type: 'invoice' });
  assert.ok(batchHtml.includes('Batch Printing: 2 Invoices'), 'Must include batch header');
  assert.ok(batchHtml.includes('page-break-after: always;'), 'Must enforce CSS page breaks for multi-page print');
  assert.ok(batchHtml.includes('AGY-101'), 'Must include first order');
  assert.ok(batchHtml.includes('AGY-102'), 'Must include second order');
});

test('7. API Route: GET /api/orders/:id/invoice serves authorized HTML & JSON with privacy guards', async (t) => {
  // Create a real order in the db
  const orderRes = createOrderWithReservation({
    customer: {
      name: 'Invoice Test Customer',
      phone: '01799887766',
      address: 'Banani Road 11, Dhaka',
      division: 'Dhaka'
    },
    items: [
      { id: 'remax-rc155a-120w-cable', title: 'REMAX Fast Charging Cable', price: 150, quantity: 2, variant: 'Type-C' }
    ],
    subtotal: 300,
    deliveryFee: 60,
    total: 360,
    paymentMethod: 'cod'
  });

  assert.ok(orderRes.success, 'Order creation must succeed');
  const order = orderRes.order;

  // Helper to simulate request to handleApiRequest
  function makeReq(urlPath, headers = {}) {
    return new Promise((resolve) => {
      const req = new http.IncomingMessage();
      req.url = urlPath;
      req.method = 'GET';
      req.headers = { host: 'localhost:3000', ...headers };

      let statusCode = 200;
      const resHeaders = {};
      let body = '';

      const res = {
        setHeader(k, v) { resHeaders[k.toLowerCase()] = v; },
        writeHead(status, headers = {}) {
          statusCode = status;
          for (const [k, v] of Object.entries(headers)) {
            resHeaders[k.toLowerCase()] = v;
          }
        },
        end(data) {
          if (data) body += data;
          resolve({ statusCode: res.statusCode || statusCode, headers: resHeaders, body });
        }
      };

      handleApiRequest(req, res);
    });
  }

  // 1. Unauthorized request (no token) -> 403 Forbidden
  const unauthRes = await makeReq(`/api/orders/${order.id}/invoice`);
  assert.strictEqual(unauthRes.statusCode, 403, 'Must reject unauthenticated invoice requests');
  const unauthJson = JSON.parse(unauthRes.body);
  assert.strictEqual(unauthJson.success, false);

  // 2. Authorized request with valid guest token -> 200 HTML
  const guestRes = await makeReq(`/api/orders/${order.id}/invoice?token=${order.guestToken}`);
  assert.strictEqual(guestRes.statusCode, 200);
  assert.ok(guestRes.headers['content-type'].includes('text/html'));
  assert.ok(guestRes.body.includes(order.id));
  assert.ok(guestRes.body.includes('Invoice Test Customer'));
  assert.ok(guestRes.body.includes('Banani Road 11'));

  // 3. Authorized request for Packing Slip -> 200 HTML with packing slip markup
  const slipRes = await makeReq(`/api/orders/${order.id}/invoice?token=${order.guestToken}&type=packing-slip`);
  assert.strictEqual(slipRes.statusCode, 200);
  assert.ok(slipRes.body.includes('DISPATCH PACKING SLIP'));
  assert.ok(slipRes.body.includes('Courier Handover &amp; Dispatch Sign-off'));

  // 4. Authorized request with format=json -> 200 JSON with amount in words
  const jsonRes = await makeReq(`/api/orders/${order.id}/invoice?token=${order.guestToken}&format=json`);
  assert.strictEqual(jsonRes.statusCode, 200);
  const invoiceData = JSON.parse(jsonRes.body);
  assert.strictEqual(invoiceData.success, true);
  assert.strictEqual(invoiceData.order.id, order.id);
  assert.ok(invoiceData.amountInWords.includes('Taka Only'));

  // 5. Admin authorization using Admin Token -> 200 HTML
  const adminToken = generateAdminToken();
  const adminRes = await makeReq(`/api/orders/${order.id}/invoice?admin_token=${adminToken}`);
  assert.strictEqual(adminRes.statusCode, 200);
  assert.ok(adminRes.body.includes(order.id));

  // 6. Admin Orders CSV Export -> 200 text/csv
  const csvRes = await makeReq(`/api/admin/orders/export-csv?admin_token=${adminToken}`);
  assert.strictEqual(csvRes.statusCode, 200);
  assert.ok(csvRes.headers['content-type'].includes('text/csv'));
  assert.ok(csvRes.headers['content-disposition'].includes('.csv'));
  assert.ok(csvRes.body.includes('Order ID,Date,Customer Name'));
  assert.ok(csvRes.body.includes(order.id));
  assert.ok(csvRes.body.includes('Invoice Test Customer'));
});
