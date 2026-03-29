/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7b61ff",
        secondary: "#ff8a17",
        accent: "#22d3ee",
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        '3xl': '64px',
      }
    },
  },
  plugins: [],
}
