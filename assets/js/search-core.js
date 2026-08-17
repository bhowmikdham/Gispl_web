/* GISPL — shared search scoring and index loading.
   Used by the header dropdown (site.js) and the /search/ results page
   (search.js), so the two can never rank the same query differently.

   Loaded before site.js on every page. */
(function () {
  "use strict";

  function root() { return window.GX_ROOT || "/"; }

  function wordsOf(s) {
    return String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  }

  /* Word-PREFIX matching, not substring: "pen" hits "penetration" and
     "pentest" but never "open" or "opening" — substring matching on a short
     query returns mostly noise. Title matches outrank keyword matches, and a
     match on the first word of a title outranks a later one. Every query word
     must match somewhere, so multi-word queries narrow rather than widen. */
  function scoreEntry(e, words) {
    if (!e._tw) { e._tw = wordsOf(e.t); e._kw = wordsOf((e.kw || "") + " " + (e.sub || "")); }
    var s = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i], m = 0, j;
      for (j = 0; j < e._tw.length; j++) {
        if (e._tw[j].indexOf(w) === 0) { m = (j === 0 ? 4 : 3); break; }
      }
      if (!m) {
        for (j = 0; j < e._kw.length; j++) {
          if (e._kw[j].indexOf(w) === 0) { m = 1; break; }
        }
      }
      if (!m) return 0;
      s += m;
    }
    return s;
  }

  function rank(entries, query, limit) {
    var words = wordsOf(query);
    if (!words.length) return [];
    var out = [];
    for (var i = 0; i < entries.length; i++) {
      var s = scoreEntry(entries[i], words);
      if (s > 0) out.push({ e: entries[i], s: s });
    }
    out.sort(function (a, b) { return b.s - a.s || a.e.t.localeCompare(b.e.t); });
    return out.slice(0, limit || out.length).map(function (x) { return x.e; });
  }

  var cache = null;
  function loadIndex() {
    if (cache) return cache;
    cache = fetch(root() + "assets/data/search-index.json")
      .then(function (r) { return r.ok ? r.json() : { items: [] }; })
      .then(function (d) {
        return (d.items || []).map(function (it) {
          return { t: it.t, href: it.h, type: it.ty, sub: it.s || "",
                   kw: ((it.k || "") + " " + (it.s || "")).toLowerCase() };
        });
      })
      .catch(function () { return []; });
    return cache;
  }

  window.GISPLSearch = {
    wordsOf: wordsOf,
    score: scoreEntry,
    rank: rank,
    loadIndex: loadIndex,
    resultsUrl: function (q) { return root() + "search/?q=" + encodeURIComponent(q); }
  };
})();
