/**
 * GDPR cookie consent – същата логика като nova_art_space (cookie_consent cookie).
 */

/** @typedef {{ necessary: boolean, functional: boolean, analytics: boolean, performance: boolean, advertisement: boolean }} ConsentPreferences */

const CONSENT_COOKIE_NAME = 'cookie_consent';
const CONSENT_COOKIE_EXPIRY_DAYS = 365;

/**
 * @returns {ConsentPreferences | null}
 */
export function getConsentCookie() {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const consentCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${CONSENT_COOKIE_NAME}=`)
  );

  if (!consentCookie) return null;

  try {
    const value = consentCookie.split('=')[1];
    const decoded = decodeURIComponent(value);
    const parsed = JSON.parse(decoded);

    if ('analytics' in parsed && !('necessary' in parsed)) {
      return {
        necessary: true,
        functional: false,
        analytics: parsed.analytics === true,
        performance: false,
        advertisement: false,
      };
    }

    return {
      ...parsed,
      necessary: true,
    };
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  const consent = getConsentCookie();
  if (consent && 'analytics' in consent) {
    return consent.analytics === true;
  }
  return false;
}

/**
 * @param {keyof Omit<ConsentPreferences, 'necessary'>} category
 */
export function hasConsentFor(category) {
  const consent = getConsentCookie();
  if (!consent) return false;
  return consent[category] === true;
}

export function hasConsentDecision() {
  return getConsentCookie() !== null;
}

/** @param {ConsentPreferences} preferences */
export function setConsentCookie(preferences) {
  if (typeof document === 'undefined') return;

  const expiryDate = new Date();
  expiryDate.setTime(
    expiryDate.getTime() + CONSENT_COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  );

  const cookieValue = JSON.stringify(preferences);
  const encoded = encodeURIComponent(cookieValue);
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

export function acceptAllCookies() {
  setConsentCookie({
    necessary: true,
    functional: true,
    analytics: true,
    performance: true,
    advertisement: true,
  });
}

export function rejectAllCookies() {
  setConsentCookie({
    necessary: true,
    functional: false,
    analytics: false,
    performance: false,
    advertisement: false,
  });
}

/** @returns {ConsentPreferences} */
export function getDefaultPreferences() {
  return {
    necessary: true,
    functional: false,
    analytics: false,
    performance: false,
    advertisement: false,
  };
}

/** @param {ConsentPreferences} preferences */
export function updateConsentPreferences(preferences) {
  setConsentCookie({
    ...preferences,
    necessary: true,
  });
}

export function clearConsentCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${CONSENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}
