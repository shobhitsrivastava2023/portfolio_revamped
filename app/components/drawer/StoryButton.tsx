"use client";

import { useState } from "react";
import { t } from "../../data/strings";
import { shareImage } from "../../lib/drawer/shareImage";

/**
 * Shares the item's story card (/drawer/<id>/story, in its saved design) as an image.
 * On phones this opens the share sheet with the PNG attached, so it can go
 * straight to an Instagram story; elsewhere it downloads the PNG.
 * `version` changes when the design does, so a cached old card isn't served.
 */
export default function StoryButton({ id, version }: { id: string; version: string }) {
  const [busy, setBusy] = useState(false);

  const share = async () => {
    setBusy(true);
    try {
      await shareImage(`/drawer/${id}/story?v=${version}`, `drawer-${id}.png`);
    } catch (err) {
      console.error("drawer: story card failed", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      disabled={busy}
      className="inline-flex min-h-[32px] items-center gap-1 border-0 bg-transparent p-0 font-outfit font-medium text-[#323232] cursor-pointer underline decoration-[#FC6E20] decoration-2 underline-offset-4 hover:opacity-80 disabled:cursor-wait disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#323232] rounded-[4px]"
      style={{ fontSize: 13, letterSpacing: "-0.03em" }}
    >
      {busy ? t("drawer.storyBusy") : t("drawer.story")}
    </button>
  );
}
