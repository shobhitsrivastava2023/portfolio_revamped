import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../lib/drawer/auth";
import { createDrawerItem, listAllDrawerItems } from "../../../lib/drawer/db";
import { publicUrl } from "../../../lib/drawer/r2";
import { revalidateDrawer } from "../../../lib/drawer/revalidate";
import {
  DRAWER_KINDS,
  DRAWER_VISIBILITIES,
  extractTags,
  type DrawerKind,
  type DrawerMedia,
  type DrawerVisibility,
} from "../../../lib/drawer/types";

/** Admin: every item, drafts included. */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  return NextResponse.json({ items: await listAllDrawerItems() });
}

type CreateBody = {
  kind?: DrawerKind;
  body?: string;
  media?: DrawerMedia[];
  waveform?: number[];
  tags?: string[];
  visibility?: DrawerVisibility;
};

/** Admin: add an item. Files are already in R2 (uploaded via /api/drawer/upload-url). */
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const input = (await request.json().catch(() => ({}))) as CreateBody;
  if (!input.kind || !DRAWER_KINDS.includes(input.kind)) {
    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  }
  const body = input.body?.trim() || null;
  const media = (input.media ?? [])
    .filter((m) => typeof m.key === "string" && m.key.startsWith("drawer/"))
    // Rebuild the public URL server-side rather than trusting the client's.
    .map((m) => ({ ...m, url: publicUrl(m.key) }));

  if (input.kind === "thought" ? !body : media.length === 0) {
    return NextResponse.json({ error: input.kind === "thought" ? "Write something" : "Add a file" }, { status: 400 });
  }

  const item = await createDrawerItem({
    kind: input.kind,
    body,
    media,
    waveform: input.kind === "audio" ? input.waveform ?? null : null,
    tags: [...new Set([...(input.tags ?? []), ...extractTags(body)])],
    visibility: input.visibility && DRAWER_VISIBILITIES.includes(input.visibility) ? input.visibility : "public",
    source: "admin",
  });
  revalidateDrawer(item.id);
  return NextResponse.json({ item });
}
