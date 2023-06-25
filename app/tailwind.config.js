/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "overlay-light": "rgba(255, 255, 255, 0.15)",
      },
      colors: {
        primary: "#191970",
        accent: "#00C957",
        background: "#333333",
        text: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
