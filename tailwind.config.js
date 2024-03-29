/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./index.html",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"), // require Flowbite's plugin for Tailwind CSS
  ],
};
