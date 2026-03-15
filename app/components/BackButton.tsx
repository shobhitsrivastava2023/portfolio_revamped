"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

/** Back button 71×50. Defaults to home; pass href to override (e.g. /blog). */
export default function BackButton({ href = "/" }: { href?: string }) {
  const { t } = useLanguage();
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 self-start items-center justify-center min-h-[44px] min-w-[44px] no-underline text-[#323232] hover:opacity-80 touch-manipulation rounded-[8px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFE7D0]"
      style={{ width: 71, height: 50 }}
      aria-label={t("back.label")}
    >
      <svg
        width="71"
        height="50"
        viewBox="0 0 71 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
        aria-hidden
      >
        <path
          d="M45 25H20M20 25L28 17M20 25L28 33"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
