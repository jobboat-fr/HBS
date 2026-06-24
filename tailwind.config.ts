import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./sanity/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#050505",
        dark: "#0A0A0A",
        surface: "#111111",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E2C87A",
          muted: "rgba(201,168,76,0.15)",
        },
        blue: {
          DEFAULT: "#0EA5E9",
          muted: "rgba(14,165,233,0.12)",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in": "fadeIn 0.6s ease forwards",
        shimmer: "shimmer 2s infinite",
        "gold-pulse": "goldPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
        goldPulse: { "0%,100%": { opacity: "0.7" }, "50%": { opacity: "1" } },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #E2C87A 50%, #C9A84C 100%)",
        "dark-gradient": "linear-gradient(180deg, #050505 0%, #0A0A0A 100%)",
        glass: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "hero-radial": "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.15) 0%, transparent 100%)",
      },
      backdropBlur: { xs: "2px" },
      borderColor: {
        DEFAULT: "rgba(255,255,255,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
