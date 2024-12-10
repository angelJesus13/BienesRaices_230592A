module.exports = {
  content: [
    './views/auth/**/*.pug',
    './views/layout/**/*.pug',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        angelPaleta: {
          'custom-green': '#91CB3E',
          'custom-green-hover': '#53A548',
          'custom-black-hover': '#000000',
          'custom-sea-green': '#4C934C',
          white: '#FFFFFF',
          black: '#000000',
          'light-gray': '#f7f7f7',
          'dark-gray': '#333333',
        },
      },
      backgroundImage: {
        'real-estate': 'linear-gradient(to right, #1e3c72, #2a5298)', // Azul sofisticado
        'warm-sunset': 'linear-gradient(to bottom, #ff7e5f, #feb47b)', // Atardecer cálido
        'green-growth': 'linear-gradient(to right, #56ab2f, #a8e063)', // Verde
        'green-gradient': 'linear-gradient(45deg, #91CB3E, #53A548, #28a745)', // Gradiente verde para animación
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out forwards',
        'fade-out': 'fadeOut 15s ease-in-out forwards',
        'gradient-move': 'moverGradiente 5s ease infinite', // Animación para mover gradiente
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0, display: 'none' }, // Continuamos con display: none
        },
        moverGradiente: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
      },
    },
  },
  plugins: [],
}
