/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cerebro: {
          bg: '#0D0814',
          card: '#181126',
          cardLight: '#241B38',
          cardBorder: '#342552',
          accent: '#FF4B72',
          accentGlow: 'rgba(255, 75, 114, 0.35)',
          purple: '#9B51E0',
          pink: '#E53E7B',
          orange: '#FF7A45',
          textMuted: '#9E92B3',
        }
      },
      boxShadow: {
        'glow-pink': '0 0 25px -5px rgba(255, 75, 114, 0.4)',
        'glow-purple': '0 0 30px -5px rgba(155, 81, 224, 0.3)',
        'glow-card': '0 10px 30px -10px rgba(13, 8, 20, 0.8)',
      }
    },
  },
  plugins: [],
};
