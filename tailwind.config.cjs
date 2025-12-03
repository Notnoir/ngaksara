/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sundanese: ['Noto Sans Sundanese', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
