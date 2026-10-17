import crypto from 'crypto';
import { PAYMENT_STATUS } from './types.js';
import { savePaymentSession, getPaymentSession } from '../db.js';

const SANDBOX_SECRET = process.env.SANDBOX_SIGNING_SECRET || 'dev_sandbox_signature_key_2025';

export class SandboxPaymentProvider {
  constructor() {
    this.name = 'sandbox';
  }

  isConfigured() {
    // Sandbox is strictly disabled in production mode
    if (process.env.NODE_ENV === 'production') {
      return false;
    }
    return true; // Available in development/test fallback
  }

  async initiatePayment(order, reqOrigin) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Sandbox payment provider is strictly disabled in production mode');
    }

    const sessionId = `sbx_${crypto.randomBytes(12).toString('hex')}`;
    const host = reqOrigin || 'http://localhost:3000';

    // Store session server-side
    savePaymentSession(sessionId, {
      sessionId,
      orderId: order.id,
      amount: order.total,
      currency: 'BDT',
      status: PAYMENT_STATUS.PENDING,
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      createdAt: new Date().toISOString()
    });

    // Gateway URL on the app's secure test gateway screen
    const redirectUrl = `${host}/?payment_session=${sessionId}&orderId=${order.id}#payment-gateway`;

    return {
      success: true,
      provider: 'sandbox',
      isSandboxNotice: 'Payment gateway credentials not provided in .env. Operating in isolated developer sandbox.',
      sessionId,
      redirectUrl
    };
  }

  createSignature(sessionId, orderId, amount, status) {
    return crypto
      .createHmac('sha256', SANDBOX_SECRET)
      .update(`${sessionId}:${orderId}:${amount}:${status}`)
      .digest('hex');
  }

  async verifyPayment({ sessionId, orderId, status = 'success', signature }) {
    // 1. Strict production safeguard
    if (process.env.NODE_ENV === 'production') {
      return { verified: false, reason: 'Sandbox payments are strictly disabled in production mode' };
    }

    // 2. Gateway session lookup
    if (!sessionId || typeof sessionId !== 'string') {
      return { verified: false, reason: 'Payment session ID is required' };
    }

    const session = getPaymentSession(sessionId);
    if (!session) {
      return { verified: false, reason: 'Payment session not found or expired' };
    }

    if (session.orderId !== orderId) {
      return { verified: false, reason: 'Order ID does not match payment session' };
    }

    // 3. Cryptographic signature is strictly required (prevents bypass spoofing)
    if (!signature || typeof signature !== 'string') {
      return { verified: false, reason: 'Cryptographic gateway signature is strictly required for payment verification' };
    }

    const expectedSignature = this.createSignature(sessionId, orderId, session.amount, status);
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return { verified: false, reason: 'Invalid payment signature' };
    }

    if (status === 'success') {
      const trxId = `SBX_TX_${Date.now().toString(36).toUpperCase()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      return {
        verified: true,
        status: PAYMENT_STATUS.PAID,
        transactionId: trxId,
        paymentTimestamp: new Date().toISOString(),
        isSandbox: true,
        meta: {
          gateway: 'SANDBOX_DEVELOPER_MODE',
          sessionId,
          verifiedAt: new Date().toISOString(),
          signatureVerified: true
        }
      };
    } else if (status === 'cancel') {
      return {
        verified: false,
        status: PAYMENT_STATUS.CANCELLED,
        reason: 'Payment cancelled by user in gateway'
      };
    } else {
      return {
        verified: false,
        status: PAYMENT_STATUS.FAILED,
        reason: 'Payment declined or gateway error'
      };
    }
  }
}
