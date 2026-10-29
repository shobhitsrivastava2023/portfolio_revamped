import Image from "next/image";
import type { Project } from "../data/projects";

/**
 * Fills a `relative` container with the project's image, or with its
 * headline numbers when there is no screenshot.
 */
export default function ProjectCover({
  project,
  size,
  sizes,
  priority,
}: {
  project: Project;
  size: "card" | "page";
  sizes: string;
  priority?: boolean;
}) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={project.imageAlt ?? project.name}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    );
  }

  const page = size === "page";
  // Card covers sit in an @container tile, so cqw here is a share of the tile's width.
  return (
    <div
      className="absolute inset-0 grid grid-cols-2 bg-[#323232] font-outfit font-medium text-[#FFE7D0]"
      style={{
        padding: page ? 28 : "clamp(8px, 4.5cqw, 12px)",
        gap: page ? 20 : "clamp(4px, 3cqw, 8px)",
      }}
      role="img"
      aria-label={`${project.name}: ${(project.stats ?? []).map((s) => `${s.value} ${s.label}`).join(", ")}`}
    >
      {(project.stats ?? []).map((s) => (
        <div key={s.label} className="flex flex-col justify-end">
          <span
            className={page ? "text-[clamp(1.75rem,9vw,52px)]" : undefined}
            style={{
              fontSize: page ? undefined : "clamp(14px, 8.3cqw, 22px)",
              letterSpacing: "-0.08em",
              lineHeight: 1,
            }}
          >
            {s.value}
          </span>
          <span
            className="opacity-80"
            style={{
              marginTop: page ? 6 : 2,
              fontSize: page ? 14 : "clamp(8px, 3.8cqw, 10px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
