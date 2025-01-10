/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        leagueGothic: ['"League Gothic"', "sans-serif"], // Nome da fonte e fallback
      },
    },
  },
  plugins: [],
};
