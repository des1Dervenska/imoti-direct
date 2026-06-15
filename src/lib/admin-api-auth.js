import { cookies } from 'next/headers';
import { verifyAdminCookie, getAdminCookieName } from '@/lib/auth-edge';

export async function requireAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    return { ok: false, status: 503, error: 'Админ достъпът не е конфигуриран' };
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(getAdminCookieName())?.value;
  const valid = await verifyAdminCookie(cookieValue, secret);

  if (!valid) {
    return { ok: false, status: 401, error: 'Неоторизиран достъп' };
  }

  return { ok: true };
}
