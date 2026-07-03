/* GISPL — VAPT methodology page behavior.
   Scroll progress bar, reveal-on-scroll, scroll-driven lifecycle spine
   (fill + phase node activation + sticky phase pill), count-up stats.
   All lookups null-guarded; honours prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  /* ---- reveal on scroll ---- */
  var rv = document.querySelectorAll(".mx-rv");
  if (reduce || !("IntersectionObserver" in window)) {
    each(rv, function (el) { el.classList.add("mx-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      each(entries, function (en) {
        if (en.isIntersecting) { en.target.classList.add("mx-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -7% 0px" });
    each(rv, function (el) { io.observe(el); });
  }

  /* ---- count-up stats ---- */
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll(".mx-num[data-target]");
  if (nums.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      each(nums, runCounter);
    } else {
      var nio = new IntersectionObserver(function (entries) {
        each(entries, function (en) {
          if (en.isIntersecting) { runCounter(en.target); nio.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      each(nums, function (el) { nio.observe(el); });
    }
  }

  /* ---- scroll progress + lifecycle spine ---- */
  var bar = document.getElementById("mxProgress");
  var tl = document.getElementById("mxTimeline");
  var fill = document.getElementById("mxFill");
  var cap = document.getElementById("mxCap");
  var rows = document.querySelectorAll(".mx-row");
  var segs = document.querySelectorAll(".mx-seg");
  var pillNum = document.getElementById("mxPillNum");
  var pillName = document.getElementById("mxPillName");
  var names = [];
  each(rows, function (r) { names.push(r.getAttribute("data-name") || ""); });

  var ticking = false;
  function update() {
    ticking = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    if (!tl || !fill) return;
    var rect = tl.getBoundingClientRect();
    var trigger = window.innerHeight * 0.55;
    var h = Math.max(0, Math.min(trigger - rect.top, rect.height));
    fill.style.height = h + "px";
    var passed = 0;
    each(rows, function (r, i) {
      var node = r.querySelector(".mx-node");
      if (!node) return;
      var mid = r.offsetTop + node.offsetTop + node.offsetHeight / 2;
      var on = h >= mid;
      r.classList.toggle("mx-on", on);
      if (on) passed = i + 1;
    });
    if (cap) cap.classList.toggle("mx-on", h >= cap.offsetTop + cap.offsetHeight / 2);
    each(segs, function (s, i) { s.classList.toggle("mx-on", i < passed); });
    var cur = Math.max(1, passed);
    if (pillNum) pillNum.textContent = "PHASE 0" + cur + " / 08";
    if (pillName) pillName.textContent = names[cur - 1] || "";
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", update);
  update();

  /* ---- phase pill segments jump to their phase ---- */
  each(segs, function (s, i) {
    s.addEventListener("click", function () {
      var r = rows[i];
      if (r) r.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    });
  });

  /* ---- hero orbital navigator ----
     A calm phase-by-phase stepper: one active node, a progress trail whose
     leading edge sits on the active node, and a centre readout that names it.
     Auto-advances on a slow cadence; pauses on hover/focus; clicking a node
     jumps to that phase in the timeline. Reduced motion: no auto-advance. */
  var orb = document.getElementById("mxOrb");
  var arc = document.getElementById("mxOrbArc");
  var onodes = document.querySelectorAll(".mx-onode");
  if (orb && arc && onodes.length) {
    var oNum = document.getElementById("mxOrbNum");
    var oName = document.getElementById("mxOrbName");
    var oKey = document.getElementById("mxOrbKey");
    var C = 942.4778; // 2·π·150, matches stroke-dasharray
    try { C = arc.getTotalLength(); } catch (e) {}
    var meta = [];
    each(rows, function (r) {
      meta.push({ name: r.getAttribute("data-name") || "", key: r.getAttribute("data-key") || "" });
    });
    var cur = -1, timer = null, paused = false;
    var pad2 = function (n) { return (n < 10 ? "0" : "") + n; };

    function setActive(i, fromUser) {
      if (i === cur) return;
      cur = i;
      each(onodes, function (g, j) {
        g.classList.toggle("mx-active", j === i);
        g.classList.toggle("mx-passed", j < i);
      });
      arc.style.strokeDashoffset = (C * (1 - i / 8)) + "";
      var m = meta[i] || { name: "", key: "" };
      if (oNum && oName && oKey) {
        if (reduce) {
          oNum.textContent = "PHASE " + pad2(i + 1);
          oName.textContent = m.name; oKey.textContent = m.key;
        } else {
          oName.style.opacity = 0; oKey.style.opacity = 0;
          setTimeout(function () {
            oNum.textContent = "PHASE " + pad2(i + 1);
            oName.textContent = m.name; oKey.textContent = m.key;
            oName.style.opacity = 1; oKey.style.opacity = 1;
          }, 130);
        }
      }
      if (fromUser) restart();
    }
    function advance() { setActive((cur + 1) % onodes.length); }
    function start() {
      if (reduce || paused || timer) return;
      timer = window.setInterval(advance, 2600);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); if (!paused) start(); }

    each(onodes, function (g, i) {
      g.addEventListener("click", function () {
        setActive(i, true);
        var r = rows[i];
        if (r) r.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      });
      g.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); g.click(); }
      });
    });
    orb.addEventListener("mouseenter", function () { paused = true; stop(); });
    orb.addEventListener("mouseleave", function () { paused = false; start(); });
    orb.addEventListener("focusin", function () { paused = true; stop(); });
    orb.addEventListener("focusout", function () { paused = false; start(); });

    setActive(0);
    // start advancing only once the hero is actually on screen
    if (reduce || !("IntersectionObserver" in window)) {
      start();
    } else {
      var oio = new IntersectionObserver(function (entries) {
        each(entries, function (en) { if (en.isIntersecting) start(); else stop(); });
      }, { threshold: 0.35 });
      oio.observe(orb);
    }
  }
})();
