'use client';

import { heroConfig, heroSectionHeightClass } from '@/lib/hero.config';
import { BRAND_NAME_WITHOUT_NUMBER, BRAND_NAME_NUMBER } from '@/lib/constants';
import { getTranslations } from '@/lib/translations';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

function TaglineWithNumbers({ text }) {
  const parts = text.split(/(\d+)/);
  return (
    <>
      {parts.map((part, i) =>
        /^\d+$/.test(part) ? (
          <span key={i} className="tagline-number">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function HeroSection({ locale = 'bg' }) {
  const { image, content } = heroConfig;
  const t = getTranslations(locale)?.hero;
  const tagline = t?.tagline ?? content.tagline;
  const imageAlt = t?.imageAlt ?? image.alt;
  const taglineStr = Array.isArray(tagline) ? tagline.join(' ') : content.tagline.join(' ');

  return (
    <section className={`relative ${heroSectionHeightClass}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image.src}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
        {/* Лек оверлей – много намален син оттенък, снимката доминира */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0, 151, 178, 0.08) 0%, rgba(0, 120, 150, 0.06) 50%, rgba(0, 0, 0, 0.15) 100%)',
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
          {/* Brand Title – изцяло default шрифт, без Playfair */}
          <h1 className="brand-name-sans font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-[0.28em] md:tracking-[0.35em] mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            {BRAND_NAME_WITHOUT_NUMBER.trim().split(' ').join('   ')}{BRAND_NAME_NUMBER}
          </h1>

          {/* Divider */}
          <div className="w-28 h-px bg-white/70 mx-auto mb-6" />

          {/* Tagline – Playfair, числата с default шрифт */}
          <p className="hero-tagline font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white tracking-[0.12em] md:tracking-[0.15em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            <TaglineWithNumbers text={taglineStr} />
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
