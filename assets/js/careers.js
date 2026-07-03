/* GISPL Careers — open-roles filtering (team chips + hero query + location).
 * Roles now load dynamically from the API/JSON via gisplGet("jobs"). */
(function () {
  "use strict";
  var ROLES = [];
  var state = { q: "", loc: "All", roleFilter: "All" };
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  var rowsEl = document.getElementById("roleRows");
  if (!rowsEl) return; // not the careers page

  function roleRow(r) {
    var href = r.slug ? "job.html?slug=" + encodeURIComponent(r.slug) : "#apply";
    return '<a href="' + href + '" class="gx-role-row" style="text-decoration:none;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;padding:22px 26px;border-bottom:1px solid rgba(11,30,59,.09)">'
      + '<div style="display:flex;flex-direction:column;gap:6px;flex:1 1 240px;min-width:0">'
      + '<span style="font:600 19px Archivo;color:#0B1E3B">' + esc(r.title) + "</span>"
      + '<span style="font:500 11px \'IBM Plex Mono\';letter-spacing:.12em;color:#C4632A">' + esc(r.team) + "</span></div>"
      + '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'
      + '<span style="font:500 11px \'IBM Plex Mono\';letter-spacing:.06em;color:#5B647C;border:1px solid rgba(11,30,59,.14);padding:6px 12px;border-radius:20px;white-space:nowrap">' + esc(r.loc) + "</span>"
      + '<span style="font:500 11px \'IBM Plex Mono\';letter-spacing:.06em;color:#5B647C;border:1px solid rgba(11,30,59,.14);padding:6px 12px;border-radius:20px;white-space:nowrap">' + esc(r.type) + "</span>"
      + '<span class="gx-apply" style="font:600 14px \'IBM Plex Sans\';color:#F26A21;display:inline-flex;align-items:center;gap:6px;margin-left:6px">View role <span style="font-size:15px">&rarr;</span></span>'
      + "</div></a>";
  }
  function render() {
    var rf = state.roleFilter || "All", q = (state.q || "").trim().toLowerCase(), loc = state.loc || "All";
    var filtered = ROLES.filter(function (r) {
      if (rf !== "All" && r.team !== rf) return false;
      if (loc !== "All" && r.loc.indexOf(loc) === -1) return false;
      if (q && (r.title + " " + r.team).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    rowsEl.innerHTML = filtered.map(roleRow).join("");
    var nr = document.getElementById("noResults"); if (nr) nr.style.display = filtered.length ? "none" : "block";
    var rc = document.getElementById("roleCount"); if (rc) rc.textContent = filtered.length;
    var rt = document.getElementById("roleTotalR"); if (rt) rt.textContent = ROLES.length;
    each(document.querySelectorAll(".gx-chip-filter"), function (ch) {
      var on = ch.getAttribute("data-team") === rf;
      ch.style.background = on ? "#F26A21" : "#fff";
      ch.style.color = on ? "#fff" : "#5B647C";
      ch.style.borderColor = on ? "#F26A21" : "rgba(11,30,59,.16)";
    });
    var hasFilter = !!(q || loc !== "All");
    var cs = document.getElementById("clearSearch"); if (cs) cs.style.display = hasFilter ? "inline" : "none";
  }
  each(document.querySelectorAll(".gx-chip-filter"), function (ch) {
    ch.addEventListener("click", function () { state.roleFilter = ch.getAttribute("data-team"); render(); });
  });
  var hq = document.getElementById("heroQ"); if (hq) hq.addEventListener("input", function (e) { state.q = e.target.value; render(); });
  var hl = document.getElementById("heroLoc"); if (hl) hl.addEventListener("change", function (e) { state.loc = e.target.value; render(); });
  function clearFilters() { state.q = ""; state.loc = "All"; state.roleFilter = "All"; if (hq) hq.value = ""; if (hl) hl.value = "All"; render(); }
  var cs = document.getElementById("clearSearch"); if (cs) cs.addEventListener("click", clearFilters);
  var nrc = document.getElementById("noResultsClear"); if (nrc) nrc.addEventListener("click", clearFilters);

  function statusMsg(text) {
    rowsEl.innerHTML = '<div style="padding:44px 26px;text-align:center;font:500 14px \'IBM Plex Sans\';color:#8A92A4">' + esc(text) + "</div>";
  }

  // Load roles from the shared data provider, then render.
  statusMsg("Loading open roles…");
  GISPL.data.list("jobs").then(function (jobs) {
    ROLES = jobs;
    render();
  }).catch(function (err) {
    if (window.console) console.error("careers: failed to load jobs", err);
    statusMsg("Open roles are temporarily unavailable. Please email careers@gispl.com.");
  });
})();
