/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",       // Pega o index.html do Vite
    "./src/**/*.{js,ts,jsx,tsx}", // Pega todos os arquivos dentro de src (JavaScript, TypeScript, JSX e TSX)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
