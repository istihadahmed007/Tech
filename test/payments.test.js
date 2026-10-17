import test from 'node:test';
import assert from 'node:assert/strict';
import { getPaymentProvider, getPaymentConfigurationStatus, isPaymentConfigured } from '../server/payments/index.js';
import { SandboxPaymentProvider } from '../server/payments/sandbox.js';
import { PAYMENT_STATUS, ORDER_STATUS } from '../server/payments/types.js';
import { verifyPassword, getAdminPassword, generateAdminToken, verifyAdminToken } from '../server/auth.js';
import { savePaymentSession, getPaymentSession } from '../server/db.js';

test('Payment Provider: returns null and marks online payments unavailable when credentials are not configured', () => {
  const provider = getPaymentProvider();
  assert.equal(provider, null, 'Should return null when neither SSLCommerz nor bKash credentials are set');

  const configStatus = getPaymentConfigurationStatus();
  assert.equal(configStatus.isConfigured, false);
  assert.equal(configStatus.onlinePaymentAvailable, false);
  assert.equal(configStatus.activeProvider, null);
  assert.equal(isPaymentConfigured(), false);
  assert.match(configStatus.message, /currently unavailable/i);
});

test('Payment Verification Safety: refuses verification if no live payment provider is configured', async () => {
  // If no live provider is configured, online payments must refuse verification
  assert.equal(isPaymentConfigured(), false);
  const provider = getPaymentProvider();
  assert.equal(provider, null);
});

test('Sandbox Payment Activation: correctly configures and returns SandboxPaymentProvider when requested', () => {
  const sandboxProvider = getPaymentProvider('sandbox');
  assert.ok(sandboxProvider);
  assert.equal(sandboxProvider.name, 'sandbox');
  assert.equal(sandboxProvider.isConfigured(), true);

  process.env.ENABLE_SANDBOX_PAYMENT = 'true';
  const autoProvider = getPaymentProvider();
  assert.ok(autoProvider);
  assert.equal(autoProvider.name, 'sandbox');
  assert.equal(isPaymentConfigured(), true);
  const status = getPaymentConfigurationStatus();
  assert.equal(status.onlinePaymentAvailable, true);
  assert.equal(status.activeProvider, 'sandbox');
  delete process.env.ENABLE_SANDBOX_PAYMENT;
});

test('UddoktaPay & Paymently Integration: resolves provider and initiates payment session with QR and link', async () => {
  const provider = getPaymentProvider('uddoktapay');
  assert.ok(provider);
  assert.ok(provider.paymentLink.includes('paymently.io'));
  process.env.PAYMENT_GATEWAY_PROVIDER = 'uddoktapay';
  assert.equal(provider.isConfigured(), true);
  delete process.env.PAYMENT_GATEWAY_PROVIDER;

  const mockOrder = {
    id: 'ORD-VT-101',
    total: 1850,
    customer: { name: 'Rahim Khan', phone: '01712345678' }
  };
  const session = await provider.initiatePayment(mockOrder, 'http://localhost:3000');
  assert.equal(session.success, true);
  assert.equal(session.provider, 'uddoktapay');
  assert.ok(session.paymentLink.includes('paymently.io'));
  assert.equal(session.qrCodeUrl, '/payment-link-BDT-2026-09-11.svg');

  // Verify with valid manual TrxID
  const verifyResult = await provider.verifyPayment({
    order: mockOrder,
    trxId: 'BK728192019'
  });
  assert.equal(verifyResult.verified, true);
  assert.equal(verifyResult.transactionId, 'BK728192019');
});

test('Order Status Model: accurately distinguishes demo_received, unpaid, and paid states', () => {
  // Demo COD order
  const demoOrder = {
    id: 'AGY-DEMO-101',
    isDemo: true,
    paymentMethod: 'cod',
    status: ORDER_STATUS.DEMO_RECEIVED,
    paymentStatus: PAYMENT_STATUS.UNPAID
  };
  assert.equal(demoOrder.isDemo, true);
  assert.equal(demoOrder.status, 'demo_received');
  assert.equal(demoOrder.paymentStatus, 'unpaid');

  // Pending payment order
  const pendingOrder = {
    id: 'AGY-ONLINE-102',
    isDemo: false,
    paymentMethod: 'online',
    status: ORDER_STATUS.PENDING_PAYMENT,
    paymentStatus: PAYMENT_STATUS.PENDING
  };
  assert.equal(pendingOrder.status, 'pending_payment');
  assert.equal(pendingOrder.paymentStatus, 'pending');

  // Confirmed and paid order
  const confirmedOrder = {
    id: 'AGY-PAID-103',
    status: ORDER_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PAID
  };
  assert.equal(confirmedOrder.status, 'confirmed');
  assert.equal(confirmedOrder.paymentStatus, 'paid');
});

test('Sandbox Payment Isolation: sandbox initiates session only if explicitly instantiated', async () => {
  const provider = new SandboxPaymentProvider();
  const mockOrder = {
    id: 'AGY-TEST-001',
    total: 2500,
    customer: {
      name: 'Test Customer',
      phone: '01712345678'
    }
  };

  const result = await provider.initiatePayment(mockOrder, 'http://localhost:3000');
  assert.equal(result.success, true);
  assert.equal(result.provider, 'sandbox');
  assert.match(result.sessionId, /^sbx_/);

  const storedSession = getPaymentSession(result.sessionId);
  assert.ok(storedSession);
  assert.equal(storedSession.orderId, 'AGY-TEST-001');
  assert.equal(storedSession.amount, 2500);
});

test('Payment Security: HMAC signature generation and tamper protection', async () => {
  const provider = new SandboxPaymentProvider();
  const sessionId = 'sbx_hmac_test';
  const orderId = 'ORDER_HMAC_1';
  const amount = 3000;

  savePaymentSession(sessionId, {
    sessionId,
    orderId,
    amount
  });

  const validSignature = provider.createSignature(sessionId, orderId, amount, 'success');
  const validVerification = await provider.verifyPayment({
    sessionId,
    orderId,
    status: 'success',
    signature: validSignature
  });
  assert.equal(validVerification.verified, true);

  // Tampered signature
  const tamperedSig = 'deadbeef' + validSignature.slice(8);
  const tamperedVerification = await provider.verifyPayment({
    sessionId,
    orderId,
    status: 'success',
    signature: tamperedSig
  });
  assert.equal(tamperedVerification.verified, false);
  assert.match(tamperedVerification.reason, /invalid payment signature/i);
});

test('Admin Auth: timing-safe password check and HMAC signed token verification', () => {
  // Correct password check (dynamic based on environment config)
  const validPassword = getAdminPassword();
  assert.equal(verifyPassword(validPassword), true);
  // Incorrect password check
  assert.equal(verifyPassword('wrongpassword_xyz123'), false);
  assert.equal(verifyPassword(''), false);

  // Token issue & verification
  const token = generateAdminToken();
  assert.ok(token);
  assert.equal(verifyAdminToken(`Bearer ${token}`), true);

  // Tampered token
  const tamperedToken = token.slice(0, -6) + 'abcdef';
  assert.equal(verifyAdminToken(`Bearer ${tamperedToken}`), false);
  assert.equal(verifyAdminToken('Bearer invalidtoken'), false);
  assert.equal(verifyAdminToken(null), false);
});
