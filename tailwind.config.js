/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F9F9F6',
        foreground: '#111827',
        primary: {
          DEFAULT: '#8B1E3F',
          hover: '#701632',
        },
        secondary: {
          DEFAULT: '#A47F55',
          hover: '#C19A6B',
        },
        text: {
          primary: '#111827',
          secondary: '#4B5563',
        },
      },
      fontFamily: {
        fontPrimary: ['Effra', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
