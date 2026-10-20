import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CATALOG = [
  { id: 'TN-01', name: 'Pro White ANC TWS', price: 1190, oldPrice: 1550, category: 'audio', sale: false, tier: '1:1 MASTER', stock: 38 },
  { id: 'TN-02', name: 'REMAX RC-155a Fast Cable', price: 150, oldPrice: 220, category: 'charging', sale: true, tier: 'ORIGINAL', stock: 45 },
  { id: 'TN-03', name: 'Ultrapods Pro Crystal TWS', price: 350, oldPrice: 490, category: 'audio', sale: false, tier: 'TRENDING', stock: 52 },
  { id: 'TN-04', name: 'SM 007 Wireless Neckband', price: 450, oldPrice: 650, category: 'audio', sale: true, tier: 'QC TESTED', stock: 30 },
  { id: 'TN-05', name: 'Y80 Ultra 8+1 Smartwatch', price: 890, oldPrice: 1350, category: 'wearables', sale: false, tier: '8+1 STRAPS', stock: 19 },
  { id: 'TN-06', name: 'RECRSI 4-in-1 65W Cable', price: 420, oldPrice: 650, category: 'charging', sale: true, tier: 'ORIGINAL', stock: 41 },
  { id: 'TN-07', name: 'Compact 27W Fast Adapter', price: 250, oldPrice: 380, category: 'charging', sale: false, tier: 'FAST PD', stock: 29 },
  { id: 'TN-08', name: 'KW68 Mini Smartwatch', price: 790, oldPrice: 1150, category: 'wearables', sale: true, tier: '3+1 STRAPS', stock: 22 },
  { id: 'TN-09', name: 'Oraimo Over-Ear OR-08', price: 990, oldPrice: 1450, category: 'audio', sale: false, tier: 'STUDIO', stock: 16 },
  { id: 'TN-10', name: 'LAXASFIT K10 2G SIM Watch', price: 1350, oldPrice: 1750, category: 'wearables', sale: true, tier: '2G SIM', stock: 14 }
];

// 1. Get filtered catalog
app.get('/api/products', (req, res) => {
  const { category, maxPrice, sale } = req.query;
  let results = [...CATALOG];
  if (category && category !== 'all') results = results.filter(p => p.category === category);
  if (maxPrice) results = results.filter(p => p.price <= Number(maxPrice));
  if (sale === 'true') results = results.filter(p => p.sale);
  res.json({ count: results.length, products: results });
});

// 2. Agentic Free-Delivery Threshold Optimizer (৳2,000+)
app.post('/api/agent/optimize-bundle', (req, res) => {
  const { cartIds = [] } = req.body;
  const items = cartIds.map(id => CATALOG.find(p => p.id === id)).filter(Boolean);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const FREE_DELIVERY_THRESHOLD = 2000;

  if (subtotal >= FREE_DELIVERY_THRESHOLD) {
    return res.json({
      subtotal,
      freeDeliveryUnlocked: true,
      agentMessage: '100% Free Nationwide Delivery unlocked!'
    });
  }

  const shortfall = FREE_DELIVERY_THRESHOLD - subtotal;
  const recommendedFiller = CATALOG
    .filter(p => !cartIds.includes(p.id) && p.price >= shortfall)
    .sort((a, b) => a.price - b.price)[0] || CATALOG.find(p => p.id === 'TN-02');

  res.json({
    subtotal,
    shortfall,
    freeDeliveryUnlocked: false,
    recommendedFiller,
    agentMessage: `You are ৳${shortfall} away from Free Nationwide Delivery. Add ${recommendedFiller.name} (৳${recommendedFiller.price}) to waive the ৳120 courier fee.`
  });
});

// 3. Create COD / bKash Order
app.post('/api/orders', (req, res) => {
  const { customerName, phone, district, items = [], paymentMethod = 'COD' } = req.body;
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const deliveryFee = subtotal >= 2000 ? 0 : (district?.toLowerCase() === 'dhaka' ? 60 : 120);

  res.status(201).json({
    orderId: `TN-${Date.now().toString().slice(-6)}`,
    customerName: customerName || 'Valued Customer',
    phone: phone || '',
    paymentMethod,
    subtotal,
    deliveryFee,
    totalPayable: subtotal + deliveryFee,
    status: 'CONFIRMED_FOR_DISPATCH'
  });
});

// Root & fallback static routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let server;
if (!process.env.DISABLE_SERVER_LISTEN && process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`🚀 Tech Nest Gradient Storefront running at http://localhost:${PORT}`);
  });
}

export { app, server, CATALOG };
export default server || app;
