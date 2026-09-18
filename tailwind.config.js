/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'alpha-orange': '#E8651B',
        'alpha-orange-dark': '#CF5512',
        'alpha-orange-light': '#FFF5EB',
        'alpha-blue': '#0A66C2',
        'alpha-navy': '#1E293B',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Barlow Condensed"', 'Montserrat', 'sans-serif'],
        signature: ['"Caveat"', '"Dancing Script"', 'cursive'],
        quote: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'cert': '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        'cert-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
