/* GISPL home — hero carousel (4 slides, 6s dwell, pause-on-hover, progress bars)
   and the decorative wireframe-globe canvas. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- hero carousel ---------------- */
  var hero = document.getElementById("hero");
  var slides = document.querySelectorAll(".hero-slide");
  var steps = document.querySelectorAll(".hero-step");
  if (hero && slides.length) {
    var N = slides.length, DWELL = 6000;
    var idx = 0, prog = 0, paused = false;

    function apply() {
      Array.prototype.forEach.call(slides, function (s, i) {
        s.style.opacity = i === idx ? "1" : "0";
        s.style.pointerEvents = i === idx ? "auto" : "none";
        s.setAttribute("aria-hidden", i === idx ? "false" : "true");
      });
      Array.prototype.forEach.call(steps, function (st, i) {
        var on = i === idx;
        var num = st.querySelector(".hero-step-num"), lab = st.querySelector(".hero-step-label"), fill = st.querySelector(".hero-step-fill");
        if (num) num.style.color = on ? "#F4915A" : "rgba(255,255,255,.4)";
        if (lab) lab.style.color = on ? "#fff" : "rgba(255,255,255,.5)";
        if (fill) fill.style.width = on ? (reduce ? "100%" : Math.round(prog * 100) + "%") : "0%";
      });
    }
    function go(i) { idx = ((i % N) + N) % N; prog = 0; apply(); }

    Array.prototype.forEach.call(steps, function (st, i) {
      st.addEventListener("click", function () { go(i); });
      st.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(i); }
      });
    });
    hero.addEventListener("mouseenter", function () { paused = true; });
    hero.addEventListener("mouseleave", function () { paused = false; });

    apply();
    if (!reduce) {
      setInterval(function () {
        if (paused || document.hidden) return;
        prog += 80 / DWELL;
        if (prog >= 1) { idx = (idx + 1) % N; prog = 0; }
        apply();
      }, 80);
    }
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
        var want = onScreen && tabVisible;
        if (want === running) return;
        running = want; last = null;
        if (want && rafId == null) rafId = requestAnimationFrame(loop);
      }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; sync(); }).observe(cv);
      }
      document.addEventListener("visibilitychange", function () { tabVisible = !document.hidden; sync(); });
      sync();
    }
    // re-rasterize if the canvas moves to a display with a different pixel ratio
    window.addEventListener("resize", function () {
      var d2 = Math.min(window.devicePixelRatio || 1, 2);
      if (d2 !== dpr) { dpr = d2; cv.width = size * dpr; cv.height = size * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); render(); }
    });
  }
})();
