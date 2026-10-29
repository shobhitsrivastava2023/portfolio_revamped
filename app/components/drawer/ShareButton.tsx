"use client";

import { useState } from "react";
import { t } from "../../data/strings";

/** Opens the phone's share sheet, or copies the link on desktop. */
export default function ShareButton({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = new URL(path, window.location.origin).toString();
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-[32px] items-center gap-1 border-0 bg-transparent p-0 font-outfit font-medium text-[#323232] cursor-pointer underline decoration-[#FC6E20] decoration-2 underline-offset-4 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] rounded-[4px]"
      style={{ fontSize: 13, letterSpacing: "-0.03em" }}
    >
      {copied ? t("drawer.copied") : t("drawer.share")}
    </button>
  );
}
