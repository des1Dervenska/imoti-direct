'use client';

import { useState, useCallback, useEffect } from 'react';
import { getTranslations } from '@/lib/translations';
import { FACEBOOK_APP_ID } from '@/lib/constants';
import {
  ChatBubbleLeftRightIcon,
  PrinterIcon,
  ClipboardDocumentIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const BUTTON_CLASS =
  'flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-graphite bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors';

/** Viber logo – Flaticon */
function ViberIcon({ className }) {
  return (
    <img
      src="https://cdn-icons-png.flaticon.com/512/1241/1241017.png"
      alt=""
      className={className}
      width={20}
      height={20}
      aria-hidden
    />
  );
}

export default function PropertyShareBar({ propertyPath, title, locale = 'bg' }) {
  const t = getTranslations(locale)?.property ?? {};
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    const path = propertyPath.startsWith('/') ? propertyPath : `/${propertyPath}`;
    setFullUrl(`${window.location.origin}${path}`);
  }, [propertyPath]);

  const shareText = fullUrl ? (title ? `${title} ${fullUrl}` : fullUrl) : '';

  const handleCopyLink = useCallback(() => {
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [fullUrl]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const messengerUrl =
    fullUrl && FACEBOOK_APP_ID
      ? `https://www.facebook.com/dialog/send?app_id=${encodeURIComponent(FACEBOOK_APP_ID)}&link=${encodeURIComponent(fullUrl)}&redirect_uri=${encodeURIComponent(fullUrl)}`
      : fullUrl
        ? `https://www.facebook.com/dialog/send?link=${encodeURIComponent(fullUrl)}&redirect_uri=${encodeURIComponent(fullUrl)}`
        : '#';
  const viberUrl = shareText ? `viber://forward?text=${encodeURIComponent(shareText)}` : '#';
  const mailtoUrl = shareText
    ? `mailto:?subject=${encodeURIComponent(title || 'Property')}&body=${encodeURIComponent(shareText)}`
    : '#';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={BUTTON_CLASS}
        aria-label={t.shareViaMessage}
      >
        <ChatBubbleLeftRightIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{t.shareViaMessage}</span>
      </a>
      <button type="button" onClick={handlePrint} className={BUTTON_CLASS} aria-label={t.sharePrint}>
        <PrinterIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{t.sharePrint}</span>
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        className={BUTTON_CLASS}
        aria-label={t.shareCopyLink}
      >
        <ClipboardDocumentIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{copied ? t.shareCopied : t.shareCopyLink}</span>
      </button>
      <a
        href={viberUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={BUTTON_CLASS}
        aria-label={t.shareViber}
      >
        <ViberIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{t.shareViber}</span>
      </a>
      <a href={mailtoUrl} className={BUTTON_CLASS} aria-label={t.shareEmail}>
        <EnvelopeIcon className="w-5 h-5" />
        <span className="hidden sm:inline">{t.shareEmail}</span>
      </a>
    </div>
  );
}
