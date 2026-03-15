export type Project = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  imageAlt: string;
  /** Short description for the card */
  description: string;
  /** Paragraphs for the project detail page */
  details: string[];
  githubUrl: string;
  liveUrl: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "non-linear-workflows",
    name: "NonLinear Workflows",
    tagline: "AI-Powered Workflow Automation SaaS",
    image: "/project1.jpg",
    imageAlt: "NonLinear Workflows app",
    description:
      "AI orchestration platform using Composio SDK to connect 300+ tools and run multi-step agent workflows. Redis-backed context store cut agent setup time by 90%; adaptive retry orchestration reached 95% workflow success. OAuth 2.0, webhooks, rate limiting, and job queuing implemented end-to-end.",
    details: [
      "Engineered an AI orchestration platform leveraging Composio SDK to connect 300+ third-party tools, enabling users to build multi-step programmable agent workflows.",
      "Designed Redis-backed context store for agent orchestration: each workflow step reads and writes shared context, enabling low-latency task execution and reducing agent setup time by 90%.",
      "Built resilient retry orchestration with adaptive flags: on failure, the system re-runs the pipeline with modified parameters to optimize output quality, achieving a 95% workflow success rate.",
      "Implemented full OAuth 2.0 token lifecycle, webhook ingestion, rate limiting, and background job queuing end-to-end.",
    ],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "lexel",
    name: "LEXEL",
    tagline: "Self Hosted AI voice generative Web App with Live translation",
    image: "/project2.png",
    imageAlt: "LEXEL app",
    description:
      "LEXEL is an AI text-to-speech and voice-cloning platform where users can turn scripts into voiceovers with system or custom cloned voices, do live translation in 23 languages, and rate outputs with MOS scores (naturalness, clarity, intelligibility). The app includes a dark themed dashboard; audio is stored in R2 and TTS is powered by a self hosted AI pipeline.",
    details: [
      "LEXEL is an AI text-to-speech and voice-cloning platform where users can turn scripts into voiceovers with system or custom cloned voices, do live translation in 23 languages, and rate outputs with MOS scores (naturalness, clarity, intelligibility).",
      "The app includes a dark themed dashboard; audio is stored in R2 and TTS is powered by a self hosted AI pipeline.",
    ],
    githubUrl: "#",
    liveUrl: "#",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
