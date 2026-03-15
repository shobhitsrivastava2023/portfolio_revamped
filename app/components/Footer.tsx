"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer
      className="w-full max-w-[562px] rounded-[10px] bg-[#323232] px-6 py-6 font-outfit font-medium text-[#FFE7D0]"
      style={{
        marginTop: 69,
        marginBottom: 40,
        fontSize: 14,
        letterSpacing: "-0.05em",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span>© {year} Shobhit</span>
        <nav className="flex flex-wrap items-center gap-2 min-[400px]:gap-6" aria-label="Footer links">
          <Link
            href="/#philosophy"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center no-underline text-[#FFE7D0] transition-opacity hover:opacity-80 focus:outline-none focus-visible:opacity-80 rounded-[6px] focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
          >
            {t("footer.philosophy")}
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center no-underline text-[#FFE7D0] transition-opacity hover:opacity-80 focus:outline-none focus-visible:opacity-80 rounded-[6px] focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
          >
            {t("footer.blogs")}
          </Link>
          <a
            href="mailto:shobhitsrivastava729@gmail.com"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center no-underline text-[#FFE7D0] transition-opacity hover:opacity-80 focus:outline-none focus-visible:opacity-80 rounded-[6px] focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
          >
            {t("footer.contact")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
