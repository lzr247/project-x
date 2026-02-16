import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Sidebar - theme-aware dark shades
        sidebar: {
          DEFAULT: "var(--color-sidebar)",
          hover: "var(--color-sidebar-hover)",
          border: "var(--color-sidebar-border)",
          text: "var(--color-sidebar-text)",
          "text-active": "var(--color-sidebar-text-active)",
        },
        // Theme-aware colors via CSS variables
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          light: "var(--color-accent-light)",
          subtle: "var(--color-accent-subtle)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          card: "var(--color-surface-card)",
          hover: "var(--color-surface-hover)",
        },
        content: {
          DEFAULT: "var(--color-content)",
          secondary: "var(--color-content-secondary)",
          muted: "var(--color-content-muted)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        skeleton: {
          DEFAULT: "var(--color-skeleton)",
          light: "var(--color-skeleton-light)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(0, 0, 0, var(--color-shadow-opacity)), 0 4px 16px -4px rgba(0, 0, 0, calc(var(--color-shadow-opacity) * 1.5))",
        card: "0 1px 3px rgba(0, 0, 0, var(--color-shadow-opacity)), 0 1px 2px rgba(0, 0, 0, calc(var(--color-shadow-opacity) * 1.5))",
        "card-hover":
          "0 10px 40px -10px rgba(0, 0, 0, calc(var(--color-shadow-opacity) * 2.5)), 0 4px 12px -2px rgba(0, 0, 0, var(--color-shadow-opacity))",
      },
    },
  },
  plugins: [],
} satisfies Config;
