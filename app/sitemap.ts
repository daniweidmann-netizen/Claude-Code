import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data/site";
import { projects } from "@/lib/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/arbeiten`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/impressum`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/datenschutz`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/arbeiten/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
