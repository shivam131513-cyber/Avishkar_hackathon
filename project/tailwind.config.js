/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#050d1a',
          900: '#0a192f',
          800: '#0d2137',
          700: '#112840',
        }
      }
    },
  },
  plugins: [],
};
