"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function ProjectActionLinks({
  githubUrl,
  liveUrl,
}: {
  githubUrl: string;
  liveUrl: string;
}) {
  const { t } = useLanguage();
  return (
    <div
      className="mt-10 flex w-full gap-4"
      style={{ marginBottom: 60 }}
    >
      <Link
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 min-h-[44px] items-center justify-center rounded-[10px] bg-[#323232] font-outfit font-medium text-[#FFE7D0] no-underline hover:opacity-90 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFE7D0]"
        style={{
          height: 47,
          fontSize: 18,
          letterSpacing: "-0.05em",
        }}
      >
        {t("project.github")}
      </Link>
      <Link
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 min-h-[44px] items-center justify-center rounded-[10px] bg-[#FC6E20] font-outfit font-medium text-[#323232] no-underline hover:opacity-90 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFE7D0]"
        style={{
          height: 47,
          fontSize: 18,
          letterSpacing: "-0.05em",
        }}
      >
        {t("project.live")}
      </Link>
    </div>
  );
}
