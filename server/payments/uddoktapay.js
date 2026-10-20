import { PAYMENT_STATUS } from './types.js';

export class UddoktaPayProvider {
  constructor(config = {}) {
    this.name = 'uddoktapay';
    this.apiKey = (config.apiKey || process.env.UDDOKTAPAY_API_KEY || '').trim();
    const rawBaseUrl = (config.baseUrl || process.env.UDDOKTAPAY_BASE_URL || 'https://my.uddoktapay.com').trim();
    this.baseUrl = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    this.paymentLink = (config.paymentLink || process.env.PAYMENTLY_URL || '').trim();
    this.qrCodeUrl = (config.qrCodeUrl || process.env.PAYMENT_QR_CODE_URL || '').trim();
  }

  isConfigured() {
    return Boolean(
      this.apiKey || 
      (this.paymentLink && (
        process.env.PAYMENT_GATEWAY_PROVIDER === 'paymently' || 
        process.env.PAYMENT_GATEWAY_PROVIDER === 'uddoktapay'
      ))
    );
  }

  async initiatePayment(order, reqOrigin) {
    if (!this.isConfigured()) {
      throw new Error('Online payment is currently unavailable. Payment gateway credentials are not configured.');
    }

    const origin = (reqOrigin || 'http://localhost:3000').replace(/\/+$/, '');

    // 1. Authoritative UddoktaPay API session initiation
    if (this.apiKey) {
      try {
        const payload = {
          full_name: order.customer?.name || 'Store Customer',
          email: order.customer?.email || 'customer@store.local',
          amount: String(order.total),
          metadata: {
            orderId: String(order.id),
            phone: String(order.customer?.phone || '')
          },
          redirect_url: `${origin}/api/payment/callback/uddoktapay?orderId=${order.id}&status=success`,
          cancel_url: `${origin}/api/payment/callback/uddoktapay?orderId=${order.id}&status=cancel`,
          webhook_url: `${origin}/api/payment/ipn/uddoktapay`,
          return_type: 'GET'
        };

        const response = await fetch(`${this.baseUrl}/api/checkout-v2`, {
          method: 'POST',
          headers: {
            'RT-UDDOKTAPAY-API-KEY': this.apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const rawText = await response.text();
        let data = null;
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          console.warn('[UddoktaPay Init Warning] Non-JSON response:', rawText.slice(0, 160));
        }

        if (data && data.payment_url) {
          const invoiceId = data.invoice_id || (data.payment_url.split('/').pop() || String(order.id));
          return {
            success: true,
            provider: 'uddoktapay',
            redirectUrl: data.payment_url,
            invoiceId,
            paymentLink: data.payment_url,
            qrCodeUrl: this.qrCodeUrl || null,
            supportedMethods: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Visa / Mastercard']
          };
        } else {
          throw new Error(data?.message || 'UddoktaPay checkout initialization failed');
        }
      } catch (err) {
        console.error('[UddoktaPay Gateway Error]', err.message);
        throw err;
      }
    }

    // 2. Direct merchant payment link (only if explicitly set in environment)
    if (this.paymentLink) {
      return {
        success: true,
        provider: 'uddoktapay',
        redirectUrl: this.paymentLink,
        paymentLink: this.paymentLink,
        qrCodeUrl: this.qrCodeUrl || null,
        invoiceId: String(order.id),
        isPaymently: true,
        supportedMethods: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Visa / Mastercard']
      };
    }

    throw new Error('No valid payment provider configuration available');
  }

  async verifyPayment({ invoiceId, order, trxId, senderPhone }) {
    // 1. Authoritative API verification with UddoktaPay server
    if (this.apiKey && invoiceId) {
      try {
        const res = await fetch(`${this.baseUrl}/api/verify-payment`, {
          method: 'POST',
          headers: {
            'RT-UDDOKTAPAY-API-KEY': this.apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({ invoice_id: invoiceId })
        });

        const data = await res.json();
        const status = (data.status || '').toUpperCase();
        const amountMatches = Math.abs(parseFloat(data.amount || '0') - order.total) < 0.01;

        if (status === 'COMPLETED' && amountMatches) {
          return {
            verified: true,
            status: PAYMENT_STATUS.PAID,
            transactionId: data.transaction_id || `UDD_${invoiceId}`,
            paymentMethod: data.payment_method || 'bKash/Nagad via UddoktaPay',
            paymentTimestamp: data.date || new Date().toISOString(),
            meta: data
          };
        }
      } catch (err) {
        console.warn('[UddoktaPay Verify Notice]:', err.message);
      }
    }

    // 2. Customer manual TrxID submission: Store as pending verification reference
    // Never independently authorize an order as paid based purely on a client string!
    if (trxId && typeof trxId === 'string' && trxId.trim().length >= 6) {
      const cleanTrx = trxId.trim().toUpperCase();
      return {
        verified: false,
        pendingVerification: true,
        status: PAYMENT_STATUS.PENDING,
        transactionId: cleanTrx,
        senderPhone: senderPhone || order?.customer?.phone || null,
        reason: 'Transaction ID recorded for manual verification. Awaiting confirmation from payment gateway.'
      };
    }

    return {
      verified: false,
      status: PAYMENT_STATUS.FAILED,
      reason: 'Authoritative transaction verification failed. No valid transaction confirmed by payment provider.'
    };
  }
}
