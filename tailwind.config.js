/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f3f6fb', 100: '#e4eaf4', 200: '#c9d4e8', 300: '#9fb2d3',
          400: '#6f88b8', 500: '#4c679c', 600: '#3a5080', 700: '#2e3f66',
          800: '#1c2847', 900: '#111a33', 950: '#0a1024',
        },
        accent: {
          50: '#ecfdf6', 100: '#d1faea', 200: '#a6f3d6', 300: '#6de8bf',
          400: '#33d4a3', 500: '#12b98a', 600: '#079671', 700: '#08785d',
          800: '#0b5f4b', 900: '#0b4e3f',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgb(10 16 36 / 0.04), 0 8px 24px -8px rgb(10 16 36 / 0.12)',
      },
    },
  },
  plugins: [],
};
