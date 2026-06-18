'use client';

import { useState } from 'react';

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function UnusedStoragePanel() {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [unused, setUnused] = useState([]);
  const [stats, setStats] = useState(null);

  const handleScan = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/storage/unused', { credentials: 'include' });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || 'Грешка при сканиране');
        return;
      }

      setUnused(data.unused || []);
      setStats(data.stats || null);
    } catch {
      setError('Няма връзка със сървъра');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!unused.length) return;

    const confirmed = window.confirm(
      `Сигурни ли сте, че искате да изтриете ${unused.length} неизползвани снимки (${formatBytes(stats?.totalSizeBytes || 0)})? Това действие не може да бъде отменено.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/storage/unused', {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || 'Грешка при изтриване');
        return;
      }

      if (data.failed?.length) {
        setError(
          `Изтрити: ${data.deleted}. Неуспешни: ${data.failed.length}. Опитайте сканиране отново.`
        );
      } else {
        setSuccess(`Успешно изтрити ${data.deleted} неизползвани снимки от Supabase Storage.`);
      }

      setUnused([]);
      setStats(null);
      await handleScan();
    } catch {
      setError('Няма връзка със сървъра');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleScan}
          disabled={loading || deleting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Сканиране...' : 'Сканирай неизползвани снимки'}
        </button>

        {unused.length > 0 && (
          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={loading || deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Изтриване...' : `Изтрий всички (${unused.length})`}
          </button>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-white border rounded-lg">
            <p className="text-sm text-gray-500">Файлове в storage</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.storageFileCount}</p>
          </div>
          <div className="p-4 bg-white border rounded-lg">
            <p className="text-sm text-gray-500">Използвани в приложението</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.referencedCount}</p>
          </div>
          <div className="p-4 bg-white border rounded-lg">
            <p className="text-sm text-gray-500">Неизползвани</p>
            <p className="text-2xl font-semibold text-red-600">{stats.unusedCount}</p>
          </div>
          <div className="p-4 bg-white border rounded-lg">
            <p className="text-sm text-gray-500">Размер (неизползвани)</p>
            <p className="text-2xl font-semibold text-gray-900">{formatBytes(stats.totalSizeBytes)}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          {success}
        </div>
      )}

      {!loading && stats && unused.length === 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          Няма неизползвани Supabase снимки. Storage е чист спрямо обявите и постерите.
        </div>
      )}

      {unused.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Неизползвани снимки ({unused.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {unused.map((file) => (
              <div key={file.path} className="bg-white border rounded-lg overflow-hidden">
                <img
                  src={file.publicUrl}
                  alt=""
                  className="w-full h-24 object-cover bg-gray-100"
                />
                <div className="p-2 text-xs text-gray-600 break-all">
                  <p>{file.path}</p>
                  <p className="mt-1 text-gray-400">{formatBytes(file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Сканира само Supabase bucket <code className="bg-gray-100 px-1 rounded">property-images</code>.
        Сравнява с URL-и от обяви (<code className="bg-gray-100 px-1 rounded">properties.images</code>)
        и постери (<code className="bg-gray-100 px-1 rounded">home_posters</code>).
        Cloudinary снимки не се показват тук.
      </p>
    </div>
  );
}
