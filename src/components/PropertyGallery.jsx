'use client';

import { useState } from 'react';

export default function PropertyGallery({ images = [], title = 'Имот' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // No images - show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="relative bg-gray-200 rounded-2xl overflow-hidden h-72 md:h-96 lg:h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-300">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 22V12h6v10"/>
            </svg>
            <p className="text-lg">Снимка на имота</p>
          </div>
        </div>
      </div>
    );
  }

  const hasMultipleImages = images.length > 1;

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative bg-gray-200 rounded-2xl overflow-hidden h-72 md:h-96 lg:h-[500px]">
        <img
          src={images[activeIndex]}
          alt={`${title} - снимка ${activeIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Image counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={() => setActiveIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Предишна снимка"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Следваща снимка"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${title} - thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
