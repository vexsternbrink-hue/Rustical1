# Rustikal & Schön – Relaunch (Frontend)

Statische Seite mit Tailwind CSS. Kein Framework, kein Tracking, keine externen Schriften oder Skripte – alles liegt im Repo.

## Verzeichnisstruktur

```
rustikal-relaunch/
├── index.html              Hauptseite (alle Sektionen, SEO, Schema.org)
├── .nojekyll               GitHub Pages: Dateien unverändert ausliefern
├── package.json            Build-Skripte
├── tailwind.config.js      Farben (Kreide, Tanne, Ochsenblut, Messing), Schriften
├── src/input.css           Tailwind-Eingabe + kleine Komponenten
└── assets/
    ├── css/styles.css      vom Build erzeugt und mit eingecheckt
    ├── fonts/              Cormorant Garamond + Archivo, selbst gehostet (SIL OFL)
    ├── js/main.js          Menü, „Jetzt geöffnet?“, Karte, Animationen
    ├── js/vendor/          Lenis (weiches Scrollen, MIT-Lizenz)
    └── img/
        ├── favicon.svg
        └── guilloche.svg   Muster der Gutscheinkarte
```

## Live (GitHub Pages)

Die Seite wird per GitHub Pages direkt aus dem Branch `main` veröffentlicht:
https://vexsternbrink-hue.github.io/Rustical1/

Jeder Push auf `main` geht nach etwa einer Minute live. Weil `assets/css/styles.css` mit eingecheckt ist, braucht der Server keinen Build-Schritt.

## Start

```bash
npm install
npm run build      # erzeugt assets/css/styles.css (minifiziert)
npm run dev        # Watch-Modus beim Entwickeln
```

Die Seite danach über einen beliebigen statischen Server ausliefern, z. B. `npx serve .`.
**Nach Änderungen an Klassen in `index.html` oder `assets/js/main.js` `npm run build` ausführen und die neue `styles.css` mit committen.** Sonst fehlen online die Styles für neue Klassen.

## Gestaltung

Die Seite kommt ohne Fotos aus. Sie lebt von einer eigenen Bildsprache:

- **Emblem** „R&S“ mit umlaufender Schrift (SVG-Symbol `#emblem-ring` in `index.html`), dreht sich langsam.
- **Linienzeichnungen** (Inline-SVG) für Stillleben, die sechs Sortimentsbereiche, Zitat und Ladenfront. Sie zeichnen sich beim Scrollen selbst; die Linien bekommen dafür per JavaScript `pathLength="1"`.
- **Rundbögen** als wiederkehrende Form (Schaufenster, Etiketten, Abschnittsübergänge).
- **Typografie**: schmale, fette Archivo-Versalien plus Cormorant Garamond kursiv. Die Markennamen nutzen die Breitenachse der variablen Archivo (Hover: schmal → breit).
- **Gutscheinkarte** mit Guillochen-Muster, neigt sich zur Maus.

Echte Fotos aus dem Laden lassen sich später ergänzen, z. B. im Rundbogen des Hero (`<img class="absolute inset-0 h-full w-full object-cover">` statt des SVG).

## Noch zu ergänzen (bewusst offen gelassen)

1. **Vorschaubild** `og-image.jpg` (1200×630) für soziale Medien fehlt noch. Optional Ladenfotos (siehe „Gestaltung“). Die Bilder der alten Seite gehören dem Laden – bitte Originaldateien verwenden und nicht von der alten Seite einbinden.
2. **Geokoordinaten** (`geo` in den strukturierten Daten): bitte aus Google Maps übernehmen und prüfen, sie sind hier absichtlich nicht geraten.
3. **Unterseiten** (Impressum, Datenschutz, AGB, Produkte, Gutscheine) verlinken noch auf rustikal.de. Impressum und Datenschutz müssen zum neuen Hosting passen.
4. **Google-Unternehmensprofil** pflegen: Für „Geschenke Volksdorf“ wirkt es meist stärker als die Seite selbst. Name, Adresse und Telefon müssen exakt wie im Schema übereinstimmen.
5. **Feiertage** berücksichtigt die „Jetzt geöffnet“-Anzeige nicht.

## Performance, SEO, Barrierefreiheit

- Schriften Cormorant Garamond (Überschriften) und Archivo (Text, schmale Versal-Labels) liegen lokal in `assets/fonts` – keine Anfragen an Google Fonts. Lizenz: SIL Open Font License (Dateien liegen bei).
- JavaScript ohne Framework: Zeilen-Reveals, sich selbst zeichnende Linien, Manifest-Wörter leuchten beim Scrollen auf, Laufband reagiert auf Scroll-Tempo und -Richtung, magnetische Buttons, Kopfzeile blendet sich beim Runterscrollen aus.
- Weiches Scrollen mit Lenis nur auf Geräten mit Maus; Touch-Geräte scrollen nativ.
- Kurzer Vorspann (Emblem) nur beim ersten Aufruf pro Sitzung; er blendet sich per CSS aus, auch wenn JavaScript fehlt.
- Alle Animationen entfallen bei `prefers-reduced-motion` – dann ist sofort alles sichtbar.
- `LocalBusiness` (Typ `GiftShop`) mit Öffnungszeiten als JSON-LD, Canonical, Open Graph.
- Skip-Link, sichtbarer Fokus, Kontraste für WCAG AA berechnet, `prefers-reduced-motion`, Touch-Ziele ≥ 44 px.
- DSGVO: Google Maps lädt erst nach Klick. Die Datenschutzerklärung muss Google Maps nennen.
