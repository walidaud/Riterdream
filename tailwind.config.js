/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(amber|slate|red|gray|purple)-\d{3}/,
    },
    {
      pattern: /text-(amber|slate|red|gray|purple)-\d{3,4}/,
    },
    {
      pattern: /border-(amber|slate|red|gray|purple)-\d{3}/,
    },
    {
      pattern: /shadow-(amber|slate|red|gray|purple)-\d{3}\/\d{2}/,
    },
    {
      pattern: /animate-(pulse|shake|bounce|wiggle|slow-fade|glow)/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
