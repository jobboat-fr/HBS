import { MetadataRoute } from "next";
import { site } from "@/lib/site";

const PRIVATE_PATHS = ["/espace-client/", "/studio/", "/api/", "/connexion", "/inscription"];

// Crawlers derrière les moteurs de réponse IA (ChatGPT, Perplexity, Google AI Overviews,
// Claude...) — explicitement autorisés en plus du user-agent générique, pour la visibilité
// dans la recherche assistée par IA.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE_PATHS })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
