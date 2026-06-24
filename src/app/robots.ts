import { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/espace-client/", "/studio/", "/api/", "/connexion", "/inscription"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
