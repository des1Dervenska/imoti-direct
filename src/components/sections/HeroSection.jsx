'use client';

import { heroConfig } from '@/lib/hero.config';

export default function HeroSection() {
  const { image, content } = heroConfig;

  return (
    <section className="relative h-[90vh] min-h-[600px] max-h-[900px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      </div>

      {/* Content - Centered */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center px-4">
          {/* Brand Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-[0.3em] md:tracking-[0.4em] mb-6 drop-shadow-lg">
            {content.title.split(' ').join('   ')}
          </h1>

          {/* Divider */}
          <div className="w-24 h-px bg-white/60 mx-auto mb-6" />

          {/* Tagline */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light tracking-[0.15em] drop-shadow-md">
            {content.tagline.join(' ')}
          </p>
        </div>
      </div>

      {/* Scroll indicator - subtle arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
