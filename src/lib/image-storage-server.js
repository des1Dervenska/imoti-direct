import {
  deleteCloudinaryImage,
  getSupabaseStoragePath,
  isCloudinaryImageUrl,
  isSupabaseStorageUrl,
} from '@/lib/cloudinary-server';
import { supabaseAdmin } from '@/lib/supabase';

const BUCKET_NAME = 'property-images';

/**
 * Изтрива една снимка от Cloudinary или Supabase Storage.
 * @param {string} url
 * @returns {Promise<{ success: boolean, error: string|null, skipped?: boolean }>}
 */
export async function deleteStoredImage(url) {
  if (!url) {
    return { success: false, error: 'Липсва URL на снимка' };
  }

  if (isCloudinaryImageUrl(url)) {
    return deleteCloudinaryImage(url);
  }

  if (isSupabaseStorageUrl(url)) {
    if (!supabaseAdmin) {
      return {
        success: false,
        error: 'Supabase service role не е конфигуриран за изтриване на снимки',
      };
    }

    const filePath = getSupabaseStoragePath(url);
    if (!filePath) {
      return { success: false, error: 'Невалиден Supabase URL' };
    }

    const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      return { success: false, error: `Supabase: ${error.message}` };
    }

    return { success: true, error: null };
  }

  return { success: true, error: null, skipped: true };
}

/**
 * @param {string[]} urls
 */
export async function deleteStoredImages(urls) {
  const uniqueUrls = [...new Set((urls || []).filter(Boolean))];
  const failed = [];

  for (const url of uniqueUrls) {
    const result = await deleteStoredImage(url);
    if (!result.success && !result.skipped) {
      failed.push({ url, error: result.error || 'Неизвестна грешка' });
    }
  }

  return { failed };
}
