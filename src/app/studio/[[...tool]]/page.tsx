import type { Metadata } from "next";
import { sanityEnabled } from "@/lib/sanity/client";
import StudioClient from "./StudioClient";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false },
};

export default function StudioPage() {
  if (!sanityEnabled) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui", color: "#111" }}>
        <h1>Sanity non configuré</h1>
        <p>
          Lancez <code>npx sanity init</code>, renseignez{" "}
          <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> dans <code>.env.local</code>, puis rechargez.
        </p>
      </div>
    );
  }
  return <StudioClient />;
}
