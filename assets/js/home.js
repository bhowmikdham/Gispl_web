/* GISPL home — hero carousel (4 slides, 7s dwell, pause controls, progress bars)
   and the decorative wireframe-globe canvas. */
(function () {
  "use strict";
  var preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduce = preference.matches;

  /* ---------------- hero carousel ---------------- */
  var hero = document.getElementById("hero");
  var slides = document.querySelectorAll(".hero-slide");
  var steps = document.querySelectorAll(".hero-step");
  if (hero && slides.length) {
    var N = slides.length, DWELL = 7000;
    var idx = 0, prog = 0, hovered = false, focused = false;
    var manualPause = false, resumeRequested = false, heroVisible = true, timer = null;
    var pauseButton = document.getElementById("heroPause");
    hero.setAttribute("aria-roledescription", "carousel");
    hero.setAttribute("aria-label", "Featured security services");

    function paintProgress() {
      Array.prototype.forEach.call(steps, function (st, i) {
        var fill = st.querySelector(".hero-step-fill");
        if (fill) fill.style.transform = "scaleX(" + (i === idx ? (reduce ? 1 : prog) : 0) + ")";
      });
    }
    function apply() {
      Array.prototype.forEach.call(slides, function (s, i) {
        var active = i === idx;
        s.style.opacity = active ? "1" : "0";
        s.style.pointerEvents = active ? "auto" : "none";
        s.classList.toggle("is-active", active);
        s.toggleAttribute("inert", !active);
        s.setAttribute("aria-hidden", active ? "false" : "true");
        s.setAttribute("role", "group");
        s.setAttribute("aria-roledescription", "slide");
        s.setAttribute("aria-label", (i + 1) + " of " + N);
      });
      Array.prototype.forEach.call(steps, function (st, i) {
        var label = st.querySelector(".hero-step-label");
        st.setAttribute("aria-pressed", i === idx ? "true" : "false");
        if (label) label.style.color = i === idx ? "#fff" : "rgba(255,255,255,.6)";
      });
      paintProgress();
    }
    function go(i) { idx = ((i % N) + N) % N; prog = 0; apply(); }
    function sync() {
      var play = !reduce && !manualPause && (resumeRequested || (!hovered && !focused)) && heroVisible && !document.hidden;
      if (play && timer === null) {
        timer = setInterval(function () {
          prog += 80 / DWELL;
          if (prog >= 1) go(idx + 1);
          else paintProgress();
        }, 80);
      } else if (!play && timer !== null) { clearInterval(timer); timer = null; }
      if (pauseButton) {
        pauseButton.hidden = reduce;
        pauseButton.setAttribute("aria-pressed", manualPause ? "true" : "false");
        pauseButton.innerHTML = manualPause ? 'Resume slideshow <span aria-hidden="true">▷</span>' : 'Pause slideshow <span aria-hidden="true">Ⅱ</span>';
      }
    }
    Array.prototype.forEach.call(steps, function (st, i) {
      st.addEventListener("click", function () { go(i); });
      st.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(i); }
        if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") {
          ev.preventDefault();
          var next = (i + (ev.key === "ArrowRight" ? 1 : -1) + N) % N;
          steps[next].focus(); go(next);
        }
      });
    });
    if (pauseButton) pauseButton.addEventListener("click", function () {
      manualPause = !manualPause;
      // An explicit resume works immediately, even while this button has focus.
      resumeRequested = !manualPause;
      sync();
    });
    hero.addEventListener("mouseenter", function () { hovered = true; resumeRequested = false; sync(); });
    hero.addEventListener("mouseleave", function () { hovered = false; sync(); });
    hero.addEventListener("focusin", function () { focused = true; resumeRequested = false; sync(); });
    hero.addEventListener("focusout", function (event) { focused = hero.contains(event.relatedTarget); sync(); });
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", function () { reduce = preference.matches; paintProgress(); sync(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { heroVisible = entries[0].isIntersecting; sync(); }).observe(hero);
    }
    apply(); sync();
  }

  /* later slides' background images load after first paint, not up front (~700KB saved on arrival) */
  Array.prototype.forEach.call(document.querySelectorAll(".hero-bg[data-bg]"), function (el) {
    function show() { el.style.background = "url('" + el.getAttribute("data-bg") + "') " + (el.getAttribute("data-pos") || "center") + "/cover no-repeat"; }
    if (document.readyState === "complete") show();
    else window.addEventListener("load", show, { once: true });
  });

  /* ---------------- hero stats band: DPDP day count ---------------- */
  var stat = document.getElementById("dpdpStat");
  if (stat) {
    var num = document.getElementById("dpdpStatDays"), lab = document.getElementById("dpdpStatLabel");
    // deadlines are Indian law: count calendar days in IST regardless of the visitor's timezone
    var d = function (iso) {
      try {
        var todayIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
        return Math.round((Date.parse(iso) - Date.parse(todayIST)) / 86400000);
      } catch (e) {
        return Math.ceil((new Date(iso + "T00:00:00") - new Date()) / 86400000);
      }
    };
    var toMandate = d("2026-11-13"), toEnforce = d("2027-05-13");
    if (toMandate > 0) { num.textContent = toMandate; lab.textContent = "Days to DPDP mandate"; stat.style.display = ""; }
    else if (toEnforce > 0) { num.textContent = toEnforce; lab.textContent = "Days to DPDP enforcement"; stat.style.display = ""; }
    /* past both dates: the stat simply stays hidden */
  }

  /* ---------------- wireframe globe ---------------- */
  var cv = document.getElementById("globe");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d");
    var size = 560, dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = size * dpr; cv.height = size * dpr;
    cv.style.width = size + "px"; cv.style.height = size + "px";
    ctx.scale(dpr, dpr);
    var cx = size / 2, cy = size / 2, R = size * 0.42, tilt = 12 * Math.PI / 180;
    var lats = [], lons = [];
    for (var la = -75; la <= 75; la += 15) lats.push(la * Math.PI / 180);
    for (var lo = 0; lo < 360; lo += 15) lons.push(lo * Math.PI / 180);
    var ang = 0;
    function render() {
      ctx.clearRect(0, 0, size, size);
      var dots = [];
      for (var i = 0; i < lats.length; i++) {
        var laa = lats[i];
        for (var j = 0; j < lons.length; j++) {
          var loo = lons[j] + ang;
          var x0 = Math.cos(laa) * Math.sin(loo), y0 = Math.sin(laa), z0 = Math.cos(laa) * Math.cos(loo);
          var y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
          var z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
          dots.push({ sx: cx + x0 * R, sy: cy - y * R, z: z });
        }
      }
      dots.sort(function (a, b) { return a.z - b.z; });
      for (var k = 0; k < dots.length; k++) {
        var d = dots[k], p = (d.z + 1) / 2;
        ctx.globalAlpha = 0.08 + p * 0.62;
        ctx.fillStyle = "#0B1E3B";
        ctx.beginPath();
        ctx.arc(d.sx, d.sy, (2 + p * 5) / 2, 0, 6.2832);
        ctx.fill();
      }
    }
    render();
    if (!reduce) {
      // spin only while the canvas is on screen and the tab is visible — no idle CPU burn
      var running = false, rafId = null, last = null;
      var onScreen = true, tabVisible = !document.hidden;
      function loop(t) {
        if (!running) { rafId = null; return; }
        if (last != null) { ang += (t - last) * 0.00036; render(); }
        last = t;
        rafId = requestAnimationFrame(loop);
      }
      function sync() {
        var want = onScreen && tabVisible && !preference.matches;
        if (want === running) return;
        running = want; last = null;
        if (want && rafId == null) rafId = requestAnimationFrame(loop);
      }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; sync(); }).observe(cv);
      }
      document.addEventListener("visibilitychange", function () { tabVisible = !document.hidden; sync(); });
      preference.addEventListener("change", sync);
      sync();
    }
    // re-rasterize if the canvas moves to a display with a different pixel ratio
    window.addEventListener("resize", function () {
      var d2 = Math.min(window.devicePixelRatio || 1, 2);
      if (d2 !== dpr) { dpr = d2; cv.width = size * dpr; cv.height = size * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); render(); }
    });
  }
})();

/* Hero parallax. The photograph behind the active slide drifts up at a
   fraction of the scroll speed while the hero is in view — transform only,
   one paint per frame, nothing while the hero is off-screen, and nothing at
   all under prefers-reduced-motion. The slide's first child is the
   background layer; it is scaled slightly so the drift never exposes an
   edge. */
(function () {
  "use strict";
  var hero = document.getElementById("hero");
  if (!hero) return;
  var preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  var layers = Array.prototype.map.call(hero.querySelectorAll(".hero-slide"), function (s) { return s.firstElementChild; })
    .filter(function (el) { return el && /url\(/.test(el.style.backgroundImage || ""); });
  if (!layers.length) return;
  var frame = null, active = false;

  function paint() {
    frame = null;
    var y = window.scrollY || window.pageYOffset || 0;
    var limit = hero.offsetHeight;
    var shift = Math.min(y, limit) * 0.18;
    layers.forEach(function (el) { el.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0) scale(1.12)"; });
  }
  function queue() { if (frame === null) frame = requestAnimationFrame(paint); }
  function start() {
    if (active || preference.matches) return;
    active = true;
    layers.forEach(function (el) { el.style.willChange = "transform"; el.style.transformOrigin = "50% 40%"; });
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    paint();
  }
  function stop() {
    if (!active) return;
    active = false;
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", queue);
    layers.forEach(function (el) { el.style.transform = ""; el.style.willChange = ""; });
  }
  // Only listen while the hero can actually be seen.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) start(); else stop(); });
    }).observe(hero);
  } else {
    start();
  }
  preference.addEventListener("change", function () { if (preference.matches) stop(); else start(); });
})();
