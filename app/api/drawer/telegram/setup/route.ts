import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/drawer/auth";
import { telegramApi } from "../../../../lib/drawer/telegram";
import { SITE_URL } from "../../../../lib/site";

type WebhookInfo = { url: string; pending_update_count: number; last_error_message?: string };

/** Admin: current webhook status and whether the owner id is set. */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  try {
    const info = await telegramApi<WebhookInfo>("getWebhookInfo");
    const me = await telegramApi<{ username: string }>("getMe");
    return NextResponse.json({
      bot: me.username,
      webhook: info.url || null,
      lastError: info.last_error_message ?? null,
      ownerSet: Boolean(process.env.TELEGRAM_OWNER_ID),
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

/** Admin: point the bot at this site's webhook. Run once after deploying. */
export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "TELEGRAM_WEBHOOK_SECRET is not set" }, { status: 500 });
  try {
    await telegramApi("setWebhook", {
      url: `${SITE_URL}/api/drawer/telegram`,
      secret_token: secret,
      allowed_updates: ["message"],
      drop_pending_updates: true,
    });
    return GET();
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
