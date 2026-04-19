import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-1": "#050714",
        "bg-2": "#13182f",
        accent: "#ff5f7c",
        "accent-2": "#68fff0",
        ink: "#f4f3ff",
        muted: "#a8aed3",
      },
    },
  },
  plugins: [],
};

export default config;