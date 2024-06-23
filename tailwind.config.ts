import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      letterSpacing: {
        tightest: "-.1em",
      },
      spacing: {
        "max-w-xs": "20rem" /* 320px */,
        "max-w-sm": "24rem" /* 384px */,
        "max-w-md": "28rem" /* 448px */,
        "max-w-lg": "32rem" /* 512px */,
        "max-w-xl": "36rem" /* 576px */,
        "max-w-2xl": "42rem" /* 672px */,
        "max-w-3xl": "48rem" /* 768px */,
        "max-w-4xl": "56rem" /* 896px */,
        "max-w-5xl": "64rem" /* 1024px */,
        "max-w-6xl": "72rem" /* 1152px */,
        "max-w-7xl": "80rem" /* 1280px */,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
