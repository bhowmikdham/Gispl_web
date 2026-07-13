/* GISPL Services — scroll reveals, lifecycle rail, stat count-ups, deadline countdown,
   capability-explorer tabs. All effects are one-time and respect prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- count-up ---- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce || !window.requestAnimationFrame) { el.textContent = target + suffix; return; }
    var t0 = null, dur = 900;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function activate(el) {
    el.classList.add("sv-in");
    if (el.classList.contains("sv-lc")) el.classList.add("sv-on");
    var counts = el.querySelectorAll("[data-count]");
    Array.prototype.forEach.call(counts, countUp);
  }

  /* ---- reveal on scroll (one-time) ---- */
  var revealables = document.querySelectorAll(".sv-rv");
  if (!("IntersectionObserver" in window) || reduce) {
    Array.prototype.forEach.call(revealables, activate);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { activate(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  }

  /* ---- DPDP deadline countdown ---- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-deadline]"), function (el) {
    var iso = el.getAttribute("data-deadline"), days;
    try { // whole calendar days in IST — same math as the DPDP page, so the counts always agree
      var todayIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
      days = Math.round((Date.parse(iso) - Date.parse(todayIST)) / 86400000);
    } catch (e) {
      days = Math.ceil((new Date(iso + "T00:00:00+05:30") - new Date()) / 86400000);
    }
    if (isNaN(days)) return;
    el.textContent = days > 0 ? "· " + days + " DAYS LEFT" : "· DEADLINE PASSED";
  });

  /* ---- capability explorer tabs ---- */
  var tabs = document.querySelectorAll(".sv-x-tab");
  var panels = document.querySelectorAll(".sv-x-panel");
  function select(i) {
    Array.prototype.forEach.call(tabs, function (t) {
      var on = t.getAttribute("data-x") === String(i);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1; // roving tabindex — only the active tab is in the tab order
    });
    Array.prototype.forEach.call(panels, function (p) {
      p.classList.toggle("sv-x-live", p.getAttribute("data-xp") === String(i));
    });
  }
  Array.prototype.forEach.call(tabs, function (t, idx) {
    t.addEventListener("click", function () { select(t.getAttribute("data-x")); });
    t.addEventListener("keydown", function (ev) {
      var n = tabs.length, next = null;
      if (ev.key === "ArrowDown" || ev.key === "ArrowRight") next = (idx + 1) % n;
      else if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") next = (idx - 1 + n) % n;
      if (next !== null) {
        ev.preventDefault();
        tabs[next].focus();
        select(tabs[next].getAttribute("data-x"));
      }
    });
  });
})();
