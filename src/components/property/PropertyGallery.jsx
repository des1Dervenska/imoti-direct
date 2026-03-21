'use client';

import { useState } from 'react';
import { DEFAULT_PROPERTY_IMAGE } from '@/lib/constants';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Styles
const mainImageContainer = 'relative bg-white rounded-2xl overflow-hidden h-72 md:h-96 lg:h-[500px]';
const imageStyle = 'absolute inset-0 w-full h-full object-contain';
const counterBadge =
  'rounded-full bg-black/70 text-white text-sm px-3 py-1 shadow-md z-20';
const navBtnBase = 'absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-20';
const navIconStyle = 'w-5 h-5 text-gray-700';
const thumbBase = 'flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all';
const thumbActive = 'border-graphite ring-2 ring-graphite/20';
const thumbInactive = 'border-transparent hover:border-gray-300';

const NAV_BUTTONS = [
  { Icon: ChevronLeftIcon, position: 'left-3', label: 'Предишна снимка', direction: -1 },
  { Icon: ChevronRightIcon, position: 'right-3', label: 'Следваща снимка', direction: 1 },
];

export default function PropertyGallery({
  images = [],
  title = 'Имот',
  isUnavailable = false,
  unavailableOverlayText = null,
  topLeftOverlay = null,
  code = '',
  codeLabel = 'КОД',
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images?.length > 0 ? images : [DEFAULT_PROPERTY_IMAGE];
  const hasMultipleImages = displayImages.length > 1;
  const codeStr = code != null ? String(code).trim() : '';
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
      {/* Главна снимка – показва селектираната */}
      <div className={mainImageContainer}>
        <img
          src={displayImages[activeIndex]}
          alt={`${title} - снимка ${activeIndex + 1}`}
          className={imageStyle}
        />

        {topLeftOverlay && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            {topLeftOverlay}
          </div>
        )}

        <div className="absolute top-8 left-[27%] -translate-x-1/2 md:top-10 pointer-events-none z-1" aria-hidden>
          <img
            src="/images/logo.jpg"
            alt=""
            className="w-16 h-16 md:w-20 md:h-20 object-contain opacity-95"
          />
        </div>

        {isUnavailable && unavailableOverlayText && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 pointer-events-none"
            aria-hidden
          >
            <span className="text-white text-3xl md:text-4xl lg:text-5xl tracking-widest uppercase drop-shadow-lg">
              {unavailableOverlayText}
            </span>
          </div>
        )}

        {(codeStr || hasMultipleImages) && (
          <div className="absolute bottom-3 right-3 z-20 flex max-w-[min(100%-1.5rem,18rem)] flex-col items-end gap-2 pointer-events-none">
            {codeStr !== '' && (
              <span className="inline-block w-full truncate rounded-full bg-white px-3 py-1.5 text-center text-sm font-semibold text-black shadow-md ring-1 ring-black/10">
                {codeLabel}: {codeStr}
              </span>
            )}
            {hasMultipleImages && (
              <div className={counterBadge}>
                {activeIndex + 1} / {totalImages}
              </div>
            )}
          </div>
        )}

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

      {/* Миниатюри – клик селектира снимката да се вижда горе */}
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
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
