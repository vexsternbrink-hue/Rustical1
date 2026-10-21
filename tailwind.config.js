/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/*.js"],
  theme: {
    extend: {
      colors: {
        // Papier & Tinte – Kontraste gegen "paper" geprüft (WCAG AA)
        paper: "#F4EFE7",
        paperDeep: "#EAE2D5",
        ink: "#1E1915", // Haupttext, 16:1 auf paper
        inkSoft: "#5C5249", // Sekundärtext, 6.3:1 auf paper
        clay: "#9A5230", // Akzent, 5.5:1 auf paper
        clayDark: "#7C3F22",
        moss: "#4F5F44",
        wheat: "#F2D3A0", // Akzent-Text auf ink/moss
      },
      fontFamily: {
        // Selbst gehostet (assets/fonts), keine externen Requests – DSGVO-sicher.
        serif: ['"Cormorant Garamond"', "Garamond", '"Times New Roman"', "serif"],
        sans: ["Archivo", "ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        site: "1600px",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.19, 1, 0.22, 1)",
        inout: "cubic-bezier(0.77, 0, 0.18, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        scrollcue: {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "45%": { transform: "scaleY(1)", transformOrigin: "top" },
          "55%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
      animation: {
        marquee: "marquee 70s linear infinite",
        scrollcue: "scrollcue 2.6s cubic-bezier(0.77, 0, 0.18, 1) infinite",
        "spin-slow": "spin 28s linear infinite",
      },
    },
  },
  plugins: [],
};
