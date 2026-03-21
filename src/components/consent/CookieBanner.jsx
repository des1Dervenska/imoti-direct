'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getConsentCookie,
  hasConsentDecision,
  acceptAllCookies,
  rejectAllCookies,
  updateConsentPreferences,
} from '@/lib/cookie-consent';

function CookieToggle({ checked, onToggle, id }) {
  return (
    <label htmlFor={id} className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      <span
        className={`relative block h-6 w-11 rounded-full transition-colors ${checked ? 'bg-graphite' : 'bg-gray-300'}`}
      >
        <span
          className={`absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </label>
  );
}

export default function CookieBanner({ locale = 'bg' }) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    performance: false,
    advertisement: false,
  });

  const privacyHref = `/${locale}/privacy`;

  useEffect(() => {
    if (!hasConsentDecision()) {
      setShowBanner(true);
    } else {
      const consent = getConsentCookie();
      if (consent) setPreferences(consent);
    }
  }, []);

  const dispatchConsent = (analytics) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookieConsentUpdated', { detail: { analytics } })
      );
    }
  };

  const handleAcceptAll = () => {
    acceptAllCookies();
    setShowBanner(false);
    dispatchConsent(true);
  };

  const handleReject = () => {
    rejectAllCookies();
    setShowBanner(false);
    dispatchConsent(false);
  };

  const handleSaveSettings = () => {
    updateConsentPreferences(preferences);
    setShowSettings(false);
    setShowBanner(false);
    dispatchConsent(preferences.analytics);
  };

  const handleToggleCategory = (category) => {
    if (category === 'necessary') return;
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {!showSettings ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-[family-name:var(--font-playfair),serif] text-lg text-graphite sm:text-xl">
                Бисквитки и поверителност
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite-light">
                Използваме бисквитки, за да подобрим вашето изживяване и да анализираме
                използването на сайта. Можете да изберете кои бисквитки да приемете.
              </p>
              <p className="mt-1 text-xs text-graphite-light">
                Повече в{' '}
                <Link href={privacyHref} className="font-medium text-graphite underline hover:text-graphite-dark">
                  Политика за поверителност
                </Link>
                .
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto lg:flex-nowrap">
              <button
                type="button"
                onClick={handleReject}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-graphite transition-colors hover:bg-gray-50"
              >
                Отхвърли
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-graphite transition-colors hover:bg-gray-50"
              >
                Настройки
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-lg bg-cadetblue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-cadetblue-dark"
              >
                Приеми всички
              </button>
            </div>
          </div>
        ) : (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto">
            <div>
              <h3 className="font-[family-name:var(--font-playfair),serif] text-lg text-graphite sm:text-xl">
                Настройки на бисквитките
              </h3>
              <p className="mt-2 text-sm text-graphite-light">
                Подробности за категориите и правната основа – вижте{' '}
                <Link href={privacyHref} className="font-medium text-graphite underline">
                  Политика за поверителност
                </Link>
                .
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/80 p-3 opacity-90">
                <div className="pr-3">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-medium text-graphite">Необходими бисквитки</h4>
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] text-graphite-light">
                      Винаги активни
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-graphite-light">
                    Необходими за основна функционалност и запомняне на избора ви за съгласие.
                  </p>
                </div>
                <div className="h-6 w-11 shrink-0 rounded-full bg-graphite">
                  <div className="mr-0.5 mt-0.5 flex h-6 justify-end pr-0.5">
                    <span className="mt-0.5 block h-5 w-5 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              {[
                {
                  key: 'functional',
                  title: 'Функционални бисквитки',
                  desc: 'Споделяне в социални мрежи, обратна връзка и др. функции от трети страни.',
                },
                {
                  key: 'analytics',
                  title: 'Аналитични бисквитки',
                  desc: 'Статистика за посещения, трафик и използване на сайта (напр. Google Analytics).',
                },
                {
                  key: 'performance',
                  title: 'Бисквитки за производителност',
                  desc: 'Измерване на производителност и подобряване на изживяването.',
                },
                {
                  key: 'advertisement',
                  title: 'Рекламни бисквитки',
                  desc: 'Персонализирани реклами и измерване на ефективността на кампании.',
                },
              ].map(({ key, title, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-3"
                >
                  <div className="pr-3">
                    <h4 className="mb-1 text-sm font-medium text-graphite">{title}</h4>
                    <p className="text-xs leading-relaxed text-graphite-light">{desc}</p>
                  </div>
                  <CookieToggle
                    id={`cookie-pref-${key}`}
                    checked={preferences[key]}
                    onToggle={() => handleToggleCategory(key)}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-graphite hover:bg-gray-50"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="rounded-lg bg-cadetblue px-4 py-2.5 text-sm font-medium text-white hover:bg-cadetblue-dark"
              >
                Запази предпочитанията
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
