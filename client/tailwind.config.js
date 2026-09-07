/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF7EF',
        sand: '#F0E6D2',
        'sand-dark': '#E1D3B4',
        charcoal: '#2B2420',
        'charcoal-soft': '#55493C',
        gold: {
          DEFAULT: '#A8792E',
          light: '#C79A4B',
          deep: '#7C5A22',
        },
        maroon: '#7A2331',
        pine: '#33473B',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Jost"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.18em',
      },
    },
  },
  plugins: [],
};
