/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffdd00',
        secondary: '#ffdd00',
        coffee: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffdd00',
          300: '#ffcc00',
          400: '#e6b800',
          500: '#cca300',
          600: '#b38f00',
          700: '#997a00',
          800: '#806600',
          900: '#665200'
        },
        dark: '#000000',
        light: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({strategy: 'class'}),
  ],
}
