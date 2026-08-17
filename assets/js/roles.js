/* GISPL — dedicated role-search page (keyword + facets, deep-linkable). */
(function () {
  "use strict";
  var esc = (window.GISPL && GISPL.util && GISPL.util.esc) || function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); };
  var rowsEl = document.getElementById("resultRows");
  if (!rowsEl) return; // not the roles page

  var ROLES = [];
  var state = { q: "", loc: "All", team: "All", type: "All" };

  function byId(id) { return document.getElementById(id); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function uniq(arr) { var seen = {}, out = []; arr.forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; out.push(x); } }); return out; }

  /* ---- read/write filters in the URL so results are shareable ---- */
  function readURL() {
    try {
      var p = new URLSearchParams(location.search);
      state.q = p.get("q") || "";
      state.loc = p.get("loc") || "All";
      state.team = p.get("team") || "All";
      state.type = p.get("type") || "All";
    } catch (e) { /* older browsers: leave defaults */ }
  }
  function writeURL() {
    try {
      var p = new URLSearchParams();
      if (state.q) p.set("q", state.q);
      if (state.team !== "All") p.set("team", state.team);
      if (state.loc !== "All") p.set("loc", state.loc);
      if (state.type !== "All") p.set("type", state.type);
      var qs = p.toString();
      history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
    } catch (e) { /* no-op */ }
  }

  function roleRow(r) {
    var href = r.url || (r.slug ? "../roles/" + encodeURIComponent(r.slug) + "/" : "#");
    return '<a href="' + href + '" class="gx-role-row" style="text-decoration:none;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;padding:22px 26px;border-bottom:1px solid rgba(11,30,59,.09)">'
      + '<div style="display:flex;flex-direction:column;gap:6px;flex:1 1 240px;min-width:0">'
      + '<span style="font:600 19px Archivo;color:#0B1E3B">' + esc(r.title) + "</span>"
      + '<span style="font:500 11px \'IBM Plex Mono\';letter-spacing:.12em;color:#C4632A">' + esc(r.team) + "</span></div>"
      + '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">'
      + '<span style="font:500 11px \'IBM Plex Mono\';letter-spacing:.06em;color:#5B647C;border:1px solid rgba(11,30,59,.14);padding:6px 12px;border-radius:20px;white-space:nowrap">' + esc(r.location) + "</span>"
      + '<span style="font:500 11px \'IBM Plex Mono\';letter-spacing:.06em;color:#5B647C;border:1px solid rgba(11,30,59,.14);padding:6px 12px;border-radius:20px;white-space:nowrap">' + esc(r.employmentType) + "</span>"
      + '<span style="font:600 14px \'IBM Plex Sans\';color:#F26A21;display:inline-flex;align-items:center;gap:6px;margin-left:6px">View role <span style="font-size:15px">&rarr;</span></span>'
      + "</div></a>";
  }

  function matches(r) {
    if (state.team !== "All" && r.team !== state.team) return false;
    if (state.loc !== "All" && (r.location || "").indexOf(state.loc) === -1) return false;
    if (state.type !== "All" && r.employmentType !== state.type) return false;
    if (state.q) {
      var hay = (r.title + " " + r.team + " " + r.location + " " + r.employmentType + " " + (r.searchText || "")).toLowerCase();
      if (hay.indexOf(state.q.trim().toLowerCase()) === -1) return false;
    }
    return true;
  }

  function render() {
    var filtered = ROLES.filter(matches);
    rowsEl.innerHTML = filtered.map(roleRow).join("");

    var rc = byId("resCount"); if (rc) rc.textContent = filtered.length;
    var rt = byId("resTotal"); if (rt) rt.textContent = ROLES.length;
    var empty = byId("resEmpty"); if (empty) empty.style.display = filtered.length ? "none" : "block";
    var wrap = byId("resultsWrap"); if (wrap) wrap.style.display = filtered.length ? "block" : "none";

    // sync team chips highlight
    each(document.querySelectorAll(".rl-chip"), function (ch) {
      var on = ch.getAttribute("data-team") === state.team;
      ch.style.background = on ? "#F26A21" : "#fff";
      ch.style.color = on ? "#fff" : "#5B647C";
      ch.style.borderColor = on ? "#F26A21" : "rgba(11,30,59,.16)";
    });

    // active-filters summary + clear visibility
    var hasFilter = !!(state.q || state.team !== "All" || state.loc !== "All" || state.type !== "All");
    var clr = byId("rclear"); if (clr) clr.style.display = hasFilter ? "inline-flex" : "none";
    writeURL();
  }

  function fillSelect(sel, values, allLabel) {
    if (!sel) return;
    sel.innerHTML = '<option value="All">' + allLabel + "</option>"
      + values.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + "</option>"; }).join("");
  }

  function buildTeamChips(teams) {
    var host = byId("teamChips");
    if (!host) return;
    var chipStyle = "font:500 11px 'IBM Plex Mono';letter-spacing:.1em;text-transform:uppercase;padding:9px 15px;border-radius:22px;cursor:pointer;white-space:nowrap;border:1px solid rgba(11,30,59,.16);background:#fff;color:#5B647C";
    host.innerHTML = ["All"].concat(teams).map(function (t) {
      return '<span class="rl-chip" data-team="' + esc(t) + '" style="' + chipStyle + '">' + esc(t) + "</span>";
    }).join("");
    each(host.querySelectorAll(".rl-chip"), function (ch) {
      ch.addEventListener("click", function () { state.team = ch.getAttribute("data-team"); syncControls(); render(); });
    });
  }

  // reflect state into the form controls (used on load + chip clicks)
  function syncControls() {
    var q = byId("rq"); if (q) q.value = state.q;
    var loc = byId("rloc"); if (loc) loc.value = state.loc;
    var team = byId("rteam"); if (team) team.value = state.team;
    var type = byId("rtype"); if (type) type.value = state.type;
  }

  function clearAll() {
    state = { q: "", loc: "All", team: "All", type: "All" };
    syncControls(); render();
  }

  function wire() {
    var q = byId("rq"); if (q) q.addEventListener("input", function (e) { state.q = e.target.value; render(); });
    var loc = byId("rloc"); if (loc) loc.addEventListener("change", function (e) { state.loc = e.target.value; render(); });
    var team = byId("rteam"); if (team) team.addEventListener("change", function (e) { state.team = e.target.value; render(); });
    var type = byId("rtype"); if (type) type.addEventListener("change", function (e) { state.type = e.target.value; render(); });
    var clr = byId("rclear"); if (clr) clr.addEventListener("click", clearAll);
    var emptyClr = byId("resEmptyClear"); if (emptyClr) emptyClr.addEventListener("click", clearAll);

    var search = byId("rsearch");
    if (search) search.addEventListener("click", function (e) {
      e.preventDefault(); render();
      var rs = byId("resultsSection"); if (rs && rs.scrollIntoView) rs.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    var toggle = byId("moreToggle"), more = byId("moreFilters");
    if (toggle && more) toggle.addEventListener("click", function (e) {
      e.preventDefault();
      var open = more.style.display !== "none";
      more.style.display = open ? "none" : "grid";
      toggle.textContent = open ? "More filters +" : "Fewer filters −";
    });
  }

  function statusMsg(text) {
    rowsEl.innerHTML = '<div style="padding:44px 26px;text-align:center;font:500 14px \'IBM Plex Sans\';color:#8A92A4">' + esc(text) + "</div>";
  }

  readURL();
  wire();
  statusMsg("Loading open roles…");
  fetch((window.GX_ROOT || "/") + "assets/data/roles.json")
    .then(function (r) { if (!r.ok) throw new Error("roles.json " + r.status); return r.json(); })
    .then(function (jobs) {
    ROLES = jobs.slice().sort(function (a, b) { // newest first, independent of seed order
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });
    fillSelect(byId("rloc"), uniq(jobs.map(function (r) { return r.location; })).sort(), "All locations");
    fillSelect(byId("rteam"), uniq(jobs.map(function (r) { return r.team; })).sort(), "All teams");
    fillSelect(byId("rtype"), uniq(jobs.map(function (r) { return r.employmentType; })).sort(), "All types");
    buildTeamChips(uniq(jobs.map(function (r) { return r.team; })).sort());
    syncControls();
    render();
  }).catch(function (err) {
    if (window.console) console.error("roles: failed to load jobs", err);
    statusMsg("Open roles are temporarily unavailable. Please email careers@gisconsulting.in.");
  });
})();
