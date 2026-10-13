import { PAYMENT_STATUS } from './types.js';

export class SSLCommerzProvider {
  constructor(config = {}) {
    this.storeId = config.storeId || process.env.SSLCOMMERZ_STORE_ID;
    this.storePassword = config.storePassword || process.env.SSLCOMMERZ_STORE_PASSWD;
    this.isSandbox = config.isSandbox !== undefined 
      ? config.isSandbox 
      : (process.env.SSLCOMMERZ_IS_SANDBOX !== 'false');
    
    this.baseUrl = this.isSandbox
      ? 'https://sandbox.sslcommerz.com'
      : 'https://securepay.sslcommerz.com';
  }

  isConfigured() {
    return Boolean(this.storeId && this.storePassword);
  }

  async initiatePayment(order, reqOrigin) {
    if (!this.isConfigured()) {
      throw new Error('SSLCommerz store credentials (SSLCOMMERZ_STORE_ID, SSLCOMMERZ_STORE_PASSWD) are not configured.');
    }

    const host = reqOrigin || 'http://localhost:3000';
    const params = new URLSearchParams({
      store_id: this.storeId,
      store_passwd: this.storePassword,
      total_amount: order.total.toString(),
      currency: 'BDT',
      tran_id: order.id,
      success_url: `${host}/api/payment/callback/sslcommerz?status=success&orderId=${order.id}`,
      fail_url: `${host}/api/payment/callback/sslcommerz?status=fail&orderId=${order.id}`,
      cancel_url: `${host}/api/payment/callback/sslcommerz?status=cancel&orderId=${order.id}`,
      ipn_url: `${host}/api/payment/ipn/sslcommerz`,
      cus_name: order.customer.name,
      cus_email: order.customer.email || 'customer@store.local',
      cus_add1: order.customer.address,
      cus_city: order.customer.division || 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: order.customer.phone,
      shipping_method: 'Courier',
      product_name: order.items.map(i => i.title).join(', ').substring(0, 255),
      product_category: 'Mobile Accessories',
      product_profile: 'physical-goods'
    });

    const response = await fetch(`${this.baseUrl}/gwprocess/v4/api.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await response.json();
    if (data.status === 'SUCCESS' && data.GatewayPageURL) {
      return {
        success: true,
        provider: 'sslcommerz',
        redirectUrl: data.GatewayPageURL,
        sessionKey: data.sessionkey
      };
    } else {
      throw new Error(data.failedreason || 'Failed to initiate SSLCommerz payment session');
    }
  }

  async verifyPayment({ val_id, order }) {
    if (!this.isConfigured()) {
      throw new Error('SSLCommerz credentials missing');
    }
    if (!val_id) {
      throw new Error('val_id is required for SSLCommerz verification');
    }

    const verifyUrl = `${this.baseUrl}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(val_id)}&store_id=${encodeURIComponent(this.storeId)}&store_passwd=${encodeURIComponent(this.storePassword)}&v=1&format=json`;
    
    const response = await fetch(verifyUrl);
    const data = await response.json();

    const isValidStatus = data.status === 'VALID' || data.status === 'VALIDATED';
    const amountMatches = Math.abs(parseFloat(data.amount) - order.total) < 0.01;
    const currencyMatches = (data.currency || '').toUpperCase() === 'BDT';
    const tranMatches = data.tran_id === order.id;

    if (isValidStatus && amountMatches && currencyMatches && tranMatches) {
      return {
        verified: true,
        status: PAYMENT_STATUS.PAID,
        transactionId: data.bank_tran_id || data.tran_id,
        rawId: data.val_id,
        cardType: data.card_type,
        cardBrand: data.card_brand,
        paymentTimestamp: data.tran_date,
        meta: data
      };
    } else {
      return {
        verified: false,
        status: PAYMENT_STATUS.FAILED,
        reason: `Verification failed: status=${data.status}, amountMatches=${amountMatches}, tranMatches=${tranMatches}`
      };
    }
  }
}
