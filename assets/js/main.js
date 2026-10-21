/* Rustikal & Schön – JavaScript ohne Framework, ohne Tracking.
   Einzige Bibliothek: Lenis (weiches Scrollen, MIT, lokal in assets/js/vendor). */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var introShowing = root.classList.contains("js") && !root.classList.contains("intro-seen") && !reduceMotion;

  /* 1. Weiches Scrollen (nur Desktop mit Maus, nicht bei reduzierter Bewegung) */
  var lenis = null;
  if (window.Lenis && finePointer && !reduceMotion) {
    // Anker-Sprünge nutzen das scroll-padding-top aus dem CSS (Platz für die Kopfzeile)
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
    var raf = function (time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  /* 2. Mobiles Vollbild-Menü ---------------------------------------------- */
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");
  var closeBtn = document.getElementById("menu-close");
  var quickbar = document.getElementById("quickbar");
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      root.style.overflow = open ? "hidden" : "";
      if (quickbar) quickbar.hidden = open;
      if (open) {
        requestAnimationFrame(function () {
          menu.classList.add("is-visible");
        });
        menu.querySelector("a").focus();
      } else {
        menu.classList.remove("is-visible");
      }
    };
    toggle.addEventListener("click", function () {
      setMenu(true);
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setMenu(false);
        toggle.focus();
      });
    }
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

  /* 3. „Jetzt geöffnet?“ – berechnet in der Zeitzone Europa/Berlin ------- */
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

  function markToday() {
    var today = String(berlinNow().day);
    document.querySelectorAll("tr[data-days]").forEach(function (row) {
      if (row.dataset.days.split(" ").indexOf(today) !== -1) row.dataset.today = "";
      else delete row.dataset.today;
    });
  }

  renderStatus();
  markToday();
  setInterval(function () {
    renderStatus();
    markToday();
  }, 60000);

  /* 4. Google Maps erst nach Klick laden (DSGVO: Zwei-Klick-Lösung) ------ */
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
      iframe.className = "absolute inset-0 h-full w-full border-0";
      iframe.allowFullscreen = true;
      mapBox.replaceChildren(iframe);
      mapBtn.disabled = true;
      mapBtn.textContent = "Karte geladen";
    });
  }

  /* 5. Linien-Illustrationen vorbereiten: jede Linie bekommt die Länge 1 --- */
  var SHAPES = "path, circle, ellipse, line, rect, polyline, polygon, use";
  var drawings = document.querySelectorAll(".draw");
  drawings.forEach(function (svg) {
    svg.querySelectorAll(SHAPES).forEach(function (el, i) {
      if (el.classList.contains("fill")) return;
      if (el.tagName.toLowerCase() !== "use") el.setAttribute("pathLength", "1");
      el.style.setProperty("--i", String(i));
    });
    svg.classList.add("is-ready");
  });

  /* 6. Inhalte beim Scrollen einblenden ----------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal], [data-reveal-group], .draw");
  var reveal = function (el) {
    el.classList.add(el.classList.contains("draw") ? "is-drawn" : "is-visible");
  };
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          reveal(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    // Beim ersten Besuch erst nach dem Vorspann starten
    setTimeout(function () {
      revealEls.forEach(function (el) { io.observe(el); });
    }, introShowing ? 1500 : 0);
  } else {
    revealEls.forEach(reveal);
  }

  /* 7. Etiketten im Sortiment: Zeichnung beim Hover neu ziehen, leicht neigen */
  document.querySelectorAll(".etikett").forEach(function (card) {
    var svg = card.querySelector(".draw");
    var arch = card.querySelector(".arch");
    card.addEventListener("mouseenter", function () {
      if (!svg || reduceMotion) return;
      svg.classList.remove("redraw");
      void svg.getBoundingClientRect();
      svg.classList.add("redraw");
    });
    if (!finePointer || reduceMotion || !arch) return;
    arch.style.transition = "background-color 0.7s cubic-bezier(0.19, 1, 0.22, 1), color 0.7s, transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)";
    card.addEventListener("mousemove", function (e) {
      var r = arch.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      arch.style.transform = "perspective(900px) rotateY(" + (x * 7).toFixed(2) + "deg) rotateX(" + (-y * 7).toFixed(2) + "deg)";
    });
    card.addEventListener("mouseleave", function () {
      arch.style.transform = "";
    });
  });

  /* 8. Gutscheinkarte neigt sich zur Maus, Glanz folgt ------------------- */
  var gift = document.querySelector("[data-giftcard]");
  if (gift && finePointer && !reduceMotion) {
    var area = gift.parentElement;
    area.addEventListener("mousemove", function (e) {
      var r = gift.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      gift.style.setProperty("--ry", ((x - 0.5) * 16).toFixed(2) + "deg");
      gift.style.setProperty("--rx", ((0.5 - y) * 12).toFixed(2) + "deg");
      gift.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      gift.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    });
    area.addEventListener("mouseleave", function () {
      gift.style.setProperty("--rx", "0deg");
      gift.style.setProperty("--ry", "0deg");
    });
  }

  /* 9. Magnetische Buttons ----------------------------------------------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.style.transition = "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), color 0.5s";
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + (x * 0.22).toFixed(1) + "px," + (y * 0.32).toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* 10. Scroll-Effekte: Kopfzeile, Manifest-Wörter, Laufband -------------- */
  var header = document.getElementById("site-header");
  var words = [];
  var manifest = document.querySelector("[data-words]");
  if (manifest && !reduceMotion) {
    // Text in Wort-Spans zerlegen (Kursives bleibt erhalten)
    var wrapWords = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              var span = document.createElement("span");
              span.className = "w";
              span.textContent = part;
              frag.appendChild(span);
              words.push(span);
            }
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          wrapWords(child);
        }
      });
    };
    wrapWords(manifest);
  }

  var marquees = Array.prototype.slice.call(document.querySelectorAll("[data-marquee]")).map(function (el) {
    return { el: el, dir: parseFloat(el.dataset.marquee) || 1, x: 0 };
  });
  var lastY = window.scrollY;
  var velocity = 0;

  function onScroll() {
    var y = window.scrollY;
    var delta = y - lastY;
    lastY = y;
    velocity = Math.max(-40, Math.min(40, delta));

    if (header) {
      header.dataset.scrolled = String(y > 30);
      header.dataset.hidden = String(delta > 0 && y > 600 && root.style.overflow !== "hidden");
    }

    if (words.length) {
      var r = manifest.getBoundingClientRect();
      var vh = window.innerHeight;
      // Fortschritt: beginnt, wenn der Text bei 85 % der Höhe ist, endet bei 35 %
      var progress = (vh * 0.85 - r.top) / (r.height + vh * 0.5);
      var count = Math.round(Math.max(0, Math.min(1, progress)) * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle("on", i < count);
    }
  }

  if (lenis) lenis.on("scroll", onScroll);
  else window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Laufband: läuft immer, wird beim Scrollen schneller und dreht mit der Richtung
  if (marquees.length && !reduceMotion) {
    var visible = true;
    var band = marquees[0].el.parentElement;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(band);
    }
    var lastT = performance.now();
    var tick = function (t) {
      var dt = Math.min(64, t - lastT);
      lastT = t;
      velocity *= 0.92;
      if (visible) {
        var boost = 1 + Math.abs(velocity) * 0.18;
        var sign = velocity < -0.5 ? -1 : 1;
        marquees.forEach(function (m) {
          var half = m.el.scrollWidth / 2;
          m.x -= m.dir * sign * boost * dt * 0.045;
          if (m.x <= -half) m.x += half;
          if (m.x > 0) m.x -= half;
          m.el.style.transform = "translate3d(" + m.x.toFixed(1) + "px,0,0)";
        });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();
