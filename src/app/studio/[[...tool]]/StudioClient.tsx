"use client";

import dynamic from "next/dynamic";

// Le Studio Sanity est strictement côté navigateur (createContext, etc.).
const Studio = dynamic(() => import("./StudioInner"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>Chargement du studio…</div>
  ),
});

export default function StudioClient() {
  return <Studio />;
}
