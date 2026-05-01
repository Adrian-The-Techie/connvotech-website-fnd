import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-white": "#FFFFFF",
        "brand-bg": "#F8FAFC",    // Soft Off-White
        "brand-black": "#0B0B0D", // Deep Black (Typography)
        "brand-blue": "#2F80ED",  // Connvotech Blue (Primary)
        "brand-accent": "#56CCF2", // Sky Blue (Secondary)
        "soft-gray": "#F1F5F9",   // Section Backgrounds
        "border-gray": "#E2E8F0", // Borders
        "text-gray": "#64748B",   // Subtitles
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #2F80ED, #56CCF2)",
        "premium-gradient": "linear-gradient(135deg, #FFFFFF, #F8FAFC)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "premium-soft": "0 10px 40px -10px rgba(0, 0, 0, 0.05)",
        "premium-card": "0 20px 50px -12px rgba(0, 0, 0, 0.08)",
        "glow": "0 0 20px rgba(47, 128, 237, 0.2)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
