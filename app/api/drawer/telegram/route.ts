import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { handleTelegramUpdate, type TgUpdate } from "../../../lib/drawer/telegram";
import { revalidateDrawer } from "../../../lib/drawer/revalidate";

// Downloading a file from Telegram and copying it to R2 can take a little while.
export const maxDuration = 60;

function validSecret(header: string | null): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected || !header) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Telegram webhook: posts from the bot land in the drawer. */
export async function POST(request: NextRequest) {
  if (!validSecret(request.headers.get("x-telegram-bot-api-secret-token"))) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    await handleTelegramUpdate((await request.json()) as TgUpdate);
    revalidateDrawer();
  } catch (err) {
    // Always answer 200: otherwise Telegram keeps redelivering the same update.
    console.error("drawer telegram webhook failed", err);
  }
  return NextResponse.json({ ok: true });
}
