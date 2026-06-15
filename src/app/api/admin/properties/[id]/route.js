import { NextResponse } from 'next/server';
import { deleteProperty } from '@/lib/properties';
import { deleteStoredImages } from '@/lib/image-storage-server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

/**
 * DELETE /api/admin/properties/[id]
 * Изтрива снимките от storage и след това имота от базата.
 */
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'Липсва id на имот' }, { status: 400 });
    }

    const idVal = Number(id);
    if (Number.isNaN(idVal)) {
      return NextResponse.json({ error: 'Невалиден id на имот' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: row } = await supabaseAdmin
        .from('properties')
        .select('images')
        .eq('id', idVal)
        .maybeSingle();

      if (row?.images?.length) {
        const { failed } = await deleteStoredImages(row.images);
        if (failed.length > 0) {
          console.error('[api/admin/properties/delete] storage cleanup failed:', failed);
        }
      }
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
