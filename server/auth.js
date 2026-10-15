import crypto from 'node:crypto';
import {
  findUserByEmail,
  findUserById,
  createUser,
  createSession,
  findSession,
  deleteSession,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts
} from './db.js';

const IS_PROD = process.env.NODE_ENV === 'production';
const INSECURE_DEFAULTS = [
  'admin123',
  'change_me_in_production_strong_secret',
  'dev_secret_key_antigravity_ice_blue_2025',
  'generate_a_random_32_char_secret_for_sessions'
];

// Production secrets validator
export function validateProductionSecrets() {
  if (!IS_PROD) return true;

  const adminPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH;
  const sessionSec = process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET;

  const errors = [];
  if (!adminPass || INSECURE_DEFAULTS.includes(adminPass.trim())) {
    errors.push('ADMIN_PASSWORD / ADMIN_PASSWORD_HASH must be configured with a secure non-default secret in production.');
  }
  if (!sessionSec || INSECURE_DEFAULTS.includes(sessionSec.trim())) {
    errors.push('ADMIN_SESSION_SECRET / SESSION_SECRET must be configured with a secure 32+ character random secret in production.');
  }

  if (errors.length > 0) {
    throw new Error(`[CRITICAL SECURITY CONFIGURATION ERROR]\n${errors.join('\n')}`);
  }
  return true;
}

// Secret key for HMAC token signing
function getSessionSecret() {
  if (IS_PROD) {
    validateProductionSecrets();
    return process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET;
  }
  return process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET || 'dev_secret_key_antigravity_ice_blue_2025';
}

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// -----------------------------------------------------------------------------
// Password Hashing & Verification (scrypt with cryptographically random salt)
// -----------------------------------------------------------------------------

export function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plainPassword, salt, 64).toString('hex');
  return `scrypt:${salt}:${derivedKey}`;
}

export function verifyPasswordHash(plainPassword, storedHash) {
  if (!plainPassword || !storedHash || typeof plainPassword !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  // Handle salted scrypt format
  if (storedHash.startsWith('scrypt:')) {
    const parts = storedHash.split(':');
    if (parts.length !== 3) return false;
    const [, salt, expectedHex] = parts;
    const derivedKey = crypto.scryptSync(plainPassword, salt, 64).toString('hex');

    const derivedBuf = Buffer.from(derivedKey, 'hex');
    const expectedBuf = Buffer.from(expectedHex, 'hex');

    if (derivedBuf.length !== expectedBuf.length) {
      crypto.timingSafeEqual(expectedBuf, expectedBuf);
      return false;
    }
    return crypto.timingSafeEqual(derivedBuf, expectedBuf);
  }

  // Fallback for development plaintext / test compatibility
  const plainBuf = Buffer.from(plainPassword);
  const storedBuf = Buffer.from(storedHash);

  if (plainBuf.length !== storedBuf.length) {
    crypto.timingSafeEqual(storedBuf, storedBuf);
    return false;
  }
  return crypto.timingSafeEqual(plainBuf, storedBuf);
}

// Legacy admin password verification (kept for backward compatibility & tests)
export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH || 'admin123';
}

export function verifyPassword(providedPassword) {
  if (!providedPassword || typeof providedPassword !== 'string') return false;
  const expectedPassword = getAdminPassword();
  return verifyPasswordHash(providedPassword, expectedPassword);
}

// -----------------------------------------------------------------------------
// Admin Token Generation & Verification
// -----------------------------------------------------------------------------

export function generateAdminToken() {
  const secret = getSessionSecret();
  const payload = {
    role: 'admin',
    sub: 'admin_console',
    exp: Date.now() + TOKEN_TTL_MS,
    nonce: crypto.randomBytes(8).toString('hex')
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
  return `agy_admin.${payloadStr}.${signature}`;
}

export function verifyAdminToken(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') {
    return false;
  }
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'agy_admin') {
    return false;
  }

  const [, payloadStr, signature] = parts;
  const secret = getSessionSecret();
  const expectedSignature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (payload.role !== 'admin' || Date.now() > payload.exp) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

// -----------------------------------------------------------------------------
// Customer Session Management
// -----------------------------------------------------------------------------

export function createCustomerSession(userId) {
  const token = `agy_usr_${crypto.randomBytes(32).toString('hex')}`;
  createSession(token, userId, 'customer', TOKEN_TTL_MS);
  return token;
}

export function authenticateRequest(req) {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7).trim();

  // 1. Check if it's admin token
  if (token.startsWith('agy_admin.')) {
    if (verifyAdminToken(authHeader)) {
      return {
        id: 'admin',
        role: 'admin',
        email: 'admin@store.local',
        name: 'Administrator'
      };
    }
    return null;
  }

  // 2. Check customer database session
  const session = findSession(token);
  if (!session) return null;

  const user = findUserById(session.user_id);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
    addresses: user.addresses || []
  };
}

export function logoutSession(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return;
  const token = authHeader.slice(7).trim();
  deleteSession(token);
}

export { checkRateLimit, recordFailedAttempt, clearFailedAttempts };
