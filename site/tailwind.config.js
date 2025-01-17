const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['_site/**/*.html'],
  darkMode: 'class',
  safelist: [
    'copy-to-clipboard-button',
    'code-toolbar'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        accent: colors.red[600],
        accentDark: colors.red[400] 
      },
      borderWidth: {
        '1': '1px'
      },
      scale: {
        '103': '1.03'
      }
    },
  },
  variants: {
    extend: {
      display: ['dark']
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
