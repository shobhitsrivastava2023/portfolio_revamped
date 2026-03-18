import type { PowEvent } from "./types";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

function supabaseRestBase(): string {
  const url = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
  return `${url}/rest/v1`;
}

function supabaseHeaders(): Record<string, string> {
  // Use service role on server routes only (never expose client-side).
  const key = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
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

  const body = events.map((e) => ({
    occurred_at: e.occurredAt,
    source: e.source,
    repo: e.repo,
    event_type: e.type,
    url: e.url,
    dedupe_key: e.dedupeKey,
    meta: e.meta ?? null,
  }));

  const res = await fetch(`${supabaseRestBase()}/pow_events?on_conflict=dedupe_key`, {
    method: "POST",
    headers: {
      ...supabaseHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Supabase upsert failed: ${res.status} ${txt}`);
  }

  // PostgREST doesn't return inserted count with return=minimal; assume all attempted.
  return events.length;
}

export async function listPowEventsLastDays(days: number): Promise<StoredPowEventRow[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    select: "id,occurred_at,created_at,source,repo,event_type,url,dedupe_key,meta",
    occurred_at: `gte.${since}`,
    order: "occurred_at.desc",
    limit: "300",
  });

  const res = await fetch(`${supabaseRestBase()}/pow_events?${params.toString()}`, {
    headers: supabaseHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Supabase list failed: ${res.status} ${txt}`);
  }
  return (await res.json()) as StoredPowEventRow[];
}

export async function deletePowEventsOlderThanDays(days: number): Promise<void> {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const params = new URLSearchParams({
    occurred_at: `lt.${cutoff}`,
  });

  const res = await fetch(`${supabaseRestBase()}/pow_events?${params.toString()}`, {
    method: "DELETE",
    headers: {
      ...supabaseHeaders(),
      Prefer: "return=minimal",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Supabase delete failed: ${res.status} ${txt}`);
  }
}

