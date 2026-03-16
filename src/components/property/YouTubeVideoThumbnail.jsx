'use client';

export default function YouTubeVideoThumbnail({ videoId, videoUrl, watchVideoLabel }) {
  const thumbSrc = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackSrc = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="mt-6">
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative rounded-xl overflow-hidden bg-gray-200 aspect-video w-full max-w-2xl group"
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
        <span className="absolute bottom-3 left-3 right-3 text-white text-sm drop-shadow-md">
          {watchVideoLabel}
        </span>
      </a>
    </div>
  );
}
