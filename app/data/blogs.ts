export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
};

export const BLOGS: BlogPost[] = [
  {
    slug: "in-this-time-of-ai-everything-is-about-building",
    title: "In this time of AI everything is about building",
    excerpt:
      "Why shipping fast and iterating in public matters more than waiting for the perfect idea.",
    date: "2025-01-15",
    content: `
      <p>We're in a moment where AI is changing how we build—but the best way to learn is still by building.</p>
      <p>Waiting for the "right" idea or the perfect stack means someone else is already shipping. The gap between thinking and doing has never been smaller: you can go from idea to prototype in a weekend.</p>
      <p>This post is a placeholder. Replace with your own thoughts on building in the age of AI, side projects, and why execution still beats perfection.</p>
    `,
  },
  {
    slug: "the-hidden-cost-of-automation-nobody-talks-about",
    title: "The Hidden Cost of Automation Nobody Talks About",
    excerpt:
      "What we give up when we automate too much, too soon.",
    date: "2024-11-03",
    content: `
      <p>Automation promises to save time and reduce errors. But it also hides a cost: we stop understanding how things work.</p>
      <p>When every step is abstracted away, debugging becomes guesswork. When we never touch the low-level details, we lose the intuition that helps us design better systems.</p>
      <p>This post is a placeholder. Add your own take on when to automate and when to keep things manual.</p>
    `,
  },
  {
    slug: "what-i-wish-i-knew-before-graduating",
    title: "What I Wish I Knew Before Graduating",
    excerpt:
      "A few things that would have made the jump from college to industry a bit smoother.",
    date: "2024-08-20",
    content: `
      <p>Graduation feels like a finish line, but it's really the start of a different kind of learning.</p>
      <p>I wish I'd known how much communication matters—code is only half the job. I wish I'd practiced reading legacy code and writing clear PRs. And I wish I'd been less afraid of asking "dumb" questions.</p>
      <p>This post is a placeholder. Share your own lessons for new grads and career switchers.</p>
    `,
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOGS.find((b) => b.slug === slug);
}
