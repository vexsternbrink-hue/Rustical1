/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/*.js"],
  theme: {
    extend: {
      colors: {
        // Warme Erdtöne – Kontraste gegen "cream" geprüft (WCAG AA)
        cream: "#FAF6F0",
        sand: "#EFE6D8",
        linen: "#E4D6C2",
        clay: "#9A5230", // Akzent, 5.6:1 auf cream
        clayDark: "#7C3F22",
        moss: "#4F5F44",
        bark: "#3B2F27", // Haupttextfarbe, 12:1 auf cream
        stone: "#6B5D52", // Sekundärtext, 5.9:1 auf cream
        // Nur für Illustrationen und Flächen, nicht für Text auf cream
        ochre: "#C8964A",
        olive: "#7E8A5E",
        wheat: "#F2D3A0", // Akzent-Text auf moss/bark, 4.8:1 auf moss
      },
      fontFamily: {
        // Selbst gehostet (assets/fonts), keine externen Requests – DSGVO-sicher.
        serif: ["Fraunces", '"Iowan Old Style"', '"Palatino Linotype"', "Palatino", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 30s linear infinite",
      },
    },
  },
  plugins: [],
};
