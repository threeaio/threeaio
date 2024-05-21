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
    colors: {
      "3a-green": "var(--color-3a-green)",
      "3a-red": "var(--color-3a-red)",
      "3a-white": "var(--color-3a-white)",
      "3a-paper": "var(--color-3a-paper)",
      "3a-gray": "var(--color-3a-gray)",
      "3a-gray-darker": "var(--color-3a-gray-darker)",
      "3a-gray-darkest": "var(--color-3a-gray-darkest)",
      "3a-black": "var(--color-3a-black)",
    },
    extend: {
      fontFamily: {
        display: ['"Cal Sans"', ...defaultTheme.fontFamily.sans],
        sans: ['"Fira Code"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    //  require("flowbite/plugin"), // require Flowbite's plugin for Tailwind CSS
  ],
};
