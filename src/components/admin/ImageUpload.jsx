'use client';

import { useState, useRef } from 'react';
import { uploadMultipleImages, isStorageConfigured } from '@/lib/storage';

export default function ImageUpload({ images = [], onChange, disabled = false }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const storageReady = isStorageConfigured();

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create previews
    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setErrors([]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || !storageReady) return;

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );

    if (files.length === 0) return;

    const newPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setErrors([]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Remove selected file (before upload)
  const removeSelectedFile = (index) => {
    URL.revokeObjectURL(previews[index].preview);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove uploaded image
  const removeUploadedImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // Reorder uploaded images
  const moveUploadedImage = (fromIndex, toIndex) => {
    if (disabled || !storageReady) return;
    if (fromIndex === toIndex) return;
    if (toIndex < 0 || toIndex >= images.length) return;

    const next = [...images];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  };

  // Upload selected files
  const handleUpload = async () => {
    console.log('[ImageUpload] handleUpload called');
    console.log('[ImageUpload] selectedFiles:', selectedFiles.length);
    console.log('[ImageUpload] storageReady:', storageReady);

    if (selectedFiles.length === 0 || !storageReady) {
      console.log('[ImageUpload] Aborting - no files or storage not ready');
      return;
    }

    setIsUploading(true);
    setErrors([]);

    console.log('[ImageUpload] Calling uploadMultipleImages...');
    const { urls, errors: uploadErrors } = await uploadMultipleImages(
      selectedFiles,
      (progress) => {
        setUploadProgress(progress);
      }
    );

    console.log('[ImageUpload] Upload complete. URLs:', urls);
    console.log('[ImageUpload] Upload errors:', uploadErrors);

    setIsUploading(false);
    setUploadProgress(null);

    if (uploadErrors.length > 0) {
      setErrors(uploadErrors);
    }

    if (urls.length > 0) {
      // Add new URLs to existing images
      const newImages = [...images, ...urls];
      console.log('[ImageUpload] Calling onChange with new images:', newImages);
      onChange(newImages);

      // Clear selected files
      previews.forEach((p) => URL.revokeObjectURL(p.preview));
      setSelectedFiles([]);
      setPreviews([]);
    } else {
      console.log('[ImageUpload] No URLs returned - not calling onChange');
    }
  };

  // Clear all selected files
  const clearSelected = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.preview));
    setSelectedFiles([]);
    setPreviews([]);
    setErrors([]);
  };

  if (!storageReady) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Supabase Storage не е конфигуриран.</strong> За да качвате снимки,
          добавете Supabase credentials в <code className="bg-yellow-100 px-1 rounded">.env.local</code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Uploaded Images */}
      {images.length > 0 && (
        <div>
          <label className="block text-sm text-gray-700 mb-2">
            Качени снимки ({images.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group">
                {/* Up / Down controls */}
                <button
                  type="button"
                  onClick={() => moveUploadedImage(index, index - 1)}
                  disabled={disabled || index === 0}
                  className="absolute top-1 left-1 w-7 h-7 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-graphite text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Премести снимката нагоре"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveUploadedImage(index, index + 1)}
                  disabled={disabled || index === images.length - 1}
                  className="absolute top-1 left-9 w-7 h-7 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-graphite text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Премести снимката надолу"
                >
                  ↓
                </button>
                <img
                  src={url}
                  alt={`Снимка ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeUploadedImage(index)}
                  disabled={disabled}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm hover:bg-red-600"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 cursor-pointer'
        }`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        <svg
          className="w-10 h-10 mx-auto text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <p className="text-gray-600 mb-1">
          Плъзнете снимки тук или кликнете за избор
        </p>
        <p className="text-gray-400 text-sm">JPEG, PNG, WebP до 5MB</p>
      </div>

      {/* Selected Files Preview */}
      {previews.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-gray-700">
              Избрани за качване ({previews.length})
            </label>
            <button
              type="button"
              onClick={clearSelected}
              disabled={isUploading}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Изчисти всички
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {previews.map((item, index) => (
              <div key={index} className="relative group">
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeSelectedFile(index)}
                  disabled={isUploading}
                  className="absolute top-1 right-1 w-6 h-6 bg-gray-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm hover:bg-gray-800"
                >
                  &times;
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                  {item.name}
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || previews.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Качване...
                </span>
              ) : (
                `Качи ${previews.length} ${previews.length === 1 ? 'снимка' : 'снимки'}`
              )}
            </button>

            {uploadProgress && (
              <span className="text-sm text-gray-500">
                {uploadProgress.current} / {uploadProgress.total}: {uploadProgress.fileName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm mb-1">Грешки при качване:</p>
          <ul className="text-red-700 text-sm list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
