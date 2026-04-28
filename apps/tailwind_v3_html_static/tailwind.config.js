/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#06b6d4",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      spacing: {
        128: "32rem",
      },
    },
  },
  plugins: [],
};
