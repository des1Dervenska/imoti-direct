/**
 * Hero Section Configuration
 * This file contains all configurable content for the hero section.
 * In the future, these values will be managed from the admin panel.
 */

import { BRAND_NAME } from './constants';

/**
 * Височина на hero (същата формула като в HeroSection).
 * Използва се и за банери: 2/3 от тази височина на десктоп.
 */
export const heroSectionHeightClass =
  'h-[90vh] min-h-[600px] max-h-[900px]';

/**
 * Банери на началната страница – само от `md` (компютър):
 * макс. височина = 2/3 от видимата височина на hero.
 * С `object-contain` снимката е „цяла“, без изрязване.
 */
export const homePosterDesktopMaxHeightClass =
  'md:max-h-[calc(min(max(90vh,600px),900px)*2/3)]';

export const heroConfig = {
  // Hero background image
  image: {
    src: '/images/hero/sofia-building-vitosha.webp',
    alt: 'Луксозна сграда с изглед към Витоша',
  },

  // Text content for the hero card
  content: {
    // Main title - brand name
    title: BRAND_NAME,

    // Tagline words (displayed on separate lines for elegance)
    tagline: ['Елегантност.', 'Комфорт.', 'Дом.'],

    // Optional subtitle (set to null to hide)
    subtitle: null,
  },

  // Search form configuration (currently disabled for cleaner design)
  search: {
    enabled: false,
  },
};
