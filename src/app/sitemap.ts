import { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Seules les pages indexables. `/certifications` est en `noindex` (offre à venir) : la mettre
 * au sitemap envoie à Google un signal contradictoire. `/realisations` n'y figure pas tant
 * qu'elle est vide.
 */
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
    page("/planning", 1, "weekly"),
    page("/formations", 1, "weekly"),
    page("/formations/analyse-de-donnees", 0.95, "weekly"),
    page("/formations/creation-de-contenu", 0.95, "weekly"),
    page("/formations/marketing", 0.95, "weekly"),
    page("/pack-360", 0.95, "weekly"),
    page("/reserver", 0.95, "weekly"),
    page("/financement", 0.9),
    page("/entreprises", 0.85),
    page("/formation-ia-ai-act", 0.8),
    page("/formation-ia-rouen", 0.8),
    page("/faq", 0.8),
    page("/preinscription", 0.7, "weekly"),
    page("/a-propos", 0.6),
    page("/contact", 0.6, "yearly"),
    page("/cgv", 0.3, "yearly"),
    page("/cgu", 0.2, "yearly"),
  ];
}
