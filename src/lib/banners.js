import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

function normalizePosterRow(row) {
  return {
    position: row.position,
    imageUrl: row.image_url ?? '',
    imageUrlEn: row.image_url_en ?? '',
    linkUrl: row.link_url ?? '',
    linkUrlEn: row.link_url_en ?? '',
    text: row.text_bg ?? '',
    textEn: row.text_en ?? '',
  };
}

export async function getHomePosters() {
  if (!isSupabaseConfigured) {
    return {
      data: [1, 2, 3].map((position) => ({
        position,
        imageUrl: '',
        imageUrlEn: '',
        linkUrl: '',
        linkUrlEn: '',
        text: '',
        textEn: '',
      })),
      error: null,
      isDemo: true,
    };
  }

  const { data, error } = await supabase
    .from('home_posters')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    return { data: [], error: error.message, isDemo: false };
  }

  const byPosition = new Map((data || []).map((row) => [row.position, normalizePosterRow(row)]));
  const normalized = [1, 2, 3].map((position) => byPosition.get(position) ?? {
    position,
    imageUrl: '',
    imageUrlEn: '',
    linkUrl: '',
    linkUrlEn: '',
    text: '',
    textEn: '',
  });

  return { data: normalized, error: null, isDemo: false };
}

export async function upsertHomePosters(posters) {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase не е конфигуриран', isDemo: true };
  }

  const rows = (posters || []).slice(0, 3).map((poster, idx) => ({
    position: idx + 1,
    image_url: (poster.imageUrl ?? '').trim() || null,
    image_url_en: (poster.imageUrlEn ?? '').trim() || null,
    link_url: (poster.linkUrl ?? '').trim() || null,
    link_url_en: (poster.linkUrlEn ?? '').trim() || null,
    text_bg: (poster.text ?? '').trim() || null,
    text_en: (poster.textEn ?? '').trim() || null,
  }));

  const client = supabaseAdmin || supabase;
  const { data, error } = await client
    .from('home_posters')
    .upsert(rows, { onConflict: 'position' })
    .select('*');

  if (error) {
    return { data: null, error: error.message, isDemo: false };
  }

  return { data: (data || []).map(normalizePosterRow), error: null, isDemo: false };
}
