import type { MetadataRoute } from "next";
import { BLOGS } from "./data/blogs";
import { EXPERIENCES } from "./data/experience";
import { PROJECTS } from "./data/projects";
import { SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...BLOGS.map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: new Date(b.date),
      priority: 0.7,
    })),
    ...PROJECTS.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, priority: 0.7 })),
    ...EXPERIENCES.map((e) => ({ url: `${SITE_URL}/experiences/${e.slug}`, priority: 0.5 })),
  ];
}
