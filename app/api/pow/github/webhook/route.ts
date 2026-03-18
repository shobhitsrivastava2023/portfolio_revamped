import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { parseGitHubWebhookToPowEvents } from "../../../../lib/pow/github";
import { upsertPowEvents } from "../../../../lib/pow/db";
import { writePowEventsToGoogleCalendar } from "../../../../lib/pow/googleCalendar";

function verifyGitHubSignature(params: {
  secret: string;
  rawBody: string;
  signature256: string | null;
}): boolean {
  const { secret, rawBody, signature256 } = params;
  if (!signature256) return false;
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature256));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const eventName = request.headers.get("x-github-event") ?? "unknown";
  const deliveryId = request.headers.get("x-github-delivery");
  const signature256 = request.headers.get("x-hub-signature-256");

  const rawBody = await request.text();

  // If secret is set, require signature verification. If not set, accept (dev convenience).
  if (secret && !verifyGitHubSignature({ secret, rawBody, signature256 })) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const receivedAt = new Date();
  const events = parseGitHubWebhookToPowEvents({
    eventName,
    deliveryId,
    payload,
    receivedAt,
  });

  if (events.length === 0) {
    return NextResponse.json({ ok: true, stored: 0 });
  }

  // 1) Store hot events (Supabase, 4-day retention via cron).
  const stored = await upsertPowEvents(events);

  // 2) Archive immediately to Google Calendar (one event per artifact).
  await writePowEventsToGoogleCalendar(events);

  return NextResponse.json({ ok: true, stored });
}

