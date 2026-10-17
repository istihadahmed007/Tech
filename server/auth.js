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
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) return true;

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

let runtimeGeneratedSecret = null;

// Secret key for HMAC token signing
function getSessionSecret() {
  const customSecret = process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET;
  if (customSecret && !INSECURE_DEFAULTS.includes(customSecret.trim())) {
    return customSecret;
  }
  if (process.env.NODE_ENV === 'production') {
    if (!runtimeGeneratedSecret) {
      runtimeGeneratedSecret = crypto.randomBytes(32).toString('hex');
    }
    return runtimeGeneratedSecret;
  }
  return 'dev_secret_key_antigravity_ice_blue_2025';
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
// Role-Based Access Control (RBAC) & Permissions
// -----------------------------------------------------------------------------

export const ROLE_PERMISSIONS = {
  admin: ['*'],
  manager: [
    'view:all',
    'manage:products',
    'manage:orders',
    'manage:inventory',
    'manage:categories',
    'manage:promotions',
    'manage:reviews',
    'manage:services',
    'view:reports',
    'export:data'
  ],
  staff: [
    'view:orders',
    'manage:orders',
    'view:products',
    'view:inventory',
    'manage:reviews',
    'manage:services'
  ],
  customer: [
    'view:catalog',
    'create:order'
  ]
};

export function getDefaultPermissions(role) {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(userPermissions, requiredPermission) {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
}

// -----------------------------------------------------------------------------
// Admin Token Generation & Verification
// -----------------------------------------------------------------------------

export function generateAdminToken(customPayload = {}) {
  const secret = getSessionSecret();
  const role = customPayload.role || 'admin';
  const payload = {
    role,
    sub: customPayload.sub || 'admin_console',
    email: customPayload.email || 'admin@store.local',
    name: customPayload.name || 'Administrator',
    permissions: customPayload.permissions || getDefaultPermissions(role),
    exp: Date.now() + TOKEN_TTL_MS,
    nonce: crypto.randomBytes(8).toString('hex')
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
  return `agy_admin.${payloadStr}.${signature}`;
}

export function decodeAdminToken(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'agy_admin') {
    return null;
  }

  const [, payloadStr, signature] = parts;
  const secret = getSessionSecret();
  const expectedSignature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (!['admin', 'manager', 'staff'].includes(payload.role) || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export function verifyAdminToken(authHeader) {
  return Boolean(decodeAdminToken(authHeader));
}

export function getAdminUserFromToken(authHeader) {
  return decodeAdminToken(authHeader);
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

  // 1. Check if it's admin/staff token
  if (token.startsWith('agy_admin.')) {
    const decoded = decodeAdminToken(authHeader);
    if (decoded) {
      return {
        id: decoded.sub || 'admin',
        role: decoded.role || 'admin',
        email: decoded.email || 'admin@store.local',
        name: decoded.name || 'Administrator',
        permissions: decoded.permissions || ['*']
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

// -----------------------------------------------------------------------------
// Phone Ownership OTP Verification
// -----------------------------------------------------------------------------
const phoneOtpStore = new Map();

export function createPhoneOtp(phone) {
  if (!phone || typeof phone !== 'string') {
    throw new Error('Valid phone number is required to request OTP');
  }
  const clean = phone.replace(/[\s-]/g, '');
  const code = crypto.randomInt(100000, 999999).toString();
  phoneOtpStore.set(clean, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0
  });
  return code;
}

export function verifyPhoneOtp(phone, code) {
  if (!phone || !code || typeof code !== 'string') return false;
  const clean = phone.replace(/[\s-]/g, '');
  const record = phoneOtpStore.get(clean);
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    phoneOtpStore.delete(clean);
    return false;
  }

  record.attempts++;
  if (record.attempts > 5) {
    phoneOtpStore.delete(clean);
    return false;
  }

  const codeBuf = Buffer.from(code.trim());
  const expectedBuf = Buffer.from(record.code);
  if (codeBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(codeBuf, expectedBuf)) {
    return false;
  }

  // Once verified, invalidate OTP immediately (single-use)
  phoneOtpStore.delete(clean);
  return true;
}

export { checkRateLimit, recordFailedAttempt, clearFailedAttempts };

