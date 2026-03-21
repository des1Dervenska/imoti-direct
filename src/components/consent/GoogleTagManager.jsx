'use client';

import { useEffect, useRef } from 'react';
import { GTM_CONTAINER_ID } from '@/lib/analytics-config';
import { hasAnalyticsConsent, hasConsentDecision } from '@/lib/cookie-consent';

/**
 * Зарежда GTM само при съгласие за аналитика (споделя dataLayer с ConsentModeBootstrap).
 * Конфигурирайте GA4 в контейнера на GTM в Google Tag Manager.
 */
export default function GoogleTagManager() {
  const containerId = GTM_CONTAINER_ID?.trim();
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!containerId || typeof window === 'undefined') return undefined;

    const inject = () => {
      if (injectedRef.current) return;
      if (!hasConsentDecision() || !hasAnalyticsConsent()) return;
      injectedRef.current = true;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
      document.head.appendChild(script);
    };

    inject();

    const onConsent = (event) => {
      if (event.detail?.analytics) {
        inject();
      }
    };

    window.addEventListener('cookieConsentUpdated', onConsent);
    return () => window.removeEventListener('cookieConsentUpdated', onConsent);
  }, [containerId]);

  if (!containerId) {
    return null;
  }

  return null;
}
