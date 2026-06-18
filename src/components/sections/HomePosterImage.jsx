'use client';

import SafeImage from '@/components/ui/SafeImage';

export default function HomePosterImage({ src, alt, className }) {
  return (
    <SafeImage
      src={src}
      alt={alt}
      className={className}
    />
  );
}
