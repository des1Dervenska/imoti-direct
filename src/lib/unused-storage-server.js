import { getSupabaseStoragePath } from '@/lib/cloudinary-server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

const BUCKET_NAME = 'property-images';
const LIST_LIMIT = 1000;

/**
 * @typedef {{ path: string, publicUrl: string, size: number }} StorageFileEntry
 */

async function listStorageFolder(prefix = '') {
  if (!supabaseAdmin) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY не е конфигуриран');
  }

  /** @type {StorageFileEntry[]} */
  const files = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(prefix, { limit: LIST_LIMIT, offset, sortBy: { column: 'name', order: 'asc' } });

    if (error) {
      throw new Error(`Грешка при списък на storage: ${error.message}`);
    }

    if (!data?.length) break;

    for (const item of data) {
      const itemPath = prefix ? `${prefix}/${item.name}` : item.name;

      if (item.id === null) {
        files.push(...(await listStorageFolder(itemPath)));
        continue;
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(itemPath);

      files.push({
        path: itemPath,
        publicUrl: urlData.publicUrl,
        size: item.metadata?.size ?? 0,
      });
    }

    if (data.length < LIST_LIMIT) break;
    offset += LIST_LIMIT;
  }

  return files;
}

async function getReferencedStoragePaths() {
  if (!supabaseAdmin) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY не е конфигуриран');
  }

  const referenced = new Set();

  const { data: properties, error: propError } = await supabaseAdmin
    .from('properties')
    .select('images');

  if (propError) {
    throw new Error(`Грешка при четене на имоти: ${propError.message}`);
  }

  for (const row of properties || []) {
    for (const url of row.images || []) {
      const path = getSupabaseStoragePath(url);
      if (path) referenced.add(path);
    }
  }

  const { data: posters, error: posterError } = await supabaseAdmin
    .from('home_posters')
    .select('image_url, image_url_en');

  if (posterError) {
    throw new Error(`Грешка при четене на постери: ${posterError.message}`);
  }

  for (const row of posters || []) {
    for (const url of [row.image_url, row.image_url_en]) {
      const path = getSupabaseStoragePath(url);
      if (path) referenced.add(path);
    }
  }

  return referenced;
}

export async function scanUnusedSupabaseStorage() {
  if (!isSupabaseConfigured) {
    return { error: 'Supabase не е конфигуриран', isDemo: true };
  }

  if (!supabaseAdmin) {
    return {
      error: 'Нужен е SUPABASE_SERVICE_ROLE_KEY за сканиране на storage',
      isDemo: false,
    };
  }

  const [allFiles, referencedPaths] = await Promise.all([
    listStorageFolder(),
    getReferencedStoragePaths(),
  ]);

  const unused = allFiles.filter((file) => !referencedPaths.has(file.path));
  const totalSizeBytes = unused.reduce((sum, file) => sum + file.size, 0);

  return {
    unused,
    stats: {
      storageFileCount: allFiles.length,
      referencedCount: referencedPaths.size,
      unusedCount: unused.length,
      totalSizeBytes,
    },
    error: null,
    isDemo: false,
  };
}

export async function deleteUnusedSupabaseStorage() {
  const scan = await scanUnusedSupabaseStorage();

  if (scan.error) {
    return { deleted: 0, failed: [], error: scan.error, isDemo: !!scan.isDemo };
  }

  const paths = scan.unused.map((file) => file.path);
  if (paths.length === 0) {
    return { deleted: 0, failed: [], error: null, isDemo: false };
  }

  /** @type {{ path: string, error: string }[]} */
  const failed = [];
  let deleted = 0;
  const BATCH_SIZE = 100;

  for (let i = 0; i < paths.length; i += BATCH_SIZE) {
    const batch = paths.slice(i, i + BATCH_SIZE);
    const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove(batch);

    if (error) {
      for (const path of batch) {
        failed.push({ path, error: error.message });
      }
    } else {
      deleted += batch.length;
    }
  }

  return { deleted, failed, error: null, isDemo: false };
}
