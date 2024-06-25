/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      colors: {
        'blue-back': 'rgb(2, 2, 2)',
        'second-back': 'rgb(203, 212, 194)'
      }
    },
    animation: {
      fadeout: 'fadeout 5s forwards',
      fadeIn: 'fadeIn 0.5s ease-out',
      fadeOut: 'fadeOut 0.5s ease-out',
      slideIn: 'slideIn 0.5s ease-out',
      slideOut: 'slideOut 0.5s ease-out',
      'fade-in': 'fademoreIn 0.3s ease-in-out',
      'fade-out': 'fademoreOut 0.3s ease-in-out',
      'fall-down': 'fallDown 1s ease-in-out',
      fallDown: 'fallDown 0.5s ease-in-out forwards',
      fadeTextOut: 'fadeOut 0.5s ease-in-out forwards',
      fadeInRight: 'fadeInRight 1s ease-in-out forwards',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      fadeout: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
      slideIn: {
        '0%': { transform: 'translateY(-50px)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
      slideOut: {
        '0%': { transform: 'translateY(0)', opacity: 1 },
        '100%': { transform: 'translateY(-50px)', opacity: 0 },
      },
      fademoreIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      fademoreOut: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
      },
      fallDown: {
        '0%': { transform: 'translateY(-100%)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
      fadeOut: {
        '0%': { opacity: 1 },
        '100%': { opacity: 0 },
      },
      fadeInRight: {
        '0%': { transform: 'translateX(100%)', opacity: 0 },
        '100%': { transform: 'translateX(0)', opacity: 1 },
      },
      
    },
  },
  plugins: [],
}

