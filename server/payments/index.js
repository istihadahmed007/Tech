import { SSLCommerzProvider } from './sslcommerz.js';
import { BkashProvider } from './bkash.js';
import { SandboxPaymentProvider } from './sandbox.js';
import { PAYMENT_PROVIDERS } from './types.js';

export * from './types.js';

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

  // Auto-detect based on env credentials
  if (sslcommerz.isConfigured()) return sslcommerz;
  if (bkash.isConfigured()) return bkash;

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
  const sandboxEnabled = process.env.ENABLE_SANDBOX_PAYMENT === 'true' || 
                         process.env.PAYMENT_GATEWAY_PROVIDER === 'sandbox';
  return sslcommerz.isConfigured() || bkash.isConfigured() || sandboxEnabled;
}

export function getPaymentConfigurationStatus() {
  const sslcommerz = new SSLCommerzProvider();
  const bkash = new BkashProvider();
  const sandboxEnabled = process.env.ENABLE_SANDBOX_PAYMENT === 'true' || 
                         process.env.PAYMENT_GATEWAY_PROVIDER === 'sandbox';
  const configured = sslcommerz.isConfigured() || bkash.isConfigured() || sandboxEnabled;

  const activeProvider = sslcommerz.isConfigured() 
    ? 'sslcommerz' 
    : (bkash.isConfigured() ? 'bkash' : (sandboxEnabled ? 'sandbox' : null));

  return {
    isConfigured: configured,
    onlinePaymentAvailable: configured,
    activeProvider,
    sandbox: Boolean(sandboxEnabled || sslcommerz.isSandbox || bkash.isSandbox),
    sslcommerz: {
      configured: sslcommerz.isConfigured(),
      sandbox: sslcommerz.isSandbox
    },
    bkash: {
      configured: bkash.isConfigured(),
      sandbox: bkash.isSandbox
    },
    message: configured
      ? (activeProvider === 'sandbox' 
          ? 'Interactive Sandbox Gateway active on main domain (bKash / Nagad / Cards).' 
          : 'Payment gateway configured and ready.')
      : 'Online payments currently unavailable. Live merchant credentials (SSLCommerz or bKash) must be configured in environment variables.'
  };
}
