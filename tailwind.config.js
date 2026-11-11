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
        // "navy" = neutrales Anthrazit (Name aus Kompatibilitätsgründen beibehalten)
        navy: {
          50: '#f5f6f7', 100: '#e9ebee', 200: '#d3d6dc', 300: '#a9aeb8',
          400: '#8b919c', 500: '#6b717d', 600: '#4f5560', 700: '#3b414a',
          800: '#30353d', 900: '#262a31', 950: '#1b1e23',
        },
        // Akzent: Limettengrün
        accent: {
          50: '#f8fde6', 100: '#effbc9', 200: '#e2f79a', 300: '#d6f566',
          400: '#d6f566', 500: '#c9f03f', 600: '#a6c925', 700: '#6b8512',
          800: '#546814', 900: '#465716',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 8px 24px -8px rgb(0 0 0 / 0.18)',
      },
    },
  },
  plugins: [],
};
