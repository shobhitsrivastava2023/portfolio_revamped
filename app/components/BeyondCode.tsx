"use client";

import { useLanguage } from "../context/LanguageContext";

export default function BeyondCode() {
  const { t } = useLanguage();
  return (
    <section className="w-full max-w-[562px]" style={{ marginTop: 69 }}>
      <div className="relative overflow-hidden rounded-[10px] bg-[#323232] py-5 px-6">
        {/* Meteors inside the block, behind the text */}
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-[10px]"
          aria-hidden
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#FFE7D0]"
              style={{
                width: 72,
                height: 2,
                top: `${10 + i * 16}%`,
                left: `${5 + (i % 3) * 32}%`,
                animation: "meteor 0.5s linear infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        <div
          className="relative z-10 flex w-full items-center justify-center font-outfit font-bold uppercase tracking-[-0.05em] text-[#FFE7D0] whitespace-nowrap"
          style={{ fontSize: "clamp(1.5rem, 6vw, 2.5rem)" }}
        >
          {t("beyondCode.title")}
        </div>
      </div>
    </section>
  );
}
