/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#A78BFA',
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
        secondary: {
          light: '#93C5FD',
          DEFAULT: '#60A5FA',
          dark: '#3B82F6',
        },
        accent: {
          light: '#FDE68A',
          DEFAULT: '#FBBF24',
          dark: '#F59E0B',
        },
        background: {
          light: '#F3F4F6',
          dark: '#1F2937',
        },
        text: {
          light: '#1F2937',
          dark: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
};