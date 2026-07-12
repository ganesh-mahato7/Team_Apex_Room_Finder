/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FAF3E7', deep: '#F3E9D8' },
        terracotta: {
          50: '#FBF0E8',
          100: '#F3DDC9',
          400: '#D97F49',
          500: '#C9662D',
          600: '#B85A26',
          700: '#A8511F',
        },
        ink: '#3D2B1F',
        sage: { 100: '#E5EADF', 600: '#6B7F5E', 700: '#566B4A' },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
};