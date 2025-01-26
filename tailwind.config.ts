import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jksans: ["Plus Jakarta Sans", "sans-serif"],
        nue: ["Bebas Neue", 'serif'],
        lux: ["Luxurious Roman", 'serif'],
        plantin: ["Plantin Infant", "serif"],
      },
      colors: {
        background: {
          100: "var(--background-100)",
          90: "var(--background-90)",
          80: "var(--background-80)",
          70: "var(--background-70)",
          60: "var(--background-60)",
          50: "var(--background-50)",
          40: "var(--background-40)",
          30: "var(--background-30)",
          20: "var(--background-20)",
          10: "var(--background-10)",
        },
        foreground: {
          100: "var(--foreground-100)",
          90: "var(--foreground-90)",
          80: "var(--foreground-80)",
          70: "var(--foreground-70)",
          60: "var(--foreground-60)",
          50: "var(--foreground-50)",
          40: "var(--foreground-40)",
          30: "var(--foreground-30)",
          20: "var(--foreground-20)",
          10: "var(--foreground-10)",
        },
        light: "var(--light)",
        mod: "var(--mod)",
        dark: "var(--dark)",
        brown: "var(--brown)",
      },
    },
  },
  plugins: [],
} satisfies Config;
