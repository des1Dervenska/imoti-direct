import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSignedCookie, getCookieName, getMaxAge } from '@/lib/auth-server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { error: 'Админ паролата не е конфигурирана' },
        { status: 500 }
      );
    }

    if (password !== expected) {
      return NextResponse.json(
        { error: 'Грешна парола' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const value = createSignedCookie();
    cookieStore.set(getCookieName(), value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: getMaxAge(),
      path: '/',
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Грешка при влизане' },
      { status: 500 }
    );
  }
}
