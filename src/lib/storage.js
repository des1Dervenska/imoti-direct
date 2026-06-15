/**
 * =============================================================================
 * IMAGE STORAGE UTILITIES
 * =============================================================================
 *
 * Нови снимки се качват в Cloudinary (през /api/admin/upload).
 * Стари Supabase URL-и остават валидни и се показват без промяна.
 *
 * =============================================================================
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

function isAllowedImageFile(file) {
  if (ALLOWED_TYPES.includes(file.type)) return true;
  const ext = file.name?.split('.').pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

function validateFile(file) {
  if (!isAllowedImageFile(file)) {
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

async function uploadViaApi(file, folder) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.error || getUploadErrorMessage(response.status);
      return { url: null, error: message };
    }

    if (!data.url) {
      return { url: null, error: 'Сървърът не върна URL на снимката след качване' };
    }

    return { url: data.url, error: null };
  } catch {
    return {
      url: null,
      error: 'Няма връзка със сървъра. Проверете дали dev сървърът работи.',
    };
  }
}

function getUploadErrorMessage(status) {
  switch (status) {
    case 401:
      return 'Не сте влезли в админ панела. Презаредете страницата и влезте отново.';
    case 503:
      return 'Cloudinary не е конфигуриран. Добавете CLOUDINARY_URL в .env.local и рестартирайте сървъра.';
    case 413:
      return 'Файлът е твърде голям. Максимум: 5MB.';
    default:
      return `Грешка при качване (HTTP ${status})`;
  }
}

/**
 * @param {File} file
 * @returns {Promise<{url: string|null, error: string|null}>}
 */
export async function uploadPropertyImage(file) {
  const validation = validateFile(file);
  if (!validation.valid) {
    return { url: null, error: validation.error };
  }

  return uploadViaApi(file, 'properties');
}

/**
 * @param {File} file
 * @returns {Promise<{url: string|null, error: string|null}>}
 */
export async function uploadPosterImage(file) {
  const validation = validateFile(file);
  if (!validation.valid) {
    return { url: null, error: validation.error };
  }

  return uploadViaApi(file, 'posters');
}

/**
 * @param {File[]} files
 * @param {function} [onProgress]
 * @returns {Promise<{urls: string[], errors: string[]}>}
 */
export async function uploadMultipleImages(files, onProgress) {
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
 * @param {string} url
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function deletePropertyImage(url) {
  if (!url) {
    return { success: false, error: 'Липсва URL на снимка' };
  }

  try {
    const response = await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { success: false, error: data.error || 'Грешка при изтриване' };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: 'Грешка при изтриване на снимка' };
  }
}

export function isStorageConfigured() {
  return true;
}
