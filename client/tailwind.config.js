/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        rose: '#E8A0A0',
        dark: '#0A0A0A',
        stone: '#F5F2ED',
        blush: '#FFF8F6',
        clay: '#D8B4A0',
        champagne: '#E8D7C8',
        umber: {
          900: '#1A1410',
          800: '#2D211A',
        },
        cream: '#F9F3FF',
        emerald: '#059669',
        plum: {
          900: '#1a0533',
          800: '#2d0a55',
          700: '#3d0d6b',
          600: '#6b1a4a',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'Menlo', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1a0533 0%, #3d0d6b 50%, #6b1a4a 100%)',
        'gold-rose': 'linear-gradient(90deg, #C9A84C 0%, #E8A0A0 100%)',
        'card-hover': 'linear-gradient(180deg, #ffffff 0%, #fff0f5 100%)',
        'section-alt': 'linear-gradient(180deg, #faf5ff 0%, #fff5f8 100%)',
        'footer-gradient': 'linear-gradient(135deg, #1a0533 0%, #0a0010 100%)',
        'ai-card': 'linear-gradient(135deg, #f5e6ff 0%, #ffe6f0 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06)',
        'rose': '0 4px 24px rgba(232, 160, 160, 0.25)',
        'gold': '0 4px 24px rgba(201, 168, 76, 0.25)',
      },
      animation: {
        'underscore': 'underscoreReveal 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'soundwave': 'soundwave 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        underscoreReveal: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(201, 168, 76, 0.4), 0 0 30px rgba(232, 160, 160, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(201, 168, 76, 0.8), 0 0 50px rgba(232, 160, 160, 0.5)' },
        },
        soundwave: {
          '0%': { height: '4px' },
          '100%': { height: '28px' },
        },
      },
    },
  },
  plugins: [],
};
