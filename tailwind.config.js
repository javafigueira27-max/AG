/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          light: "#F472B6",
          DEFAULT: "#EC4899",
          dark: "#BE185D",
        },
        ink: {
          light: "#18181E",
          DEFAULT: "#121216",
          dark: "#0A0A0C",
        },
        cream: {
          DEFAULT: "#FDFBF7",
          dark: "#EAE4D9",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
