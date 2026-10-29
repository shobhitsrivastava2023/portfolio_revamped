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
  return (
    <div
      className="absolute inset-0 grid grid-cols-2 bg-[#323232] font-outfit font-medium text-[#FFE7D0]"
      style={{ padding: page ? 28 : 12, gap: page ? 20 : 8 }}
      role="img"
      aria-label={`${project.name}: ${(project.stats ?? []).map((s) => `${s.value} ${s.label}`).join(", ")}`}
    >
      {(project.stats ?? []).map((s) => (
        <div key={s.label} className="flex flex-col justify-end">
          <span
            className={page ? "text-[clamp(1.75rem,9vw,52px)]" : "text-[clamp(1.25rem,6vw,22px)]"}
            style={{ letterSpacing: "-0.08em", lineHeight: 1 }}
          >
            {s.value}
          </span>
          <span
            className="opacity-80"
            style={{ marginTop: page ? 6 : 2, fontSize: page ? 14 : 10, letterSpacing: "-0.03em" }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
