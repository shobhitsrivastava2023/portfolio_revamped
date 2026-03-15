export type Experience = {
  slug: string;
  company: string;
  role: string;
  /** Short description for the card */
  description: string;
  /** Paragraphs for the experience detail page */
  details: string[];
  /** e.g. "Jan 2024 - May 2024" */
  duration: string;
};

export const EXPERIENCES: Experience[] = [
  {
    slug: "deloitte",
    company: "Deloitte",
    role: "Project Intern",
    description:
      "Selected out of 700+ teams nationwide for the Deloitte case study challenge. Worked on real-world consulting problem statements and delivered data-driven recommendations.",
    details: [
      "Selected out of 700+ teams nationwide for the Deloitte case study challenge. Worked on real-world consulting problem statements and delivered data-driven recommendations.",
      "Analyzed complex business problems and built data-driven models to support strategic decisions. Collaborated with cross-functional teams to present findings and recommendations to stakeholders.",
    ],
    duration: "Jun 2024 - Aug 2024",
  },
  {
    slug: "curiate-solutions",
    company: "curiate solutions",
    role: "SDE Intern",
    description:
      "Contributed to fullstack product development. Built features and fixed bugs across the stack in an agile team.",
    details: [
      "Contributed to fullstack product development. Built features and fixed bugs across the stack in an agile team.",
      "Participated in sprint planning, code reviews, and deployment pipelines. Worked with React, Node.js, and cloud services to ship user-facing features and improve system reliability.",
    ],
    duration: "Jan 2024 - May 2024",
  },
  {
    slug: "pratwear",
    company: "Pratwear",
    role: "Developer",
    description:
      "Helped build and maintain the company's web presence and internal tools. Focus on clean UI and performance.",
    details: [
      "Helped build and maintain the company's web presence and internal tools. Focus on clean UI and performance.",
      "Developed responsive front-end components and integrated with backend APIs. Optimized page load times and improved accessibility and cross-browser compatibility.",
    ],
    duration: "Sep 2023 - Dec 2023",
  },
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return EXPERIENCES.find((e) => e.slug === slug);
}
