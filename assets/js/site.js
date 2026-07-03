/* GISPL — shared site behavior (both pages)
   Services mega-menu (hover-driven active category), nav search toggle, mobile menu.
   All lookups are null-guarded so a page missing a hook simply skips that behavior. */
(function () {
  "use strict";

  // Shared services taxonomy — drives the Services mega-menu on every page.
  var SVC = [
    { name: "Compliance & certification", blurb: "Certify to the standards your customers, regulators and boards expect.", items: ["PCI DSS", "HIPAA", "SOC 1 & SOC 2", "GDPR", "RBI compliance (NBFC)", "Data Protection Act", "ISO standards"] },
    { name: "Consulting & maintenance", blurb: "ISO management-system design, implementation and ongoing upkeep.", items: ["ISO 27001 · ISMS", "ISO 27017 · Cloud", "ISO 27018 · Privacy", "ISO 22301 · Continuity", "ISO 20000 · ITSM", "ISO 27799 · Health"] },
    { name: "Assessments & testing", blurb: "CERT-IN empanelled testing across your applications, network and OT.", items: ["VAPT services", "Network security testing", "Web & mobile app testing", "SCADA / OT testing", "IoT security testing", "Secure source code review", "Red / blue / purple teaming", "Compromise assessment", "Maturity assessment", "ERP security audit"] },
    { name: "Implementation & managed services", blurb: "Build, run and monitor your defences — 24×7, under one accountable team.", items: ["Cloud security", "Network security", "Application security", "IoT security", "Open source security", "Switching security", "SOC monitoring (24×7)", "Ransomware detection & response", "ISMS / ITSMS maintenance"] },
    { name: "Cyber forensics & investigations", blurb: "Evidence-grade forensics, investigations and workforce due-diligence.", items: ["Digital forensics", "Forensic audit", "Private investigations", "Fingerprint verification", "Employee background checks", "PhishSniper"] }
  ];

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

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
      return '<a class="gx-svc-item" href="#" style="text-decoration:none;display:flex;align-items:center;gap:9px;padding:9px 0;font:500 14px \'IBM Plex Sans\';line-height:1.3">' + esc(x) + "</a>";
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

  /* ---- nav search toggle ---- */
  var searchToggle = document.getElementById("searchToggle"), navSearch = document.getElementById("navSearch");
  if (searchToggle && navSearch) searchToggle.addEventListener("click", function () {
    var open = navSearch.style.display === "none" || navSearch.style.display === "";
    navSearch.style.display = open ? "inline-block" : "none";
    if (open) navSearch.focus();
  });

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
})();
