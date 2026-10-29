import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/drawer/auth";
import { deleteDrawerItem, updateDrawerItem, type DrawerPatch } from "../../../../lib/drawer/db";
import { deleteObject } from "../../../../lib/drawer/r2";
import { revalidateDrawer } from "../../../../lib/drawer/revalidate";
import { DRAWER_VISIBILITIES } from "../../../../lib/drawer/types";

type Params = { params: Promise<{ id: string }> };

/** Admin: edit text, tags, pin, visibility, or save a computed waveform. */
export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  const { id } = await params;
  const input = (await request.json().catch(() => ({}))) as DrawerPatch;

  const patch: DrawerPatch = {};
  if ("body" in input) patch.body = input.body?.trim() || null;
  if (Array.isArray(input.tags)) patch.tags = input.tags.map((t) => t.toLowerCase().trim()).filter(Boolean);
  if (typeof input.pinned === "boolean") patch.pinned = input.pinned;
  if (input.visibility && DRAWER_VISIBILITIES.includes(input.visibility)) patch.visibility = input.visibility;
  if (Array.isArray(input.waveform)) patch.waveform = input.waveform.slice(0, 400).map((n) => Math.max(0, Math.min(1, Number(n) || 0)));

  const item = await updateDrawerItem(id, patch);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateDrawer(id);
  return NextResponse.json({ item });
}

/** Admin: delete the item and its files. */
export async function DELETE(_request: NextRequest, { params }: Params) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  const { id } = await params;
  const item = await deleteDrawerItem(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await Promise.allSettled(item.media.map((m) => deleteObject(m.key)));
  revalidateDrawer(id);
  return NextResponse.json({ ok: true });
}
