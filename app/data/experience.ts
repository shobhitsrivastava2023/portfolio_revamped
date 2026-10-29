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
    slug: "skaya",
    company: "Skaya",
    role: "SDE",
    description:
      "Built the payment integration for a booking platform with 30-40K users, from checkout flow to gateway failure handling. Also rebuilt three booking flows as typed TypeScript components.",
    details: [
      "Skaya is a consumer booking platform with around 30 to 40 thousand users. I worked there remotely as a software development engineer from July to November 2025.",
      "My main piece of work was the payment integration. I designed the checkout flow, wrote the REST APIs behind it, and integrated the payment gateway SDK, including what happens when a payment fails, times out, or comes back in an unexpected state. This is what unblocked revenue collection on the platform.",
      "I also rebuilt parts of three of the busiest booking flows as typed, modular TypeScript components, including a debounced real-time search. That cut down runtime errors and made changes to those flows quicker to ship.",
    ],
    duration: "Jul 2025 - Nov 2025",
  },
  {
    slug: "upwork",
    company: "Upwork",
    role: "Freelance",
    description:
      "24+ projects for clients in the UK and India: dashboards, storefronts and third-party API integrations, usually as the only developer from requirements to post-launch support.",
    details: [
      "I've been freelancing on Upwork since 2023, mostly for small businesses in the UK and India. So far that's 24+ projects: dashboards, storefronts, and integrations with third-party APIs.",
      "On most of them I was the only developer, so I handled the whole thing: working out requirements with the client, designing the system, building and testing it, deploying it, and supporting it after launch.",
      "A good share of the work was fixing production issues on live client systems, often for people in a different time zone and against a fixed deadline. It taught me to turn a vague business request into a spec I could actually build against.",
    ],
    duration: "2023 - Present",
  },
  {
    slug: "deloitte",
    company: "Deloitte",
    role: "Capstone",
    description:
      "National capstone program. Our team placed in the top 10 out of 700+ teams and presented the solution to Deloitte leadership.",
    details: [
      "A national capstone program run by Deloitte from March to June 2025. Our team placed in the top 10 out of more than 700 teams.",
      "We built a production-grade solution end to end, with mentorship from Deloitte's senior engineers, and presented it to Deloitte leadership at the end of the program.",
    ],
    duration: "Mar 2025 - Jun 2025",
  },
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return EXPERIENCES.find((e) => e.slug === slug);
}
