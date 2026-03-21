/**
 * Публични ключове от Google (задават се в .env.local).
 * NEXT_PUBLIC_* се вграждат при build – рестарт на dev сървъра след промяна.
 */

export const GA_MEASUREMENT_ID =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) || '';

export const GTM_CONTAINER_ID =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GTM_CONTAINER_ID) || '';

export const GOOGLE_SITE_VERIFICATION =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) || '';

/** Има ли поне един конфигуриран проследяващ инструмент (за consent bootstrap) */
export function hasAnyTrackingConfigured() {
  return Boolean(
    (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.trim()) ||
      (GTM_CONTAINER_ID && GTM_CONTAINER_ID.trim())
  );
}
