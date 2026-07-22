/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        crimson: ["var(--font-crimson)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        cream: {
          50: "#fdf9f3",
          100: "#f7eedf",
          200: "#eeddc0",
          300: "#e2c89a",
        },
        gold: {
          300: "#d4a853",
          400: "#c49535",
          500: "#b5831e",
          600: "#9a6d12",
        },
        blush: {
          100: "#f9ede8",
          200: "#f2d5cb",
          300: "#e8b8a8",
          400: "#d99585",
        },
        forest: {
          700: "#2d4a2d",
          800: "#1e3420",
          900: "#112112",
        },
        sage: {
          300: "#8fa88f",
          400: "#6d8f6d",
          500: "#4f7050",
        },
      },
      animation: {
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "float-medium": "floatMedium 6s ease-in-out infinite",
        "petal-drift": "petalDrift 12s linear infinite",
        "fade-up": "fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        floatMedium: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(-2deg)" },
        },
        petalDrift: {
          "0%": { transform: "translateY(-20px) translateX(0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.3" },
          "100%": { transform: "translateY(100vh) translateX(60px) rotate(180deg)", opacity: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
