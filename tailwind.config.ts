import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FFFFFF",
          soft: "#F8FAFC",
          dark: "#090D16",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F1F5F9",
          card: "#FFFFFF",
          dark: "#0F172A",
          "dark-subtle": "#1E293B",
        },
        border: {
          subtle: "#E2E8F0",
          focus: "#16A34A",
          dark: "#334155",
        },
        brand: {
          sage: {
            50: "#F0FDF4",
            100: "#DCFCE7",
            200: "#BBF7D0",
            300: "#86EFAC",
            400: "#4ADE80",
            500: "#22C55E", // Vibrant Success Green
            600: "#16A34A", // True Success Green
            700: "#15803D",
            800: "#166534",
            900: "#14532D",
          },
          emerald: {
            50: "#F0FDF4",
            100: "#DCFCE7",
            200: "#BBF7D0",
            300: "#86EFAC",
            400: "#4ADE80",
            500: "#22C55E", // Success Green
            600: "#16A34A", // Success Green
            700: "#15803D",
          },
          blue: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            200: "#BFDBFE",
            500: "#2563EB",
            600: "#1D4ED8",
            700: "#1E40AF",
            800: "#1E3A8A",
          },
          black: {
            DEFAULT: "#09090B",
            900: "#0F172A",
            800: "#1E293B",
          },
        },
        content: {
          primary: "#0F172A",
          muted: "#475569",
          subtle: "#64748B",
          faint: "#94A3B8",
          dark: "#F8FAFC",
          "dark-muted": "#94A3B8",
        },
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "2xs": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        xs: "0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.07)",
        soft: "0 2px 10px -2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03)",
        card: "0 4px 20px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)",
        hover: "0 10px 30px -6px rgba(15, 23, 42, 0.1), 0 4px 10px -2px rgba(15, 23, 42, 0.05)",
        glow: "0 0 25px -4px rgba(22, 163, 74, 0.45)",
        "blue-glow": "0 0 20px -5px rgba(37, 99, 235, 0.35)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
