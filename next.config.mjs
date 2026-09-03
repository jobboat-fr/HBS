// CSP pour le site public. 'unsafe-inline' sur script-src/style-src reste nécessaire tant
// que Next.js (hydratation, __NEXT_DATA__) et Tailwind/framer-motion (styles inline) ne
// sont pas migrés vers un CSP à base de nonce — c'est un vrai renforcement par rapport à
// l'absence totale de CSP, pas une politique parfaite.
const SITE_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://cdn.sanity.io",
  "font-src 'self' data:",
  // Domaine Supabase explicite plutôt qu'un wildcard *.supabase.co — à mettre à jour si le
  // projet change (voir NEXT_PUBLIC_SUPABASE_URL).
  "connect-src 'self' https://tdabohyicldueniapsvp.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "media-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Sanity Studio (/studio) est un client lourd derrière l'auth Sanity — pas la surface
// publique que le CSP ci-dessus protège. Politique large pour ne pas casser l'éditeur.
const STUDIO_CSP = [
  "default-src 'self' https: data: blob:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
  "style-src 'self' 'unsafe-inline' https:",
  "connect-src 'self' https: wss:",
  "img-src 'self' data: blob: https:",
  "frame-src 'self' https:",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/((?!studio).*)",
        headers: [...SECURITY_HEADERS, { key: "Content-Security-Policy", value: SITE_CSP }],
      },
      {
        source: "/studio/:path*",
        headers: [...SECURITY_HEADERS, { key: "Content-Security-Policy", value: STUDIO_CSP }],
      },
      {
        source: "/media/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
