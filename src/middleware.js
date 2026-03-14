import { NextResponse } from 'next/server';
import { verifyAdminCookie, getAdminCookieName } from '@/lib/auth-edge';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
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

export const config = {
  matcher: ['/admin', '/admin/login', '/admin/properties/:path*'],
};
