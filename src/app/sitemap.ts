import { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({ url: `${base}${path}`, lastModified: now, changeFrequency, priority });

  return [
    page("", 1, "weekly"),
    page("/formations", 0.9),
    page("/alternance", 0.8),
    page("/financement", 0.8),
    page("/entreprises", 0.8),
    page("/realisations", 0.7, "weekly"),
    page("/a-propos", 0.6),
    page("/contact", 0.9, "yearly"),
  ];
}
