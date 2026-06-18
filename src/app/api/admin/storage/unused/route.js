import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-api-auth';
import {
  deleteUnusedSupabaseStorage,
  scanUnusedSupabaseStorage,
} from '@/lib/unused-storage-server';

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const result = await scanUnusedSupabaseStorage();

    if (result.error) {
      return NextResponse.json(
        { error: result.error, isDemo: !!result.isDemo },
        { status: result.isDemo ? 400 : 500 }
      );
    }

    return NextResponse.json({
      unused: result.unused,
      stats: result.stats,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || 'Грешка при сканиране' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const auth = await requireAdminSession();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const result = await deleteUnusedSupabaseStorage();

    if (result.error) {
      return NextResponse.json(
        { error: result.error, isDemo: !!result.isDemo },
        { status: result.isDemo ? 400 : 500 }
      );
    }

    return NextResponse.json({
      deleted: result.deleted,
      failed: result.failed,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || 'Грешка при изтриване' },
      { status: 500 }
    );
  }
}
