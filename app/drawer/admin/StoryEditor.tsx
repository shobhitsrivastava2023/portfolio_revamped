"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { DrawerItem } from "../../lib/drawer/types";
import { articleTitle } from "../../lib/drawer/article";
import { shareImage } from "../../lib/drawer/shareImage";
import {
  DEFAULT_STORY_STYLE,
  STORY_PRESETS,
  STORY_SIZES,
  sanitizeStoryStyle,
  type StoryAlign,
  type StorySize,
  type StoryStyle,
} from "../../lib/drawer/story";

const chip = "min-h-[32px] rounded-md border-0 px-3 font-outfit cursor-pointer transition-opacity hover:opacity-90";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-outfit font-medium opacity-60" style={{ fontSize: 12 }}>
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Choice<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <>
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`${chip} ${value === v ? "bg-[#FC6E20] text-[#323232]" : "bg-[#FFE7D0]/12 text-[#FFE7D0]"}`}
          style={{ fontSize: 13 }}
        >
          {label}
        </button>
      ))}
    </>
  );
}

function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: (on: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`${chip} ${on ? "bg-[#FFE7D0] text-[#323232]" : "bg-[#FFE7D0]/12 text-[#FFE7D0]/60 line-through"}`}
      style={{ fontSize: 13 }}
    >
      {label}
    </button>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#FFE7D0]/12 py-1 pr-3 pl-1" style={{ fontSize: 13 }}>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value.toUpperCase())} className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0" />
      {label}
    </label>
  );
}

/** The post's own text, shown as the placeholder for the text override. */
function defaultText(item: DrawerItem): string {
  if (item.kind === "article") return articleTitle(item.body);
  return item.body ?? (item.kind === "video" ? "a clip from the drawer" : "");
}

/**
 * Designs the share card for one item: live preview on the left, controls on the right.
 * "save" stores the design on the item, so the public "share as story" button uses it too.
 */
export default function StoryEditor({ item, onSaved }: { item: DrawerItem; onSaved: (item: DrawerItem) => void }) {
  const [style, setStyle] = useState<StoryStyle>(() => sanitizeStoryStyle(item.storyStyle));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const loading = loadedUrl !== previewUrl;
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (patch: Partial<StoryStyle>) => setStyle((s) => ({ ...s, ...patch }));
  const cardUrl = `/drawer/${item.id}/story?style=${encodeURIComponent(JSON.stringify(style))}`;

  // Re-render the preview a moment after the last change, not on every keystroke or colour drag.
  useEffect(() => {
    const timer = setTimeout(() => setPreviewUrl(cardUrl), 350);
    return () => clearTimeout(timer);
  }, [cardUrl]);

  const save = async () => {
    setBusy(true);
    try {
      const isDefault = JSON.stringify(style) === JSON.stringify(DEFAULT_STORY_STYLE);
      const res = await fetch(`/api/drawer/items/${item.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ storyStyle: isDefault ? null : style }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `save failed (${res.status})`);
      onSaved(json.item);
      setStatus("saved ✓ the share button on the site uses this now");
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    setBusy(true);
    try {
      await shareImage(cardUrl, `drawer-${item.id}-${style.size}.png`);
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const { width, height } = STORY_SIZES[style.size];
  const textShown = style.text !== "";

  return (
    <div className="mt-1 flex w-full flex-col gap-5 rounded-[10px] bg-[#323232] p-4 text-[#FFE7D0] min-[640px]:flex-row">
      {/* Preview */}
      <div className="flex shrink-0 flex-col items-center gap-2 min-[640px]:w-[220px]">
        <div className="relative w-full max-w-[220px] overflow-hidden rounded-[8px] bg-[#1B1B1B]" style={{ aspectRatio: `${width} / ${height}` }}>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- generated on the fly, not worth optimising
            <img
              src={previewUrl}
              alt="share card preview"
              onLoad={() => setLoadedUrl(previewUrl)}
              onError={() => setLoadedUrl(previewUrl)}
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${loading ? "opacity-50" : "opacity-100"}`}
            />
          )}
        </div>
        <span className="opacity-60" style={{ fontSize: 12 }}>
          {loading ? "rendering..." : `${width} × ${height}`}
        </span>
      </div>

      {/* Controls */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <Row label="size">
          <Choice<StorySize> value={style.size} options={Object.entries(STORY_SIZES).map(([k, v]) => [k as StorySize, v.label])} onChange={(size) => set({ size })} />
        </Row>

        <Row label="colours">
          {STORY_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              title={p.name}
              aria-label={`${p.name} colours`}
              onClick={() => set({ bg: p.bg, card: p.card, accent: p.accent })}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 p-0"
              style={{ background: p.bg, borderColor: style.bg === p.bg && style.card === p.card ? "#FC6E20" : "rgba(255,231,208,0.25)" }}
            >
              <span className="block h-3.5 w-3.5 rounded-[3px]" style={{ background: p.card }} />
            </button>
          ))}
        </Row>
        <Row label="custom colours">
          <ColorInput label="background" value={style.bg} onChange={(bg) => set({ bg })} />
          <ColorInput label="card" value={style.card} onChange={(card) => set({ card })} />
          <ColorInput label="accent" value={style.accent} onChange={(accent) => set({ accent })} />
          {item.kind === "photo" && <Toggle on={style.photoBg} label="photo as background" onChange={(photoBg) => set({ photoBg })} />}
        </Row>

        <Row label="layout">
          <Toggle on={style.showCard} label="card" onChange={(showCard) => set({ showCard })} />
          <Choice<StoryAlign> value={style.align} options={[["top", "top"], ["center", "middle"], ["bottom", "bottom"]]} onChange={(align) => set({ align })} />
        </Row>

        <Row label={`text size · ${Math.round(style.scale * 100)}%`}>
          <input
            type="range"
            min={60}
            max={150}
            step={5}
            value={Math.round(style.scale * 100)}
            onChange={(e) => set({ scale: Number(e.target.value) / 100 })}
            className="w-full max-w-[280px] accent-[#FC6E20]"
          />
        </Row>

        <Row label={item.kind === "article" ? "title on the card" : "text on the card"}>
          <Toggle on={textShown} label="show text" onChange={(on) => set({ text: on ? null : "" })} />
          {textShown && (
            <textarea
              value={style.text ?? ""}
              onChange={(e) => set({ text: e.target.value || null })}
              placeholder={defaultText(item) || "write something for the card"}
              rows={3}
              className="block w-full resize-y rounded-[8px] border-0 bg-[#FFE7D0]/8 p-2.5 text-[#FFE7D0] outline-none placeholder:text-[#FFE7D0]/40 focus:bg-[#FFE7D0]/12"
              style={{ fontSize: 14, lineHeight: 1.4 }}
            />
          )}
        </Row>

        <Row label="show">
          <Toggle on={style.header} label="name & date" onChange={(header) => set({ header })} />
          <Toggle on={style.tags} label="tags" onChange={(tags) => set({ tags })} />
          <Toggle on={style.footer} label="footer" onChange={(footer) => set({ footer })} />
          {style.footer && (
            <input
              value={style.footerText}
              onChange={(e) => set({ footerText: e.target.value })}
              maxLength={60}
              className="min-h-[32px] min-w-0 flex-1 rounded-md border-0 bg-[#FFE7D0]/8 px-2.5 text-[#FFE7D0] outline-none focus:bg-[#FFE7D0]/12"
              style={{ fontSize: 13 }}
            />
          )}
        </Row>

        <div className="flex flex-wrap items-center gap-2 border-t border-[#FFE7D0]/12 pt-4">
          <button type="button" disabled={busy} onClick={save} className={`${chip} bg-[#FC6E20] font-semibold text-[#323232] disabled:opacity-50`} style={{ fontSize: 14 }}>
            save design
          </button>
          <button type="button" disabled={busy} onClick={share} className={`${chip} bg-[#FFE7D0] font-semibold text-[#323232] disabled:opacity-50`} style={{ fontSize: 14 }}>
            share / download
          </button>
          <button type="button" onClick={() => setStyle(DEFAULT_STORY_STYLE)} className={`${chip} ml-auto bg-transparent text-[#FFE7D0]/70 underline`} style={{ fontSize: 13 }}>
            reset
          </button>
        </div>
        {status && (
          <p className="font-outfit font-medium" style={{ fontSize: 13 }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
