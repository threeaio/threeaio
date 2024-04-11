/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  // darkMode: "selector",
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./index.html",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', ...defaultTheme.fontFamily.sans],
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    //  require("flowbite/plugin"), // require Flowbite's plugin for Tailwind CSS
  ],
};
