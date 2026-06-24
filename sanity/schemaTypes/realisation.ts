import { defineField, defineType } from "sanity";

export const realisation = defineType({
  name: "realisation",
  title: "Réalisation",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "client", title: "Client / partenaire", type: "string" }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          "Formation certifiante",
          "Bilan de compétences",
          "VAE",
          "Apprentissage",
          "E-learning",
          "Conseil",
        ],
      },
    }),
    defineField({ name: "coverImage", title: "Image de couverture", type: "image", options: { hotspot: true } }),
    defineField({ name: "galleryImages", title: "Galerie", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "summary", title: "Résumé", type: "text", rows: 3 }),
    defineField({ name: "description", title: "Description", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "services", title: "Prestations", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "year", title: "Année", type: "number" }),
    defineField({ name: "featured", title: "Mise en avant", type: "boolean", initialValue: false }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", title: "Meta title", type: "string" },
        { name: "metaDescription", title: "Meta description", type: "text" },
      ],
    }),
  ],
  orderings: [
    {
      title: "Mises en avant d'abord",
      name: "featuredDesc",
      by: [
        { field: "featured", direction: "desc" },
        { field: "year", direction: "desc" },
      ],
    },
  ],
});
