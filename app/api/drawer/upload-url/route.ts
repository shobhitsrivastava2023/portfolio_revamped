import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "../../../lib/drawer/auth";
import { newObjectKey, presignUpload, publicUrl } from "../../../lib/drawer/r2";

const ALLOWED = /^(image|video|audio)\//;

/** Admin: get a one-time URL to upload a file straight from the browser to R2. */
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { mime, name } = (await request.json().catch(() => ({}))) as { mime?: string; name?: string };
  if (!mime || !ALLOWED.test(mime)) {
    return NextResponse.json({ error: "Only images, videos and audio files" }, { status: 400 });
  }

  const key = newObjectKey(mime, name);
  return NextResponse.json({ key, uploadUrl: await presignUpload(key, mime), url: publicUrl(key) });
}
