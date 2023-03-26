/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "light-purple": "#7284FF",
      },
      fontFamily: {
        "roboto-font": ["Roboto"],
      },
    },
  },
  plugins: [],
}
