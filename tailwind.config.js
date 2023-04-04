/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        yeseva: ["Yeseva One", "cursive"],
        work: ["Work Sans", "sans-serif"],
      },
      colors: {
        primary: "#1F2B6C",
        secondary: "#159EEC",
        accent: "#BFD2F8",
      },
      // backgroundImage: {
      //   hero: "url('/public/image_assets/hero-bg.JPG')",
      //   "hero-mobile": "url('/public/image_assets/hero-bg-mobile.png')",
      //   "about-quote": "url('/public/image_assets/quoteBG.jpg')",
      //   appointment: "url('/public/image_assets/appointment.png')",
      //   "doctor-card": "url('/public/image_assets/DoctorCardImg.jpg')",
      // },
    },
  },
  plugins: [],
};