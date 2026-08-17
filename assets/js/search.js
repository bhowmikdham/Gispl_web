/* GISPL — /search/ results page.
   Renders results for ?q=, using the same index and scorer as the header
   dropdown (search-core.js).

   Before this page existed, pressing Enter in site search sent every visitor
   to roles.html?q=… — so someone searching "SOC 2" landed on the jobs board. */
(function () {
  "use strict";

  var form = document.getElementById("srchForm");
  var input = document.getElementById("srchInput");
  var out = document.getElementById("srchResults");
  var summary = document.getElementById("srchSummary");
  if (!form || !input || !out) return;

  var SANS = "'IBM Plex Sans'";
  var MONO = "'IBM Plex Mono'";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function row(e) {
    return '<a href="' + esc(e.href) + '" style="text-decoration:none;display:block;' +
      'padding:20px 0;border-bottom:1px solid rgba(11,30,59,.1)">' +
      '<div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">' +
      '<span style="font:600 19px Archivo;color:#0B1E3B">' + esc(e.t) + "</span>" +
      '<span style="font:500 10px ' + MONO + ';letter-spacing:.14em;color:#fff;' +
      'background:#C4632A;padding:3px 9px;border-radius:20px">' + esc(e.type) + "</span>" +
      "</div>" +
      (e.sub ? '<div style="font:500 12px ' + MONO + ';letter-spacing:.08em;' +
        'color:#8A92A4;margin-top:6px">' + esc(e.sub) + "</div>" : "") +
      "</a>";
  }

  function query() {
    return (new URLSearchParams(location.search).get("q") || "").trim();
  }

  function render(q, entries) {
    if (!q) {
      summary.textContent = "Type a query to search the site.";
      out.innerHTML = "";
      return;
    }
    var hits = window.GISPLSearch.rank(entries, q, 40);
    summary.textContent = hits.length
      ? hits.length + (hits.length === 1 ? " result for " : " results for ") + "“" + q + "”"
      : "No results for “" + q + "”";
    out.innerHTML = hits.length
      ? hits.map(row).join("")
      : '<p style="font:400 16px/1.7 ' + SANS + ';color:#5B647C;margin:20px 0 0">' +
        "Try a broader term, or browse " +
        '<a href="' + (window.GX_ROOT || "/") + 'services.html" style="color:#C4632A">services</a>, ' +
        '<a href="' + (window.GX_ROOT || "/") + 'insights/" style="color:#C4632A">insights</a> or ' +
        '<a href="' + (window.GX_ROOT || "/") + 'careers/roles/" style="color:#C4632A">open roles</a>.</p>';
  }

  var q0 = query();
  input.value = q0;
  document.title = q0 ? ('Search: ' + q0 + " — GISPL") : "Search — GISPL";

  window.GISPLSearch.loadIndex().then(function (entries) {
    render(q0, entries);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim();
      // Keep the URL shareable and the back button meaningful without a reload.
      history.replaceState(null, "", location.pathname + (q ? "?q=" + encodeURIComponent(q) : ""));
      document.title = q ? ("Search: " + q + " — GISPL") : "Search — GISPL";
      render(q, entries);
    });
  });
})();
