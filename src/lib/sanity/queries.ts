import { groq } from "next-sanity";
import { sanityClient, sanityEnabled } from "./client";

export const realisationsQuery = groq`
  *[_type == "realisation"] | order(featured desc, year desc) {
    _id, title, "slug": slug.current, client, category, summary,
    coverImage, services, year, featured
  }
`;

export const realisationBySlugQuery = groq`
  *[_type == "realisation" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, client, category, summary,
    description, coverImage, galleryImages, services, year, seo
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(featured desc) {
    _id, name, role, company, avatar, quote, rating
  }
`;

export type Realisation = {
  _id: string;
  title: string;
  slug: string;
  client?: string;
  category?: string;
  summary?: string;
  coverImage?: unknown;
  services?: string[];
  year?: number;
  featured?: boolean;
};

export type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: unknown;
  quote: string;
  rating?: number;
};

/** Récupère les réalisations depuis Sanity, ou [] si Sanity n'est pas encore configuré. */
export async function getRealisations(): Promise<Realisation[]> {
  if (!sanityEnabled) return [];
  try {
    return await sanityClient.fetch(realisationsQuery, {}, { next: { revalidate: 60 } });
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!sanityEnabled) return [];
  try {
    return await sanityClient.fetch(testimonialsQuery, {}, { next: { revalidate: 60 } });
  } catch {
    return [];
  }
}
