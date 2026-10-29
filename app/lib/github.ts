export const GITHUB_USERNAME = "shobhitsrivastava2023";

/** Last known count, used if the GitHub API is down or rate-limited. */
const FALLBACK_REPO_COUNT = 61;

export type ContributionDay = {
  /** YYYY-MM-DD */
  date: string;
  count: number;
  /** GitHub's own 0-4 intensity bucket */
  level: number;
};

/**
 * Daily contributions for the last `weeks` weeks, read from the public calendar
 * on the GitHub profile page (the REST API has no endpoint for it without a token).
 * Returns [] if GitHub changes the markup, so callers can just hide the strip.
 */
export async function getContributions(weeks = 26): Promise<ContributionDay[]> {
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const counts = new Map<string, number>();
    for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>(\d+|No) contribution/g)) {
      counts.set(m[1], m[2] === "No" ? 0 : Number(m[2]));
    }

    const days: ContributionDay[] = [];
    for (const m of html.matchAll(/data-date="([\d-]+)" id="([^"]+)" data-level="(\d)"/g)) {
      days.push({ date: m[1], count: counts.get(m[2]) ?? 0, level: Number(m[3]) });
    }
    days.sort((a, b) => a.date.localeCompare(b.date));

    // Start on the Sunday `weeks` weeks back so columns line up as calendar weeks.
    const last = days.at(-1);
    if (!last) return [];
    const start = new Date(`${last.date}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() - start.getUTCDay() - (weeks - 1) * 7);
    const from = start.toISOString().slice(0, 10);
    return days.filter((d) => d.date >= from);
  } catch {
    return [];
  }
}

/** Public repo count from the GitHub API, cached for a day. */
export async function getPublicRepoCount(): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return FALLBACK_REPO_COUNT;
    const json = (await res.json()) as { public_repos?: number };
    return json.public_repos ?? FALLBACK_REPO_COUNT;
  } catch {
    return FALLBACK_REPO_COUNT;
  }
}
