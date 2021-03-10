module.exports = {
  purge: ["src/**/*.tsx", "public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      peach: { DEFAULT: "#F5E6D0" },
      orange: { DEFAULT: "#E9724C" },
      yellow: { DEFAULT: "#FFC857" },
      brown: { DEFAULT: "#481D24" },
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
