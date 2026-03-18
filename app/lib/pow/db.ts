import { neon } from "@neondatabase/serverless";
import type { PowEvent } from "./types";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function sql() {
  // Neon serverless driver expects a connection string.
  return neon(requiredEnv("DATABASE_URL"));
}

export type StoredPowEventRow = {
  id: string;
  occurred_at: string;
  created_at: string;
  source: string;
  repo: string;
  event_type: string;
  url: string;
  dedupe_key: string;
  meta: Record<string, unknown> | null;
};

export async function upsertPowEvents(events: PowEvent[]): Promise<number> {
  if (events.length === 0) return 0;

  const q = sql();

  // One insert per event keeps it simple and avoids huge parameter lists.
  // Dedupe with unique(dedupe_key).
  for (const e of events) {
    await q`
      insert into pow_events (occurred_at, source, repo, event_type, url, dedupe_key, meta)
      values (
        ${e.occurredAt}::timestamptz,
        ${e.source},
        ${e.repo},
        ${e.type},
        ${e.url},
        ${e.dedupeKey},
        ${e.meta ? JSON.stringify(e.meta) : null}::jsonb
      )
      on conflict (dedupe_key) do update set
        occurred_at = excluded.occurred_at,
        source = excluded.source,
        repo = excluded.repo,
        event_type = excluded.event_type,
        url = excluded.url,
        meta = excluded.meta;
    `;
  }

  return events.length;
}

export async function listPowEventsLastDays(days: number): Promise<StoredPowEventRow[]> {
  const q = sql();
  const rows = (await q`
    select id, occurred_at::text, created_at::text, source, repo, event_type, url, dedupe_key, meta
    from pow_events
    where occurred_at >= (now() - (${days} || ' days')::interval)
    order by occurred_at desc
    limit 300;
  `) as StoredPowEventRow[];
  return rows;
}

export async function deletePowEventsOlderThanDays(days: number): Promise<void> {
  const q = sql();
  await q`
    delete from pow_events
    where occurred_at < (now() - (${days} || ' days')::interval);
  `;
}

