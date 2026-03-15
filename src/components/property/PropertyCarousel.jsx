'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import PropertyCard from './PropertyCard';

const SLIDE_INTERVAL_MS = 3000;
const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

/** Десктоп: по 3 на слайд, безкраен цикъл. Мобилен: по 1 имот на слайд. */
function buildSlides(properties, isMobile) {
  const N = properties.length;
  if (N === 0) return [];
  if (isMobile) return properties.map((p) => [p]);
  if (N < 3) return [properties.slice()];
  const slides = [];
  for (let k = 0; k < N; k++) {
    const start = (k * 3) % N;
    slides.push([
      properties[start],
      properties[(start + 1) % N],
      properties[(start + 2) % N],
    ]);
  }
  return slides;
}

export default function PropertyCarousel({ properties = [], locale = 'bg' }) {
  const isMobile = useIsMobile();
  const slides = buildSlides(properties, isMobile);
  const slideCount = Math.max(1, slides.length);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [isMobile]);

  const goNext = useCallback(() => {
    setSlideIndex((i) => (i + 1) % slideCount);
  }, [slideCount]);

  const goPrev = useCallback(() => {
    setSlideIndex((i) => (i - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-advance every 3 seconds; reset timer on manual navigation
  useEffect(() => {
    if (slideCount <= 1) return;
    const t = setInterval(goNext, SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [slideCount, goNext, slideIndex]);

  if (!properties?.length) {
    return (
      <div className="text-center py-12 text-graphite-light">
        Няма налични оферти за показ.
      </div>
    );
  }

  // При 3 или по-малко имота: статична мрежа, без стрелки и без завъртане
  if (properties.length <= 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} locale={locale} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Arrows - само при повече от 3 имота */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-graphite hover:bg-gray-50 transition-colors"
            aria-label="Предишни"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-graphite hover:bg-gray-50 transition-colors"
            aria-label="Следващи"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            width: `${slideCount * 100}%`,
            transform: `translateX(-${(slideIndex / slideCount) * 100}%)`,
          }}
        >
          {slides.map((slideProperties, index) => (
            <div
              key={index}
              className="shrink-0 w-full min-w-0"
              style={{ width: `${100 / slideCount}%` }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-1">
                {slideProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} locale={locale} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
