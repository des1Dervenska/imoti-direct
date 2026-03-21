'use client';

import Script from 'next/script';
import { hasAnyTrackingConfigured } from '@/lib/analytics-config';

/**
 * Инициализира dataLayer + gtag и Consent Mode v2 ПРЕДИ зареждане на gtag.js / GTM.
 */
export default function ConsentModeBootstrap() {
  if (!hasAnyTrackingConfigured()) {
    return null;
  }

  return (
    <Script
      id="consent-mode-bootstrap"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;

            var consentCookie = document.cookie.split(';').find(function(c) { return c.trim().startsWith('cookie_consent='); });
            var analyticsConsent = 'denied';
            if (consentCookie) {
              try {
                var value = consentCookie.split('=')[1];
                var decoded = decodeURIComponent(value);
                var parsed = JSON.parse(decoded);
                analyticsConsent = parsed.analytics === true ? 'granted' : 'denied';
              } catch (e) {
                analyticsConsent = 'denied';
              }
            }

            gtag('consent', 'default', {
              'analytics_storage': analyticsConsent,
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });

            gtag('js', new Date());
          `,
      }}
    />
  );
}
