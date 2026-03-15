"use client";

import { useLanguage } from "../context/LanguageContext";

export default function Philosophy() {
  const { t } = useLanguage();
  return (
    <section
      id="philosophy"
      className="flex w-full max-w-[562px] flex-col items-center text-center"
      style={{ marginTop: 66 }}
    >
      <h2
        className="font-outfit font-medium text-[#1B1B1B] w-full max-w-[562px] text-center max-[562px]:text-left"
        style={{
          fontSize: "clamp(3rem, 22vw, 120px)",
          letterSpacing: "-0.05em",
        }}
      >
        {t("philosophy.title")}
      </h2>
      <p
        className="font-outfit font-medium text-[#1B1B1B] w-full max-w-[562px] text-justify max-[562px]:leading-[1.6]"
        style={{
          marginTop: 50,
          fontSize: "clamp(0.875rem, 4vw, 24px)",
          letterSpacing: "-0.05em",
          lineHeight: 1.5,
        }}
      >
        {t("philosophy.body")}
      </p>
    </section>
  );
}
