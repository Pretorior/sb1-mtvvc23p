/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Pro Display', 'system-ui', 'sans-serif'],
      },
      colors: {
        malibu: {
          50: '#F0F9FF',
          100: '#92CCFE',
          200: '#7BBCF9',
          300: '#64ACF4',
          400: '#4D9CEF',
          500: '#368CEA',
        },
        feijoa: {
          50: '#F3FBF1',
          100: '#9DDD79',
          200: '#86D362',
          300: '#6FC94B',
          400: '#58BF34',
          500: '#41B51D',
        },
        apricot: {
          50: '#FEF6F3',
          100: '#F6CBB2',
          200: '#F4BC9B',
          300: '#F2AD84',
          400: '#F09E6D',
          500: '#EE8F56',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};