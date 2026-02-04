/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#1E293B",
        gold: "#C8A24D",
        accentBlue: "#2563EB",
        background: "#FAFAF9",
        adminSidebar: "#0F172A",
        textDark: "#020617",
        muted: "#64748B",
        mutedLight: "#94A3B8",
        border: "#E2E8F0",
        danger: "#DC2626",
        success: "#059669",
        surface: "#F8FAFC",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1E293B 0%, #1E293B 55%, #24324A 100%)",
        "gradient-gold": "linear-gradient(90deg, #C8A24D, #E6C97A, #C8A24D)",
        "gradient-button": "linear-gradient(90deg, #1E293B, #2563EB)",
        "gradient-card": "linear-gradient(180deg, #FFFFFF, #FAFAF9)",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(30, 41, 59, 0.06), 0 10px 20px -2px rgba(30, 41, 59, 0.04)",
        softHover: "0 10px 40px -10px rgba(30, 41, 59, 0.12)",
        card: "0 1px 3px rgba(30, 41, 59, 0.04), 0 4px 12px rgba(30, 41, 59, 0.03)",
        cardHover: "0 8px 25px -5px rgba(30, 41, 59, 0.08)",
        gold: "0 4px 14px -2px rgba(200, 162, 77, 0.2)",
      },
      borderRadius: {
        "2xl": "0.75rem",
        "3xl": "1rem",
      },
      transitionDuration: {
        300: "300ms",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
