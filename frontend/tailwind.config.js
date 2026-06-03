/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#050505",
        secondary: "#FF4500", // More intense Orange/Red
        accent: "#FF4500",
        cyan: "#00E5FF", // Neon Cyan
        surface: "#0A0A0A", // Very dark grey
        outline: "#1A1A1A",
        bgDark: "#000000" // Pitch black
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 40px -10px rgba(0, 0, 0, 0.8)",
        glow: "0 0 20px -5px rgba(255, 90, 31, 0.4)",
        'glow-cyan': "0 0 20px -5px rgba(0, 189, 214, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
