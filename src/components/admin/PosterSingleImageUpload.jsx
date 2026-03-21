'use client';

import { useState, useRef, useEffect } from 'react';
import { uploadPosterImage, isStorageConfigured, deletePropertyImage } from '@/lib/storage';

/**
 * Една снимка за постер – същият bucket и валидация като при имотите (`posters/` в storage).
 */
export default function PosterSingleImageUpload({
  label,
  value = '',
  onChange,
  disabled = false,
}) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const storageReady = isStorageConfigured();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || !storageReady) return;
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('image/'));
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setSelectedFile(file);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const clearPending = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !storageReady) return;
    setUploading(true);
    setError('');
    const previousUrl = value;
    const { url, error: err } = await uploadPosterImage(selectedFile);
    setUploading(false);
    if (err) {
      setError(err);
      return;
    }
    clearPending();
    if (previousUrl && previousUrl !== url) {
      await deletePropertyImage(previousUrl);
    }
    onChange(url);
  };

  const handleRemove = async () => {
    if (value && storageReady) {
      await deletePropertyImage(value);
    }
    onChange('');
  };

  if (!storageReady) {
    return (
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Supabase Storage не е конфигуриран.</strong> Добавете credentials в{' '}
          <code className="bg-yellow-100 px-1 rounded">.env.local</code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm text-gray-700 mb-1">{label}</label>
      )}

      {value && !selectedFile && (
        <div className="relative group inline-block max-w-full mb-2">
          <img
            src={value}
            alt=""
            className="max-h-40 w-auto rounded-lg border border-gray-200 object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || uploading}
            className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full opacity-90 hover:bg-red-600 text-sm flex items-center justify-center"
            aria-label="Премахни снимката"
          >
            ×
          </button>
        </div>
      )}

      {!selectedFile && (
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          disabled || uploading
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 cursor-pointer'
        }`}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={false}
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="hidden"
        />
        <p className="text-gray-600 text-sm mb-1">
          Плъзни снимка тук или кликни за избор (един файл)
        </p>
        <p className="text-gray-400 text-xs">JPEG, PNG, WebP до 5MB</p>
      </div>
      )}

      {selectedFile && preview && (
        <div className="space-y-2">
          <div className="relative inline-block">
            <img
              src={preview}
              alt={selectedFile.name}
              className="max-h-32 rounded-lg border border-gray-200 object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearPending();
              }}
              disabled={uploading}
              className="absolute top-1 right-1 w-6 h-6 bg-gray-700 text-white rounded-full text-xs"
            >
              ×
            </button>
          </div>
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || disabled}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {uploading ? 'Качване...' : 'Качи снимката'}
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
