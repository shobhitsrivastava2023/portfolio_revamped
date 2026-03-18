"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

type PowFeed = {
  days: Array<{
    day: string; // YYYY-MM-DD
    events: Array<{
      occurredAt: string;
      repo: string;
      type: string;
      url: string;
    }>;
  }>;
  retentionDays: number;
  calendarId: string | null;
};

function typeLabel(type: string) {
  switch (type) {
    case "commit":
      return "commit";
    case "pull_request_opened":
      return "pr opened";
    case "pull_request_merged":
      return "pr merged";
    case "pull_request_closed":
      return "pr closed";
    case "workflow_run":
      return "ci";
    case "release":
      return "release";
    default:
      return type;
  }
}

export default function ProofOfWorkSection() {
  const { t } = useLanguage();
  const [feed, setFeed] = useState<PowFeed | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch("/api/pow/feed", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as PowFeed;
        if (!cancelled) setFeed(json);
      } catch {
        // ignore
      }
    };
    poll();
    const id = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const total = useMemo(() => {
    if (!feed) return 0;
    return feed.days.reduce((acc, d) => acc + d.events.length, 0);
  }, [feed]);

  return (
    <section className="w-full max-w-[562px]" style={{ marginTop: 70 }}>
      <div
        className="w-full rounded-[10px] bg-[#323232] px-5 py-4 text-background"
        style={{ borderRadius: 10 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className="font-outfit font-medium"
              style={{ fontSize: 34, letterSpacing: "-0.08em" }}
            >
              {t("pow.title")}
            </p>
            <p
              className="font-outfit font-medium opacity-90"
              style={{ marginTop: 6, fontSize: 14, letterSpacing: "-0.04em" }}
            >
              {t("pow.lastDays")
                .replace("{days}", String(feed?.retentionDays ?? 4))
                .replace("{count}", String(total))}
            </p>
          </div>

          <Link
            href={t("pow.calendarUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-[10px] px-3 py-2 font-outfit font-medium no-underline transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
            style={{
              fontSize: 14,
              letterSpacing: "-0.04em",
              backgroundColor: "color-mix(in oklab, var(--background) 18%, transparent)",
              color: "var(--background)",
            }}
          >
            {t("pow.openCalendar")}
          </Link>
        </div>

        <div
          className="mt-4 grid gap-3"
          style={{ gridTemplateColumns: "1fr", marginTop: 16 }}
        >
          {!feed || feed.days.length === 0 ? (
            <div
              className="rounded-[10px] px-4 py-3"
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--background) 10%, transparent)",
              }}
            >
              <p
                className="font-outfit font-medium opacity-90"
                style={{ fontSize: 14, letterSpacing: "-0.04em" }}
              >
                {t("pow.empty")}
              </p>
            </div>
          ) : (
            <div
              className="rounded-[10px] px-4 py-3"
              style={{
                backgroundColor:
                  "color-mix(in oklab, var(--background) 10%, transparent)",
              }}
            >
              <div className="flex max-h-[220px] flex-col gap-3 overflow-auto pr-1">
                {feed.days.map((d) => (
                  <div key={d.day}>
                    <p
                      className="font-outfit font-medium opacity-90"
                      style={{
                        fontSize: 12,
                        letterSpacing: "-0.04em",
                        marginBottom: 6,
                      }}
                    >
                      {d.day}
                    </p>
                    <ul className="m-0 list-none p-0">
                      {d.events.map((e) => (
                        <li key={`${e.occurredAt}-${e.url}`} className="py-1">
                          <a
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block no-underline transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
                            style={{ color: "var(--background)" }}
                          >
                            <span
                              className="font-outfit font-medium"
                              style={{ fontSize: 14, letterSpacing: "-0.04em" }}
                            >
                              {typeLabel(e.type)}
                            </span>
                            <span
                              className="font-outfit font-medium opacity-90"
                              style={{
                                marginLeft: 10,
                                fontSize: 14,
                                letterSpacing: "-0.04em",
                              }}
                            >
                              {e.repo}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

