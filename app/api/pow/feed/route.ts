import { NextResponse } from "next/server";
import { listPowEventsRecent } from "../../../lib/pow/db";

/** How many latest events to show in the Proof of Work feed (not a rolling day window). */
const EVENT_LIMIT = 4;

function yyyyMmDd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET() {
  const rows = await listPowEventsRecent(EVENT_LIMIT);

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

  const totalEvents = days.reduce((n, d) => n + d.events.length, 0);

  return NextResponse.json({
    days,
    eventLimit: EVENT_LIMIT,
    eventCount: totalEvents,
    calendarId: process.env.GOOGLE_CALENDAR_ID ?? null,
  });
}

