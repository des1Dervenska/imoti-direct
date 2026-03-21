import { NextResponse } from 'next/server';
import { getHomePosters, upsertHomePosters } from '@/lib/banners';

export async function GET() {
  const { data, error, isDemo } = await getHomePosters();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data, isDemo: !!isDemo });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const posters = Array.isArray(body?.posters) ? body.posters : [];
    const { data, error, isDemo } = await upsertHomePosters(posters);
    if (error) return NextResponse.json({ error, isDemo: !!isDemo }, { status: 500 });
    return NextResponse.json({ data, isDemo: !!isDemo });
  } catch {
    return NextResponse.json({ error: 'Невалидни данни' }, { status: 400 });
  }
}
