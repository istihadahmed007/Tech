import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getPaymentProvider, getPaymentConfigurationStatus, isPaymentConfigured } from '../server/payments/index.js';
import { PAYMENT_STATUS } from '../server/payments/types.js';

test('Payment Link Experience — CheckoutModal.jsx code integrity', () => {
  const checkoutCode = fs.readFileSync(path.resolve('src/components/CheckoutModal.jsx'), 'utf8');

  // 1. Radio-card payment selectors removed
  assert.equal(
    checkoutCode.includes('checkout-payment-option'),
    false,
    'CheckoutModal must not render large radio-card payment selectors (checkout-payment-option)'
  );

  // 2. Unnecessary payment-method badges and chips removed
  assert.equal(
    checkoutCode.includes('checkout-brand-chips'),
    false,
    'CheckoutModal must not render payment provider brand chips'
  );
  assert.equal(
    checkoutCode.includes('checkout-brand-chip'),
    false,
    'CheckoutModal must not render individual brand chip elements'
  );

  // 3. One clean payment link with "Pay Securely Online →"
  assert.match(
    checkoutCode,
    /Pay Securely Online\s*(?:&rarr;|→)/,
    'CheckoutModal must display clean payment link with "Pay Securely Online →"'
  );

  // 4. Order total and delivery fee clearly visible
  assert.match(checkoutCode, /Items Subtotal:/, 'Items subtotal must be visible');
  assert.match(checkoutCode, /Delivery & Handling:/, 'Delivery fee must be visible');
  assert.match(checkoutCode, /Order Total:/, 'Order total must be visible');

  // 5. No fake fallback payment links or fake availability when gateway is unconfigured
  assert.equal(
    checkoutCode.includes('vartualtutor.paymently.io/paymentlink/default/BDT'),
    false,
    'CheckoutModal must not hardcode fake fallback payment links when backend unconfigured'
  );
  assert.match(
    checkoutCode,
    /setOnlineAvailable\(false\)/,
    'CheckoutModal must strictly set onlineAvailable to false when server returns not available'
  );
});

test('Payment Link Experience — PaymentGatewayModal.jsx code integrity', () => {
  const gatewayCode = fs.readFileSync(path.resolve('src/components/PaymentGatewayModal.jsx'), 'utf8');

  // 1. Segmented navigation tabs removed
  assert.equal(
    gatewayCode.includes('Payment Portal'),
    false,
    'PaymentGatewayModal must not contain "Payment Portal" tab'
  );
  assert.equal(
    gatewayCode.includes('Scan QR'),
    false,
    'PaymentGatewayModal must not contain "Scan QR" tab'
  );
  assert.equal(
    gatewayCode.includes('Submit TrxID'),
    false,
    'PaymentGatewayModal must not contain "Submit TrxID" tab'
  );

  // 2. Tab-switching state removed
  assert.equal(
    gatewayCode.includes('activeTab'),
    false,
    'PaymentGatewayModal must not contain activeTab state'
  );
  assert.equal(
    gatewayCode.includes('setActiveTab'),
    false,
    'PaymentGatewayModal must not contain setActiveTab state'
  );

  // 3. Simple payment section contents
  assert.match(
    gatewayCode,
    /Secure Online Payment/,
    'PaymentGatewayModal must contain "Secure Online Payment"'
  );
  assert.match(
    gatewayCode,
    /Click the link below to complete your payment through our configured merchant gateway\./,
    'PaymentGatewayModal must contain the exact instruction copy'
  );
  assert.match(
    gatewayCode,
    /Pay Now\s*(?:&rarr;|→)/,
    'PaymentGatewayModal must contain "Pay Now →" link'
  );

  // 4. Normal clickable link opening actual backend session checkout URL
  assert.match(
    gatewayCode,
    /<a[\s\S]*?href=\{paymentUrl\}[\s\S]*?target="_blank"[\s\S]*?rel="noopener noreferrer"/,
    'PaymentGatewayModal must render a normal <a> link opening paymentUrl in target="_blank"'
  );

  // 5. Uses real session URL according to provider, without inventing generic URLs
  assert.match(
    gatewayCode,
    /const paymentUrl = sessionInfo\?\.redirectUrl \|\| sessionInfo\?\.paymentLink \|\| '';/,
    'PaymentGatewayModal must use real sessionInfo.redirectUrl or verified sessionInfo.paymentLink'
  );

  // 6. Displays order ID and payable total
  assert.match(gatewayCode, /sessionInfo\.orderId/, 'Must display session order ID');
  assert.match(gatewayCode, /sessionInfo\.amount/, 'Must display payable total');

  // 7. Small security note present
  assert.match(
    gatewayCode,
    /256-bit SSL encrypted/,
    'PaymentGatewayModal must display security note'
  );

  // 8. Error handling when payment URL is missing
  assert.match(
    gatewayCode,
    /Payment checkout URL is unavailable/,
    'PaymentGatewayModal must display clear error when payment URL is unavailable'
  );

  // 9. Does not mark order as paid on link click or use local storage
  assert.equal(
    gatewayCode.includes('onPaymentSuccess('),
    false,
    'PaymentGatewayModal must never invoke onPaymentSuccess on click or modal load'
  );
  assert.equal(
    gatewayCode.includes('localStorage.setItem'),
    false,
    'PaymentGatewayModal must not use localStorage as proof of payment'
  );
});

test('Real Payment Processing Safety & Server Validation', async () => {
  // When no provider credentials are configured, online payments must not claim to be configured
  const status = getPaymentConfigurationStatus();
  assert.equal(status.onlinePaymentAvailable, false);
  assert.equal(isPaymentConfigured(), false);
  assert.equal(getPaymentProvider(), null);

  // When live Paymently is configured, it resolves real session URL
  process.env.PAYMENT_GATEWAY_PROVIDER = 'paymently';
  const provider = getPaymentProvider('paymently');
  assert.ok(provider);

  const mockOrder = {
    id: 'ORD-TEST-900',
    total: 2150,
    customer: { name: 'Verified Customer', phone: '01711112222' }
  };
  const session = await provider.initiatePayment(mockOrder, 'https://tech.vartualtutor.com');
  assert.equal(session.success, true);
  assert.ok(session.redirectUrl);
  assert.ok(session.paymentLink);
  assert.equal(session.redirectUrl, session.paymentLink);

  delete process.env.PAYMENT_GATEWAY_PROVIDER;
});
