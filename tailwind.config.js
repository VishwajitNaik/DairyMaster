/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        slide: 'slide 8s linear infinite',
        '3d': 'rotate3d 6s infinite linear',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20%)' },
          '100%': { transform: 'translateX(0)' },
        },
        rotate3d: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
    },
  },
  plugins: [],
};
