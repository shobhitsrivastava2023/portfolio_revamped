import { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";
import ProjectActionLinks from "../../components/ProjectActionLinks";
import { getProjectBySlug, PROJECTS } from "../../data/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const displayName = project.name === "NonLinear Workflows"
    ? { line1: "Non Linear", line2: "Workflows" }
    : { line1: project.name, line2: null };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFE7D0] font-sans">
      <main className="flex w-full max-w-[562px] flex-col items-center px-4">
        <Navbar />
        <article
          className="flex w-full max-w-[562px] flex-col items-center"
          style={{ marginTop: 50 }}
        >
          <BackButton />
          <h1
            className="mt-6 w-full font-outfit font-medium text-[#1B1B1B] max-[562px]:text-[clamp(2rem,14vw,80px)]"
            style={{
              fontSize: 80,
              letterSpacing: "-0.1em",
              lineHeight: 1.1,
            }}
          >
            {displayName.line2 ? (
              <>
                {displayName.line1}
                <br />
                {displayName.line2}
              </>
            ) : (
              displayName.line1
            )}
          </h1>

          <div
            className="relative w-full max-w-[562px] overflow-hidden rounded-[10px] max-[562px]:aspect-[562/359] min-[563px]:h-[359px]"
            style={{ marginTop: 24 }}
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 562px) 100vw, 562px"
              priority
            />
          </div>

          <div
            className="mt-10 w-full font-outfit font-medium text-[#1B1B1B] text-justify"
            style={{
              fontSize: 24,
              letterSpacing: "normal",
            }}
          >
            {project.details.map((paragraph, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          <ProjectActionLinks
            githubUrl={project.githubUrl}
            liveUrl={project.liveUrl}
          />
        </article>
      </main>
    </div>
  );
}
