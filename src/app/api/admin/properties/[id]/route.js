import { NextResponse } from 'next/server';
import { deleteProperty } from '@/lib/properties';

/**
 * DELETE /api/admin/properties/[id]
 * Изтрива имот по id.
 */
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Липсва id на имот' }, { status: 400 });
    }

    const { error, isDemo } = await deleteProperty(id);

    if (isDemo) {
      return NextResponse.json({ error: error || 'Демо режим' }, { status: 400 });
    }

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/admin/properties/delete]', err);
    return NextResponse.json(
      { error: 'Грешка при изтриване на имота' },
      { status: 500 }
    );
  }
}
