/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0f172a",
          yellow: "#facc15",
          amber: "#f59e0b",
          gold: "#b7791f",
        },
      },
    },
  },
  plugins: [],
};
