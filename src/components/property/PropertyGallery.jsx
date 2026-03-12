'use client';

import { useState } from 'react';
import { DEFAULT_PROPERTY_IMAGE } from '@/lib/constants';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

export default function PropertyGallery({ images = [], title = 'Имот' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Use default image if no images provided
  const displayImages = images && images.length > 0 ? images : [DEFAULT_PROPERTY_IMAGE];
  const hasMultipleImages = displayImages.length > 1;

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative bg-gray-200 rounded-2xl overflow-hidden h-72 md:h-96 lg:h-[500px]">
        <img
          src={displayImages[activeIndex]}
          alt={`${title} - снимка ${activeIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Image counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
            {activeIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Navigation arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={() => setActiveIndex(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Предишна снимка"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setActiveIndex(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              aria-label="Следваща снимка"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
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
