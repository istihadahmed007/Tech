import crypto from 'crypto';

// Secret key for signing admin tokens (derived from env or generated per process)
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'dev_secret_key_antigravity_ice_blue_2025';
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH || 'admin123';
}

export function verifyPassword(providedPassword) {
  if (!providedPassword || typeof providedPassword !== 'string') return false;
  const expectedPassword = getAdminPassword();
  
  const providedBuffer = Buffer.from(providedPassword);
  const expectedBuffer = Buffer.from(expectedPassword);
  
  if (providedBuffer.length !== expectedBuffer.length) {
    // Constant time dummy check to avoid length leak
    crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }
  
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

export function generateAdminToken() {
  const payload = {
    role: 'admin',
    exp: Date.now() + TOKEN_TTL_MS,
    nonce: crypto.randomBytes(8).toString('hex')
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64url');
  return `agy_admin.${payloadStr}.${signature}`;
}

export function verifyAdminToken(authHeader) {
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'agy_admin') {
    return false;
  }
  
  const [prefix, payloadStr, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64url');
  
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
