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
        papa: {
          blue: "#1e40af",
          gold: "#f59e0b",
          navy: "#1e3a8a",
          "light-blue": "#3b82f6",
        },
        // Keep the old format for backward compatibility
        "papa-blue": "#1e40af",
        "papa-gold": "#f59e0b",
        "papa-navy": "#1e3a8a",
        "papa-light-blue": "#3b82f6",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        papa: {
          primary: "#1e40af", // papa-blue
          secondary: "#f59e0b", // papa-gold
          accent: "#3b82f6", // papa-light-blue
          neutral: "#1e3a8a", // papa-navy
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#e2e8f0",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      "light",
      "dark",
    ],
  },
};

export default config;
