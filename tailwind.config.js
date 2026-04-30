/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'gold-light': '#E5C158',
        'gold-dark': '#B8962E',
        black: '#0B0B0B',
        'black-light': '#1A1A1A',
        offwhite: '#F8F8F8',
        'offwhite-dark': '#EAEAEA',
      },
    },
  },
  plugins: [],
};