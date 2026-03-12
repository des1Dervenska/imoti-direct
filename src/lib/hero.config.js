/**
 * Hero Section Configuration
 * This file contains all configurable content for the hero section.
 * In the future, these values will be managed from the admin panel.
 */

import { BRAND_NAME } from './constants';

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
