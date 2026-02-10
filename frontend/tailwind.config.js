/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'stone-50': '#F9F8F6',
        'charcoal': '#1A1A1A',
        'muted-gold': '#A68B5B',
        'border-soft': 'rgba(26, 26, 26, 0.08)',
        'luxury-bone': '#F9F8F6',    // Page Background
        'luxury-slate': '#4A4E51',   // Subheaders
        'luxury-charcoal': '#1A1A1A', // Primary Text/Buttons
        'luxury-gold': '#A68B5B',     // Accents/CTAs
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      spacing: {
        'section': '160px', // Extra large vertical rhythm
      },
      letterSpacing: {
        luxury: '0.2em',
        'widest-luxury': '0.25em',
      },
    },
  },
  plugins: [],
};
