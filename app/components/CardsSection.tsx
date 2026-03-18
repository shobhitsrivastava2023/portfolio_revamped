"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "../data/projects";
import { EXPERIENCES } from "../data/experience";
import { useLanguage } from "../context/LanguageContext";
import type { Locale } from "../data/translations";

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

export default function CardsSection() {
  const searchParams = useSearchParams();
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t, localeLabel, locales } = useLanguage();

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      className="grid w-full max-w-[562px] grid-cols-[281px_281px] gap-0 max-[562px]:grid-cols-1"
      style={{ marginTop: 40 }}
    >
      {/* Left column: 271px wide, aligned to navbar left */}
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
            download="Shobhit_Srivastava_Resume_March_2026.pdf"
            className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-[#FC6E20] font-semibold text-[#323232] touch-manipulation transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFE7D0]"
            style={{
              minWidth: 271,
              height: 47,
              fontSize: 24,
              letterSpacing: "-0.05em",
            }}
          >
            {t("cards.downloadResume")}
            <DownloadIcon />
          </a>
        </motion.div>
        <div
          id="section-experience"
          className="w-[271px] max-[562px]:w-full overflow-hidden rounded-[10px] bg-[#323232] p-4"
          style={{
            minHeight: 168,
            marginTop: 35,
          }}
        >
          <button
            type="button"
            onClick={() => setExperienceOpen(!experienceOpen)}
            className="grid w-full min-h-[44px] grid-cols-[1fr_auto] items-center gap-3 border-0 bg-transparent p-0 text-left cursor-pointer touch-manipulation rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
          >
            <span
              className="min-w-0 overflow-hidden font-outfit font-normal leading-none text-[#FFE7D0]"
              style={{
                fontSize: 48,
                letterSpacing: "-0.11em",
              }}
            >
              {t("cards.experience")}
            </span>
            <ChevronDown rotate={experienceOpen} />
          </button>

          <AnimatePresence mode="wait">
            {!experienceOpen ? (
              <motion.div
                key="tldr"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="font-medium leading-tight text-[#FFE7D0]"
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  letterSpacing: "-0.05em",
                }}
              >
                <p>{t("cards.experienceGraduating")}</p>
                <p>{t("cards.experienceWorkedAt")}</p>
                <p>{t("cards.experienceDomain")}</p>
              </motion.div>
            ) : (
              <motion.div
                key="timeline"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ marginTop: 32, overflow: "hidden" }}
                className="relative"
              >
                <motion.div
                  className="flex flex-col"
                  initial={{ y: -12 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {EXPERIENCES.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-stretch"
                      style={{ gap: 10 }}
                    >
                      {/* Timeline: dot + line 10px left of data */}
                      <div
                        className="flex shrink-0 flex-col items-center"
                        style={{ width: 10 }}
                      >
                        <div
                          className="rounded-full bg-[#FFE7D0]"
                          style={{ width: 7, height: 7 }}
                        />
                        {i < EXPERIENCES.length - 1 && (
                          <div
                            className="w-px flex-1 min-h-[28px] bg-[#FFE7D0]"
                            style={{ marginTop: 2 }}
                          />
                        )}
                      </div>
                      {/* Content: fixed 81.02px gap between company and role */}
                      <div
                        className="min-w-0 flex-1 font-outfit font-normal text-[#FFE7D0]"
                        style={{
                          letterSpacing: "-0.11em",
                          paddingBottom: i < EXPERIENCES.length - 1 ? 22 : 0,
                        }}
                      >
                        <Link
                          href={`/experiences/${entry.slug}?from=experience`}
                          className="flex items-center min-h-[1.5em] no-underline text-[#FFE7D0] hover:opacity-80"
                          style={{ marginBottom: 14 }}
                        >
                          <span
                            className="min-w-0 shrink"
                            style={{ fontSize: 18 }}
                          >
                            {entry.company}
                          </span>
                          <span
                            className="shrink-0 min-[563px]:w-[81.02px] max-[562px]:w-4"
                            aria-hidden
                          />
                          <span
                            className="flex shrink-0 items-center gap-1"
                            style={{ fontSize: 14 }}
                          >
                            {entry.role}
                            <ExternalLinkIcon />
                          </span>
                        </Link>
                        <p
                          className="text-justify leading-snug"
                          style={{ fontSize: 10, letterSpacing: "normal" }}
                        >
                          {entry.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          id="section-projects"
          className="w-[271px] max-[562px]:w-full overflow-hidden rounded-[10px] bg-[#FC6E20] p-4"
          style={{
            minHeight: 168,
            marginTop: 20,
          }}
        >
          <button
            type="button"
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="grid w-full min-h-[44px] grid-cols-[1fr_auto] items-center gap-3 border-0 bg-transparent p-0 text-left cursor-pointer touch-manipulation rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FC6E20]"
          >
            <span
              className="min-w-0 overflow-hidden font-outfit font-normal leading-none text-[#323232]"
              style={{
                fontSize: 64,
                letterSpacing: "-0.11em",
              }}
            >
              {t("cards.projects")}
            </span>
            <ChevronDown className="text-[#323232]" rotate={projectsOpen} />
          </button>

          <AnimatePresence mode="wait">
            {!projectsOpen ? (
              <motion.div
                key="tldr"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="font-medium leading-tight text-[#323232]"
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  letterSpacing: "-0.05em",
                }}
              >
                <p>{t("cards.projectsRepos")}</p>
                <p>{t("cards.projectsContributions")}</p>
                <p>{t("cards.projectsOpenSource")}</p>
              </motion.div>
            ) : (
              <motion.div
                key="project"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ marginTop: 24, overflow: "hidden" }}
              >
                <motion.div
                  initial={{ y: -12 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {PROJECTS.map((project, i) => (
                    <div
                      key={i}
                      className="font-outfit font-normal text-[#323232]"
                      style={i > 0 ? { marginTop: 28 } : undefined}
                    >
                      <Link
                        href={`/projects/${project.slug}?from=projects`}
                        className="flex items-start justify-between gap-2 no-underline text-[#323232] hover:opacity-80"
                        aria-label={`Open ${project.name}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p style={{ fontSize: 16 }}>{project.name}</p>
                          <p
                            className="mt-1 leading-tight"
                            style={{ fontSize: 12 }}
                          >
                            {project.tagline}
                          </p>
                        </div>
                        <span className="mt-0.5 flex shrink-0 items-center gap-1">
                          <ExternalLinkIcon className="text-[#323232]" />
                        </span>
                      </Link>
                      <Link
                        href={`/projects/${project.slug}?from=projects`}
                        className="mt-3 block no-underline text-[#323232] hover:opacity-80"
                        aria-label={`Open ${project.name} project details from image`}
                      >
                        <div className="relative w-full overflow-hidden rounded-md max-[562px]:aspect-221/140 min-[563px]:h-[140px] min-[563px]:w-[221px]">
                          <Image
                            src={project.image}
                            alt={project.imageAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 562px) 100vw, 221px"
                          />
                        </div>
                        <p
                          className="mt-2 leading-snug"
                          style={{ fontSize: 12, letterSpacing: "normal" }}
                        >
                          {project.description}
                        </p>
                      </Link>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right column: 224px wide, aligned to navbar right; gap above on mobile when stacked */}
      <div className="flex w-[281px] max-[562px]:w-full max-[562px]:mt-6 flex-col items-end">
        <div
          ref={langDropdownRef}
          className="relative flex w-[224px] max-[562px]:w-full items-start overflow-hidden border-2 border-[#323232] bg-[#FFE7D0] p-4 font-bold leading-tight text-[#323232]"
          style={{
            height: 252,
            letterSpacing: "-0.05em",
          }}
        >
          <p
            className="min-h-0 min-w-0 flex-1 overflow-hidden pr-14 text-[#323232] max-[562px]:text-[clamp(0.875rem,4vw,1.25rem)]"
            style={{
              fontSize: "clamp(0.875rem, 3.8vw, 1.75rem)",
              lineHeight: 1.28,
              letterSpacing: "-0.04em",
            }}
          >
            {t("banner.text")}
          </p>
          {/* Translation badge: top-right, shows selected language */}
          <div className="absolute right-2 top-2 flex flex-col items-end">
            <button
              type="button"
              onClick={() => setLangDropdownOpen((o) => !o)}
              className="flex min-h-[32px] items-center rounded-md border border-[#323232] bg-[#FFE7D0] px-2 py-1 font-outfit text-sm font-medium text-[#323232] shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] focus-visible:ring-offset-1"
              aria-expanded={langDropdownOpen}
              aria-haspopup="listbox"
              aria-label="Select language"
            >
              {localeLabel(locale)}
            </button>
            <AnimatePresence>
              {langDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  className="absolute right-0 top-full z-50 mt-1 max-h-[240px] min-w-[120px] overflow-auto rounded-md border border-[#323232] bg-[#FFE7D0] py-1 shadow-lg"
                  style={{ marginTop: 4 }}
                >
                  {locales.map((l) => (
                    <li key={l} role="option" aria-selected={l === locale}>
                      <button
                        type="button"
                        onClick={() => {
                          setLocale(l as Locale);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left font-outfit text-sm transition-colors hover:bg-[#FC6E20]/20 ${
                          l === locale ? "bg-[#FC6E20]/30 font-medium" : ""
                        }`}
                      >
                        {localeLabel(l as Locale)}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div
          id="section-contact"
          className="w-[224px] max-[562px]:w-full overflow-hidden rounded-[10px] bg-[#323232] p-4"
          style={{
            minHeight: 168,
            marginTop: 20,
          }}
        >
          <button
            type="button"
            onClick={() => setContactOpen(!contactOpen)}
            className="grid w-full min-h-[44px] grid-cols-[1fr_auto] items-center gap-3 border-0 bg-transparent p-0 text-left cursor-pointer touch-manipulation rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
          >
            <span
              className="min-w-0 overflow-hidden font-outfit font-normal leading-none text-[#FFE7D0]"
              style={{
                fontSize: 48,
                letterSpacing: "-0.11em",
              }}
            >
              {t("cards.contact")}
            </span>
            <ChevronDown className="text-[#FFE7D0]" rotate={contactOpen} />
          </button>

          <AnimatePresence mode="wait">
            {!contactOpen ? (
              <motion.div
                key="tldr"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="font-medium leading-tight text-[#FFE7D0]"
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  letterSpacing: "-0.05em",
                }}
              >
                <p>{t("cards.contactTldr")}</p>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ marginTop: 32, overflow: "hidden" }}
                className="relative"
              >
                <motion.div
                  className="flex flex-col font-outfit font-normal text-[#FFE7D0]"
                  initial={{ y: -12 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ letterSpacing: "-0.05em" }}
                >
                  <a
                    href="mailto:shobhitsrivastava729@gmail.com"
                    className="flex items-center justify-between gap-2 no-underline text-[#FFE7D0] hover:opacity-80"
                    style={{ fontSize: 14 }}
                  >
                    <span>{t("cards.gmail")}</span>
                    <span style={{ fontSize: 10, letterSpacing: "normal" }}>
                      shobhitsrivastava729@gmail.com
                    </span>
                  </a>
                  <a
                    href="https://github.com/shobhitsrivastava2023"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-1 no-underline text-[#FFE7D0] hover:opacity-80"
                    style={{ fontSize: 14, marginTop: 14 }}
                  >
                    <span>{t("cards.github")}</span>
                    <span className="flex items-center gap-1">
                      @shobhitsrivastava2023
                      <ExternalLinkIcon />
                    </span>
                  </a>
                  <a
                    href="https://x.com/Shobhit_Talks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-1 no-underline text-[#FFE7D0] hover:opacity-80"
                    style={{ fontSize: 14, marginTop: 14 }}
                  >
                    <span>{t("cards.twitter")}</span>
                    <span className="flex items-center gap-1">
                      x.com/Shobhit_Talks
                      <ExternalLinkIcon />
                    </span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/shobhit-srivastava-s1323/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-1 no-underline text-[#FFE7D0] hover:opacity-80"
                    style={{ fontSize: 14, marginTop: 14 }}
                  >
                    <span>{t("cards.linkedin")}</span>
                    <ExternalLinkIcon />
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
