"use client";

import { useState, useEffect, ViewTransition, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "../data/projects";
import ProjectCover from "./ProjectCover";
import { EXPERIENCES } from "../data/experience";
import { t } from "../data/strings";
import { LEETCODE_URL, LEETCODE_USERNAME, type LeetCodeStats } from "../lib/leetcode";

function ChevronDown({ className, rotate }: { className?: string; rotate?: boolean }) {
  return (
    <motion.span
      className={`flex shrink-0 justify-end text-[#FFE7D0] ${className ?? ""}`}
      animate={{ rotate: rotate ? 180 : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden
      >
        <path
          d="M3 4.5L6 7.5L9 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.span>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M2 8L8 2M8 2H4M8 2V6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M8 11V2M8 11L5 8M8 11L11 8M2 14H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Contact method icons (24×24, drawn in currentColor) */

function MailIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LeetCodeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

const CONTACTS = [
  { key: "gmail", label: t("cards.gmail"), handle: "shobhitsrivastava729@gmail.com", href: "mailto:shobhitsrivastava729@gmail.com", Icon: MailIcon },
  { key: "github", label: t("cards.github"), handle: "@shobhitsrivastava2023", href: "https://github.com/shobhitsrivastava2023", Icon: GithubIcon },
  { key: "twitter", label: t("cards.twitter"), handle: "@Shobhit_Talks", href: "https://x.com/Shobhit_Talks", Icon: XIcon },
  { key: "linkedin", label: t("cards.linkedin"), handle: "in/shobhit-srivastava-s1323", href: "https://www.linkedin.com/in/shobhit-srivastava-s1323/", Icon: LinkedinIcon },
];

const EASE = [0.25, 0.1, 0.25, 1] as const;
const TONES = {
  dark: {
    bg: "#323232",
    fg: "text-[#FFE7D0]",
    ring: "focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-[#323232]",
  },
  orange: {
    bg: "#FC6E20",
    fg: "text-[#323232]",
    ring: "focus-visible:ring-[#323232] focus-visible:ring-offset-[#FC6E20]",
  },
};
type Tone = keyof typeof TONES;

/** Staggered fade-up for the items inside an open card or panel. */
const LIST_VARIANTS = {
  hidden: {},
  shown: { transition: { delayChildren: 0.12, staggerChildren: 0.06 } },
};
const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

const EXPAND = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.35, ease: EASE },
};

/** Background of an open project tile and its details strip (text flips to cream on it). */
const TILE_SHADE = "#323232";

type ProjectItem = (typeof PROJECTS)[number];

/**
 * One project in the open Projects panel. Cover and name link to the write-up;
 * the "details" toggle opens a full-width strip under the row (ProjectDetails).
 * While open, the tile takes the darker shade and squares off its bottom so the
 * two read as one L-shaped block, the same way the big cards join their panels.
 */
function ProjectTile({
  project,
  open,
  onToggle,
}: {
  project: ProjectItem;
  open: boolean;
  onToggle: () => void;
}) {
  const href = `/projects/${project.slug}?from=projects`;
  return (
    <motion.div
      className={`min-w-0 p-2.5 ${open ? "flex-1" : ""}`}
      style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
      initial={false}
      animate={{
        backgroundColor: open ? TILE_SHADE : "rgba(50, 50, 50, 0)",
        borderBottomLeftRadius: open ? 0 : 10,
        borderBottomRightRadius: open ? 0 : 10,
      }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      <motion.div whileHover={{ y: -4 }}>
        <Link
          href={href}
          className={`group block rounded-[10px] no-underline transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            open
              ? "text-[#FFE7D0] focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-[#323232]"
              : "text-[#323232] focus-visible:ring-[#323232] focus-visible:ring-offset-[#FC6E20]"
          }`}
        >
          <ViewTransition name={`project-cover-${project.slug}`}>
            <div className="@container relative aspect-16/10 w-full overflow-hidden rounded-[8px] shadow-[0_0_0_1px_rgba(50,50,50,0.15)] transition-shadow group-hover:shadow-[0_8px_20px_-8px_rgba(50,50,50,0.6)]">
              <ProjectCover project={project} size="card" sizes="(max-width: 562px) 50vw, 265px" />
            </div>
          </ViewTransition>
          <p
            className="mt-3 flex items-center gap-1 font-outfit font-medium"
            style={{ fontSize: "clamp(15px, 3.56cqw, 20px)", letterSpacing: "-0.06em", lineHeight: 1.1 }}
          >
            {project.name}
            <ExternalLinkIcon className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </p>
          <p className="mt-1.5 leading-snug opacity-90" style={{ fontSize: "clamp(11px, 2.14cqw, 12px)", letterSpacing: "-0.02em" }}>
            {project.tagline}
          </p>
        </Link>
      </motion.div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`project-details-${project.slug}`}
        className={`mt-3 inline-flex min-h-[32px] items-center gap-1.5 rounded-[6px] border-0 px-2.5 font-outfit font-medium cursor-pointer touch-manipulation transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          open
            ? "bg-[#FFE7D0]/12 text-[#FFE7D0] hover:bg-[#FFE7D0]/20 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-[#323232]"
            : "bg-[#323232]/10 text-[#323232] hover:bg-[#323232]/20 focus-visible:ring-[#323232] focus-visible:ring-offset-[#FC6E20]"
        }`}
        style={{ fontSize: 12, letterSpacing: "-0.03em" }}
      >
        {open ? t("projects.lessDetails") : t("projects.details")}
        <ChevronDown className={open ? "text-[#FFE7D0]" : "text-[#323232]"} rotate={open} />
      </button>
    </motion.div>
  );
}

/**
 * Full-width strip under a row of tiles with the open project's description.
 * `side` is the column of the open tile; the fillet rounds the inside corner.
 */
function ProjectDetails({ project, side }: { project: ProjectItem | null; side: "left" | "right" }) {
  // Each tile is half the row minus half the column gap (--tile-gap, set on the row).
  const tileWidth = "calc(50% - var(--tile-gap) / 2)";
  const fillet =
    side === "left"
      ? { left: tileWidth, background: `radial-gradient(circle at 100% 0, transparent 10px, ${TILE_SHADE} 10.5px)` }
      : { right: tileWidth, background: `radial-gradient(circle at 0 0, transparent 10px, ${TILE_SHADE} 10.5px)` };
  return (
    <div className="relative col-span-2">
      <AnimatePresence initial={false}>
        {project && (
          <motion.div
            key="fillet"
            aria-hidden
            className="absolute"
            style={{ top: -10, width: 10, height: 10, ...fillet }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
        {project && (
          <motion.div
            key="details"
            id={`project-details-${project.slug}`}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={EXPAND.transition}
            className="overflow-hidden text-[#FFE7D0]"
            style={{
              backgroundColor: TILE_SHADE,
              borderRadius: side === "left" ? "0 10px 10px 10px" : "10px 0 10px 10px",
            }}
          >
            <div className="p-4 max-[562px]:p-3.5">
              <p className="leading-relaxed" style={{ fontSize: 13, letterSpacing: "-0.01em" }}>
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#FFE7D0]/15 pt-3">
                <p className="opacity-75" style={{ fontSize: 11, letterSpacing: "normal" }}>
                  {project.stack}
                </p>
                <Link
                  href={`/projects/${project.slug}?from=projects`}
                  className="inline-flex min-h-[32px] items-center gap-1 font-outfit font-medium text-[#FFE7D0] underline decoration-[#FC6E20] decoration-2 underline-offset-4 hover:opacity-80"
                  style={{ fontSize: 12, letterSpacing: "-0.03em" }}
                >
                  {t("projects.readWriteup")}
                  <ExternalLinkIcon />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Keeps a 12px gap between a closed tile and the details strip of its neighbour. */
function TileGap({ active }: { active: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="shrink-0"
      initial={false}
      animate={{ height: active ? 12 : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    />
  );
}

/** Projects in rows of two, each row followed by its details strip. One project open at a time. */
function ProjectTiles() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const rows: ProjectItem[][] = [];
  for (let i = 0; i < PROJECTS.length; i += 2) rows.push(PROJECTS.slice(i, i + 2));

  return (
    <motion.div className="flex flex-col gap-3" initial="hidden" animate="shown" variants={LIST_VARIANTS}>
      {rows.map((row) => {
        const openIndex = row.findIndex((p) => p.slug === openSlug);
        return (
          <div
            key={row[0].slug}
            className="grid grid-cols-2 gap-x-[var(--tile-gap)] [--tile-gap:8px]"
          >
            {row.map((project, i) => (
              <motion.div key={project.slug} className="flex min-w-0 flex-col" variants={ITEM_VARIANTS}>
                <ProjectTile
                  project={project}
                  open={openIndex === i}
                  onToggle={() => setOpenSlug(openSlug === project.slug ? null : project.slug)}
                />
                <TileGap active={openIndex !== -1 && openIndex !== i} />
              </motion.div>
            ))}
            <ProjectDetails
              project={openIndex === -1 ? null : row[openIndex]}
              side={openIndex === 1 ? "right" : "left"}
            />
          </div>
        );
      })}
    </motion.div>
  );
}

/** Timeline of roles shown when the Experience card is open. */
function ExperienceTimeline() {
  return (
    <motion.ol className="m-0 list-none p-0" initial="hidden" animate="shown" variants={LIST_VARIANTS}>
      {EXPERIENCES.map((entry, i) => {
        const last = i === EXPERIENCES.length - 1;
        return (
          <motion.li key={entry.slug} className="flex items-stretch" style={{ gap: 14 }} variants={ITEM_VARIANTS}>
            {/* Dot + connecting line */}
            <div className="flex shrink-0 flex-col items-center" style={{ width: 10, paddingTop: 9 }} aria-hidden>
              <div className="rounded-full bg-[#FC6E20]" style={{ width: 9, height: 9 }} />
              {!last && <div className="w-px flex-1 bg-[#FFE7D0]/40" style={{ marginTop: 4 }} />}
            </div>
            <Link
              href={`/experiences/${entry.slug}?from=experience`}
              className="group min-w-0 flex-1 rounded-[6px] no-underline text-[#FFE7D0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
              style={{ paddingBottom: last ? 0 : 22 }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="flex items-baseline gap-2 font-outfit font-medium">
                  <span style={{ fontSize: 24, letterSpacing: "-0.06em" }}>{entry.company}</span>
                  <span className="flex items-center gap-1 opacity-85" style={{ fontSize: 14, letterSpacing: "-0.04em" }}>
                    {entry.role}
                    <ExternalLinkIcon className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </p>
                <p className="font-outfit opacity-70" style={{ fontSize: 12, letterSpacing: "-0.02em" }}>
                  {entry.duration}
                </p>
              </div>
              <p className="mt-1 leading-snug opacity-90 transition-opacity group-hover:opacity-100" style={{ fontSize: 13, letterSpacing: "normal" }}>
                {entry.description}
              </p>
            </Link>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}

/** Link tiles shown when the Contact card is open. */
function ContactLinks() {
  return (
    <motion.ul
      className="m-0 grid list-none grid-cols-2 gap-3 p-0 max-[480px]:grid-cols-1"
      initial="hidden"
      animate="shown"
      variants={LIST_VARIANTS}
    >
      {CONTACTS.map(({ key, label, handle, href, Icon }) => {
        const external = href.startsWith("http");
        return (
          <motion.li key={key} variants={ITEM_VARIANTS} whileHover={{ y: -3 }}>
            <a
              href={href}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="group flex items-center gap-3 rounded-[8px] p-3 no-underline text-[#FFE7D0] transition-colors bg-[#FFE7D0]/8 hover:bg-[#FFE7D0]/14 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#FFE7D0] text-[#323232]">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-outfit font-medium" style={{ fontSize: 18, letterSpacing: "-0.05em" }}>
                  {label}
                  <ExternalLinkIcon className="opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="block truncate opacity-70" style={{ fontSize: 11, letterSpacing: "normal" }}>
                  {handle}
                </span>
              </span>
            </a>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

/** Bar colour per difficulty, in the site palette. */
const DIFFICULTY_COLOR = { Easy: "#FFE7D0", Medium: "#FC6E20", Hard: "#E2590F" } as const;

/** Competitive profile panel: LeetCode link, headline numbers, and solved-by-difficulty bars. */
function CompetitiveStats({ stats }: { stats: LeetCodeStats | null }) {
  const numbers = stats
    ? [
        { value: stats.rating ?? "-", label: t("competitive.rating") },
        { value: stats.topPercentage != null ? `top ${stats.topPercentage}%` : "-", label: t("competitive.ofContestants") },
        { value: stats.solved, label: t("competitive.solved") },
        { value: stats.contests, label: t("competitive.contests") },
      ]
    : [];
  return (
    <motion.div className="flex flex-col gap-4 text-[#FFE7D0]" initial="hidden" animate="shown" variants={LIST_VARIANTS}>
      <motion.a
        variants={ITEM_VARIANTS}
        href={LEETCODE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-[8px] p-3 no-underline text-[#FFE7D0] transition-colors bg-[#FFE7D0]/8 hover:bg-[#FFE7D0]/14 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#FFE7D0] text-[#323232]">
          <LeetCodeIcon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-outfit font-medium" style={{ fontSize: 18, letterSpacing: "-0.05em" }}>
            leetcode
          </span>
          <span className="block truncate opacity-70" style={{ fontSize: 11, letterSpacing: "normal" }}>
            @{LEETCODE_USERNAME}
            {stats?.globalRanking ? ` · global rank ${stats.globalRanking.toLocaleString("en-IN")}` : ""}
          </span>
        </span>
        <ExternalLinkIcon className="shrink-0" />
      </motion.a>

      {stats && (
        <>
          <motion.ul variants={ITEM_VARIANTS} className="m-0 grid list-none grid-cols-4 gap-3 p-0 max-[480px]:grid-cols-2">
            {numbers.map((n) => (
              <li key={n.label} className="rounded-[8px] bg-[#FFE7D0]/8 p-3">
                <p className="font-outfit font-medium" style={{ fontSize: "clamp(20px, 5cqw, 28px)", letterSpacing: "-0.06em", lineHeight: 1 }}>
                  {n.value}
                </p>
                <p className="mt-1 opacity-70" style={{ fontSize: 11, letterSpacing: "normal" }}>
                  {n.label}
                </p>
              </li>
            ))}
          </motion.ul>

          <motion.ul variants={ITEM_VARIANTS} className="m-0 flex list-none flex-col gap-2.5 p-0">
            {stats.byDifficulty.map((d) => (
              <li key={d.difficulty} className="grid grid-cols-[64px_1fr_auto] items-center gap-3" style={{ fontSize: 12 }}>
                <span className="font-outfit font-medium">{d.difficulty.toLowerCase()}</span>
                <span className="h-2 overflow-hidden rounded-full bg-[#FFE7D0]/15">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${d.total ? Math.max(2, (d.solved / d.total) * 100) : 0}%`, backgroundColor: DIFFICULTY_COLOR[d.difficulty] }}
                  />
                </span>
                <span className="font-outfit opacity-80 tabular-nums">
                  {d.solved}
                  <span className="opacity-60">/{d.total}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        </>
      )}
    </motion.div>
  );
}

/**
 * An accordion card. It never moves: its contents open in a full-width
 * ExpandPanel underneath, and the card squares off its bottom corners to join
 * it. Cards are as tall as their content, but fill their row so neighbours
 * always end on the same line; the title stays centred when stretched.
 */
function ExpandCard({
  id,
  panelId,
  open,
  onToggle,
  title,
  titleSize,
  tone,
  widthClass,
  marginTop,
  fillRow = true,
  growWhenOpen = false,
  openSummary,
  layoutId,
}: {
  id: string;
  panelId: string;
  open: boolean;
  onToggle: () => void;
  title: string;
  /** CSS font-size; use cqw so it scales with the section on phones */
  titleSize: string;
  tone: Tone;
  widthClass: string;
  marginTop: number;
  /** Stretch to the row's height (default). Off for cards stacked in a column that keep their own height. */
  fillRow?: boolean;
  /** Keep its place and grow downward to meet its panel when opened (title stays at the top). */
  growWhenOpen?: boolean;
  /** Shown under the title while open, filling the space a growing card gains. */
  openSummary?: ReactNode;
  /** Lets the same card move smoothly between slots (Projects moves below Experience's panel). */
  layoutId?: string;
}) {
  const { bg, fg, ring } = TONES[tone];
  const growing = growWhenOpen && open;
  // Cards that change size or slot animate it; the title only moves, so it isn't stretched mid-animation.
  const animatesLayout = growWhenOpen || Boolean(layoutId);
  return (
    <motion.div
      id={id}
      layout={animatesLayout}
      layoutId={layoutId}
      className={`${widthClass} max-[562px]:w-full flex flex-col overflow-hidden p-4 max-[562px]:p-3 ${growing ? "justify-start" : "justify-center"} ${fillRow || growing ? "flex-1" : ""}`}
      style={{ marginTop, backgroundColor: bg, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
      initial={false}
      animate={{
        borderBottomLeftRadius: open ? 0 : 10,
        borderBottomRightRadius: open ? 0 : 10,
      }}
      transition={{ duration: 0.2, ease: EASE, layout: { duration: 0.35, ease: EASE } }}
    >
      <motion.button
        layout={animatesLayout ? "position" : undefined}
        transition={{ layout: { duration: 0.35, ease: EASE } }}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={`grid w-full min-h-[44px] grid-cols-[1fr_auto] items-center gap-3 border-0 bg-transparent p-0 text-left cursor-pointer touch-manipulation rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${ring}`}
      >
        <span
          className={`min-w-0 overflow-hidden font-outfit font-normal leading-none ${fg}`}
          style={{ fontSize: titleSize, letterSpacing: "-0.11em" }}
        >
          {title}
        </span>
        <ChevronDown className={fg} rotate={open} />
      </motion.button>
      <AnimatePresence initial={false}>
        {open && openSummary && (
          <motion.div
            key="summary"
            className={`font-medium leading-snug ${fg}`}
            style={{ marginTop: 10, fontSize: "clamp(12px, 2.6cqw, 15px)", letterSpacing: "-0.04em" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.3, ease: EASE } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {openSummary}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Full-width panel under a row of cards. With the squared-off
 * card it forms one L-shaped block; the fillet rounds the inside corner where
 * the card meets the panel. `side` is the column the card sits in.
 */
function ExpandPanel({
  id,
  open,
  side,
  tone,
  children,
}: {
  id: string;
  open: boolean;
  /** Column of the card it joins, or "full" for a full-width card (plain drop-down, no L). */
  side: "left" | "right" | "full";
  tone: Tone;
  children: ReactNode;
}) {
  const { bg } = TONES[tone];
  // --left-card / --right-card are the card widths, set on the section for each breakpoint.
  const fillet =
    side === "left"
      ? { left: "var(--left-card)", background: `radial-gradient(circle at 100% 0, transparent 10px, ${bg} 10.5px)` }
      : { right: "var(--right-card)", background: `radial-gradient(circle at 0 0, transparent 10px, ${bg} 10.5px)` };
  return (
    <div className="relative col-span-2">
      <AnimatePresence initial={false}>
        {open && side !== "full" && (
          <motion.div
            key="fillet"
            aria-hidden
            className="absolute"
            style={{ top: -10, width: 10, height: 10, ...fillet }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
        {open && (
          <motion.div
            key="panel"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={EXPAND.transition}
            className="overflow-hidden"
            style={{
              backgroundColor: bg,
              borderRadius: side === "left" ? "0 10px 10px 10px" : side === "right" ? "10px 0 10px 10px" : "0 0 10px 10px",
            }}
          >
            <div id={id} className="p-4 max-[562px]:p-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * When the card on the other side of a row is joined to its panel,
 * this keeps a 20px gap between this side's card and the panel (the joined
 * card stretches to fill the same space).
 */
function JoinGap({ active }: { active: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="shrink-0"
      initial={false}
      animate={{ height: active ? 20 : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    />
  );
}

export default function CardsSection({ leetcode }: { leetcode: LeetCodeStats | null }) {
  const searchParams = useSearchParams();
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [competitiveOpen, setCompetitiveOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Competitive profile and Contact share the panel row under them, so only one of them is open at a time.
  const toggleCompetitive = () => {
    if (!competitiveOpen) setContactOpen(false);
    setCompetitiveOpen(!competitiveOpen);
  };
  const toggleContact = () => {
    if (!contactOpen) setCompetitiveOpen(false);
    setContactOpen(!contactOpen);
  };

  // Restore accordion state and scroll when returning from detail page (e.g. Back with ?section=experience)
  useEffect(() => {
    const section = searchParams.get("section");
    if (section === "experience") {
      requestAnimationFrame(() => {
        setExperienceOpen(true);
        document.getElementById("section-experience")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else if (section === "projects") {
      requestAnimationFrame(() => {
        setProjectsOpen(true);
        document.getElementById("section-projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else if (section === "contact") {
      requestAnimationFrame(() => {
        setContactOpen(true);
        document.getElementById("section-contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [searchParams]);

  // Projects sits under Experience in the first column. When Experience opens, its panel needs the
  // space right below it, so Projects moves down under that panel (same card, animated via layoutId).
  const projectsCard = (stacked: boolean) => (
    <ExpandCard
      id="section-projects"
      panelId="projects-panel"
      open={projectsOpen}
      onToggle={() => setProjectsOpen(!projectsOpen)}
      title={t("cards.projects")}
      titleSize="clamp(32px, 11.39cqw, 64px)"
      tone="orange"
      widthClass={stacked ? "w-[271px]" : "w-full"}
      marginTop={stacked ? 0 : 20}
      fillRow={!stacked}
      layoutId="projects-card"
    />
  );

  return (
    // Two columns at every width: fixed 281px columns on desktop, equal halves with a 12px gap on phones.
    // Text sizes use cqw (this section is the container) so phones get the desktop layout, scaled.
    <section
      className="@container grid w-full max-w-[562px] grid-cols-[281px_281px] gap-0 max-[562px]:grid-cols-2 max-[562px]:gap-x-3 [--left-card:calc(50%-6px)] [--right-card:calc(50%-6px)] min-[563px]:[--left-card:271px] min-[563px]:[--right-card:224px]"
      style={{ marginTop: 40 }}
    >
      {/* Row 1, left: resume, Experience, Projects, aligned to navbar left */}
      <div className="flex w-[281px] max-[562px]:w-full flex-col">
        <motion.div
          className="relative mr-auto max-w-[271px] overflow-hidden max-[562px]:max-w-none"
          initial={{ width: 56 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformOrigin: "left center" }}
        >
          <span
            className="absolute left-0 top-0 z-10 font-outfit font-medium leading-none text-[#FFE7D0]"
            style={{
              background: "#323232",
              fontSize: 12,
              letterSpacing: "-0.05em",
              padding: "6px 10px",
              borderRadius: "6px",
              transform: "translate(-6px, -6px)",
            }}
          >
            {t("cards.inAHurry")}
          </span>
          <a
            href="/shobhit_srivastava_2026_march.pdf"
            download="Shobhit_Srivastava_Resume.pdf"
            className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-[#FC6E20] font-semibold text-[#323232] touch-manipulation transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFE7D0] min-[563px]:min-w-[271px]"
            style={{
              height: 47,
              fontSize: "clamp(15px, 4.27cqw, 24px)",
              letterSpacing: "-0.05em",
            }}
          >
            {t("cards.downloadResume")}
            <DownloadIcon />
          </a>
        </motion.div>
        <div aria-hidden style={{ minHeight: 35 }} />
        <ExpandCard
          id="section-experience"
          panelId="experience-panel"
          open={experienceOpen}
          onToggle={() => setExperienceOpen(!experienceOpen)}
          title={t("cards.experience")}
          titleSize="clamp(24px, 8.54cqw, 48px)"
          tone="dark"
          widthClass="w-[271px]"
          marginTop={0}
          fillRow={false}
          growWhenOpen
          openSummary={
            <>
              <p>{t("cards.experienceAi")}</p>
              <p>{t("cards.experienceFullStack")}</p>
              <p>{t("cards.experienceDistributed")}</p>
            </>
          }
        />
        {/* Experience never moves. Spare space in this row sits between it and Projects, so Projects'
            bottom lines up with the status card; when Experience opens it grows down to its panel instead. */}
        {!experienceOpen && (
          <>
            <div aria-hidden className="flex-1" style={{ minHeight: 20 }} />
            {projectsCard(true)}
          </>
        )}
      </div>

      {/* Row 1, right: status, aligned to navbar right */}
      <div className="flex w-[281px] max-[562px]:w-full flex-col items-end">
        <div
          className="relative flex w-[224px] max-[562px]:w-full flex-1 flex-col justify-between overflow-hidden border-2 border-[#323232] bg-[#FFE7D0] p-4 max-[562px]:p-3 font-bold leading-tight text-[#323232]"
          style={{ letterSpacing: "-0.05em" }}
        >
          <div className="min-h-0 min-w-0" style={{ marginTop: 36 }}>
            <p
              className="text-[#323232]"
              style={{
                fontSize: "clamp(16px, 4.27cqw, 24px)",
                lineHeight: 1.2,
                letterSpacing: "-0.04em",
              }}
            >
              {t("status.text")}
            </p>
            <p
              className="font-outfit font-medium text-[#323232]/80"
              style={{ marginTop: 8, fontSize: "clamp(12px, 2.5cqw, 14px)", letterSpacing: "-0.04em" }}
            >
              {t("status.where")}
            </p>
          </div>
          {/* Status badge: top-right, same slot the language picker used */}
          <span className="absolute right-2 top-2 flex min-h-[32px] items-center gap-1.5 rounded-md border border-[#323232] bg-[#FFE7D0] px-2 py-1 font-outfit text-sm font-medium text-[#323232] shadow-sm">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#FC6E20] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#FC6E20]" />
            </span>
            {t("status.badge")}
          </span>
          <a
            href="mailto:shobhitsrivastava729@gmail.com"
            className="inline-flex min-h-[44px] w-fit items-center gap-1 font-outfit font-medium text-[#323232] underline decoration-[#FC6E20] decoration-2 underline-offset-4 hover:opacity-80"
            style={{ fontSize: "clamp(15px, 3.2cqw, 18px)" }}
          >
            {t("status.cta")}
            <ExternalLinkIcon />
          </a>
        </div>
        <JoinGap active={experienceOpen || projectsOpen} />
      </div>

      <ExpandPanel id="experience-panel" open={experienceOpen} side="left" tone="dark">
        <ExperienceTimeline />
      </ExpandPanel>

      {/* Projects' panel while Projects is still under Experience */}
      <ExpandPanel id="projects-panel" open={projectsOpen && !experienceOpen} side="left" tone="orange">
        <ProjectTiles />
      </ExpandPanel>

      {/* Experience open: Projects moves below its panel, full width, opening as a plain drop-down */}
      {experienceOpen && (
        <>
          <div className="col-span-2 flex flex-col">{projectsCard(false)}</div>
          <ExpandPanel id="projects-panel" open={projectsOpen} side="full" tone="orange">
            <ProjectTiles />
          </ExpandPanel>
        </>
      )}

      {/* Row 2, left: Competitive profile */}
      <div className="flex w-[281px] max-[562px]:w-full flex-col">
        <ExpandCard
          id="section-competitive"
          panelId="competitive-panel"
          open={competitiveOpen}
          onToggle={toggleCompetitive}
          title={t("cards.competitive")}
          // Long title: 48px on desktop, but shrinks faster than the others on phones (~21px).
          titleSize="clamp(21px, calc(14.3cqw - 32px), 48px)"
          tone="dark"
          widthClass="w-[271px]"
          marginTop={20}
        />
        <JoinGap active={contactOpen} />
      </div>

      {/* Row 2, right: Contact */}
      <div className="flex w-[281px] max-[562px]:w-full flex-col items-end">
        <ExpandCard
          id="section-contact"
          panelId="contact-panel"
          open={contactOpen}
          onToggle={toggleContact}
          title={t("cards.contact")}
          titleSize="clamp(24px, 8.54cqw, 48px)"
          tone="dark"
          widthClass="w-[224px]"
          marginTop={20}
        />
        <JoinGap active={competitiveOpen} />
      </div>

      <ExpandPanel id="competitive-panel" open={competitiveOpen} side="left" tone="dark">
        <CompetitiveStats stats={leetcode} />
      </ExpandPanel>
      <ExpandPanel id="contact-panel" open={contactOpen} side="right" tone="dark">
        <ContactLinks />
      </ExpandPanel>
    </section>
  );
}
