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

/** Viber logo (официален стил – телефон с балон) */
function ViberIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.4 0C9.473.028 5.403.394 2.721 2.057.15 3.657 0 6.641 0 9.585c0 2.945.603 5.457 1.79 7.67 1.347 2.52 3.502 4.544 5.96 5.776 2.458 1.23 5.273 1.884 8.25 1.884 2.977 0 5.792-.654 8.25-1.884 2.458-1.232 4.613-3.256 5.96-5.776C23.397 15.042 24 12.53 24 9.585c0-2.944-.15-5.928-2.721-7.528C18.597.394 14.527.028 12.6 0h-1.2zM12 2.16c1.846.028 5.385.36 7.604 1.6 1.892 1.067 1.891 2.853 1.891 5.825 0 2.972 0 4.758-1.89 5.825-2.22 1.24-5.76 1.572-7.605 1.6-1.846-.028-5.385-.36-7.604-1.6-1.892-1.067-1.891-2.853-1.891-5.825 0-2.972 0-4.758 1.89-5.825 2.22-1.24 5.76-1.572 7.605-1.6zM5.795 5.932c-.277 0-.508.09-.692.273-.184.184-.274.415-.274.692 0 .276.09.507.274.691.184.184.415.274.692.274.276 0 .507-.09.691-.274a.943.943 0 00.274-.691.943.943 0 00-.274-.692.943.943 0 00-.691-.273zm0 2.768a.943.943 0 00-.692.274.943.943 0 00-.274.691c0 .277.09.508.274.692.184.184.415.274.692.274.276 0 .507-.09.691-.274a.943.943 0 00.274-.692.943.943 0 00-.274-.691.943.943 0 00-.691-.274zm0 2.768a.943.943 0 00-.692.274.943.943 0 00-.274.691c0 .277.09.508.274.692.184.184.415.274.692.274.276 0 .507-.09.691-.274a.943.943 0 00.274-.692.943.943 0 00-.274-.691.943.943 0 00-.691-.274zm3.205-5.536c.277 0 .508.09.692.273.184.184.274.415.274.692a.943.943 0 01-.274.691.943.943 0 01-.692.274.943.943 0 01-.691-.274.943.943 0 01-.274-.691c0-.277.09-.508.274-.692a.943.943 0 01.691-.273zm0 2.768c.277 0 .508.09.692.274a.943.943 0 01.274.691.943.943 0 01-.274.692.943.943 0 01-.692.274.943.943 0 01-.691-.274.943.943 0 01-.274-.692c0-.277.09-.508.274-.691a.943.943 0 01.691-.274zm4.205 6.912c1.384 0 2.768-.461 3.922-1.384l.415-.277.277-.415-.277-.415-.415-.277c-1.154-.923-2.538-1.384-3.922-1.384s-2.768.461-3.922 1.384l-.415.277-.277.415.277.415.415.277c1.154.923 2.538 1.384 3.922 1.384zm-2.307-4.153c.277 0 .508.09.692.274a.943.943 0 01.274.691.943.943 0 01-.274.692.943.943 0 01-.692.274.943.943 0 01-.691-.274.943.943 0 01-.274-.692c0-.277.09-.508.274-.691a.943.943 0 01.691-.274zm4.614 0c.277 0 .508.09.692.274a.943.943 0 01.274.691.943.943 0 01-.274.692.943.943 0 01-.692.274.943.943 0 01-.691-.274.943.943 0 01-.274-.692c0-.277.09-.508.274-.691a.943.943 0 01.691-.274z" />
    </svg>
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
