/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./tailwind.preset")],
  content: ["./.rnstorybook/**/*.{ts,tsx}", "./sincpro_mobile_ui/**/*.{ts,tsx}"],
};
