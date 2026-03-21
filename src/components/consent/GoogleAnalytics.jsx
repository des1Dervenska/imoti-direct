'use client';

import { useCallback, useEffect, useState } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics-config';
import { hasAnalyticsConsent, hasConsentDecision } from '@/lib/cookie-consent';

function attachSpaPageViews(measurementId) {
  if (typeof window === 'undefined' || window.__gaSpaAttached) return;
  window.__gaSpaAttached = true;

  const sendPageView = () => {
    if (window.gtag) {
      window.gtag('config', measurementId, { page_path: window.location.pathname });
    }
  };

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = function patchedPush() {
    originalPushState.apply(history, arguments);
    sendPageView();
  };
  history.replaceState = function patchedReplace() {
    originalReplaceState.apply(history, arguments);
    sendPageView();
  };
  window.addEventListener('popstate', sendPageView);
}

export default function GoogleAnalytics() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);

  const measurementId = GA_MEASUREMENT_ID?.trim();

  useEffect(() => {
    if (!measurementId) return undefined;

    const sync = () => {
      if (hasConsentDecision()) {
        const granted = hasAnalyticsConsent();
        setConsentGranted(granted);
        setShouldLoad(granted);
      } else {
        setShouldLoad(false);
        setConsentGranted(false);
      }
    };

    sync();

    const onConsent = (event) => {
      const analyticsConsent = event.detail?.analytics ?? false;
      setConsentGranted(analyticsConsent);
      setShouldLoad(analyticsConsent);
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: analyticsConsent ? 'granted' : 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    };

    window.addEventListener('cookieConsentUpdated', onConsent);
    return () => window.removeEventListener('cookieConsentUpdated', onConsent);
  }, [measurementId]);

  const onGtagJsLoaded = useCallback(() => {
    if (!measurementId || typeof window === 'undefined' || !window.gtag) return;
    if (consentGranted) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
    window.gtag('config', measurementId, { page_path: window.location.pathname });
    attachSpaPageViews(measurementId);
  }, [measurementId, consentGranted]);

  if (!measurementId) {
    return null;
  }

  if (!shouldLoad) {
    return null;
  }

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
      onLoad={onGtagJsLoaded}
    />
  );
}
