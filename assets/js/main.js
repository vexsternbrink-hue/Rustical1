/* Rustikal & Schön – minimales JavaScript (kein Framework, kein Tracking) */
(function () {
  "use strict";

  /* 1. Mobiles Menü ------------------------------------------------------ */
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    };
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* 2. „Jetzt geöffnet?“ – berechnet in der Zeitzone Europa/Berlin ------- */
  var HOURS = {
    1: [10, 18], 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], // Mo–Fr
    6: [10, 14], // Sa
  };
  var DAYS = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

  function berlinNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Berlin",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var dayIdx = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[map.weekday];
    return { day: dayIdx, minutes: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10) };
  }

  function statusText() {
    var now = berlinNow();
    var today = HOURS[now.day];
    if (today && now.minutes >= today[0] * 60 && now.minutes < today[1] * 60) {
      var left = today[1] * 60 - now.minutes;
      if (left <= 60) return { open: true, text: "Jetzt geöffnet · schließt in " + left + " Min." };
      return { open: true, text: "Jetzt geöffnet · bis " + today[1] + " Uhr" };
    }
    // nächster Öffnungstag
    for (var i = 0; i < 8; i++) {
      var d = (now.day + i) % 7;
      var h = HOURS[d];
      if (!h) continue;
      if (i === 0 && now.minutes >= h[0] * 60) continue; // heute schon vorbei
      var label = i === 0 ? "heute" : i === 1 ? "morgen" : DAYS[d];
      return { open: false, text: "Geschlossen · öffnet " + label + " um " + h[0] + " Uhr" };
    }
    return { open: false, text: "Geschlossen" };
  }

  function renderStatus() {
    var s = statusText();
    document.querySelectorAll("[data-open-status]").forEach(function (el) {
      el.textContent = s.text;
      el.dataset.state = s.open ? "open" : "closed";
      if (el.previousElementSibling) el.previousElementSibling.dataset.state = el.dataset.state;
    });
  }
  renderStatus();
  setInterval(renderStatus, 60000);

  /* 3. Google Maps erst nach Klick laden (DSGVO: Zwei-Klick-Lösung) ------ */
  var mapBtn = document.getElementById("map-load");
  var mapBox = document.getElementById("map-box");
  if (mapBtn && mapBox) {
    mapBtn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src =
        "https://www.google.com/maps?q=" +
        encodeURIComponent("Rustikal & Schön, Claus-Ferck-Straße 3, 22359 Hamburg") +
        "&output=embed&hl=de";
      iframe.title = "Karte: Rustikal & Schön, Claus-Ferck-Straße 3, 22359 Hamburg-Volksdorf";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.className = "h-full w-full border-0";
      iframe.allowFullscreen = true;
      mapBox.replaceChildren(iframe);
    });
  }
})();
