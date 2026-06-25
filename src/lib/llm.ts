import { site, faqs, formations } from "@/lib/site";

/**
 * Couche IA (serveur uniquement). Compatible OpenAI Chat Completions :
 * fonctionne avec OpenAI, OpenRouter, le routeur HF/AZZCO, Together, etc.
 * Activée dès que LLM_API_KEY est défini (sinon le site retombe sur la FAQ locale).
 */

function systemPrompt(page?: string): string {
  const faq = faqs.map((f) => `Q: ${f.q}\nR: ${f.a}`).join("\n\n");
  const domaines = formations.map((f) => `- ${f.title} : ${f.tagline}`).join("\n");
  return `Tu es « Hub », le copilote de ${site.name}, organisme de formation à ${site.city}.
Tu réponds EN FRANÇAIS, en vouvoyant, sur un ton chaleureux et professionnel, en phrases courtes (4 phrases maximum).
Ton rôle : aider le visiteur à choisir une formation et à comprendre les financements, puis l'orienter vers la bonne page.

Domaines proposés :
${domaines}

Financements possibles : CPF, OPCO, France Travail, plan de développement des compétences (entreprise), Région, financement personnel.
Délai : un conseiller recontacte sous 48 h ouvrées.

Règles STRICTES :
- N'invente jamais de chiffres, de taux de réussite, de témoignages, ni de certifications (pas de Qualiopi tant qu'il n'est pas obtenu).
- Pour une demande précise (devis, inscription, éligibilité personnelle), invite à utiliser la page Contact.
- Si tu ne sais pas, propose d'en parler à un conseiller.
- Reste fidèle aux informations ci-dessous, ne promets rien d'autre.

FAQ de référence :
${faq}
${page ? `\nLe visiteur est sur la page : ${page}.` : ""}`;
}

export async function aiAnswer(message: string, page?: string): Promise<string | null> {
  const key = process.env.LLM_API_KEY;
  if (!key) return null;
  const base = (process.env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.LLM_MODEL || "gpt-4o-mini";

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 320,
        messages: [
          { role: "system", content: systemPrompt(page) },
          { role: "user", content: message },
        ],
      }),
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}
