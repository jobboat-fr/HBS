import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Veuillez indiquer votre nom.").max(100),
  email: z.string().email("Adresse email invalide."),
  phone: z.string().max(30).optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  formation: z.string().max(120).optional().or(z.literal("")),
  financement: z
    .enum(["cpf", "opco", "entreprise", "france_travail", "personnel", "region", "autre"])
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Votre message doit comporter au moins 10 caractères.")
    .max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;
