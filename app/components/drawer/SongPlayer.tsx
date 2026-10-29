"use client";

import { useEffect, useRef, useState } from "react";
import type { DrawerMedia } from "../../lib/drawer/types";
import { formatDuration, WAVEFORM_BARS } from "../../lib/drawer/format";
import { t } from "../../data/strings";

/** Flat bars until a real waveform has been computed (the admin page fills it in). */
const FLAT = Array.from({ length: WAVEFORM_BARS }, () => 0.25);

/** Pause any other song on the page when this one starts. */
const PLAY_EVENT = "drawer:play";

/**
 * Dark song card: play button, title, and a waveform that fills orange as it
 * plays. Click or drag on the waveform to seek.
 */
export default function SongPlayer({
  media,
  waveform,
  compact = false,
  fill = false,
}: {
  media: DrawerMedia;
  waveform: number[] | null;
  compact?: boolean;
  /** Stretch to the parent's height (square homepage tiles), waveform at the bottom. */
  fill?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(media.duration ?? 0);
  const peaks = waveform?.length ? waveform : FLAT;

  useEffect(() => {
    const onOtherPlay = (e: Event) => {
      if ((e as CustomEvent).detail !== audioRef.current) audioRef.current?.pause();
    };
    window.addEventListener(PLAY_EVENT, onOtherPlay);
    return () => window.removeEventListener(PLAY_EVENT, onOtherPlay);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: audio }));
      void audio.play();
    } else {
      audio.pause();
    }
  };

  const seek = (clientX: number, target: HTMLElement) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = target.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    audio.currentTime = fraction * duration;
    setProgress(fraction);
  };

  const played = Math.round(progress * peaks.length);
  const title = media.title || t("drawer.untitled");

  return (
    <div
      className={`w-full rounded-[10px] bg-[#323232] text-[#FFE7D0] ${fill ? "flex h-full flex-col justify-between" : ""}`}
      style={{ padding: compact ? 12 : 16 }}
    >
      <audio
        ref={audioRef}
        src={media.url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || duration)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          className="flex shrink-0 items-center justify-center rounded-full border-0 bg-[#FC6E20] text-[#323232] cursor-pointer touch-manipulation transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
          style={{ width: compact ? 36 : 44, height: compact ? 36 : 44 }}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <rect x="2" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
              <rect x="8.5" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M3 1.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 3 1.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-outfit font-medium" style={{ fontSize: compact ? 15 : 20, letterSpacing: "-0.05em", lineHeight: 1.15 }}>
            {title}
          </p>
          <p className="font-outfit opacity-70" style={{ fontSize: 12, letterSpacing: "-0.02em" }}>
            {formatDuration(progress * duration)} / {formatDuration(duration)}
          </p>
        </div>
      </div>

      {/* Waveform: also a seek bar */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Seek ${title}`}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(progress * duration)}
        className="mt-3 flex w-full cursor-pointer items-center touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7D0] rounded-[4px]"
        style={{ height: compact ? 36 : 56, gap: 1 }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          seek(e.clientX, e.currentTarget);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) seek(e.clientX, e.currentTarget);
        }}
        onKeyDown={(e) => {
          const audio = audioRef.current;
          if (!audio) return;
          if (e.key === "ArrowRight") audio.currentTime = Math.min(duration, audio.currentTime + 5);
          if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        {(compact ? peaks.filter((_, i) => i % 2 === 0) : peaks).map((p, i, arr) => {
          const isPlayed = i < (compact ? Math.round(progress * arr.length) : played);
          return (
            <span
              key={i}
              className="flex-1 rounded-full transition-colors duration-150"
              style={{
                height: `${Math.max(6, p * 100)}%`,
                backgroundColor: isPlayed ? "#FC6E20" : "rgba(255, 231, 208, 0.3)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
