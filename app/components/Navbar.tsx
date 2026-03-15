"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const NAV_WIDTH = 562;
const NAV_HEIGHT = 76;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div
      className="sticky top-0 z-40 w-full max-w-[562px] bg-[#FFE7D0] pt-[29px] min-[563px]:w-[562px]"
    >
      <motion.nav
        initial={{ width: 64 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="ml-auto flex items-center justify-between overflow-hidden rounded-[12px] bg-[#FC6E20] px-5"
        style={{
          height: NAV_HEIGHT,
          maxWidth: NAV_WIDTH,
          transformOrigin: "right center",
        }}
      >
        <Link
          href="/"
          className="font-outfit font-medium text-[#323232] no-underline hover:opacity-90"
          style={{
            fontSize: 48,
            letterSpacing: "-0.1em",
          }}
        >
          SHOBHIT.
        </Link>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative flex min-h-[44px] min-w-[44px] items-center justify-center border-0 bg-transparent p-0 cursor-pointer touch-manipulation rounded-[8px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#323232]"
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
        >
          <span
            className="absolute h-[2px] w-9 bg-[#323232] transition-all duration-300 ease-out"
            style={{
              width: 36,
              transform: open
                ? "translateY(0) rotate(45deg)"
                : "translateY(-6.5px) rotate(0deg)",
            }}
          />
          <span
            className="h-[2px] w-9 bg-[#323232] transition-opacity duration-200"
            style={{
              width: 36,
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="absolute h-[2px] w-9 bg-[#323232] transition-all duration-300 ease-out"
            style={{
              width: 36,
              transform: open
                ? "translateY(0) rotate(-45deg)"
                : "translateY(6.5px) rotate(0deg)",
            }}
          />
        </button>
      </motion.nav>

      {/* Navigation panel: slides down, z-index above content */}
      <div
        className="w-full overflow-hidden transition-all duration-300 ease-out"
        style={{
          position: "absolute",
          top: 29 + NAV_HEIGHT,
          left: 0,
          right: 0,
          zIndex: 50,
          maxHeight: open ? 400 : 0,
          opacity: open ? 1 : 0,
        }}
      >
        <div
          className="rounded-[10px] bg-[#323232] py-4 px-6 font-outfit font-medium text-[#FFE7D0]"
          style={{
            fontSize: 48,
            letterSpacing: "-0.05em",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex min-h-[44px] items-center no-underline text-[#FFE7D0] hover:opacity-80 transition-opacity focus:outline-none focus-visible:opacity-80 rounded-[6px] focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="flex min-h-[44px] items-center no-underline text-[#FFE7D0] hover:opacity-80 transition-opacity focus:outline-none focus-visible:opacity-80 rounded-[6px] focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
          >
            {t("nav.blogs")}
          </Link>
          <Link
            href="/#philosophy"
            onClick={() => setOpen(false)}
            className="flex min-h-[44px] items-center no-underline text-[#FFE7D0] hover:opacity-80 transition-opacity focus:outline-none focus-visible:opacity-80 rounded-[6px] focus-visible:ring-2 focus-visible:ring-[#FFE7D0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#323232]"
          >
            {t("nav.philosophy")}
          </Link>
        </div>
      </div>
    </div>
  );
}
