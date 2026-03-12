/**
 * =============================================================================
 * SUPABASE STORAGE UTILITIES
 * =============================================================================
 *
 * Functions for uploading and managing property images in Supabase Storage.
 *
 * =============================================================================
 */

import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'property-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validates a file before upload
 */
function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Невалиден тип файл: ${file.type}. Позволени са: JPEG, PNG, WebP`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `Файлът е твърде голям: ${sizeMB}MB. Максимум: 5MB`,
    };
  }

  return { valid: true, error: null };
}

/**
 * Generates a unique filename for upload
 */
function generateFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop().toLowerCase();
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Uploads a single image to Supabase Storage
 * @param {File} file - The file to upload
 * @returns {Promise<{url: string|null, error: string|null}>}
 */
export async function uploadPropertyImage(file) {
  console.log('[Storage] uploadPropertyImage called with:', {
    name: file.name,
    type: file.type,
    size: file.size,
  });

  if (!isSupabaseConfigured) {
    console.error('[Storage] Supabase not configured!');
    return {
      url: null,
      error: 'Supabase не е конфигуриран. Моля, добавете credentials в .env.local',
    };
  }

  console.log('[Storage] Supabase is configured, proceeding with upload...');

  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    console.error('[Storage] File validation failed:', validation.error);
    return { url: null, error: validation.error };
  }

  // Generate unique filename
  const fileName = generateFileName(file.name);
  const filePath = `properties/${fileName}`;
  console.log('[Storage] Generated file path:', filePath);

  // Upload to Supabase Storage
  console.log('[Storage] Starting upload to bucket:', BUCKET_NAME);
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  console.log('[Storage] Upload response:', { data, error });

  if (error) {
    console.error('[Storage] Upload error:', error);
    return { url: null, error: `Грешка при качване: ${error.message}` };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  console.log('[Storage] Public URL data:', urlData);
  console.log('[Storage] Final public URL:', urlData.publicUrl);

  return { url: urlData.publicUrl, error: null };
}

/**
 * Uploads multiple images to Supabase Storage
 * @param {File[]} files - Array of files to upload
 * @param {function} onProgress - Optional callback for progress updates
 * @returns {Promise<{urls: string[], errors: string[]}>}
 */
export async function uploadMultipleImages(files, onProgress) {
  console.log('[Storage] uploadMultipleImages called with', files.length, 'files');

  if (!isSupabaseConfigured) {
    console.error('[Storage] Cannot upload - Supabase not configured');
    return {
      urls: [],
      errors: ['Supabase не е конфигуриран. Моля, добавете credentials в .env.local'],
    };
  }

  const results = {
    urls: [],
    errors: [],
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`[Storage] Processing file ${i + 1}/${files.length}:`, file.name);

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: files.length,
        fileName: file.name,
      });
    }

    const { url, error } = await uploadPropertyImage(file);
    console.log(`[Storage] Result for ${file.name}:`, { url, error });

    if (url) {
      results.urls.push(url);
    }

    if (error) {
      results.errors.push(`${file.name}: ${error}`);
    }
  }

  console.log('[Storage] uploadMultipleImages final results:', results);
  return results;
}

/**
 * Deletes an image from Supabase Storage
 * @param {string} url - The public URL of the image
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function deletePropertyImage(url) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase не е конфигуриран',
    };
  }

  // Extract path from URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/property-images/properties/filename.jpg
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/property-images\/(.+)/);

    if (!pathMatch) {
      return { success: false, error: 'Невалиден URL на снимка' };
    }

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: `Грешка при изтриване: ${error.message}` };
    }

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: 'Невалиден URL формат' };
  }
}

/**
 * Checks if Supabase Storage is configured and accessible
 */
export function isStorageConfigured() {
  return isSupabaseConfigured;
}
