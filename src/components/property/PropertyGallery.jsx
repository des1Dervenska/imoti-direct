'use client';

import { useState } from 'react';
import { DEFAULT_PROPERTY_IMAGE } from '@/lib/constants';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

// Styles
const mainImageContainer = 'relative bg-gray-200 rounded-2xl overflow-hidden h-72 md:h-96 lg:h-[500px]';
const imageStyle = 'absolute inset-0 w-full h-full object-cover';
const counterBadge = 'absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full';
const navBtnBase = 'absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors';
const navIconStyle = 'w-5 h-5 text-gray-700';
const thumbBase = 'flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all';
const thumbActive = 'border-graphite ring-2 ring-graphite/20';
const thumbInactive = 'border-transparent hover:border-gray-300';

// Navigation config
const NAV_BUTTONS = [
  { Icon: ChevronLeftIcon, position: 'left-3', label: 'Предишна снимка', direction: -1 },
  { Icon: ChevronRightIcon, position: 'right-3', label: 'Следваща снимка', direction: 1 },
];

export default function PropertyGallery({ images = [], title = 'Имот' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images?.length > 0 ? images : [DEFAULT_PROPERTY_IMAGE];
  const hasMultipleImages = displayImages.length > 1;
  const totalImages = displayImages.length;

  const navigate = (direction) => {
    setActiveIndex(prev => {
      const next = prev + direction;
      if (next < 0) return totalImages - 1;
      if (next >= totalImages) return 0;
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className={mainImageContainer}>
        <img
          src={displayImages[activeIndex]}
          alt={`${title} - снимка ${activeIndex + 1}`}
          className={imageStyle}
        />

        {/* Image counter */}
        {hasMultipleImages && (
          <div className={counterBadge}>
            {activeIndex + 1} / {totalImages}
          </div>
        )}

        {/* Navigation arrows */}
        {hasMultipleImages && NAV_BUTTONS.map(({ Icon, position, label, direction }) => (
          <button
            key={direction}
            onClick={() => navigate(direction)}
            className={`${navBtnBase} ${position}`}
            aria-label={label}
          >
            <Icon className={navIconStyle} />
          </button>
        ))}
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`${thumbBase} ${index === activeIndex ? thumbActive : thumbInactive}`}
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
