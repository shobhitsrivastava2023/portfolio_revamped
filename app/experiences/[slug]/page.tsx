import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";
import { getExperienceBySlug, EXPERIENCES } from "../../data/experience";

const CONTENT_WIDTH = 562;

export function generateStaticParams() {
  return EXPERIENCES.map((e) => ({ slug: e.slug }));
}

export default function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const experience = getExperienceBySlug(slug);
  if (!experience) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFE7D0] font-sans">
      <main className="flex w-full max-w-[562px] flex-col items-center px-4">
        <Navbar />
        <article
          className="flex w-full max-w-[562px] flex-col"
          style={{ marginTop: 50 }}
        >
          <BackButton />

          <div
            className="mt-6 flex w-full flex-col gap-2 max-[562px]:flex-col min-[563px]:flex-row min-[563px]:items-start min-[563px]:justify-between min-[563px]:gap-6"
            style={{ marginBottom: 40 }}
          >
            <h1
              className="min-w-0 font-outfit font-medium text-[#1B1B1B] min-[563px]:flex-1 max-[562px]:text-[clamp(2rem,14vw,80px)]"
              style={{
                fontSize: 80,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              {experience.company}
              <br />
              <span className="max-[562px]:text-[clamp(1.5rem,10vw,48px)]" style={{ fontSize: 48 }}>{experience.role}</span>
            </h1>
            <p
              className="shrink-0 font-outfit font-medium text-[#1B1B1B]/80 text-sm min-[563px]:text-base"
              style={{ letterSpacing: "normal" }}
            >
              {experience.duration}
            </p>
          </div>

          <div
            className="w-full font-outfit font-medium text-[#1B1B1B] text-justify"
            style={{
              fontSize: 24,
              letterSpacing: "normal",
            }}
          >
            {experience.details.map((paragraph, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          <div style={{ marginBottom: 60 }} />
        </article>
      </main>
    </div>
  );
}
