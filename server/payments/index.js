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

/**
 * Resolves active payment provider strictly from trusted server configuration.
 * In production mode, sandbox provider is strictly prohibited and returns null.
 */
export function getPaymentProvider(trustedProviderName = null) {
  const isProd = process.env.NODE_ENV === 'production';
  const serverConfiguredProvider = (process.env.PAYMENT_GATEWAY_PROVIDER || '').toLowerCase();
  const chosen = (trustedProviderName || serverConfiguredProvider).toLowerCase();

  const sslcommerz = new SSLCommerzProvider();
  const bkash = new BkashProvider();
  const uddoktapay = new UddoktaPayProvider();

  // 1. Production Mode: Strictly forbid sandbox provider under all circumstances
  if (isProd) {
    if (chosen === 'sandbox') {
      return null;
    }
    if (chosen === PAYMENT_PROVIDERS.UDDOKTAPAY || chosen === PAYMENT_PROVIDERS.PAYMENTLY) {
      return uddoktapay.isConfigured() ? uddoktapay : null;
    }
    if (chosen === PAYMENT_PROVIDERS.SSLCOMMERZ && sslcommerz.isConfigured()) {
      return sslcommerz;
    }
    if (chosen === PAYMENT_PROVIDERS.BKASH && bkash.isConfigured()) {
      return bkash;
    }

    // Auto-detect live configured provider in production
    if (uddoktapay.apiKey || uddoktapay.isConfigured()) return uddoktapay;
    if (sslcommerz.isConfigured()) return sslcommerz;
    if (bkash.isConfigured()) return bkash;

    return null;
  }

  // 2. Development / Test Mode
  if (chosen === PAYMENT_PROVIDERS.UDDOKTAPAY || chosen === PAYMENT_PROVIDERS.PAYMENTLY) {
    return uddoktapay;
  }

  if (chosen === PAYMENT_PROVIDERS.SSLCOMMERZ && sslcommerz.isConfigured()) {
    return sslcommerz;
  }

  if (chosen === PAYMENT_PROVIDERS.BKASH && bkash.isConfigured()) {
    return bkash;
  }

  // Explicit sandbox request (permitted ONLY outside production)
  if (chosen === 'sandbox') {
    return new SandboxPaymentProvider();
  }

  // Auto-detect real gateways
  if (uddoktapay.apiKey) return uddoktapay;
  if (sslcommerz.isConfigured()) return sslcommerz;
  if (bkash.isConfigured()) return bkash;
  if (uddoktapay.isConfigured() && (serverConfiguredProvider === 'uddoktapay' || serverConfiguredProvider === 'paymently')) {
    return uddoktapay;
  }

  // Check if sandbox provider is enabled via environment in dev/test
  const sandboxEnabled = process.env.ENABLE_SANDBOX_PAYMENT === 'true' || 
                         serverConfiguredProvider === 'sandbox';
  if (sandboxEnabled) {
    return new SandboxPaymentProvider();
  }

  return null;
}

export function isPaymentConfigured() {
  const isProd = process.env.NODE_ENV === 'production';
  const sslcommerz = new SSLCommerzProvider();
  const bkash = new BkashProvider();
  const uddoktapay = new UddoktaPayProvider();

  const realGatewaysConfigured = sslcommerz.isConfigured() || bkash.isConfigured() || uddoktapay.isConfigured();
  if (isProd) {
    return realGatewaysConfigured;
  }

  const sandboxEnabled = process.env.ENABLE_SANDBOX_PAYMENT === 'true' || 
                         process.env.PAYMENT_GATEWAY_PROVIDER === 'sandbox';
  return realGatewaysConfigured || sandboxEnabled;
}

export function getPaymentConfigurationStatus() {
  const isProd = process.env.NODE_ENV === 'production';
  const sslcommerz = new SSLCommerzProvider();
  const bkash = new BkashProvider();
  const uddoktapay = new UddoktaPayProvider();

  const sandboxEnabled = !isProd && (
    process.env.ENABLE_SANDBOX_PAYMENT === 'true' || 
    process.env.PAYMENT_GATEWAY_PROVIDER === 'sandbox'
  );

  const configured = sslcommerz.isConfigured() || bkash.isConfigured() || uddoktapay.isConfigured() || sandboxEnabled;

  const activeProvider = (process.env.PAYMENT_GATEWAY_PROVIDER === 'paymently' || process.env.PAYMENT_GATEWAY_PROVIDER === 'uddoktapay' || uddoktapay.apiKey)
    ? (process.env.PAYMENT_GATEWAY_PROVIDER === 'paymently' ? 'paymently' : 'uddoktapay')
    : (sslcommerz.isConfigured() 
        ? 'sslcommerz' 
        : (bkash.isConfigured() ? 'bkash' : (sandboxEnabled ? 'sandbox' : (uddoktapay.isConfigured() ? 'paymently' : null))));

  const isSandbox = Boolean(
    !isProd && (
      activeProvider === 'sandbox' ||
      (activeProvider === 'sslcommerz' && sslcommerz.isSandbox) ||
      (activeProvider === 'bkash' && bkash.isSandbox)
    )
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
      sandbox: !isProd && sslcommerz.isSandbox
    },
    bkash: {
      configured: bkash.isConfigured(),
      sandbox: !isProd && bkash.isSandbox
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
