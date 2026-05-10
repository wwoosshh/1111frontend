export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F4A6A6',
          bg: '#FCE4E4',
          card: '#FFF5F5',
          ink: '#5A2A2A',
          accent: '#E07A8A',
        },
      },
      fontFamily: {
        receipt: ['"Courier New"', 'monospace'],
      },
      maxWidth: {
        phone: '420px',
      },
    },
  },
  plugins: [],
};
