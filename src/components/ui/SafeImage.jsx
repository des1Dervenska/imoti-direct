'use client';

import { useState } from 'react';

function SafeImageInner({
  src,
  alt = '',
  className = '',
  fallbackSrc = null,
  onBroken,
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hidden, setHidden] = useState(false);

  if (hidden || !currentSrc) {
    return null;
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          return;
        }
        onBroken?.(currentSrc);
        setHidden(true);
      }}
      {...props}
    />
  );
}

/**
 * Скрива счупени/404 снимки на клиента (напр. изтрити от Supabase Storage).
 * По избор показва fallback при грешка.
 */
export default function SafeImage(props) {
  return <SafeImageInner key={props.src} {...props} />;
}
