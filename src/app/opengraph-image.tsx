import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HBS FORMATION — organisme de formation à Rouen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#10B8AA"/><stop offset="1" stop-color="#22C3B1"/></linearGradient></defs><rect width="48" height="48" rx="13" fill="url(#g)"/><path d="M24 12 L40 19 L24 26 L8 19 Z" fill="#fff"/><path d="M15 22 L24 25.4 L33 22 L33 29 C33 31.3 29 33 24 33 C19 33 15 31.3 15 29 Z" fill="#fff"/><circle cx="24" cy="19" r="1.4" fill="#FF6B5B"/><line x1="40" y1="19" x2="40" y2="27.4" stroke="#FF6B5B" stroke-width="1.8" stroke-linecap="round"/><circle cx="40" cy="29" r="1.9" fill="#FF6B5B"/></svg>`;

export default function Og() {
  const logo = `data:image/svg+xml,${encodeURIComponent(logoSvg)}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B2239",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={96} height={96} alt="" />
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#fff" }}>
            HBS
            <span style={{ color: "#22C3B1" }}>&nbsp;FORMATION</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
            Montez en compétences,
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#22C3B1", lineHeight: 1.05 }}>
            à votre rythme.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.8)" }}>
            Formations certifiantes · Bilan de compétences · VAE · Alternance
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 26, color: "#22C3B1", fontWeight: 600 }}>
          <span>Éligible CPF · OPCO · France Travail</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>· Rouen & à distance</span>
        </div>
      </div>
    ),
    size,
  );
}
