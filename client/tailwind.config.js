/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        rose: '#E8A0A0',
        dark: '#0A0A0A',
        cream: '#F9F3FF',
        plum: {
          900: '#1a0533',
          800: '#2d0a55',
          700: '#3d0d6b',
          600: '#6b1a4a',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1a0533 0%, #3d0d6b 50%, #6b1a4a 100%)',
        'gold-rose': 'linear-gradient(90deg, #C9A84C 0%, #E8A0A0 100%)',
        'card-hover': 'linear-gradient(180deg, #ffffff 0%, #fff0f5 100%)',
        'section-alt': 'linear-gradient(180deg, #faf5ff 0%, #fff5f8 100%)',
        'footer-gradient': 'linear-gradient(135deg, #1a0533 0%, #0a0010 100%)',
        'ai-card': 'linear-gradient(135deg, #f5e6ff 0%, #ffe6f0 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      boxShadow: {
        'rose': '0 4px 24px rgba(232, 160, 160, 0.25)',
        'gold': '0 4px 24px rgba(201, 168, 76, 0.25)',
        'card': '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};
