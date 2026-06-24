import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./sanity/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Encre / texte
        ink: {
          DEFAULT: "#0B2239",
          soft: "#41506A",
          muted: "#6B7A90",
        },
        // Teal Studi-like (couleur principale)
        teal: {
          50: "#E6FAF7",
          100: "#C5F2EC",
          200: "#8FE6DA",
          300: "#54D6C6",
          400: "#22C3B1",
          500: "#10B8AA",
          DEFAULT: "#10B8AA",
          600: "#0E9E92",
          700: "#0B7E75",
        },
        // Corail (accent secondaire)
        coral: {
          DEFAULT: "#FF6B5B",
          dark: "#F2503E",
          light: "#FFE3DF",
        },
        // Jaune (badges / highlights)
        sun: { DEFAULT: "#FFC94D", light: "#FFF3D6" },
        // Surfaces claires
        cloud: "#F4F7FB",
        mist: "#EEF3F8",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(11,34,57,0.12)",
        card: "0 12px 32px -10px rgba(11,34,57,0.14)",
        "card-hover": "0 24px 60px -16px rgba(16,184,170,0.28)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
      },
      backgroundImage: {
        "teal-gradient": "linear-gradient(135deg, #10B8AA 0%, #22C3B1 100%)",
        "hero-soft": "radial-gradient(60% 60% at 80% 0%, rgba(16,184,170,0.14) 0%, transparent 70%), radial-gradient(50% 50% at 0% 30%, rgba(255,107,91,0.10) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
