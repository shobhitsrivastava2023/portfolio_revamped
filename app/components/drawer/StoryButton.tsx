"use client";

import { useState } from "react";
import { t } from "../../data/strings";

/**
 * Shares the item's story card (/drawer/<id>/story, 1080×1920) as an image.
 * On phones this opens the share sheet with the PNG attached, so it can go
 * straight to an Instagram story; elsewhere it downloads the PNG.
 */
export default function StoryButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);

  const share = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/drawer/${id}/story`);
      if (!res.ok) throw new Error(`story ${res.status}`);
      const file = new File([await res.blob()], `drawer-${id}.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] }).catch(() => {});
        return;
      }
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
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
