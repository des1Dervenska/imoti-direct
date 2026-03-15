/**
 * i18n: supported locales and helpers
 */

export const LOCALES = ['bg', 'en'];
export const DEFAULT_LOCALE = 'bg';

/**
 * @param {string} locale
 * @returns {boolean}
 */
export function isValidLocale(locale) {
  return LOCALES.includes(locale);
}

/**
 * Get translation for a key path (e.g. 'nav.home').
 * @param {Record<string, unknown>} messages - messages for current locale
 * @param {string} keyPath - dot-separated path
 * @returns {string}
 */
export function t(messages, keyPath) {
  const keys = keyPath.split('.');
  let v = messages;
  for (const k of keys) v = v?.[k];
  return typeof v === 'string' ? v : keyPath;
}
