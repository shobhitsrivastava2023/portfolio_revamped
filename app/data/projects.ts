export type ProjectSection = {
  heading: string;
  paragraphs: string[];
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  /** Cover image. Projects without a screenshot show `stats` instead. */
  image?: string;
  imageAlt?: string;
  /** Headline numbers shown as the cover when there is no image */
  stats?: { value: string; label: string }[];
  /** Short description for the card */
  description: string;
  /** e.g. "Java 21 · gRPC · Docker" */
  stack: string;
  /** Write-up for the project detail page */
  sections: ProjectSection[];
  githubUrl: string;
  liveUrl: string;
  /** Optional demo/walkthrough link (e.g. LinkedIn post) */
  demoUrl?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "raftkv",
    name: "RaftKV",
    tagline: "Raft consensus from scratch, as a distributed key-value store",
    stats: [
      { value: "152/s", label: "writes, 3-node cluster" },
      { value: "210 ms", label: "p99 write latency" },
      { value: "631 ms", label: "leader failover" },
      { value: "1,000", label: "fault simulations" },
    ],
    description:
      "A distributed key-value store in Java 21 with Raft written from scratch: leader election, log replication, snapshots, crash recovery and exactly-once writes. Tested by a simulator that runs a 5-node cluster through 1,000 randomized fault scenarios.",
    stack: "Java 21 · gRPC · Protobuf · Docker",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "RaftKV is a small key-value store that stays consistent across a cluster of machines, even when some of them crash or the network loses messages. It implements the Raft consensus algorithm without a Raft library, in about 2,000 lines of Java: leader election, log replication, persistence and crash recovery, snapshots, linearizable reads with ReadIndex, and exactly-once client writes.",
        ],
      },
      {
        heading: "How it's tested",
        paragraphs: [
          "The core node only touches the network, the disk and the clock through three interfaces. In production those are gRPC, files and the system clock. In tests they are a simulated network, in-memory disks and a fake clock, so a whole 5-node cluster runs in one thread and every run can be replayed from a seed.",
          "The randomized simulation runs 1,000 seeds with network partitions, up to 30% message loss, reordering and node restarts. After every event it checks the safety rules: at most one leader per term, no node ever applies a different command at the same index, and every acknowledged write is still readable at the end.",
        ],
      },
      {
        heading: "Testing the tests",
        paragraphs: [
          "To see whether the simulation actually catches bugs, I broke the code on purpose. Removing the election restriction fails on the very first seed. Removing the rule that a leader only commits entries from its own term was not caught in 1,000 random seeds, because it needs one exact interleaving to show up. So there is a separate test that replays Figure 8 of the Raft paper message by message, and it fails when that rule is removed.",
        ],
      },
      {
        heading: "Numbers, and what I'd change",
        paragraphs: [
          "On a 3-node Docker cluster on my laptop it handles about 152 writes per second, with a p50 of 105 ms and a p99 of 210 ms. When the leader is killed, the cluster accepts writes again after a median of 631 ms.",
          "Throughput is limited by fsync. The leader syncs every write to disk separately, and one synced write inside Docker on that machine takes about 6.7 ms. Group commit, where several writes share one fsync, is the obvious next step.",
        ],
      },
    ],
    githubUrl: "https://github.com/shobhitsrivastava2023/raftkv",
    liveUrl: "#",
  },
  {
    slug: "non-linear-workflows",
    name: "NonLinear Workflows",
    tagline: "Workflow engine for multi-step AI agents",
    image: "/project1.jpg",
    imageAlt: "NonLinear Workflows app",
    description:
      "A backend for AI agents that run multi-step workflows across 300+ third-party tools through the Composio SDK, with a Redis-backed shared state store, job queues and automatic retries.",
    stack: "TypeScript · Node.js · Next.js · Redis · PostgreSQL · OAuth 2.0",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "NonLinear Workflows lets you describe a task that spans several apps, and an AI agent carries it out step by step. Tool access goes through the Composio SDK, which gives the agent 300+ third-party integrations like email, calendars and docs.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "Each workflow step reads from and writes to a shared context stored in Redis, so a step can pick up what the previous one produced without rebuilding the agent's state. That cut agent setup time by about 90%.",
          "When a step fails, the pipeline runs again with adjusted parameters instead of repeating the same call. With that in place, about 95% of workflows finish successfully.",
        ],
      },
      {
        heading: "The plumbing",
        paragraphs: [
          "Most of the work was everything around the agent: the full OAuth 2.0 token lifecycle for connected accounts, webhook ingestion, rate limiting for external APIs, and background job queues so long workflows don't hold up requests.",
        ],
      },
    ],
    githubUrl: "https://github.com/shobhitsrivastava2023/Non-Linear-WorkFlows-",
    liveUrl: "https://non-linear-work-flows.vercel.app/",
    demoUrl:
      "https://www.linkedin.com/posts/shobhit-srivastava-s1323_this-summer-break-i-built-around-26-different-activity-7361292978176352257-qPXz?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD4x6noBeLC9v2gWCC6nZUTSZaWs1kaxe8M",
  },
  {
    slug: "lexel",
    name: "LEXEL",
    tagline: "AI voice platform that checks its own output",
    image: "/project2.png",
    imageAlt: "LEXEL app",
    description:
      "A full-stack voice platform on Chatterbox TTS: voice cloning, live transcription and a real-time voice agent. An LLM scores each output and synthesis re-runs until it meets a quality bar.",
    stack: "TypeScript · Next.js · tRPC · Prisma · PostgreSQL · Cloudflare R2",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "LEXEL turns scripts into voiceovers using built-in voices or a cloned one. It also does live transcription and has a real-time streaming voice agent. Speech comes from a self-hosted pipeline built on Chatterbox TTS.",
        ],
      },
      {
        heading: "Automatic quality checks",
        paragraphs: [
          "Instead of relying on someone to listen to every output, LEXEL checks its own work. An LLM (Claude) acts as a judge and scores each clip on naturalness, clarity and intelligibility, the same dimensions used for MOS ratings. If a clip scores below the threshold, synthesis runs again with corrected parameters.",
        ],
      },
      {
        heading: "Stack",
        paragraphs: [
          "The API layer is typed end to end with tRPC and Prisma on PostgreSQL. Audio is stored in Cloudflare R2. It has auth and billing, and the whole thing runs in containers.",
        ],
      },
    ],
    githubUrl: "https://github.com/shobhitsrivastava2023/lexel",
    liveUrl: "#",
  },
  {
    slug: "enigma",
    name: "Enigma",
    tagline: "Enigma machine simulator, rotors to reflector",
    image: "/project3.png",
    imageAlt: "Enigma simulator app",
    description:
      "A simulator of the M3/M4 Enigma machines in TypeScript, with a view that shows each letter's path through the plugboard, rotors and reflector as you type.",
    stack: "TypeScript · Next.js",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "A simulator of the Enigma machines used in the Second World War, built to follow the real M3 and M4 models as closely as possible: rotor stepping, plugboard swaps and reflector wiring all work the way the hardware did.",
        ],
      },
      {
        heading: "Seeing inside it",
        paragraphs: [
          "The cipher state stays visible while you type. For every key press you can follow the letter through the plugboard, each rotor, the reflector and back out again, so the encryption is something you can trace rather than a black box.",
        ],
      },
    ],
    githubUrl: "https://github.com/shobhitsrivastava2023/Enigma",
    liveUrl: "https://enigma-nine-ashy.vercel.app/",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
