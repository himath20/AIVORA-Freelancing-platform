import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        violet: {
          50: "#f0f7f7",
          100: "#d9ecee",
          200: "#b3d9dc",
          300: "#7fbfc4",
          400: "#479fa6",
          500: "#14757d",
          600: "#003135",
          700: "#002629",
          800: "#001c1f",
          900: "#001315",
        },
        nexora: {
          primary: "#003135",
          light: "#d9ecee",
          dark: "#001c1f",
          accent: "#14757d",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
