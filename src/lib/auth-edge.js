/**
 * Verify admin session cookie in Edge (middleware).
 * Uses Web Crypto so it runs in Edge runtime.
 */
const COOKIE_NAME = 'admin_session';
const MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000; // 7 days

async function hmacSha256Hex(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(data)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyAdminCookie(cookieValue, secret) {
  if (!cookieValue || !secret) return false;
  const i = cookieValue.lastIndexOf('.');
  if (i === -1) return false;
  const base64 = cookieValue.slice(0, i);
  const expectedSig = cookieValue.slice(i + 1);
  try {
    const binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const jsonStr = new TextDecoder().decode(bytes);
    const payload = JSON.parse(jsonStr);
    if (payload.v !== 1 || !payload.t) return false;
    if (Date.now() - payload.t > MAX_AGE_MS) return false;
    const actualSig = await hmacSha256Hex(secret, base64);
    return actualSig === expectedSig && actualSig.length > 0;
  } catch {
    return false;
  }
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}
