import { NextResponse } from 'next/server';
import { verifyAdminCookie, getAdminCookieName } from '@/lib/auth-edge';

const LOCALE_COOKIE = 'NEXT_LOCALE';
const LOCALES = ['bg', 'en'];

/** Paths that require locale prefix (without leading slash). Redirect to /{locale}/... */
const LOCALE_PATHS = ['sales', 'rent', 'about', 'contact', 'privacy', 'terms', 'properties'];

function pathNeedsLocale(pathname) {
  if (pathname === '/') return true;
  const segment = pathname.split('/')[1];
  if (LOCALES.includes(segment)) return false; // already has locale
  return LOCALE_PATHS.includes(segment) || pathname.startsWith('/properties/');
}

function getPreferredLocale(request) {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && LOCALES.includes(cookie)) return cookie;
  return 'bg';
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Static / API – skip
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Admin – existing auth
  if (pathname.startsWith('/admin')) {
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }
    const secret =
      process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
    if (!secret) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const cookieValue = request.cookies.get(getAdminCookieName())?.value;
    const valid = await verifyAdminCookie(cookieValue, secret);
    if (!valid) {
      const login = new URL('/admin/login', request.url);
      login.searchParams.set('from', pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  // Public routes – ensure locale prefix
  if (pathNeedsLocale(pathname)) {
    const locale = getPreferredLocale(request);
    const newPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/sales',
    '/rent',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/properties',
    '/properties/:path*',
    '/admin',
    '/admin/login',
    '/admin/properties/:path*',
  ],
};
