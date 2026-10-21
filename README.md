# Rustikal & Schön – Relaunch (Frontend)

Statische, schnelle Seite mit Tailwind CSS. Kein Framework, kein Tracking, keine externen Schriften oder Skripte.

## Verzeichnisstruktur

```
rustikal-relaunch/
├── index.html              Hauptseite (alle Sektionen, SEO, Schema.org)
├── package.json            Build-Skripte
├── tailwind.config.js      Farben (Erdtöne), Schriften
├── src/input.css           Tailwind-Eingabe + kleine Komponenten
└── assets/
    ├── css/styles.css      wird vom Build erzeugt
    ├── js/main.js          Menü, „Jetzt geöffnet?“, Karte per Klick
    └── img/
        ├── favicon.svg
        ├── galerie/        Ladenfotos (WebP/AVIF)
        └── marken/         optional: Markenlogos (nur mit Freigabe)
```

## Start

```bash
npm install
npm run build      # erzeugt assets/css/styles.css (minifiziert)
npm run dev        # Watch-Modus beim Entwickeln
```

Die Seite danach über einen beliebigen statischen Server ausliefern, z. B. `npx serve .`.
**Ohne `npm run build` ist die Seite unformatiert**, weil `styles.css` erst dabei entsteht.

## Noch zu ergänzen (bewusst offen gelassen)

1. **Fotos**: Hero (`assets/img/hero.jpg`), Galerie, `og-image.jpg` (1200×630). Platzhalter und Hinweise stehen im Code. Die Bilder der alten Seite gehören dem Laden – bitte Originaldateien verwenden und nicht von der alten Seite einbinden.
2. **Geokoordinaten** (`geo` in den strukturierten Daten): bitte aus Google Maps übernehmen und prüfen, sie sind hier absichtlich nicht geraten.
3. **Unterseiten** (Impressum, Datenschutz, AGB, Produkte, Gutscheine) verlinken noch auf rustikal.de. Impressum und Datenschutz müssen zum neuen Hosting passen.
4. **Google-Unternehmensprofil** pflegen: Für „Geschenke Volksdorf“ wirkt es meist stärker als die Seite selbst. Name, Adresse und Telefon müssen exakt wie im Schema übereinstimmen.
5. **Feiertage** berücksichtigt die „Jetzt geöffnet“-Anzeige nicht.

## Performance, SEO, Barrierefreiheit

- Systemschriften, ca. 1 KB JavaScript, Tailwind-CSS nur mit genutzten Klassen.
- Bilder: `width`/`height` setzen, unterhalb des Hero `loading="lazy"`, Hero mit `fetchpriority="high"`.
- `LocalBusiness` (Typ `GiftShop`) mit Öffnungszeiten als JSON-LD, Canonical, Open Graph.
- Skip-Link, sichtbarer Fokus, Kontraste für WCAG AA berechnet, `prefers-reduced-motion`, Touch-Ziele ≥ 44 px.
- DSGVO: Google Maps lädt erst nach Klick. Die Datenschutzerklärung muss Google Maps nennen.
