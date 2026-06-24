import { site } from "@/lib/site";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  formation?: string;
  financement?: string;
  message: string;
};

const wrap = (inner: string) => `
  <div style="font-family:Inter,Arial,sans-serif;background:#050505;color:#f5f5f5;padding:40px">
    <div style="max-width:560px;margin:0 auto;background:#0a0a0a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden">
      <div style="height:3px;background:linear-gradient(135deg,#c9a84c,#e2c87a,#c9a84c)"></div>
      <div style="padding:32px">
        <div style="font-family:Georgia,serif;font-size:22px;color:#c9a84c;letter-spacing:0.04em">${site.name}</div>
        ${inner}
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:28px 0" />
        <div style="font-size:12px;color:rgba(245,245,245,0.5)">${site.name} — ${site.city} · ${site.email}</div>
      </div>
    </div>
  </div>`;

export function buildNotificationEmail(d: ContactPayload) {
  const row = (label: string, value?: string) =>
    value ? `<p style="margin:6px 0"><strong style="color:#c9a84c">${label} :</strong> ${value}</p>` : "";
  return wrap(`
    <h1 style="font-family:Georgia,serif;font-weight:600;font-size:24px;margin:16px 0 8px">Nouvelle demande de contact</h1>
    ${row("Nom", d.name)}
    ${row("Email", d.email)}
    ${row("Téléphone", d.phone)}
    ${row("Structure", d.company)}
    ${row("Formation souhaitée", d.formation)}
    ${row("Financement envisagé", d.financement)}
    <p style="margin:16px 0 6px"><strong style="color:#c9a84c">Message :</strong></p>
    <p style="white-space:pre-wrap;line-height:1.6">${d.message}</p>
  `);
}

export function buildConfirmationEmail(d: ContactPayload) {
  return wrap(`
    <h1 style="font-family:Georgia,serif;font-weight:600;font-size:24px;margin:16px 0 8px">Nous avons bien reçu votre demande</h1>
    <p style="line-height:1.6;color:rgba(245,245,245,0.8)">Bonjour ${d.name},</p>
    <p style="line-height:1.6;color:rgba(245,245,245,0.8)">
      Merci de votre intérêt pour ${site.name}. Notre équipe étudie votre demande et reviendra vers vous
      sous 48&nbsp;heures ouvrées pour échanger sur votre projet de formation et les financements mobilisables.
    </p>
    <p style="line-height:1.6;color:rgba(245,245,245,0.8)">À très bientôt,<br/>L'équipe ${site.name}</p>
  `);
}
