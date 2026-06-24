import { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/formations`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/realisations`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.9 },
  ];
}
