import { v2 as cloudinary } from 'cloudinary';

const BUCKET_NAME = 'property-images';
const UPLOAD_ROOT = 'imoti-direct';

function parseCloudinaryUrl(url) {
  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/?]+)$/);
  if (!match) return null;
  return {
    api_key: match[1],
    api_secret: match[2],
    cloud_name: match[3],
  };
}

function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL;
  if (!url) return false;

  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return false;

  cloudinary.config({
    ...parsed,
    secure: true,
  });

  return true;
}

export function isCloudinaryConfigured() {
  return configureCloudinary();
}

function ensureConfigured() {
  if (!isCloudinaryConfigured()) {
    throw new Error('CLOUDINARY_URL не е конфигуриран или е с невалиден формат');
  }
}

/**
 * @param {Buffer} buffer
 * @param {'properties' | 'posters'} folder
 */
export async function uploadImageBuffer(buffer, folder) {
  ensureConfigured();

  const targetFolder = `${UPLOAD_ROOT}/${folder}`;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: targetFolder,
        resource_type: 'image',
      },
      (error, uploadResult) => {
        if (error) reject(error);
        else resolve(uploadResult);
      }
    );

    stream.end(buffer);
  });

  return result.secure_url;
}

export function isCloudinaryImageUrl(url) {
  try {
    const host = new URL(url).hostname;
    return host === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

export function getCloudinaryPublicId(url) {
  if (!isCloudinaryImageUrl(url)) return null;

  try {
    const pathname = new URL(url).pathname;
    const uploadIndex = pathname.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    let publicIdPath = pathname.slice(uploadIndex + '/upload/'.length);
    publicIdPath = publicIdPath.replace(/^v\d+\//, '');
    return publicIdPath.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}

export async function deleteCloudinaryImage(url) {
  ensureConfigured();

  const publicId = getCloudinaryPublicId(url);
  if (!publicId) {
    return { success: false, error: 'Невалиден Cloudinary URL' };
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
  });

  if (result.result !== 'ok' && result.result !== 'not found') {
    return { success: false, error: `Cloudinary: ${result.result}` };
  }

  return { success: true, error: null };
}

export function isSupabaseStorageUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    return pathname.includes(`/storage/v1/object/public/${BUCKET_NAME}/`);
  } catch {
    return false;
  }
}

export function getSupabaseStoragePath(url) {
  if (!isSupabaseStorageUrl(url)) return null;

  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(
      new RegExp(`/storage/v1/object/public/${BUCKET_NAME}/(.+)`)
    );
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
