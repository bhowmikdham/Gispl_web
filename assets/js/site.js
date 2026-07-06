/* GISPL — shared site behavior (both pages)
   Services mega-menu (hover-driven active category), nav search toggle, mobile menu.
   All lookups are null-guarded so a page missing a hook simply skips that behavior. */
(function () {
  "use strict";

  // Shared services taxonomy — drives the Services mega-menu on every page.
  var SVC = [
    { name: "Compliance & certification", blurb: "Certify to the standards your customers, regulators and boards expect.", items: ["PCI DSS", "HIPAA", "SOC 1 & SOC 2", "GDPR", "RBI compliance (NBFC)", "Data Protection Act", "ISO standards"] },
    { name: "Consulting & maintenance", blurb: "ISO management-system design, implementation and ongoing upkeep.", items: ["ISO 27001 · ISMS", "ISO 27017 · Cloud", "ISO 27018 · Privacy", "ISO 22301 · Continuity", "ISO 20000 · ITSM", "ISO 27799 · Health"] },
    { name: "Assessments & testing", blurb: "CERT-IN empanelled testing across your applications, network and OT.", items: ["VAPT services", "Network security testing", "Web & mobile app testing", "AI & LLM security testing", "SCADA / OT testing", "IoT security testing", "Secure source code review", "Red / blue / purple teaming", "Compromise assessment", "Maturity assessment", "ERP security audit"] },
    { name: "Implementation & managed services", blurb: "Build, run and monitor your defences — 24×7, under one accountable team.", items: ["Cloud security", "Network security", "Application security", "IoT security", "Open source security", "Switching security", "SOC monitoring (24×7)", "Ransomware detection & response", "ISMS / ITSMS maintenance"] },
    { name: "Cyber forensics & investigations", blurb: "Evidence-grade forensics, investigations and workforce due-diligence.", items: ["Digital forensics", "Forensic audit", "Private investigations", "Fingerprint verification", "Employee background checks", "PhishSniper"] }
  ];

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  // items with a dedicated page deep-link to it; everything else goes to the services overview
  var ITEM_HREFS = { "VAPT services": "service-vapt.html", "AI & LLM security testing": "service-ai-security.html" };
  function itemHref(x) { return ITEM_HREFS[x] || "services.html"; }

  /* ---- Services mega-menu ---- */
  function paintRow(el, on) {
    var bar = el.querySelector(".gx-cat-bar"), nm = el.querySelector(".gx-cat-name"), ar = el.querySelector(".gx-cat-arrow");
    el.style.background = on ? "rgba(255,255,255,.05)" : "transparent";
    if (bar) bar.style.background = on ? "#F26A21" : "transparent";
    if (nm) nm.style.color = on ? "#fff" : "rgba(255,255,255,.82)";
    if (ar) { ar.style.color = on ? "#F26A21" : "rgba(255,255,255,.3)"; ar.style.transform = on ? "translateX(0)" : "translateX(-5px)"; }
  }
  function setSvc(i) {
    var rows = document.querySelectorAll(".gx-cat-row");
    if (!rows.length) return;
    each(rows, function (r) { paintRow(r, +r.getAttribute("data-svc") === i); });
    var d = SVC[i]; if (!d) return;
    var n = document.getElementById("svcName"); if (n) n.textContent = d.name;
    var b = document.getElementById("svcBlurb"); if (b) b.textContent = d.blurb;
    var it = document.getElementById("svcItems");
    if (it) it.innerHTML = d.items.map(function (x) {
      return '<a class="gx-svc-item" href="' + itemHref(x) + '" style="text-decoration:none;display:flex;align-items:center;gap:9px;padding:9px 0;font:500 14px \'IBM Plex Sans\';line-height:1.3">' + esc(x) + "</a>";
    }).join("");
  }
  each(document.querySelectorAll(".gx-cat-row"), function (r) {
    var i = +r.getAttribute("data-svc");
    r.addEventListener("mouseenter", function () { setSvc(i); });
    r.addEventListener("click", function () { setSvc(i); });
  });
  var svcMega = document.getElementById("svcMega");
  if (svcMega) svcMega.addEventListener("mouseleave", function () { setSvc(0); });
  if (document.querySelectorAll(".gx-cat-row").length) setSvc(0);

  /* ---- nav dropdowns: click to open, stay open until dismissed ---- */
  var menus = document.querySelectorAll(".gx-mm, .gx-drop");
  function closeMenus(except) {
    each(menus, function (m) {
      if (m === except) return;
      m.classList.remove("open");
      var t = m.querySelector("[aria-expanded]");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  }
  each(menus, function (m) {
    var panel = m.querySelector(".gx-mm-panel, .gx-drop-panel");
    var trigger = m.querySelector("a.gx-nav-link, span.gx-nav-link");
    if (!panel || !trigger || panel.contains(trigger)) return;
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("click", function (ev) {
      ev.preventDefault(); // the menu owns the click; the page itself is linked inside the panel
      var willOpen = !m.classList.contains("open");
      closeMenus();
      if (willOpen) { m.classList.add("open"); trigger.setAttribute("aria-expanded", "true"); }
    });
  });
  document.addEventListener("click", function (ev) {
    if (!(ev.target.closest && ev.target.closest(".gx-mm, .gx-drop"))) closeMenus();
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") closeMenus();
  });

  /* ---- live site search: results as you type, across pages, services, roles and insights.
     Enter opens the highlighted (or top) result; every query can fall back to a roles search. ---- */
  var SEARCH_PAGES = [
    { t: "Services overview", href: "services.html", kw: "services capabilities overview lifecycle offerings what we do" },
    { t: "VAPT services", href: "service-vapt.html", kw: "vapt penetration pentest pen testing vulnerability assessment web mobile network cloud cert-in" },
    { t: "AI & LLM security testing", href: "service-ai-security.html", kw: "ai llm artificial intelligence prompt injection jailbreak rag agent model machine learning" },
    { t: "VAPT methodology", href: "vapt-methodology.html", kw: "methodology process phases approach engagement how testing works scoping reporting retest" },
    { t: "SEBI CSCRF", href: "sebi-cscrf.html", kw: "sebi cscrf broker audit regulated entity market cyber resilience framework compliance" },
    { t: "DPDP readiness", href: "dpdp-readiness.html", kw: "dpdp data protection privacy consent readiness deadline enforcement fiduciary act india" },
    { t: "Industries we serve", href: "industries.html", kw: "industries sectors bfsi bank financial telecom manufacturing pharma healthcare government" },
    { t: "Insights & articles", href: "insights.html", kw: "insights blog articles news thinking read publications research" },
    { t: "About GISPL", href: "about.html", kw: "about company who leadership team history experience years story offices" },
    { t: "Careers at GISPL", href: "careers.html", kw: "careers jobs hiring work join benefits internship graduate culture" },
    { t: "Open roles", href: "roles.html", kw: "roles openings positions vacancies apply open job search" },
    { t: "Contact us", href: "contact.html", kw: "contact proposal quote enquiry rfp get in touch email phone offices reach" }
  ];
  var SEARCH_STATIC = SEARCH_PAGES.map(function (p) { return { t: p.t, href: p.href, type: "Page", sub: "", kw: p.kw }; });
  each(SVC, function (c) {
    each(c.items, function (it) {
      SEARCH_STATIC.push({ t: it, href: itemHref(it), type: "Service", sub: c.name, kw: c.name.toLowerCase() });
    });
  });

  // jobs + posts come from the data provider (config.js); fetched once, on first keystroke
  var dynState = { started: false, jobs: [], posts: [] };
  function loadDynamic(onReady) {
    if (dynState.started || !(window.GISPL && GISPL.data)) { onReady(); return; }
    dynState.started = true;
    var done = 0;
    function fin() { done++; if (done === 2) onReady(); }
    GISPL.data.list("jobs").then(function (jobs) {
      dynState.jobs = jobs.map(function (j) {
        return { t: j.title, href: "job.html?slug=" + encodeURIComponent(j.slug), type: "Role", sub: (j.team || "") + " · " + (j.loc || ""), kw: ((j.team || "") + " " + (j.loc || "") + " " + (j.type || "") + " job role opening position vacancy").toLowerCase() };
      });
    }).catch(function () {}).then(fin);
    GISPL.data.list("posts").then(function (posts) {
      dynState.posts = posts.map(function (p) {
        return { t: p.title, href: "article.html?slug=" + encodeURIComponent(p.slug), type: "Insight", sub: p.category || "", kw: ((p.category || "") + " " + (p.excerpt || "") + " article insight blog").toLowerCase() };
      });
    }).catch(function () {}).then(fin);
  }

  function wordsOf(s) { return String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); }
  // word-prefix matching: "pen" hits "penetration"/"pentest", never "open"/"opening"
  function scoreEntry(e, words) {
    if (!e._tw) { e._tw = wordsOf(e.t); e._kw = wordsOf((e.kw || "") + " " + (e.sub || "")); }
    var s = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i], m = 0, j;
      for (j = 0; j < e._tw.length; j++) if (e._tw[j].indexOf(w) === 0) { m = (j === 0 ? 4 : 3); break; }
      if (!m) for (j = 0; j < e._kw.length; j++) if (e._kw[j].indexOf(w) === 0) { m = 1; break; }
      if (!m) return 0; // every query word must match somewhere
      s += m;
    }
    return s;
  }
  function searchAll(q) {
    var words = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length >= 2; });
    if (!words.length) return [];
    var all = SEARCH_STATIC.concat(dynState.jobs, dynState.posts), out = [];
    each(all, function (e) { var s = scoreEntry(e, words); if (s) out.push({ e: e, s: s }); });
    out.sort(function (a, b) { return b.s - a.s || (a.e.t < b.e.t ? -1 : 1); });
    return out.slice(0, 9).map(function (x) { return x.e; });
  }
  function hi(title, q) {
    var w = (q.trim().split(/\s+/)[0] || "").toLowerCase();
    if (w) {
      var tl = title.toLowerCase(), idx = -1, from = 0;
      while (from <= tl.length) { // first occurrence at a word start
        var i = tl.indexOf(w, from);
        if (i === -1) break;
        if (i === 0 || /[^a-z0-9]/.test(tl.charAt(i - 1))) { idx = i; break; }
        from = i + 1;
      }
      if (idx >= 0) return esc(title.slice(0, idx)) + '<span style="color:#F79A6B">' + esc(title.slice(idx, idx + w.length)) + "</span>" + esc(title.slice(idx + w.length));
    }
    return esc(title);
  }
  function rowHTML(e, i, active, q, idPrefix) {
    return '<a id="' + idPrefix + i + '" role="option" aria-selected="' + (active ? "true" : "false") + '" href="' + e.href + '" style="display:flex;align-items:center;gap:12px;padding:11px 16px;text-decoration:none;border-left:3px solid ' + (active ? "#F26A21" : "transparent") + ";background:" + (active ? "rgba(255,255,255,.06)" : "transparent") + '">'
      + '<span style="flex:1;min-width:0"><span style="display:block;font:500 14px \'IBM Plex Sans\';color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + hi(e.t, q) + "</span>"
      + (e.sub ? '<span style="display:block;font:400 12px \'IBM Plex Sans\';color:rgba(255,255,255,.5);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(e.sub) + "</span>" : "")
      + "</span>"
      + '<span style="flex:none;font:500 9px \'IBM Plex Mono\';letter-spacing:.14em;color:rgba(255,255,255,.45);border:1px solid rgba(255,255,255,.18);padding:3px 8px;border-radius:12px">' + e.type.toUpperCase() + "</span></a>";
  }
  function footHTML(q) {
    return '<a href="roles.html?q=' + encodeURIComponent(q) + '" style="display:block;padding:12px 16px;text-decoration:none;font:600 13px \'IBM Plex Sans\';color:#F26A21;border-top:1px solid rgba(255,255,255,.1)">Search open roles for &ldquo;' + esc(q) + '&rdquo; &rarr;</a>';
  }

  // wires live search onto an input; mountFn places the results panel, hooks = {onEscape, onOpen}
  function attachLiveSearch(input, mountFn, hooks) {
    hooks = hooks || {};
    var panel = document.createElement("div");
    panel.setAttribute("role", "listbox");
    panel.style.cssText = "display:none;background:#0C2136;border-top:2px solid #F26A21;border-bottom:1px solid rgba(255,255,255,.1);box-shadow:0 34px 64px -20px rgba(0,0,0,.7);overflow-y:auto;z-index:80";
    mountFn(panel);
    var idPrefix = "gxsr-" + Math.random().toString(36).slice(2, 6) + "-";
    var results = [], active = -1, timer = null;

    function close() {
      panel.style.display = "none";
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      active = -1;
    }
    function render() {
      var q = input.value.trim();
      if (q.length < 2) { close(); return; }
      results = searchAll(q);
      var html = "";
      if (results.length) { for (var i = 0; i < results.length; i++) html += rowHTML(results[i], i, i === active, q, idPrefix); }
      else html = '<div style="padding:14px 16px;font:400 13px \'IBM Plex Sans\';color:rgba(255,255,255,.55)">No matches for &ldquo;' + esc(q) + "&rdquo;.</div>";
      panel.innerHTML = html + footHTML(q);
      panel.style.display = "block";
      input.setAttribute("aria-expanded", "true");
      if (active >= 0) {
        input.setAttribute("aria-activedescendant", idPrefix + active);
        var el = document.getElementById(idPrefix + active);
        if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
      } else input.removeAttribute("aria-activedescendant");
      if (hooks.onOpen) hooks.onOpen();
    }
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-autocomplete", "list");
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () { active = -1; loadDynamic(render); render(); }, 120);
    });
    input.addEventListener("keydown", function (e) {
      var open = panel.style.display !== "none";
      if (e.key === "ArrowDown" && open) { e.preventDefault(); active = Math.min(active + 1, results.length - 1); render(); }
      else if (e.key === "ArrowUp" && open) { e.preventDefault(); active = Math.max(active - 1, -1); render(); }
      else if (e.key === "Enter") {
        e.preventDefault();
        var href = null;
        if (open && active >= 0 && results[active]) href = results[active].href;
        else if (open && results.length) href = results[0].href;
        else if (input.value.trim()) href = "roles.html?q=" + encodeURIComponent(input.value.trim());
        if (href) location.href = href;
      } else if (e.key === "Escape") { close(); if (hooks.onEscape) hooks.onEscape(); }
    });
    // mousedown would steal focus and fire blur before the click lands — keep focus, let the click navigate
    panel.addEventListener("mousedown", function (e) { e.preventDefault(); });
    input.addEventListener("blur", function () { setTimeout(close, 150); });
    return { close: close, panel: panel };
  }

  /* desktop nav search */
  var searchToggle = document.getElementById("searchToggle"), navSearch = document.getElementById("navSearch");
  if (searchToggle && navSearch) {
    // Give the search results panel its OWN positioning context — a small wrapper
    // around the input + toggle. Do NOT make the whole <nav> position:relative:
    // that turns the nav into the containing block for the full-bleed mega-menu
    // panels too, squashing them into the nav's right-aligned box instead of
    // letting them span the sticky header. (This was the "menu sits on one side" bug.)
    var searchWrap = document.createElement("span");
    searchWrap.style.cssText = "position:relative;display:inline-flex;align-items:center;height:100%";
    navSearch.parentNode.insertBefore(searchWrap, navSearch);
    searchWrap.appendChild(navSearch);
    searchWrap.appendChild(searchToggle);
    var deskLS = attachLiveSearch(navSearch, function (panel) {
      panel.style.position = "absolute";
      panel.style.top = "100%";
      panel.style.right = "0";
      panel.style.width = "400px";
      panel.style.maxWidth = "92vw";
      panel.style.maxHeight = "420px";
      panel.style.borderRadius = "0 0 10px 10px";
      searchWrap.appendChild(panel);
    }, {
      onEscape: function () { navSearch.value = ""; closeS(); searchToggle.focus(); }
    });
    function openS() { navSearch.style.display = "inline-block"; navSearch.style.width = "230px"; navSearch.focus(); }
    function closeS() { navSearch.style.display = "none"; deskLS.close(); }
    function isOpen() { return navSearch.style.display !== "none" && navSearch.style.display !== ""; }
    searchToggle.addEventListener("click", function () { isOpen() ? closeS() : openS(); });
    searchToggle.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openS(); } });
    navSearch.addEventListener("blur", function () { setTimeout(function () { if (!navSearch.value.trim()) closeS(); }, 160); });
  }

  /* mobile search: same live results, injected at the top of the burger panel */
  var mobPanelEl = document.getElementById("mobilePanel");
  if (mobPanelEl && mobPanelEl.firstElementChild) {
    var mobInner = mobPanelEl.firstElementChild;
    var mobWrap = document.createElement("div");
    mobWrap.style.cssText = "padding:14px 0 4px";
    mobWrap.innerHTML = '<input id="mobSearch" placeholder="Search GISPL…" aria-label="Search GISPL" style="width:100%;box-sizing:border-box;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.2);border-radius:9px;padding:12px 14px;font:500 15px \'IBM Plex Sans\';color:#fff;outline:none">';
    mobInner.insertBefore(mobWrap, mobInner.firstChild);
    attachLiveSearch(mobWrap.querySelector("input"), function (panel) {
      panel.style.position = "static";
      panel.style.marginTop = "8px";
      panel.style.borderRadius = "10px";
      panel.style.maxHeight = "320px";
      mobWrap.appendChild(panel);
    }, {});
  }

  /* ---- mobile menu ---- */
  var burger = document.getElementById("burger"), mob = document.getElementById("mobilePanel");
  if (burger && mob) {
    burger.addEventListener("click", function () {
      var open = mob.style.display === "none" || mob.style.display === "";
      mob.style.display = open ? "block" : "none";
    });
    mob.addEventListener("click", function (ev) {
      if (ev.target.closest && ev.target.closest("a")) mob.style.display = "none";
    });
  }

  /* ---- AI assistant: full widget lives in assistant.js (KB bot + proactive nudge) ---- */
  (function () {
    if (window.__gxAssistant || document.getElementById("gxAiFab")) return;
    var s = document.createElement("script");
    s.src = "assets/js/assistant.js";
    s.defer = true;
    document.body.appendChild(s);
  })();
})();
