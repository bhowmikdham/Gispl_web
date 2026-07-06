/* GISPL Careers — the open-roles list now lives on the dedicated roles.html
 * page. This just (a) hands the hero keyword/location off to that page and
 * (b) keeps the "N open positions" counts live from the data provider. */
(function () {
  "use strict";
  var hq = document.getElementById("heroQ");
  var hl = document.getElementById("heroLoc");
  var btn = document.getElementById("heroSearchBtn");
  var totalEls = [document.getElementById("heroTotal"), document.getElementById("roleTotalR")];
  if (!hq && !btn && !totalEls[0] && !totalEls[1]) return; // not the careers page

  function syncBtn() {
    if (!btn) return;
    var parts = [];
    var q = hq ? hq.value.trim() : "";
    var loc = hl ? hl.value : "All";
    if (q) parts.push("q=" + encodeURIComponent(q));
    if (loc && loc !== "All") parts.push("loc=" + encodeURIComponent(loc));
    btn.href = "roles.html" + (parts.length ? "?" + parts.join("&") : "");
  }
  if (hq) hq.addEventListener("input", syncBtn);
  if (hl) hl.addEventListener("change", syncBtn);
  // Enter in the keyword box jumps straight to the roles page
  if (hq) hq.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && btn) { e.preventDefault(); window.location.href = btn.href; }
  });
  syncBtn();

  // keep the open-position counts honest against the live data
  if (window.GISPL && GISPL.data) {
    GISPL.data.list("jobs").then(function (jobs) {
      totalEls.forEach(function (el) { if (el) el.textContent = jobs.length; });
    }).catch(function () { /* leave the static fallback */ });
  }
})();
