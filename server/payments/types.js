export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  UNPAID: 'unpaid'
};

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  DEMO_RECEIVED: 'demo_received',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_PROVIDERS = {
  SSLCOMMERZ: 'sslcommerz',
  BKASH: 'bkash',
  UDDOKTAPAY: 'uddoktapay',
  PAYMENTLY: 'paymently',
  SANDBOX: 'sandbox',
  COD: 'cod'
};
