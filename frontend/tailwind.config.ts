import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#e8ebf1",
          200: "#c5ccd9",
          300: "#a2adc2",
          400: "#7f8eaa",
          DEFAULT: "#576A8F",
          500: "#576A8F",
          600: "#465778",
          700: "#364461",
          800: "#26314a",
          900: "#161e33",
        },
        secondary: {
          100: "#eff0fe",
          200: "#d5d9fb",
          DEFAULT: "#B7BDF7",
          300: "#B7BDF7",
          400: "#9aa2f3",
          500: "#7c86ef",
        },
        accent: {
          300: "#ffa888",
          400: "#ff8d66",
          DEFAULT: "#FF7444",
          500: "#FF7444",
          600: "#e55a2a",
          700: "#cc4010",
        },
        surface: {
          DEFAULT: "#FFF8DE",
          light: "#FFFCF0",
          dark: "#f5edcc",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
