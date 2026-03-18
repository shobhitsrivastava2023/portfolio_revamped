import { NextResponse } from "next/server";
import { listPowEventsLastDays } from "../../../lib/pow/db";

const DAYS = 4;

function yyyyMmDd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET() {
  const rows = await listPowEventsLastDays(DAYS);

  const grouped: Record<string, typeof rows> = {};
  for (const r of rows) {
    const day = yyyyMmDd(new Date(r.occurred_at));
    (grouped[day] ??= []).push(r);
  }

  const days = Object.keys(grouped)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((day) => ({
      day,
      events: grouped[day].map((r) => ({
        occurredAt: r.occurred_at,
        repo: r.repo,
        type: r.event_type,
        url: r.url,
      })),
    }));

  return NextResponse.json({
    days,
    retentionDays: DAYS,
    calendarId: process.env.GOOGLE_CALENDAR_ID ?? null,
  });
}

