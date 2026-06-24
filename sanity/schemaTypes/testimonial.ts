import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Témoignage",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Fonction", type: "string" }),
    defineField({ name: "company", title: "Structure", type: "string" }),
    defineField({ name: "avatar", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "quote", title: "Citation", type: "text", validation: (r) => r.required() }),
    defineField({
      name: "rating",
      title: "Note",
      type: "number",
      options: { list: [3, 4, 5] },
      initialValue: 5,
    }),
    defineField({ name: "featured", title: "Mise en avant", type: "boolean", initialValue: false }),
  ],
});
