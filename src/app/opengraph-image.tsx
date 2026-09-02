import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HBS FORMATION — organisme de formation à Rouen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E5FE0"/><stop offset="1" stop-color="#0F2159"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#g)"/><path d="M10 17 Q24 6 38 17" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity="0.9"/></svg>`;

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
            <span style={{ color: "#D9DCE1" }}>&nbsp;FORMATION</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>
            Montez en compétences,
          </div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#D9DCE1", lineHeight: 1.05 }}>
            à votre rythme.
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.8)" }}>
            Formations certifiantes · Bilan de compétences · VAE · Alternance
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 26, color: "#D9DCE1", fontWeight: 600 }}>
          <span>Éligible CPF · OPCO · France Travail</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>· Rouen & à distance</span>
        </div>
      </div>
    ),
    size,
  );
}
