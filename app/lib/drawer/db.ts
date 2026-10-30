import { randomBytes } from "crypto";
import { neon } from "@neondatabase/serverless";
import type { DrawerItem, DrawerKind, DrawerMedia, DrawerVisibility } from "./types";
import { sanitizeStoryStyle } from "./story";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function sql() {
  return neon(requiredEnv("DATABASE_URL"));
}

type DrawerRow = {
  id: string;
  created_at: string;
  kind: DrawerKind;
  body: string | null;
  media: DrawerMedia[];
  waveform: number[] | null;
  tags: string[];
  pinned: boolean;
  visibility: DrawerVisibility;
  source: "admin" | "telegram";
  story_style: unknown;
};

function toItem(r: DrawerRow): DrawerItem {
  return {
    id: r.id,
    createdAt: r.created_at,
    kind: r.kind,
    body: r.body,
    media: r.media ?? [],
    waveform: r.waveform,
    tags: r.tags ?? [],
    pinned: r.pinned,
    visibility: r.visibility,
    source: r.source,
    storyStyle: r.story_style ? sanitizeStoryStyle(r.story_style) : null,
  };
}

/** Short, URL-friendly id for /drawer/<id>. */
function newId(): string {
  return randomBytes(6).toString("base64url");
}

/** Public feed: pinned first, then newest. */
export async function listPublicDrawerItems(limit = 50): Promise<DrawerItem[]> {
  const rows = (await sql()`
    select id, created_at::text, kind, body, media, waveform, tags, pinned, visibility, source, story_style
    from drawer_items
    where visibility = 'public'
    order by pinned desc, created_at desc
    limit ${limit};
  `) as DrawerRow[];
  return rows.map(toItem);
}

/** Everything, drafts included, for the admin page. */
export async function listAllDrawerItems(): Promise<DrawerItem[]> {
  const rows = (await sql()`
    select id, created_at::text, kind, body, media, waveform, tags, pinned, visibility, source, story_style
    from drawer_items
    order by created_at desc
    limit 500;
  `) as DrawerRow[];
  return rows.map(toItem);
}

/** One item for its share page. Drafts are only returned when `includeDrafts` is set. */
export async function getDrawerItem(id: string, includeDrafts = false): Promise<DrawerItem | null> {
  const rows = (await sql()`
    select id, created_at::text, kind, body, media, waveform, tags, pinned, visibility, source, story_style
    from drawer_items
    where id = ${id} and (${includeDrafts} or visibility <> 'draft')
    limit 1;
  `) as DrawerRow[];
  return rows[0] ? toItem(rows[0]) : null;
}

export type NewDrawerItem = {
  kind: DrawerKind;
  body: string | null;
  media: DrawerMedia[];
  waveform?: number[] | null;
  tags: string[];
  visibility?: DrawerVisibility;
  source: "admin" | "telegram";
  groupKey?: string | null;
};

export async function createDrawerItem(item: NewDrawerItem): Promise<DrawerItem> {
  const rows = (await sql()`
    insert into drawer_items (id, kind, body, media, waveform, tags, visibility, source, group_key)
    values (
      ${newId()},
      ${item.kind},
      ${item.body},
      ${JSON.stringify(item.media)}::jsonb,
      ${item.waveform ? JSON.stringify(item.waveform) : null}::jsonb,
      ${item.tags},
      ${item.visibility ?? "public"},
      ${item.source},
      ${item.groupKey ?? null}
    )
    returning id, created_at::text, kind, body, media, waveform, tags, pinned, visibility, source, story_style;
  `) as DrawerRow[];
  return toItem(rows[0]);
}

/**
 * Telegram sends each photo of an album as its own message, often at the same moment.
 * The first one creates the item and the rest append to it (unique group_key makes this race-safe).
 * `created` is true only for the message that created it.
 */
export async function upsertDrawerGroupItem(
  groupKey: string,
  item: NewDrawerItem
): Promise<{ item: DrawerItem; created: boolean }> {
  const rows = (await sql()`
    insert into drawer_items as d (id, kind, body, media, tags, visibility, source, group_key)
    values (
      ${newId()},
      ${item.kind},
      ${item.body},
      ${JSON.stringify(item.media)}::jsonb,
      ${item.tags},
      ${item.visibility ?? "public"},
      ${item.source},
      ${groupKey}
    )
    on conflict (group_key) where group_key is not null do update set
      media = d.media || excluded.media,
      body = coalesce(d.body, excluded.body),
      tags = array(select distinct unnest(d.tags || excluded.tags))
    returning id, created_at::text, kind, body, media, waveform, tags, pinned, visibility, source, story_style,
      (xmax = 0) as created;
  `) as (DrawerRow & { created: boolean })[];
  return { item: toItem(rows[0]), created: rows[0].created };
}

export type DrawerPatch = Partial<Pick<DrawerItem, "body" | "tags" | "pinned" | "visibility" | "waveform" | "storyStyle">>;

export async function updateDrawerItem(id: string, patch: DrawerPatch): Promise<DrawerItem | null> {
  const rows = (await sql()`
    update drawer_items set
      body = case when ${"body" in patch} then ${patch.body ?? null} else body end,
      tags = case when ${"tags" in patch} then ${patch.tags ?? []}::text[] else tags end,
      pinned = case when ${"pinned" in patch} then ${patch.pinned ?? false} else pinned end,
      visibility = case when ${"visibility" in patch} then ${patch.visibility ?? "public"} else visibility end,
      waveform = case when ${"waveform" in patch} then ${patch.waveform ? JSON.stringify(patch.waveform) : null}::jsonb else waveform end,
      story_style = case when ${"storyStyle" in patch} then ${patch.storyStyle ? JSON.stringify(patch.storyStyle) : null}::jsonb else story_style end
    where id = ${id}
    returning id, created_at::text, kind, body, media, waveform, tags, pinned, visibility, source, story_style;
  `) as DrawerRow[];
  return rows[0] ? toItem(rows[0]) : null;
}

/** Deletes the row and returns it, so the caller can remove its files from R2. */
export async function deleteDrawerItem(id: string): Promise<DrawerItem | null> {
  const rows = (await sql()`
    delete from drawer_items where id = ${id}
    returning id, created_at::text, kind, body, media, waveform, tags, pinned, visibility, source, story_style;
  `) as DrawerRow[];
  return rows[0] ? toItem(rows[0]) : null;
}
