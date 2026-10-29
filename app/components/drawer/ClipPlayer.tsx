"use client";

import { useEffect, useRef, useState } from "react";
import type { DrawerMedia } from "../../lib/drawer/types";

/**
 * Short clip: plays muted on loop while on screen (like a GIF), pauses when
 * scrolled away. The corner button turns the sound on.
 */
export default function ClipPlayer({
  media,
  rounded = 10,
  fill = false,
}: {
  media: DrawerMedia;
  rounded?: number;
  /** Fill the parent box (square homepage tiles) instead of keeping the clip's own shape. */
  fill?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduceMotion) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const aspect = media.width && media.height ? `${media.width} / ${media.height}` : "16 / 9";

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#323232] ${fill ? "h-full" : ""}`}
      style={{ borderRadius: rounded, ...(fill ? {} : { aspectRatio: aspect, maxHeight: 640 }) }}
    >
      <video
        ref={videoRef}
        src={media.url}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={() => {
          const next = !muted;
          setMuted(next);
          if (!next) void videoRef.current?.play();
        }}
        aria-label={muted ? "Turn sound on" : "Mute"}
        className="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-full border-0 bg-[#323232]/80 text-[#FFE7D0] cursor-pointer backdrop-blur-sm hover:bg-[#323232] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7D0]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          {muted ? (
            <path d="m22 9-6 6M16 9l6 6" />
          ) : (
            <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
          )}
        </svg>
      </button>
    </div>
  );
}
