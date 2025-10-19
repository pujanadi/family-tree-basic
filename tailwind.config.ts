import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-mode="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "soft-sand": {
          50: "#fbf8f4",
          100: "#f3ebe2",
          200: "#e5d5c4",
          300: "#d1b79c",
          400: "#bd9975",
          500: "#a97b4d",
          600: "#896039",
          700: "#6b4a2e",
          800: "#4b3521",
          900: "#2b1f13"
        },
        "misty-teal": {
          50: "#f2fcfb",
          100: "#daf5f2",
          200: "#bce8e3",
          300: "#98d7d0",
          400: "#74c6bc",
          500: "#52b4a7",
          600: "#3c9187",
          700: "#2e716a",
          800: "#20514d",
          900: "#123031"
        }
      },
      boxShadow: {
        ambient: "0 8px 24px -12px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
