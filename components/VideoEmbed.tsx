"use client";

import { useState } from "react";
import Image from "next/image";

export function VideoEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      className="group relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-surface"
      aria-label={`Play video: ${title}`}
    >
      <Image
        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 768px) 640px, 100vw"
        className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/90 text-accent-foreground transition-transform group-hover:scale-105">
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
