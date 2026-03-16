'use client';

import { heroConfig } from '@/lib/hero.config';
import { getTranslations } from '@/lib/translations';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

export default function HeroSection({ locale = 'bg' }) {
  const { image, content } = heroConfig;
  const t = getTranslations(locale)?.hero;
  const tagline = t?.tagline ?? content.tagline;
  const imageAlt = t?.imageAlt ?? image.alt;

  return (
    <section className="relative h-[90vh] min-h-[600px] max-h-[900px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image.src}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
        {/* Лек оверлей с бранд цвят – по-ниска непрозрачност, снимката се вижда повече */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0, 151, 178, 0.4) 0%, rgba(0, 120, 150, 0.35) 50%, rgba(0, 0, 0, 0.3) 100%)',
          }}
        />
        {/* Лек контраст отгоре/отдолу за четимост на текста */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 0%, transparent 40%, transparent 60%, rgba(0, 0, 0, 0.15) 100%)',
          }}
        />
      </div>

      {/* Content - Centered */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center px-4">
          {/* Brand Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white tracking-[0.3em] md:tracking-[0.4em] mb-6 drop-shadow-lg">
            {content.title.split(' ').join('   ')}
          </h1>

          {/* Divider */}
          <div className="w-24 h-px bg-white/60 mx-auto mb-6" />

          {/* Tagline */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 tracking-[0.15em] drop-shadow-md">
            {Array.isArray(tagline) ? tagline.join(' ') : content.tagline.join(' ')}
          </p>
        </div>
      </div>

      {/* Scroll indicator - subtle arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
        <ArrowDownIcon className="w-6 h-6 text-white" />
      </div>
    </section>
  );
}
