import type { Metadata } from "next";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";
import ProjectActionLinks from "../../components/ProjectActionLinks";
import ProjectCover from "../../components/ProjectCover";
import { getProjectBySlug, PROJECTS } from "../../data/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = getProjectBySlug((await params).slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
    openGraph: {
      title: project.name,
      description: project.tagline,
      ...(project.image && { images: [project.image] }),
    },
  };
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const from = search?.from;
  const backHref = from ? `/?section=${from}` : "/";

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
          <BackButton href={backHref} />
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

          <ViewTransition name={`project-cover-${project.slug}`}>
            <div
              className="relative w-full max-w-[562px] overflow-hidden rounded-[10px] max-[562px]:aspect-[562/359] min-[563px]:h-[359px]"
              style={{ marginTop: 24 }}
            >
              <ProjectCover
                project={project}
                size="page"
                sizes="(max-width: 562px) 100vw, 562px"
                priority
              />
            </div>
          </ViewTransition>

          <p
            className="mt-4 w-full font-outfit font-medium text-[#323232]/80"
            style={{ fontSize: 14, letterSpacing: "-0.03em" }}
          >
            {project.stack}
          </p>

          <div
            className="mt-10 w-full font-outfit font-medium text-[#1B1B1B] text-justify"
            style={{
              fontSize: 24,
              letterSpacing: "normal",
            }}
          >
            {project.sections.map((section) => (
              <section key={section.heading} className="mb-10 last:mb-0">
                <h2
                  className="mb-3 text-[#FC6E20]"
                  style={{ fontSize: 32, letterSpacing: "-0.06em", lineHeight: 1.1 }}
                >
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="mb-5 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <ProjectActionLinks
            githubUrl={project.githubUrl}
            liveUrl={project.liveUrl}
            demoUrl={project.demoUrl}
          />
        </article>
      </main>
    </div>
  );
}
