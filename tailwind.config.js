/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C8857A',
        background: '#FBF8F4',
        surface: '#FFFFFF',
        text: '#3A2E2B',
        muted: '#8D7B77',
        accent: '#6B8E7B',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
      },
      borderRadius: {
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'full': '999px',
      },
      boxShadow: {
        'soft': '0 12px 32px rgba(58, 46, 43, 0.06)',
        'floating': '0 20px 48px rgba(200, 133, 122, 0.15)',
      },
    },
  },
  plugins: [],
}
