module.exports = {
  content: ['./index.html', './catalog/**/*.html', './products/**/*.html', './assets/shop.js'],
  theme: { extend: {
    fontFamily: { sans: ['Inter','system-ui','sans-serif'], display: ['Montserrat','Inter','sans-serif'] },
    colors: { fire:{500:'#F97316',600:'#EA580C',700:'#C2410C'}, buy:{500:'#22C55E',600:'#16A34A',700:'#15803D'}, graphite:'#1E293B', cream:'#F8FAFC' },
  } },
};
