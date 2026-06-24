"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { formations, financements } from "@/lib/site";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Une erreur est survenue. Merci de réessayer.");
      setSubmitted(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Erreur inconnue.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 size={48} className="text-teal-500" />
        <h3 className="font-display text-2xl font-bold text-ink">Demande envoyée</h3>
        <p className="max-w-sm text-ink-soft">
          Merci ! Notre équipe revient vers vous sous 48&nbsp;heures ouvrées pour étudier votre projet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom complet *</Label>
          <Input id="name" {...register("name")} placeholder="Jean Dupont" />
          <FieldError>{errors.name?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="jean@exemple.fr" />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" {...register("phone")} placeholder="06 12 34 56 78" />
          <FieldError>{errors.phone?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="company">Structure / entreprise</Label>
          <Input id="company" {...register("company")} placeholder="Votre organisation" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="formation">Formation souhaitée</Label>
          <Select id="formation" defaultValue="" {...register("formation")}>
            <option value="">— Sélectionnez —</option>
            {formations.map((f) => (
              <option key={f.slug} value={f.title}>
                {f.title}
              </option>
            ))}
            <option value="Autre">Autre</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="financement">Financement envisagé</Label>
          <Select id="financement" defaultValue="" {...register("financement")}>
            <option value="">— Sélectionnez —</option>
            {financements.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">Votre message *</Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Décrivez votre projet, vos objectifs, votre disponibilité…"
        />
        <FieldError>{errors.message?.message}</FieldError>
      </div>

      {serverError ? <p className="text-sm text-coral-dark">{serverError}</p> : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Envoi en cours…
          </>
        ) : (
          "Envoyer ma demande"
        )}
      </Button>
      <p className="text-center text-xs text-ink-muted">
        En envoyant ce formulaire, vous acceptez d&apos;être recontacté par {""}
        HBS FORMATION au sujet de votre demande.
      </p>
    </form>
  );
}
