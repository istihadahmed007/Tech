import { PAYMENT_STATUS } from './types.js';

export class BkashProvider {
  constructor(config = {}) {
    this.name = 'bkash';
    this.appKey = config.appKey || process.env.BKASH_APP_KEY;
    this.appSecret = config.appSecret || process.env.BKASH_APP_SECRET;
    this.username = config.username || process.env.BKASH_USERNAME;
    this.password = config.password || process.env.BKASH_PASSWORD;
    this.isSandbox = config.isSandbox !== undefined 
      ? config.isSandbox 
      : (process.env.BKASH_IS_SANDBOX !== 'false');

    this.baseUrl = this.isSandbox
      ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
      : 'https://tokenized.pay.bka.sh/v1.2.0-beta';
  }

  isConfigured() {
    return Boolean(this.appKey && this.appSecret && this.username && this.password);
  }

  async grantToken() {
    const res = await fetch(`${this.baseUrl}/tokenized/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        username: this.username,
        password: this.password
      },
      body: JSON.stringify({
        app_key: this.appKey,
        app_secret: this.appSecret
      })
    });
    const data = await res.json();
    if (!data.id_token) {
      throw new Error(data.statusMessage || 'Failed to grant bKash auth token');
    }
    return data.id_token;
  }

  async initiatePayment(order, reqOrigin) {
    if (!this.isConfigured()) {
      throw new Error('bKash merchant credentials are not configured in environment variables.');
    }

    const token = await this.grantToken();
    const host = reqOrigin || 'http://localhost:3000';

    const res = await fetch(`${this.baseUrl}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-APP-Key': this.appKey
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: order.customer.phone,
        callbackURL: `${host}/api/payment/callback/bkash?orderId=${order.id}`,
        amount: Number(order.total).toFixed(2),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: order.id
      })
    });

    const data = await res.json();
    if (data.paymentID && data.bkashURL) {
      return {
        success: true,
        provider: 'bkash',
        redirectUrl: data.bkashURL,
        paymentId: data.paymentID
      };
    } else {
      throw new Error(data.statusMessage || 'Failed to create bKash payment');
    }
  }

  async executePayment(paymentId) {
    const token = await this.grantToken();
    const res = await fetch(`${this.baseUrl}/tokenized/checkout/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-APP-Key': this.appKey
      },
      body: JSON.stringify({ paymentID: paymentId })
    });
    return await res.json();
  }

  async verifyPayment({ paymentId, order }) {
    if (!this.isConfigured()) {
      throw new Error('bKash credentials not configured');
    }
    if (!paymentId) {
      throw new Error('paymentId is required for bKash verification');
    }

    // First attempt to execute if not already captured
    let execData = null;
    try {
      execData = await this.executePayment(paymentId);
    } catch (e) {
      // If already executed or status check required, proceed to status query
    }

    const token = await this.grantToken();
    const res = await fetch(`${this.baseUrl}/tokenized/checkout/payment/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-APP-Key': this.appKey
      },
      body: JSON.stringify({ paymentID: paymentId })
    });

    const data = await res.json();
    const isCompleted = (data.transactionStatus === 'Completed') || (execData && execData.transactionStatus === 'Completed');
    const amountVal = parseFloat(data.amount || execData?.amount || '0');
    const amountMatches = Math.abs(amountVal - Number(order.total)) < 0.01;
    const invoiceMatches = (data.merchantInvoiceNumber === order.id) || (execData && execData.merchantInvoiceNumber === order.id);

    if (isCompleted && amountMatches && invoiceMatches) {
      return {
        verified: true,
        status: PAYMENT_STATUS.PAID,
        transactionId: data.trxID || execData?.trxID || `BKASH_${paymentId}`,
        paymentId: data.paymentID || paymentId,
        paymentTimestamp: data.paymentExecuteTime || new Date().toISOString(),
        meta: { ...execData, ...data }
      };
    } else {
      return {
        verified: false,
        status: PAYMENT_STATUS.FAILED,
        reason: data.statusMessage || execData?.statusMessage || 'bKash verification failed'
      };
    }
  }
}
