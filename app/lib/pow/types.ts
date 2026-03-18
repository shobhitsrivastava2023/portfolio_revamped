export type PowEventType =
  | "commit"
  | "pull_request_opened"
  | "pull_request_merged"
  | "pull_request_closed"
  | "release"
  | "workflow_run"
  | "push";

export type PowEvent = {
  /** Deterministic id used for de-dupe + Calendar iCalUID */
  dedupeKey: string;
  occurredAt: string; // ISO
  source: "github" | "vscode";
  repo: string; // owner/name
  type: PowEventType;
  url: string;
  /**
   * Keep this privacy-safe (no file paths). Can include ids like sha/prNumber.
   * Never include commit messages if you want strict privacy.
   */
  meta?: Record<string, unknown>;
};

