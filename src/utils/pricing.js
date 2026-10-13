// Shared Pricing and Shipping Calculations
// Used across CartDrawer, CheckoutModal, server/api.js, and automated tests

export const FREE_SHIPPING_THRESHOLD = 2000;

export const SHIPPING_RATES = {
  INSIDE_DHAKA: 60,
  OUTSIDE_DHAKA: 120
};

export function calculateCartSubtotal(items = []) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + (price * qty);
  }, 0);
}

export function calculateDeliveryFee(subtotal, destination = {}) {
  const { division = 'Dhaka', outsideCity = false } = destination;
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  const isInsideDhaka = String(division).trim().toLowerCase().includes('dhaka') && !outsideCity;
  return isInsideDhaka ? SHIPPING_RATES.INSIDE_DHAKA : SHIPPING_RATES.OUTSIDE_DHAKA;
}

export function calculateOrderTotals(items = [], destination = {}) {
  const subtotal = calculateCartSubtotal(items);
  const deliveryFee = calculateDeliveryFee(subtotal, destination);
  const total = subtotal + deliveryFee;
  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return {
    subtotal,
    deliveryFee,
    total,
    isFreeDelivery,
    remainingForFreeShipping,
    progressPercent
  };
}
