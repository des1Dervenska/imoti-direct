import { NextResponse } from 'next/server';
import { cloneProperty } from '@/lib/properties';

/**
 * POST /api/admin/properties/[id]/clone
 * Дублира имот; новият запис има нов slug и се подрежда най-отгоре по дата на създаване.
 */
export async function POST(request, context) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Липсва id на имот' }, { status: 400 });
    }

    const { data, error, isDemo } = await cloneProperty(id);

    if (isDemo) {
      return NextResponse.json({ error: error || 'Демо режим' }, { status: 400 });
    }

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      property: { id: data.id, slug: data.slug },
    });
  } catch (err) {
    console.error('[api/admin/properties/clone]', err);
    return NextResponse.json(
      { error: 'Грешка при клониране на имота' },
      { status: 500 }
    );
  }
}
