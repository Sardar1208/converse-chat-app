const colors = require("tailwindcss/colors");
const defTheme = require("tailwindcss/defaultTheme")
module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Build your palette here
        transparent: "transparent",
        current: "currentColor",
        // gray: colors.trueGray,
        // red: colors.red,
        // blue: colors.lightBlue,
        // yellow: colors.amber,
        // teal: colors.teal,
        ...colors,
      },
      fontSize: {
        ...defTheme.fontSize,
        tiny: "0.65rem",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
