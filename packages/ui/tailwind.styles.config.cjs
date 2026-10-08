/* Config for the precompiled dist/styles.css only. Mirrors apps/docs dark mode. */
const path = require("node:path")
const preset = require("@glinui/tokens/tailwind-preset")

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  darkMode: [
    "variant",
    "&:where(.dark, .dark *, [data-glin-theme=dark], [data-glin-theme=dark] *):not(:where([data-glin-theme=light], [data-glin-theme=light] *))"
  ],
  content: [path.join(__dirname, "src/**/*.{ts,tsx}"), "!" + path.join(__dirname, "src/tests/**")],
  // No safelist: components compose complete class strings from constants; none build
  // utility names from runtime values (verified by grep for `-${` in src).
  safelist: []
}
