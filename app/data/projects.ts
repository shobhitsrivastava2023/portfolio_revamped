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
  /** Optional demo/walkthrough link (e.g. LinkedIn post) */
  demoUrl?: string;
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
    githubUrl: "https://github.com/shobhitsrivastava2023/Non-Linear-WorkFlows-",
    liveUrl: "https://non-linear-work-flows.vercel.app/",
    demoUrl:
      "https://www.linkedin.com/posts/shobhit-srivastava-s1323_this-summer-break-i-built-around-26-different-activity-7361292978176352257-qPXz?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD4x6noBeLC9v2gWCC6nZUTSZaWs1kaxe8M",
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
    githubUrl: "https://github.com/shobhitsrivastava2023/lexel",
    liveUrl: "#",
  },
  {
    slug: "enigma",
    name: "Enigma",
    tagline: "Most Accurate Enigma Simulator",
    image: "/project3.png",
    imageAlt: "Enigma simulator app",
    description:
      "Interactive Enigma machine simulator that recreates M3/M4 rotor logic in JavaScript, with live visualization of rotor stepping, plugboard swaps, and reflector wiring so you can trace every character through the cipher.",
    details: [
      "Built a custom JavaScript Enigma engine that faithfully simulates M3/M4 mechanical cipher logic, including dynamic rotor stepping, plugboard substitution, and reflector wiring, making the full encryption process inspectable in real time.",
      "Exposed internal cipher state through a visualization layer, allowing users to trace character substitutions through each rotor stage interactively.",
    ],
    githubUrl: "https://github.com/shobhitsrivastava2023/Enigma",
    liveUrl: "https://enigma-nine-ashy.vercel.app/",
  },
  {
    slug: "talkio",
    name: "Talkio",
    tagline: "Smart chat with timed and selective group messaging",
    image: "/project4.png",
    imageAlt: "Talkio chat app",
    description:
      "Real-time chat app with scheduled messages, selective group conversations, and rich user profiles, built on WebSocket-based messaging, per-user scheduling queues, and searchable conversation metadata.",
    details: [
      "Implemented timed messaging so users can schedule messages for a specific date and time; messages are persisted with execution metadata and dispatched by a server-side scheduler that fans out to the appropriate WebSocket rooms when due.",
      "Designed selective group messaging for formal teams: within a group, users can create task-specific subthreads that only involve selected members, while still inheriting the group context so assignments stay discoverable without polluting everyone’s main chat list.",
      "Built real-time chat delivery with WebSockets (or Socket.io), room-based subscriptions, and presence indicators so messages, read states, and member joins/leaves propagate instantly across devices.",
      "Added full auth and profile management: email/password sign-up and login, JWT session handling, editable bios and avatars, and privacy-aware profile fields surfaced in conversations.",
      "Implemented conversation and user search with indexed queries over message text, participants, and tags so users can jump directly to people, tasks, or groups from a single search box.",
    ],
    githubUrl: "#",
    liveUrl: "#",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
