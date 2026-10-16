import { SSLCommerzProvider } from './sslcommerz.js';
import { BkashProvider } from './bkash.js';
import { UddoktaPayProvider, OFFICIAL_PAYMENTLY_URL, OFFICIAL_QR_CODE_URL } from './uddoktapay.js';
import { SandboxPaymentProvider } from './sandbox.js';
import { PAYMENT_PROVIDERS } from './types.js';

export * from './types.js';
export { UddoktaPayProvider, OFFICIAL_PAYMENTLY_URL, OFFICIAL_QR_CODE_URL };

export function getPublicOrigin(req = null) {
  const configured = process.env.APP_URL || process.env.PUBLIC_URL || process.env.BASE_URL;
  if (configured) {
    return configured.replace(/\/+$/, '');
  }
  if (req && req.headers && req.headers.host) {
    const proto = req.headers['x-forwarded-proto'] || (req.socket?.encrypted ? 'https' : 'http');
    return `${proto}://${req.headers.host}`;
  }
  return 'http://localhost:3000';
}

export function getPaymentProvider(requestedProvider) {
  const chosen = (requestedProvider || process.env.PAYMENT_GATEWAY_PROVIDER || '').toLowerCase();

  const sslcommerz = new SSLCommerzProvider();
  const bkash = new BkashProvider();
  const uddoktapay = new UddoktaPayProvider();

  if (chosen === PAYMENT_PROVIDERS.UDDOKTAPAY || chosen === PAYMENT_PROVIDERS.PAYMENTLY) {
    return uddoktapay;
  }

  if (chosen === PAYMENT_PROVIDERS.SSLCOMMERZ && sslcommerz.isConfigured()) {
    return sslcommerz;
  }

  if (chosen === PAYMENT_PROVIDERS.BKASH && bkash.isConfigured()) {
    return bkash;
  }

  // Explicit sandbox request
  if (chosen === 'sandbox') {
    return new SandboxPaymentProvider();
  }

  // Auto-detect based on env credentials or configured gateway
  if (uddoktapay.apiKey) return uddoktapay;
  if (sslcommerz.isConfigured()) return sslcommerz;
  if (bkash.isConfigured()) return bkash;
  if (uddoktapay.isConfigured() && (process.env.PAYMENT_GATEWAY_PROVIDER === 'uddoktapay' || process.env.PAYMENT_GATEWAY_PROVIDER === 'paymently')) {
    return uddoktapay;
  }

  // Check if sandbox provider is enabled via environment
  const sandboxEnabled = process.env.ENABLE_SANDBOX_PAYMENT === 'true' || 
                         process.env.PAYMENT_GATEWAY_PROVIDER === 'sandbox';
  if (sandboxEnabled) {
    return new SandboxPaymentProvider();
  }

  // No real provider is configured
  return null;
}

export function isPaymentConfigured() {
  const sslcommerz = new SSLCommerzProvider();
  const bkash = new BkashProvider();
  const uddoktapay = new UddoktaPayProvider();
  const sandboxEnabled = process.env.ENABLE_SANDBOX_PAYMENT === 'true' || 
                         process.env.PAYMENT_GATEWAY_PROVIDER === 'sandbox';
  return sslcommerz.isConfigured() || bkash.isConfigured() || uddoktapay.isConfigured() || sandboxEnabled;
}

export function getPaymentConfigurationStatus() {
  const sslcommerz = new SSLCommerzProvider();
  const bkash = new BkashProvider();
  const uddoktapay = new UddoktaPayProvider();
  const sandboxEnabled = process.env.ENABLE_SANDBOX_PAYMENT === 'true' || 
                         process.env.PAYMENT_GATEWAY_PROVIDER === 'sandbox';
  const configured = sslcommerz.isConfigured() || bkash.isConfigured() || uddoktapay.isConfigured() || sandboxEnabled;

  const activeProvider = (process.env.PAYMENT_GATEWAY_PROVIDER === 'paymently' || process.env.PAYMENT_GATEWAY_PROVIDER === 'uddoktapay' || uddoktapay.apiKey)
    ? (process.env.PAYMENT_GATEWAY_PROVIDER === 'paymently' ? 'paymently' : 'uddoktapay')
    : (sslcommerz.isConfigured() 
        ? 'sslcommerz' 
        : (bkash.isConfigured() ? 'bkash' : (sandboxEnabled ? 'sandbox' : (uddoktapay.isConfigured() ? 'paymently' : null))));

  const isSandbox = Boolean(
    activeProvider === 'sandbox' ||
    (activeProvider === 'sslcommerz' && sslcommerz.isSandbox) ||
    (activeProvider === 'bkash' && bkash.isSandbox)
  );

  return {
    isConfigured: configured,
    onlinePaymentAvailable: configured,
    activeProvider,
    sandbox: isSandbox,
    uddoktapay: {
      configured: uddoktapay.isConfigured(),
      hasApiKey: Boolean(uddoktapay.apiKey),
      paymentLink: uddoktapay.paymentLink,
      qrCodeUrl: uddoktapay.qrCodeUrl,
      supportedMethods: ['bKash', 'Nagad', 'Rocket', 'Upay', 'Visa / Mastercard', 'Internet Banking']
    },
    paymently: {
      configured: Boolean(uddoktapay.paymentLink),
      paymentLink: uddoktapay.paymentLink,
      qrCodeUrl: uddoktapay.qrCodeUrl
    },
    sslcommerz: {
      configured: sslcommerz.isConfigured(),
      sandbox: sslcommerz.isSandbox
    },
    bkash: {
      configured: bkash.isConfigured(),
      sandbox: bkash.isSandbox
    },
    message: configured
      ? (activeProvider === 'paymently'
          ? 'Paymently live gateway active on main domain.'
          : (activeProvider === 'uddoktapay'
              ? 'UddoktaPay automated gateway active on main domain.'
              : (activeProvider === 'sandbox' 
                  ? 'Interactive Sandbox Gateway active on main domain (bKash / Nagad / Cards).' 
                  : 'Payment gateway configured and ready.')))
      : 'Online payments currently unavailable. Live merchant credentials (Paymently, UddoktaPay, SSLCommerz, or bKash) must be configured in environment variables.'
  };
}
