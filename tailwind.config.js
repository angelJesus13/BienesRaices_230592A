module.exports = {
  content: [
    './views/auth/**/*.pug',
    './views/layout/**/*.pug',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 2s ease-out',
        'fade-out': 'fadeOut 10s ease-in-out forwards', // Aumentamos la duración
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0, display: 'none' }, // Correcto para eliminar espacio
        },
      },
      colors: {
        angelPaleta: {
          'custom-green': '#91CB3E',
          'custom-green-hover': '#53A548',
          'custom-sea-green': '#4C934C',
        },
      },
    },
  },
  plugins: [],
};
