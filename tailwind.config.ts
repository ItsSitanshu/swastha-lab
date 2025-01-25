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
        plantin: ["Plantin Infant", "serif"]
      },
      colors: {
        background: "var(--background-100)",
        foreground: "var(--foreground-100)",
        light: 'var(--light)',
        mod: 'var(--mod)',
        dark: 'var(--dark)',
        brown: 'var(--brown)',
      },
    },
  },
  plugins: [],
} satisfies Config;
