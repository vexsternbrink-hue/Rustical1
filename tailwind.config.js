/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/main.js"],
  theme: {
    extend: {
      colors: {
        // Kreide, Tanne, Ochsenblut, Messing – Kontraste geprüft (WCAG AA)
        chalk: "#F3EDE3", // Grundfläche
        linen: "#E6DCCB",
        forest: "#1F3B32", // Markenfarbe, 10:1 mit chalk
        oxblood: "#6E2A1E", // 8.9:1 mit chalk
        rust: "#A3492A", // Akzent-Text auf chalk, 5:1
        brass: "#C59A4A", // Akzent auf forest (4.7:1), sonst nur Flächen/Linien
        ink: "#171411",
        inkSoft: "#5A5047", // Sekundärtext auf chalk, 6.3:1
      },
      fontFamily: {
        // Selbst gehostet (assets/fonts), keine externen Requests – DSGVO-sicher.
        serif: ['"Cormorant Garamond"', "Garamond", '"Times New Roman"', "serif"],
        sans: ["Archivo", "ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        site: "1520px",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.19, 1, 0.22, 1)",
        inout: "cubic-bezier(0.77, 0, 0.18, 1)",
      },
      animation: {
        "spin-slow": "spin 32s linear infinite",
      },
    },
  },
  plugins: [],
};
