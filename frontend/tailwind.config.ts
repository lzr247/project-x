import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sidebar & Primary elements
        sidebar: {
          DEFAULT: "#0f172a",
          hover: "#1e293b",
          border: "#1e293b",
          text: "#94a3b8",
          "text-active": "#f8fafc",
        },
        // Accent color
        accent: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          light: "#818cf8",
          subtle: "#eef2ff",
        },
        // Surface colors
        surface: {
          DEFAULT: "#f8fafc",
          card: "#ffffff",
          hover: "#f1f5f9",
        },
        // Text colors
        content: {
          DEFAULT: "#1e293b",
          secondary: "#64748b",
          muted: "#94a3b8",
        },
        // Status colors
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.1)",
        card: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        "card-hover":
          "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
} satisfies Config;
