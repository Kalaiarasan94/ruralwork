/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#12315f',
          blue: '#1f5fa8',
          saffron: '#d97706',
          green: '#15803d',
          ink: '#172033',
          mist: '#eef4f8',
          line: '#c9d6e2',
        },
      },
    },
  },
  plugins: [],
};
