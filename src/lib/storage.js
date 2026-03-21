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
  if (!isSupabaseConfigured) {
    return {
      url: null,
      error: 'Supabase не е конфигуриран. Моля, добавете credentials в .env.local',
    };
  }

  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    return { url: null, error: validation.error };
  }

  // Generate unique filename
  const fileName = generateFileName(file.name);
  const filePath = `properties/${fileName}`;

  return uploadToBucket(filePath, file);
}

/**
 * Качва една снимка за рекламен постер – същият bucket като имотите, папка `posters/`.
 * @param {File} file
 * @returns {Promise<{url: string|null, error: string|null}>}
 */
export async function uploadPosterImage(file) {
  if (!isSupabaseConfigured) {
    return {
      url: null,
      error: 'Supabase не е конфигуриран. Моля, добавете credentials в .env.local',
    };
  }

  const validation = validateFile(file);
  if (!validation.valid) {
    return { url: null, error: validation.error };
  }

  const fileName = generateFileName(file.name);
  const filePath = `posters/${fileName}`;

  return uploadToBucket(filePath, file);
}

async function uploadToBucket(filePath, file) {
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    return { url: null, error: `Грешка при качване: ${error.message}` };
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl, error: null };
}

/**
 * Uploads multiple images to Supabase Storage
 * @param {File[]} files - Array of files to upload
 * @param {function} onProgress - Optional callback for progress updates
 * @returns {Promise<{urls: string[], errors: string[]}>}
 */
export async function uploadMultipleImages(files, onProgress) {
  if (!isSupabaseConfigured) {
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

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: files.length,
        fileName: file.name,
      });
    }

    const { url, error } = await uploadPropertyImage(file);

    if (url) {
      results.urls.push(url);
    }

    if (error) {
      results.errors.push(`${file.name}: ${error}`);
    }
  }

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
