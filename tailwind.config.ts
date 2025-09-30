import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // or "media"
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Next.js App Router
  ],
  theme: {
    extend: {
      colors: {
        brand: "#1d4ed8",
      },
    },
  },
  plugins: [],
};

export default config;
