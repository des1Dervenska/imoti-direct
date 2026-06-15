import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-api-auth';
import {
  isCloudinaryConfigured,
  uploadImageBuffer,
} from '@/lib/cloudinary-server';
import { deleteStoredImage } from '@/lib/image-storage-server';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
const ALLOWED_FOLDERS = new Set(['properties', 'posters']);

function isAllowedImageFile(file) {
  if (ALLOWED_TYPES.includes(file.type)) return true;
  const ext = file.name?.split('.').pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

export async function GET() {
  return NextResponse.json({ configured: isCloudinaryConfigured() });
}

export async function POST(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: 'Cloudinary не е конфигуриран. Добавете CLOUDINARY_URL в .env.local' },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Липсва файл' }, { status: 400 });
    }

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: 'Невалидна папка за качване' }, { status: 400 });
    }

    if (!isAllowedImageFile(file)) {
      return NextResponse.json(
        { error: `Невалиден тип файл: ${file.type || file.name}. Позволени са: JPEG, PNG, WebP` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { error: `Файлът е твърде голям: ${sizeMB}MB. Максимум: 5MB` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImageBuffer(buffer, folder);

    return NextResponse.json({ url });
  } catch (err) {
    const message =
      err?.message ||
      err?.error?.message ||
      'Грешка при качване в Cloudinary';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await requireAdminSession();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const url = typeof body?.url === 'string' ? body.url.trim() : '';

    if (!url) {
      return NextResponse.json({ error: 'Липсва URL на снимка' }, { status: 400 });
    }

    const result = await deleteStoredImage(url);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, skipped: !!result.skipped });
  } catch (err) {
    console.error('[api/admin/upload DELETE]', err);
    return NextResponse.json(
      { error: 'Грешка при изтриване на снимка' },
      { status: 500 }
    );
  }
}
