/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#148282', light: '#1a9e9e', dark: '#0f6868' },
        accent: { DEFAULT: '#FFB385', light: '#ffc9a3', dark: '#e89560' },
        background: '#FDFBF7',
        surface: '#FFFFFF',
        text: { DEFAULT: '#2A3B3B', light: '#4A5E5E', muted: '#7A8F8F' }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
