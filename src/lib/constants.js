/**
 * =============================================================================
 * APPLICATION CONSTANTS
 * =============================================================================
 *
 * Central place for brand and contact information.
 * Update these values when setting up for a new client.
 *
 * =============================================================================
 */

// =============================================================================
// BRAND
// =============================================================================

export const BRAND_NAME = 'ART HOUSE 94';
export const BRAND_DESCRIPTION = 'Професионална компания за недвижими имоти';
export const BRAND_TAGLINE = 'С нас вашата сделка ще бъде в сигурни ръце';

// =============================================================================
// CONTACT INFORMATION
// =============================================================================

export const CONTACT_PERSON = 'Геновева Филева';
export const CONTACT_PHONE = '0887 803 064';
export const CONTACT_PHONE_LINK = '+359887803064';
export const CONTACT_EMAIL = 'genoveva@arthouse94.com';
export const CONTACT_ADDRESS = 'ж.к. Белите Брези, бл. 4, ап. 37';
export const CONTACT_ADDRESS_SHORT = 'ж.к. Белите Брези, бл. 4, София';
export const CONTACT_CITY = 'София, България';

// =============================================================================
// WORKING HOURS
// =============================================================================

export const WORKING_HOURS = {
  weekdays: 'Понеделник - Петък: 9:00 - 18:00',
  saturday: 'Събота: 10:00 - 14:00',
  sunday: 'Неделя: Почивен ден',
};

// =============================================================================
// IMAGES
// =============================================================================

export const DEFAULT_PROPERTY_IMAGE = '/images/property-placeholder.svg';

// =============================================================================
// MAPS
// =============================================================================

export const GOOGLE_MAPS_SEARCH_URL = 'https://www.google.com/maps/search/?api=1&query=Белите+Брези+София';

// =============================================================================
// CURRENCY (цена винаги в EUR; показваме и в BGN)
// =============================================================================

/** 1 EUR = 1.95583 BGN (фиксиран курс за показ) */
export const EUR_TO_BGN = 1.95583;

/**
 * Връща форматирани текстове за цена в EUR (главно) и BGN (еквивалент).
 * @param {number} priceEur - Цена в евро
 * @param {'sale'|'rent'} category - Категория (за суфикс /месец при наем)
 * @returns {{ eurText: string, bgnText: string }}
 */
export function formatPriceEurAndBgn(priceEur, category) {
  const suffix = category === 'rent' ? '/месец' : '';
  const fmt = (n) => new Intl.NumberFormat('bg-BG', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  const eurText = `${fmt(priceEur)} EUR${suffix}`;
  const bgnText = `${fmt(Number(priceEur) * EUR_TO_BGN)} BGN${suffix}`;
  return { eurText, bgnText };
}
