/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#4ADE80",
        tertiary: "#A855F7",
        background: "#FFFFFF",
        surface: "#FAF5FF",
        "text-primary": "#171717",
        "text-secondary": "#737373",
        border: "#F5F5F5",
      },
      borderRadius: {
        '4': '4px',
        '6': '6px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
      },
    },
  },
  plugins: [],
}
