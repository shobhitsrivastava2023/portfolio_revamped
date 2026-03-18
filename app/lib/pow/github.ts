import type { PowEvent } from "./types";

type UnknownRecord = Record<string, unknown>;

function toIso(input: string | number | null | undefined, fallback: Date): string {
  if (!input) return fallback.toISOString();
  const d = typeof input === "number" ? new Date(input) : new Date(input);
  if (Number.isNaN(d.getTime())) return fallback.toISOString();
  return d.toISOString();
}

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function get(obj: unknown, key: string): unknown {
  if (!isRecord(obj)) return undefined;
  return obj[key];
}

function getString(obj: unknown, key: string): string | undefined {
  const v = get(obj, key);
  return typeof v === "string" ? v : undefined;
}

function repoFullName(payload: unknown): string | null {
  const repo = get(payload, "repository");
  const name = getString(repo, "full_name");
  if (typeof name === "string" && name.includes("/")) return name;
  return null;
}

function repoHtmlUrl(payload: unknown): string | null {
  const repo = get(payload, "repository");
  const url = getString(repo, "html_url");
  if (typeof url === "string" && url.startsWith("http")) return url;
  return null;
}

export function parseGitHubWebhookToPowEvents(params: {
  eventName: string;
  deliveryId: string | null;
  payload: unknown;
  receivedAt: Date;
}): PowEvent[] {
  const { eventName, deliveryId, payload, receivedAt } = params;
  const repo = repoFullName(payload);
  const repoUrl = repoHtmlUrl(payload);
  if (!repo || !repoUrl) return [];

  // Many events/day, but privacy-safe (no commit messages).
  if (eventName === "push") {
    const after = getString(payload, "after");
    const pusherName = (() => {
      const pusher = get(payload, "pusher");
      return getString(pusher, "name");
    })();
    const commitsUnknown = get(payload, "commits");
    const commits = Array.isArray(commitsUnknown) ? commitsUnknown : [];
    const headCommit = get(payload, "head_commit");
    const occurredAt = toIso(getString(headCommit, "timestamp"), receivedAt);

    // Create one event per commit for granularity.
    return commits
      .map((c) => {
        const sha = getString(c, "id") ?? null;
        if (!sha) return null;
        const url = `${repoUrl}/commit/${sha}`;
        const commitTimestamp = getString(c, "timestamp");
        return {
          dedupeKey: `gh:commit:${repo}:${sha}`,
          occurredAt: toIso(commitTimestamp, new Date(occurredAt)),
          source: "github",
          repo,
          type: "commit",
          url,
          meta: {
            sha,
            deliveryId,
            after: after ?? undefined,
            pusher: pusherName ?? undefined,
          },
        } satisfies PowEvent;
      })
      .filter(Boolean) as PowEvent[];
  }

  if (eventName === "pull_request") {
    const action = getString(payload, "action");
    const pr = get(payload, "pull_request");
    const prUrl = getString(pr, "html_url");
    const prNumber = get(payload, "number");
    const merged = Boolean(get(pr, "merged"));

    if (typeof prUrl !== "string" || !prUrl.startsWith("http")) return [];

    let type: PowEvent["type"] | null = null;
    if (action === "opened" || action === "reopened") type = "pull_request_opened";
    if (action === "closed" && merged) type = "pull_request_merged";
    if (action === "closed" && !merged) type = "pull_request_closed";
    if (!type) return [];

    const occurredAt = toIso(
      getString(pr, "updated_at") ?? getString(pr, "created_at"),
      receivedAt
    );
    return [
      {
        dedupeKey: `gh:pr:${repo}:${String(prNumber ?? "unknown")}:${type}`,
        occurredAt,
        source: "github",
        repo,
        type,
        url: prUrl,
        meta: {
          prNumber,
          deliveryId,
        },
      },
    ];
  }

  if (eventName === "release") {
    const action = getString(payload, "action");
    const rel = get(payload, "release");
    if (action !== "published") return [];
    const url = getString(rel, "html_url");
    const id = get(rel, "id");
    if (typeof url !== "string" || !url.startsWith("http")) return [];
    const occurredAt = toIso(
      getString(rel, "published_at") ?? getString(rel, "created_at"),
      receivedAt
    );
    return [
      {
        dedupeKey: `gh:release:${repo}:${String(id ?? url)}`,
        occurredAt,
        source: "github",
        repo,
        type: "release",
        url,
        meta: { deliveryId },
      },
    ];
  }

  if (eventName === "workflow_run") {
    const action = getString(payload, "action");
    if (action !== "completed") return [];
    const run = get(payload, "workflow_run");
    const url = getString(run, "html_url");
    const id = get(run, "id");
    if (typeof url !== "string" || !url.startsWith("http")) return [];
    const occurredAt = toIso(
      getString(run, "updated_at") ?? getString(run, "created_at"),
      receivedAt
    );
    return [
      {
        dedupeKey: `gh:workflow_run:${repo}:${String(id ?? url)}`,
        occurredAt,
        source: "github",
        repo,
        type: "workflow_run",
        url,
        meta: {
          conclusion: get(run, "conclusion"),
          status: get(run, "status"),
          deliveryId,
        },
      },
    ];
  }

  // Fallback: ignore other GitHub events for now.
  return [];
}

