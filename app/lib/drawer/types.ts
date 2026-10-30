import type { StoryStyle } from "./story";

export type DrawerKind = "thought" | "article" | "photo" | "video" | "audio";
export type DrawerVisibility = "public" | "unlisted" | "draft";

/** One stored file (photo, clip or song) in R2. */
export type DrawerMedia = {
  key: string;
  url: string;
  mime: string;
  width?: number;
  height?: number;
  /** seconds, for video and audio */
  duration?: number;
  /** audio: shown as the song name */
  title?: string;
};

export type DrawerItem = {
  id: string;
  createdAt: string;
  kind: DrawerKind;
  body: string | null;
  media: DrawerMedia[];
  /** audio only: peaks between 0 and 1, filled in by the admin page if missing */
  waveform: number[] | null;
  tags: string[];
  pinned: boolean;
  visibility: DrawerVisibility;
  source: "admin" | "telegram";
  /** custom share card design; null uses the default */
  storyStyle: StoryStyle | null;
};

export const DRAWER_KINDS: DrawerKind[] = ["thought", "article", "photo", "video", "audio"];
export const DRAWER_VISIBILITIES: DrawerVisibility[] = ["public", "unlisted", "draft"];

/** "#music #life" in a caption → ["music", "life"] (lowercased, unique). */
export function extractTags(text: string | null | undefined): string[] {
  if (!text) return [];
  const tags = [...text.matchAll(/(?:^|\s)#([\p{L}\p{N}_-]{1,32})/gu)].map((m) => m[1].toLowerCase());
  return [...new Set(tags)];
}

/** The caption without its trailing hashtags, so tags aren't shown twice. */
export function stripTrailingTags(text: string | null | undefined): string | null {
  if (!text) return null;
  const stripped = text.replace(/(\s*#[\p{L}\p{N}_-]{1,32})+\s*$/u, "").trim();
  return stripped || null;
}
