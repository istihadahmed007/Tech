import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve(process.cwd(), 'data-store.json');

export function getDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (data && typeof data === 'object') {
        data.orders = Array.isArray(data.orders) ? data.orders : [];
        data.inventoryDeltas = data.inventoryDeltas || {};
        data.processedIdempotencyKeys = data.processedIdempotencyKeys || {};
        data.paymentSessions = data.paymentSessions || {};
        return data;
      }
    } catch (e) {
      // Fall through to initial
    }
  }
  const initial = {
    orders: [],
    inventoryDeltas: {},
    processedIdempotencyKeys: {},
    paymentSessions: {}
  };
  saveDb(initial);
  return initial;
}

export function saveDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }
}

export function findOrderById(id) {
  if (!id) return null;
  const db = getDb();
  return db.orders.find(o => o.id.toLowerCase() === id.trim().toLowerCase()) || null;
}

export function savePaymentSession(sessionId, sessionData) {
  const db = getDb();
  db.paymentSessions[sessionId] = {
    ...sessionData,
    updatedAt: new Date().toISOString()
  };
  saveDb(db);
}

export function getPaymentSession(sessionId) {
  const db = getDb();
  return db.paymentSessions[sessionId] || null;
}

export function updateOrder(orderId, updates) {
  const db = getDb();
  const order = db.orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
  if (!order) return null;
  Object.assign(order, updates, { updatedAt: new Date().toISOString() });
  saveDb(db);
  return order;
}

export function adjustInventory(productId, quantity) {
  const db = getDb();
  db.inventoryDeltas[productId] = (db.inventoryDeltas[productId] || 0) + quantity;
  saveDb(db);
}
