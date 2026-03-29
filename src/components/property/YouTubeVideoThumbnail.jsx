'use client';

import { useState } from 'react';

export default function YouTubeVideoThumbnail({ videoId, watchVideoLabel }) {
  const [playing, setPlaying] = useState(false);
  const thumbSrc = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackSrc = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="mt-6 w-full max-w-2xl">
      <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video w-full">
        {playing ? (
          <iframe
            src={embedSrc}
            title={watchVideoLabel}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full rounded-xl overflow-hidden bg-gray-200 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cadetblue focus-visible:ring-offset-2"
            aria-label={watchVideoLabel}
          >
            <img
              src={thumbSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              width={1280}
              height={720}
              onError={(e) => {
                e.target.src = fallbackSrc;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <span className="absolute bottom-3 left-3 right-3 text-white text-sm drop-shadow-md pointer-events-none">
              {watchVideoLabel}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
