/**
 * How a drawer item's share card looks (/drawer/<id>/story). Edited on the admin page,
 * saved per item, and used by the public "share as story" button.
 */
export type StorySize = "story" | "post" | "square";
export type StoryAlign = "top" | "center" | "bottom";

export type StoryStyle = {
  /** story 9:16 (Instagram / WhatsApp), post 4:5, square 1:1 */
  size: StorySize;
  /** page background, card and highlight colours as #rrggbb */
  bg: string;
  card: string;
  accent: string;
  /** photo posts: use the photo as the background instead of `bg` */
  photoBg: boolean;
  /** false: no card, the content sits straight on the background */
  showCard: boolean;
  align: StoryAlign;
  /** text size multiplier */
  scale: number;
  /** replaces the post's text (thought, caption, or article title); null keeps it */
  text: string | null;
  header: boolean;
  tags: boolean;
  footer: boolean;
  footerText: string;
};

export const STORY_SIZES: Record<StorySize, { width: number; height: number; label: string }> = {
  story: { width: 1080, height: 1920, label: "story 9:16" },
  post: { width: 1080, height: 1350, label: "post 4:5" },
  square: { width: 1080, height: 1080, label: "square" },
};

export const DEFAULT_FOOTER = "shobhitsrivastava.com/drawer";

export const DEFAULT_STORY_STYLE: StoryStyle = {
  size: "story",
  bg: "#FC6E20",
  card: "#FFE7D0",
  accent: "#FC6E20",
  photoBg: false,
  showCard: true,
  align: "center",
  scale: 1,
  text: null,
  header: true,
  tags: true,
  footer: true,
  footerText: DEFAULT_FOOTER,
};

/** Colour starting points for the editor. */
export const STORY_PRESETS: { name: string; bg: string; card: string; accent: string }[] = [
  { name: "orange", bg: "#FC6E20", card: "#FFE7D0", accent: "#FC6E20" },
  { name: "night", bg: "#1B1B1B", card: "#323232", accent: "#FC6E20" },
  { name: "cream", bg: "#FFE7D0", card: "#FFF7EE", accent: "#FC6E20" },
  { name: "ink", bg: "#323232", card: "#FFE7D0", accent: "#FC6E20" },
  { name: "paper", bg: "#F4F1EA", card: "#FFFFFF", accent: "#1B1B1B" },
];

const HEX = /^#[0-9a-f]{6}$/i;

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

/** Anything (saved JSON, a query param, a request body) → a complete, safe style. */
export function sanitizeStoryStyle(input: unknown): StoryStyle {
  const s = (input && typeof input === "object" ? input : {}) as Partial<Record<keyof StoryStyle, unknown>>;
  const d = DEFAULT_STORY_STYLE;
  const color = (v: unknown, fallback: string) => (typeof v === "string" && HEX.test(v) ? v.toUpperCase() : fallback);
  const scale = Number(s.scale);
  return {
    size: typeof s.size === "string" && s.size in STORY_SIZES ? (s.size as StorySize) : d.size,
    bg: color(s.bg, d.bg),
    card: color(s.card, d.card),
    accent: color(s.accent, d.accent),
    photoBg: bool(s.photoBg, d.photoBg),
    showCard: bool(s.showCard, d.showCard),
    align: s.align === "top" || s.align === "bottom" ? s.align : "center",
    scale: Number.isFinite(scale) ? Math.min(1.5, Math.max(0.6, Math.round(scale * 100) / 100)) : d.scale,
    text: typeof s.text === "string" ? s.text.slice(0, 600) : null,
    header: bool(s.header, d.header),
    tags: bool(s.tags, d.tags),
    footer: bool(s.footer, d.footer),
    footerText: typeof s.footerText === "string" ? s.footerText.slice(0, 60) : d.footerText,
  };
}

/** Short stable token for a style, used to bust the CDN cache after it changes. */
export function storyVersion(style: StoryStyle | null): string {
  if (!style) return "0";
  let h = 0;
  for (const ch of JSON.stringify(style)) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return (h >>> 0).toString(36);
}

/** #rrggbb → rgba() with the given alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Dark ink on light colours, cream on dark ones. */
export function inkOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? "#1B1B1B" : "#FFE7D0";
}
