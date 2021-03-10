const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [postcssPresetEnv, tailwindcss, autoprefixer],
};
