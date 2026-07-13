/* GISPL Insights — render article cards from the API/JSON, then category filter. */
(function () {
  "use strict";
  var grid = document.getElementById("insGrid");
  var chips = document.querySelectorAll(".ins-chip");
  if (!grid) return; // not the insights page
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }

  function card(p) {
    var cat = p.category || "";
    var meta = (p.readTime || "") + (p.dateLabel ? " · " + p.dateLabel : "");
    var href = p.slug ? "article.html?slug=" + encodeURIComponent(p.slug) : "#";
    return '<a href="' + href + '" class="ins-card" data-cat="' + esc(cat) + '" style="text-decoration:none;display:flex;flex-direction:column">'
      + '<div style="position:relative;height:200px;border-radius:14px;overflow:hidden;background:linear-gradient(140deg,#14315B 0%,#0B1E3B 60%,#1B2740 100%);border:1px solid rgba(11,30,59,.1)">'
      + '<div style="position:absolute;inset:0;background:repeating-linear-gradient(125deg,rgba(255,255,255,.045) 0 1px,transparent 1px 13px)"></div>'
      + '<div style="position:absolute;inset:0;background:radial-gradient(60% 70% at 74% 26%,rgba(242,106,33,.24),transparent 60%)"></div>'
      + '<span style="position:absolute;top:18px;left:18px;font:500 10px \'IBM Plex Mono\';letter-spacing:.14em;color:#fff;background:rgba(242,106,33,.95);padding:5px 11px;border-radius:20px">' + esc(cat.toUpperCase()) + "</span>"
      + '</div>'
      + '<div style="font:500 11px \'IBM Plex Mono\';letter-spacing:.1em;color:#8A92A4;margin:16px 0 9px">' + esc(meta) + "</div>"
      + '<h3 style="font:600 20px/1.25 Archivo;letter-spacing:-.01em;color:#0B1E3B;margin:0 0 10px">' + esc(p.title) + "</h3>"
      + '<p style="font:400 14px/1.6 \'IBM Plex Sans\';color:#5B647C;margin:0 0 14px;flex:1">' + esc(p.excerpt || "") + "</p>"
      + '<span style="font:600 14px \'IBM Plex Sans\';color:#F26A21">Read article &rarr;</span></a>';
  }

  function wireFilter() {
    var cards = grid.querySelectorAll(".ins-card");
    function select(cat) {
      Array.prototype.forEach.call(chips, function (ch) {
        var on = ch.getAttribute("data-cat") === cat;
        ch.style.background = on ? "#F26A21" : "#fff";
        ch.style.color = on ? "#fff" : "#5B647C";
        ch.style.borderColor = on ? "#F26A21" : "rgba(11,30,59,.16)";
      });
      Array.prototype.forEach.call(cards, function (c) {
        c.style.display = (cat === "All" || c.getAttribute("data-cat") === cat) ? "flex" : "none";
      });
    }
    Array.prototype.forEach.call(chips, function (ch) {
      ch.addEventListener("click", function () { select(ch.getAttribute("data-cat")); });
    });
  }

  grid.innerHTML = '<div style="grid-column:1/-1;padding:30px 0;font:500 14px \'IBM Plex Sans\';color:#8A92A4">Loading articles…</div>';
  if (!(window.GISPL && GISPL.data)) {
    grid.innerHTML = '<div style="grid-column:1/-1;padding:30px 0;font:500 14px \'IBM Plex Sans\';color:#8A92A4">Articles are temporarily unavailable.</div>';
  } else GISPL.data.list("posts").then(function (posts) {
    if (!posts.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;padding:30px 0;font:500 14px \'IBM Plex Sans\';color:#8A92A4">No articles published yet.</div>';
      return;
    }
    grid.innerHTML = posts.map(card).join("");
    wireFilter();
  }).catch(function (err) {
    if (window.console) console.error("insights: failed to load posts", err);
    grid.innerHTML = '<div style="grid-column:1/-1;padding:30px 0;font:500 14px \'IBM Plex Sans\';color:#8A92A4">Articles are temporarily unavailable.</div>';
  });

  /* newsletter: no backend yet — hand off to the visitor's email client */
  var nl = document.getElementById("nlForm");
  if (nl) {
    nl.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!nl.checkValidity()) { nl.reportValidity(); return; }
      var em = nl.querySelector('input[name="email"]');
      location.href = "mailto:info@gispl.com?subject=" + encodeURIComponent("Subscribe to GISPL insights")
        + "&body=" + encodeURIComponent("Please add " + em.value.trim() + " to the GISPL insights mailing list.\n");
      var note = document.getElementById("nlNote");
      if (note) note.style.display = "block";
    });
  }
})();
