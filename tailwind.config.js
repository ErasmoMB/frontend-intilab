/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#1e293b',
          secondary: '#334155',
          tertiary: '#475569',
          accent: '#3b82f6',
          text: '#f1f5f9',
          'text-secondary': '#cbd5e1',
        },
      },
    },
  },
  plugins: [],
}
