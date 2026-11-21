import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          light: "#E5EDE1", // Primary background
          50: "#F4F7F2",
          100: "#E5EDE1",
          200: "#D2DBD0", // Borders
          300: "#B8C7B5",
          400: "#8FA38B",
          500: "#6B8267",
        },
        forest: {
          dark: "#465D45", // Secondary background
          deep: "#102D25", // Primary text
          DEFAULT: "#465D45",
          muted: "#68756B", // Secondary text
          900: "#102D25",
        },
        terracotta: {
          DEFAULT: "#B85232", // Accent colour
          hover: "#A04428",
          light: "#FDF1EC",
          dark: "#8E3D24",
        },
        ivory: {
          DEFAULT: "#F8F7F0", // Light surface
          warm: "#F8F7F0",
          card: "#FAF9F5",
        },
        borderSage: "#D2DBD0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-manrope)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(16, 45, 37, 0.05)",
        card: "0 8px 30px -4px rgba(16, 45, 37, 0.08)",
        floating: "0 20px 40px -10px rgba(16, 45, 37, 0.12)",
      },
      borderRadius: {
        brand: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
