'use client';

import { useState } from 'react';
import PosterSingleImageUpload from '@/components/admin/PosterSingleImageUpload';

const emptyPoster = { imageUrl: '', imageUrlEn: '', linkUrl: '', linkUrlEn: '', text: '', textEn: '' };

export default function PostersForm({ initialPosters = [] }) {
  const [posters, setPosters] = useState(
    [1, 2, 3].map((_, i) => ({ ...emptyPoster, ...(initialPosters[i] || {}) }))
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updatePoster = (index, key, value) => {
    setPosters((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/posters', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posters }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Грешка при запис');
      setMessage('Постерите са записани успешно.');
    } catch (e) {
      setError(e.message || 'Грешка при запис');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">{message}</div>}
      {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800">{error}</div>}

      {posters.map((poster, idx) => (
        <div key={idx} className="bg-white border rounded-xl p-5 space-y-4">
          <h3 className="text-lg text-gray-900">Постер #{idx + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <PosterSingleImageUpload
                label="Снимка (BG)"
                value={poster.imageUrl}
                onChange={(url) => updatePoster(idx, 'imageUrl', url)}
                disabled={saving}
              />
            </div>
            <div>
              <PosterSingleImageUpload
                label="Снимка (EN)"
                value={poster.imageUrlEn}
                onChange={(url) => updatePoster(idx, 'imageUrlEn', url)}
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Линк (BG)</label>
              <input className="w-full px-3 py-2 border rounded-lg" value={poster.linkUrl} onChange={(e) => updatePoster(idx, 'linkUrl', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Link (EN)</label>
              <input className="w-full px-3 py-2 border rounded-lg" value={poster.linkUrlEn} onChange={(e) => updatePoster(idx, 'linkUrlEn', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Текст (BG)</label>
              <input className="w-full px-3 py-2 border rounded-lg" value={poster.text} onChange={(e) => updatePoster(idx, 'text', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Text (EN)</label>
              <input className="w-full px-3 py-2 border rounded-lg" value={poster.textEn} onChange={(e) => updatePoster(idx, 'textEn', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? 'Запис...' : 'Запази'}
      </button>
    </div>
  );
}
