"use client";

import { t } from "../data/strings";

export default function BeyondCode() {
  return (
    <section className="w-full max-w-[562px]" style={{ marginTop: 69 }}>
      <div className="rounded-[10px] bg-[#323232] py-5 px-6">
        <h2
          className="flex w-full items-center justify-center font-outfit font-bold uppercase tracking-[-0.05em] text-[#FFE7D0] whitespace-nowrap"
          style={{ fontSize: "clamp(1.5rem, 6vw, 2.5rem)" }}
        >
          {t("beyondCode.title")}
        </h2>
      </div>
    </section>
  );
}
