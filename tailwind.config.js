module.exports = {
  content: [
    "./index.html",
    "./src/**/*.vue",
  ],
  theme: {
    extend: {
        colors: {
            violet: {
                '50': '#f5f2ff',
                '100': '#ede8ff',
                '200': '#dcd4ff',
                '300': '#c4b1ff',
                '400': '#a785ff',
                '500': '#884dff',
                '600': '#7e30f7',
                '700': '#701ee3',
                '800': '#5d18bf',
                '900': '#4e169c',
                '950': '#2f0b6a',
            }
        }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
  safelist: []
}

