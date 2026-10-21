/* Rustikal & Schön – JavaScript ohne Framework, ohne Tracking */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Mobiles Vollbild-Menü ---------------------------------------------- */
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
      iframe.className = "absolute inset-0 h-full w-full border-0";
      iframe.allowFullscreen = true;
      mapBox.replaceChildren(iframe);
    });
  }

  /* 4. Hero-Bild zoomt nach dem Laden heran ------------------------------- */
  requestAnimationFrame(function () {
    document.body.classList.add("is-loaded");
  });

  /* 5. Inhalte beim Scrollen einblenden ----------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal], [data-reveal-group], [data-reveal-img]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    // Bilder mit clip-path zählen für den Observer als unsichtbar – daher den
    // Elterncontainer beobachten und das Bild selbst freischalten.
    var targets = new Map();
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            (targets.get(entry.target) || entry.target).classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      var watch = el.hasAttribute("data-reveal-img") ? el.parentElement : el;
      targets.set(watch, el);
      io.observe(watch);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 6. Scroll-Effekte: Kopfzeile, Parallaxe, waagerechte Galerie ---------- */
  var header = document.getElementById("site-header");
  var parallaxEls = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var hscroll = document.querySelector(".hscroll");
  var hTrack = hscroll && hscroll.querySelector(".hscroll-track");
  var hBar = hscroll && hscroll.querySelector(".hscroll-progress span");
  var wideScreen = window.matchMedia("(min-width: 1024px)");
  var pinned = false;
  var hDistance = 0;
  var lastY = window.scrollY;
  var ticking = false;

  function layoutGallery() {
    if (!hscroll || !hTrack) return;
    pinned = wideScreen.matches && !reduceMotion;
    hscroll.classList.toggle("is-pinned", pinned);
    if (pinned) {
      hTrack.parentElement.scrollLeft = 0;
      hDistance = Math.max(0, hTrack.scrollWidth - window.innerWidth);
      hscroll.style.height = window.innerHeight + hDistance + "px";
    } else {
      hscroll.style.height = "";
      hTrack.style.transform = "";
    }
  }

  function onScroll() {
    ticking = false;
    var y = window.scrollY;

    if (header) {
      header.dataset.hidden = String(y > lastY && y > 400 && root.style.overflow !== "hidden");
    }
    lastY = y;

    var vh = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var speed = parseFloat(el.dataset.parallax) || 0.2;
      var offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });

    if (pinned) {
      var top = hscroll.getBoundingClientRect().top;
      var progress = Math.min(1, Math.max(0, -top / (hDistance || 1)));
      hTrack.style.transform = "translate3d(" + (-progress * hDistance).toFixed(1) + "px,0,0)";
      if (hBar) hBar.style.transform = "scaleX(" + progress.toFixed(4) + ")";
    }
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }

  layoutGallery();
  onScroll();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", function () {
    layoutGallery();
    requestTick();
  });
  // Bilder in der Galerie ändern beim Laden die Breite der Spur
  if (hTrack) {
    hTrack.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", layoutGallery);
    });
  }

  /* 7. Sortiment: Bildvorschau folgt dem Mauszeiger ----------------------- */
  var list = document.getElementById("sortiment-list");
  var preview = document.getElementById("cursor-preview");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (list && preview && finePointer.matches) {
    var imgs = preview.querySelectorAll("img");
    var pos = { x: 0, y: 0 };
    var target = { x: 0, y: 0 };
    var running = false;

    var follow = function () {
      pos.x += (target.x - pos.x) * (reduceMotion ? 1 : 0.14);
      pos.y += (target.y - pos.y) * (reduceMotion ? 1 : 0.14);
      var w = preview.offsetWidth;
      var h = preview.offsetHeight;
      preview.style.transform = "translate3d(" + (pos.x - w / 2).toFixed(1) + "px," + (pos.y - h / 2).toFixed(1) + "px,0)";
      if (running) requestAnimationFrame(follow);
    };

    list.addEventListener("mouseenter", function (e) {
      pos.x = target.x = e.clientX;
      pos.y = target.y = e.clientY;
      running = true;
      preview.classList.add("is-active");
      requestAnimationFrame(follow);
    });
    list.addEventListener("mousemove", function (e) {
      target.x = e.clientX;
      target.y = e.clientY;
    });
    list.addEventListener("mouseleave", function () {
      running = false;
      preview.classList.remove("is-active");
    });
    list.querySelectorAll(".sortiment-row").forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        var idx = parseInt(row.dataset.preview, 10);
        imgs.forEach(function (img, i) {
          img.classList.toggle("is-current", i === idx);
        });
      });
    });
  }
})();
