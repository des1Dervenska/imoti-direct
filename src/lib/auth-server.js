import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be set');
  return secret;
}

export function createSignedCookie() {
  const payload = JSON.stringify({
    t: Date.now(),
    v: 1,
  });
  const base64 = Buffer.from(payload, 'utf-8').toString('base64url');
  const secret = getSecret();
  const sig = crypto.createHmac('sha256', secret).update(base64).digest('hex');
  return `${base64}.${sig}`;
}

export function getCookieName() {
  return COOKIE_NAME;
}

export function getMaxAge() {
  return MAX_AGE_SEC;
}
