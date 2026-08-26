import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://tatuki1107-portfolio.vercel.app",
      lastModified: new Date("2026-08-26"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

