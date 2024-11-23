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
          'custom-black-hover': '#00000',
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
        'red-adv': 'linear-gradient(to right, #ff0000, #f16446)', // Rojo
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out forwards',
        'fade-out': 'fadeOut 15s ease-in-out forwards', // Ajustado para 3 segundos
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
      },
    },
  },
  plugins: [],
}
