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
      },
      fontFamily: {
        // Systemschriften = keine externen Requests (schnell + DSGVO-sicher).
        // Optional selbst hosten: siehe README ("Schriften").
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', "Palatino", "Georgia", "Cambria", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        wordmark: "0.18em",
      },
    },
  },
  plugins: [],
};
