/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-600': '#1e40af',
        'red-600': '#dc2626',
        'green-600': '#16a34a',
        'orange-600': '#ea580c',
      },
    },
  },
    plugins: [],
}
