module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "tr-light": "#f5f6f8",
        "tr-dark": "#111112",
        "tr-gray": "#1c1d1f",
        "tr-green": "#00ff5b",
        "tr-green-dark": "#00c146",
      },
    },
  },
  plugins: [],
};
