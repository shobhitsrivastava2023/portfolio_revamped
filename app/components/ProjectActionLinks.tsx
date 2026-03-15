"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const linkClass =
  "flex flex-1 min-h-[44px] items-center justify-center rounded-[10px] font-outfit font-medium no-underline hover:opacity-90 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
const linkStyle = {
  height: 47,
  fontSize: 18,
  letterSpacing: "-0.05em" as const,
};

export default function ProjectActionLinks({
  githubUrl,
  liveUrl,
  demoUrl,
}: {
  githubUrl: string;
  liveUrl: string;
  demoUrl?: string;
}) {
  const { t } = useLanguage();
  const hasLive = liveUrl !== "#";

  return (
    <div
      className="mt-10 flex w-full flex-wrap gap-4"
      style={{ marginBottom: 60 }}
    >
      <Link
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkClass} bg-[#323232] text-[#FFE7D0] focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-[#FFE7D0]`}
        style={linkStyle}
      >
        {t("project.github")}
      </Link>
      {hasLive && (
        <Link
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClass} bg-[#FC6E20] text-[#323232] focus-visible:ring-[#323232] focus-visible:ring-offset-[#FFE7D0]`}
          style={linkStyle}
        >
          {t("project.live")}
        </Link>
      )}
      {demoUrl && (
        <Link
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClass} bg-[#323232] text-white focus-visible:ring-white focus-visible:ring-offset-[#FFE7D0]`}
          style={linkStyle}
        >
          {t("project.demo")}
        </Link>
      )}
    </div>
  );
}
