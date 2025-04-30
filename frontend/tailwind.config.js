/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'light-gradient': 'linear-gradient(to right, #e0e7ff, #f3e8ff)',
        'dark-gradient': 'linear-gradient(to right, #1f2937, #374151)',
      },
      colors: {
        primary: '#2563eb',
        secondary: '#14b8a6',
        accent: '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
};