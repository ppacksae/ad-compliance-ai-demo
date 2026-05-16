/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { pretendard: ['Pretendard', 'sans-serif'] },
      keyframes: {
        marquee:        { from: { transform: 'translateX(0)' },    to: { transform: 'translateX(-50%)' } },
        marqueeRev:     { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        fadeInUp:       { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        stepIn:         { from: { opacity: '0', transform: 'translateY(5px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        typeBlink:      { '0%,80%,100%': { opacity: '0.2', transform: 'scale(0.85)' }, '40%': { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        marquee:    'marquee 40s linear infinite',
        marqueeRev: 'marqueeRev 40s linear infinite',
        fadeInUp:   'fadeInUp 0.4s ease-out',
        stepIn:     'stepIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
