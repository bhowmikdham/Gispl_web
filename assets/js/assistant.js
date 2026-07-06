/* GISPL Assistant — self-contained Q&A widget.
 * - Knowledge-base bot: keyword-scored answers built ONLY from site content.
 * - Proactive nudge: page-aware message after 5s on secondary pages (once per session).
 * - Honest: labelled as a guided assistant, never pretends to be a human.
 * - Live-LLM upgrade path: set window.GISPL_BOT_ENDPOINT to a backend proxy
 *   (POST {question, page} -> {answer, ctaLabel, ctaHref}); KB is the fallback.
 * "Training" = extend KB entries below; unanswered questions are logged to
 *   localStorage["gispl.botUnanswered"] for review.
 */
(function () {
  "use strict";
  if (window.__gxAssistant) return; window.__gxAssistant = 1;
  var path = (location.pathname.split("/").pop() || "index.html");
  if (path === "contact.html") return; // that page IS the conversion — no bot
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ================= knowledge base ================= */
  var CONTACT_CTA = { label: "Contact us", href: "contact.html" };
  var KB = [
    { id: "greet", keys: "hi hello hey namaste greetings start",
      a: "Hello — I can answer questions about GISPL's services, compliance deadlines, offices and careers. Try one of the suggestions below, or type a question." },
    { id: "services", keys: "services service offer offering capabilities list everything provide portfolio",
      a: "GISPL covers the full security lifecycle: <strong>VAPT &amp; penetration testing</strong>, <strong>AI &amp; LLM security testing</strong>, <strong>ISO 27001</strong>, <strong>PCI DSS</strong>, <strong>SEBI CSCRF audits</strong>, <strong>DPDP readiness</strong>, <strong>24×7 managed security</strong>, <strong>cyber forensics</strong> and security training — one accountable team.",
      cta: { label: "Explore all services", href: "services.html" } },
    { id: "vapt", keys: "vapt penetration pentest pen test testing vulnerability assessment web mobile network cloud scope scoping",
      a: "Our CERT-In empanelled VAPT covers web, mobile, network, cloud, API and OT — manual, chained exploitation that proves impact, ranked by exploitability, with a free retest and closure certificate after you remediate.",
      cta: { label: "VAPT & pen testing", href: "service-vapt.html" } },
    { id: "methodology", keys: "methodology phases process steps how does the test work approach engagement",
      a: "Every engagement runs a disciplined cycle: scope &amp; rules of engagement → reconnaissance → manual exploitation &amp; validation → board-ready reporting → retest &amp; closeout.",
      cta: { label: "See the methodology", href: "vapt-methodology.html" } },
    { id: "ai", keys: "ai llm artificial intelligence prompt injection jailbreak rag agent model machine learning chatbot genai gen",
      a: "We adversarially test LLM apps, RAG pipelines and agentic systems — prompt injection, jailbreaks, data poisoning, agent/tool abuse and data leakage — aligned to the OWASP LLM Top 10 and NIST AI RMF.",
      cta: { label: "AI & LLM security testing", href: "service-ai-security.html" } },
    { id: "ai-impact", keys: "impact ai business matters risk adoption agents enterprise transformation", boost: /impact/,
      a: "AI is moving into core operations — <strong>40% of enterprise applications are expected to ship AI agents by end-2026</strong>. That creates an attack surface traditional testing never covered, and procurement teams and auditors now ask for evidence it has been tested.",
      cta: { label: "AI & LLM security testing", href: "service-ai-security.html" } },
    { id: "cscrf", keys: "sebi cscrf stock broker regulated entity market intermediary amc exchange audit deadline june cyber resilience framework",
      a: "SEBI's CSCRF first-audit deadline for qualified and mid-size REs was <strong>30 June 2026</strong> — non-compliance now accrues daily penalties plus exchange action. Audits are valid only from CERT-In empanelled organisations; GISPL is one, and the cycle is annual (half-yearly for QSBs).",
      cta: { label: "SEBI CSCRF audit", href: "sebi-cscrf.html" } },
    { id: "dpdp", keys: "dpdp data protection act privacy digital personal deadline dates enforcement penalty fiduciary",
      a: "Two fixed dates: the <strong>Consent Manager mandate on 13 November 2026</strong> and <strong>full enforcement on 13 May 2027</strong>, with penalties up to ₹250 crore. Our readiness programme maps consent, rights and breach-reporting duties to your actual systems.",
      cta: { label: "DPDP readiness", href: "dpdp-readiness.html" } },
    { id: "consent", keys: "consent manager mandate november integrate registered",
      a: "From <strong>13 November 2026</strong>, every data fiduciary relying on consent must integrate with a registered Consent Manager. Our DPDP programme includes choosing and wiring that integration path.",
      cta: { label: "DPDP readiness", href: "dpdp-readiness.html" } },
    { id: "certin", keys: "cert-in cert in certin empanelled empanelment government recognised recognized",
      a: "GISPL is a <strong>CERT-In empanelled organisation</strong> — the empanelment regulators, banks and boards recognise, and a hard requirement for SEBI CSCRF audits. Roughly 200 firms in India hold it." },
    { id: "iso", keys: "iso 27001 27017 27018 22301 20000 27799 isms certification implement audit ready",
      a: "We take you from gap analysis to certification readiness across ISO 27001 (ISMS), 27017, 27018, 22301, 20000 and 27799 — build, implement and maintain, end to end.",
      cta: CONTACT_CTA },
    { id: "pci", keys: "pci dss payment card qsa merchant acquirer tokenisation",
      a: "PCI DSS scoping, remediation and ongoing compliance for payment environments — including scope-reduction strategies that make compliance smaller and cheaper.",
      cta: CONTACT_CTA },
    { id: "soc", keys: "soc managed security monitoring 24x7 24/7 mdr detection response ransomware watch",
      a: "Our managed security practice runs 24×7 monitoring, threat intelligence, ransomware detection and incident response — one accountable team watching your estate.",
      cta: CONTACT_CTA },
    { id: "forensics", keys: "forensics investigation evidence court digital audit background check phishsniper",
      a: "Evidence-grade digital forensics: origin, extent and impact of a breach — analysis that stands up in court and in the boardroom, plus forensic audits and workforce due-diligence.",
      cta: CONTACT_CTA },
    { id: "training", keys: "training awareness secure coding programme educate workshop",
      a: "Security awareness and secure-coding programmes that measurably cut human risk — from boardroom briefings to developer deep-dives.",
      cta: CONTACT_CTA },
    { id: "incident", keys: "hacked breach emergency urgent incident attack compromised ransomware active asap", boost: /hacked|breach|urgent|emergency|compromised|ransomware|attack/,
      a: "If you are dealing with an active incident, skip the forms — call <strong>+91 124 401 0000</strong> and you will be routed straight to the 24×7 forensics and incident-response team.",
      cta: { label: "Call the response team", href: "tel:+911244010000" } },
    { id: "price", keys: "price cost pricing charge fee quote budget expensive proposal estimate", boost: /how much|cost|price|charge|fee|quote|budget/, bw: 4,
      a: "Scoping and the proposal are free and carry no obligation — you get a fixed scope, fixed price and clear timeline before committing to anything, usually within one business day.",
      cta: { label: "Request a proposal", href: "contact.html" } },
    { id: "nda", keys: "nda confidential non disclosure agreement secret", boost: /\bnda\b|disclosure/,
      a: "Yes — we routinely sign NDAs before any scoping discussion. Mention it in the contact form and we will send ours, or work from yours." },
    { id: "response", keys: "how long reply respond response turnaround wait time day",
      a: "You will hear back within <strong>one business day</strong> — from a specialist in the relevant practice, not a queue. The first scoping call typically happens the same week." },
    { id: "contact", keys: "contact email phone number reach call telephone write speak talk human person specialist someone real",
      a: "Reach us at <strong>info@gispl.com</strong> or <strong>+91 124 401 0000</strong> (Mon–Fri, 09:00–18:00 IST). For proposals, the contact form routes you to the right specialist.",
      cta: CONTACT_CTA },
    { id: "offices", keys: "office location where based address gurgaon delhi doha qatar maryland usa us america india global",
      a: "Four offices on three continents: <strong>Gurgaon (HQ)</strong> and <strong>Delhi</strong> in India, <strong>Doha</strong> in Qatar, and <strong>Maryland</strong> in the US.",
      cta: { label: "Offices & contact", href: "contact.html" } },
    { id: "careers", keys: "career careers job jobs role roles open opening openings position positions vacancy vacancies hiring work join team recruit",
      a: "We hire across assessments, compliance, managed security, forensics and early careers — from senior penetration testers to graduate analysts.",
      cta: { label: "See open roles", href: "roles.html" } },
    { id: "apply", keys: "apply cv resume application send submit",
      a: "Apply against a specific role, or send your CV to <strong>careers@gispl.com</strong> — every application is read by a person, not a filter.",
      cta: { label: "Open roles", href: "roles.html" } },
    { id: "intern", keys: "intern internship graduate entry level fresher summer student campus",
      a: "Yes — a structured graduate intake and 10-week internships inside a live security practice: real engagements, real mentors, and a real shot at a full-time offer.",
      cta: { label: "Careers at GISPL", href: "careers.html" } },
    { id: "benefits", keys: "benefits perks leave insurance certification sponsored oscp cissp salary hybrid remote mobility",
      a: "Sponsored certifications (OSCP, CISSP, ISO LA, PCI QSA), hybrid working, family medical cover, real time off and global mobility across our four offices.",
      cta: { label: "Benefits & wellbeing", href: "careers.html#benefits" } },
    { id: "about", keys: "about company who is gispl history experience years old founded background trust",
      a: "GISPL (G-Info Technology Solutions) is a CERT-In empanelled information-security consultancy — <strong>15+ years</strong>, <strong>200+ engagements</strong>, <strong>120+ specialists</strong>, protecting banks, hospitals, telecoms and governments across three continents.",
      cta: { label: "About GISPL", href: "about.html" } },
    { id: "clients", keys: "clients customers who work with panasonic interglobe stellar punj lloyd references big-4 big4",
      a: "Security teams at <strong>Panasonic, Punj Lloyd, InterGlobe and Stellar</strong> trust GISPL, and we partner with Big-4 consulting firms on delivery." },
    { id: "industries", keys: "industries bfsi bank financial telecom manufacturing pharma healthcare government sector vertical",
      a: "We go deep in five sectors — BFSI, telecom, manufacturing, pharma &amp; healthcare and government — each with its regulators, threat model and audit expectations.",
      cta: { label: "Industries", href: "industries.html" } },
    { id: "insights", keys: "blog articles insights read publication news thinking",
      a: "Our Insights hub carries field notes and regulatory reads — DPDP, CSCRF, PCI v4.0, forensics and phishing trends.",
      cta: { label: "Read Insights", href: "insights.html" } },
    { id: "thanks", keys: "thanks thank you great awesome perfect cool ok okay bye goodbye",
      a: "Glad to help. If anything else comes up, I am here — or a specialist is one message away.",
      cta: CONTACT_CTA }
  ];
  var CHIPS = [
    { q: "What services do you offer?", id: "services" },
    { q: "SEBI CSCRF deadline?", id: "cscrf" },
    { q: "DPDP dates?", id: "dpdp" },
    { q: "How is a VAPT scoped?", id: "vapt" }
  ];
  /* page-aware proactive nudges (secondary pages only) */
  var NUDGES = {
    "services.html": { m: "Comparing services? Ask me about any of them.", id: "services", q: "What services do you offer?" },
    "service-vapt.html": { m: "Questions about scoping a VAPT?", id: "vapt", q: "How is a VAPT scoped?" },
    "vapt-methodology.html": { m: "Want the methodology in one answer?", id: "methodology", q: "How does the engagement work?" },
    "service-ai-security.html": { m: "Curious how AI systems get tested?", id: "ai", q: "How do you test AI systems?" },
    "sebi-cscrf.html": { m: "Wondering what CSCRF means for you?", id: "cscrf", q: "What is the SEBI CSCRF deadline?" },
    "dpdp-readiness.html": { m: "What do the DPDP dates mean for you?", id: "dpdp", q: "What are the DPDP deadlines?" },
    "careers.html": { m: "Looking for open roles?", id: "careers", q: "What roles are open?" },
    "roles.html": { m: "Need help picking a role?", id: "careers", q: "What roles are open?" },
    "job.html": { m: "Questions about this role or how we hire?", id: "apply", q: "How do I apply?" },
    "about.html": { m: "Want the short version of who we are?", id: "about", q: "Who is GISPL?" },
    "industries.html": { m: "Ask how we work in your sector.", id: "industries", q: "Which industries do you serve?" },
    "insights.html": { m: "Looking for something specific?", id: "insights", q: "What do you publish?" },
    "article.html": { m: "Questions on this topic? Ask me.", id: null, q: null }
  };

  /* ================= engine ================= */
  function norm(s) { return s.toLowerCase().replace(/[^a-z0-9\s+/-]/g, " ").replace(/\s+/g, " ").trim(); }
  var SYN = { pentesting: "pentest", penetration: "pentest", pricing: "price", cost: "price", fees: "price",
              vulnerabilities: "vulnerability", locations: "location", addresses: "address", employments: "job" };
  var STOP = {}; ("a an the do does did done you your yours we our us i me my mine is are was were be been being it its this that these those and or but with about of on in at for to from by as how what when where who whom why which can could would should will shall may might have has had get got need needs want wants right now please tell know if any some there".split(" ")).forEach(function (w) { STOP[w] = 1; });
  // phrase bonuses for the strong single-word signals
  var BOOST = { cscrf: /cscrf|sebi/, dpdp: /dpdp/, ai: /\bai\b|llm/, vapt: /vapt|pentest/ };
  function answer(qRaw) {
    var q = norm(qRaw);
    var toks = q.split(" ")
      .map(function (t) { return SYN[t] || t; })
      .filter(function (t) { return t.length > 1 && !STOP[t]; });
    var best = null, bestScore = 0;
    KB.forEach(function (e) {
      var keys = e.keys.split(" ");
      var score = 0;
      toks.forEach(function (t) {
        // exact match, or light plural-folding in either direction
        if (keys.indexOf(t) > -1 || keys.indexOf(t.replace(/s$/, "")) > -1 || keys.indexOf(t + "s") > -1) score += 2;
      });
      var b = e.boost || BOOST[e.id];
      if (b && b.test(q)) score += (e.bw || 3);
      if (score > bestScore) { bestScore = score; best = e; }
    });
    if (best && bestScore >= 2) return best;
    return null;
  }
  function logUnanswered(q) {
    try {
      var k = "gispl.botUnanswered";
      var arr = JSON.parse(localStorage.getItem(k) || "[]");
      arr.push({ q: q, page: path, at: new Date().toISOString() });
      localStorage.setItem(k, JSON.stringify(arr.slice(-200)));
    } catch (e) { /* storage unavailable */ }
  }
  var FALLBACK = {
    a: "I don't have a confident answer for that yet — I have noted it so the team can add it. A specialist can answer directly within one business day.",
    cta: CONTACT_CTA
  };

  /* ================= widget ================= */
  var fab = document.createElement("button");
  fab.id = "gxAiFab"; fab.className = "gx-ai-fab";
  fab.setAttribute("aria-label", "Open GISPL assistant");
  fab.setAttribute("aria-expanded", "false");
  fab.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F26A21" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/></svg>' +
    '<span class="gx-ai-fab-label">Ask about GISPL</span>';
  document.body.appendChild(fab);

  var panel = document.createElement("div");
  panel.className = "gx-ai-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "GISPL assistant");
  var SPARK = function (px) {
    return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 24 24" fill="none" stroke="#F26A21" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/></svg>';
  };
  panel.innerHTML =
    '<div class="gx-ai-head">' +
    '<span class="gx-ai-badge">' + SPARK(16) + '</span>' +
    '<span class="gx-ai-ht"><span class="gx-ai-title">GISPL Assistant</span>' +
    '<span class="gx-ai-sub">Guided answers &middot; replies instantly</span></span>' +
    '<button class="gx-ai-x" aria-label="Close">&times;</button></div>' +
    '<div class="gx-ai-log" id="gxAiLog"></div>' +
    '<div class="gx-ai-chips" id="gxAiChips"></div>' +
    '<form class="gx-ai-inputrow" id="gxAiForm">' +
    '<input class="gx-ai-input" id="gxAiInput" type="text" placeholder="Type a question…" autocomplete="off" maxlength="200" aria-label="Ask a question" />' +
    '<button class="gx-ai-send" type="submit" aria-label="Send"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></button>' +
    '</form>' +
    '<div class="gx-ai-note">ANSWERS FROM GISPL SITE CONTENT</div>';
  document.body.appendChild(panel);

  var log = panel.querySelector("#gxAiLog");
  var chipsEl = panel.querySelector("#gxAiChips");
  var form = panel.querySelector("#gxAiForm");
  var input = panel.querySelector("#gxAiInput");

  function scrollLog() { log.scrollTop = log.scrollHeight; }
  function revealMsg(d) {
    if (reduce) d.classList.add("in");
    else requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add("in"); }); });
  }
  function addMsg(cls, html) {
    var d = document.createElement("div");
    if (cls === "gx-ai-a") {
      // bot messages ride in an avatar row
      d.className = "gx-ai-row gx-ai-step";
      d.innerHTML = '<span class="gx-ai-av">' + SPARK(12) + '</span><div class="gx-ai-a">' + html + "</div>";
    } else {
      d.className = cls + " gx-ai-step";
      d.innerHTML = html;
    }
    log.appendChild(d);
    revealMsg(d);
    scrollLog();
    return d;
  }
  function botReply(entry) {
    var t = document.createElement("div");
    t.className = "gx-ai-row in";
    t.innerHTML = '<span class="gx-ai-av">' + SPARK(12) + '</span><div class="gx-ai-typing"><span></span><span></span><span></span></div>';
    log.appendChild(t); scrollLog();
    setTimeout(function () {
      t.remove();
      var html = entry.a;
      if (entry.cta) html += '<a class="gx-ai-btn sm" href="' + entry.cta.href + '">' + esc(entry.cta.label) + ' <span aria-hidden="true">&rarr;</span></a>';
      addMsg("gx-ai-a", html);
    }, reduce ? 0 : 550);
  }
  function ask(qText, kbId) {
    addMsg("gx-ai-q", esc(qText));
    if (chipsEl.parentNode) chipsEl.remove(); // suggestions served their purpose
    var entry = kbId ? KB.filter(function (e) { return e.id === kbId; })[0] : answer(qText);
    if (!entry) { logUnanswered(qText); entry = FALLBACK; }
    /* live-LLM hook: prefer the backend when configured */
    if (window.GISPL_BOT_ENDPOINT && !kbId) {
      var fell = false;
      var timer = setTimeout(function () { fell = true; botReply(entry); }, 6000);
      fetch(window.GISPL_BOT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: qText, page: path }) })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (fell) return; clearTimeout(timer); botReply({ a: esc(j.answer), cta: j.ctaHref ? { label: j.ctaLabel || "Learn more", href: j.ctaHref } : null }); })
        .catch(function () { if (!fell) { clearTimeout(timer); botReply(entry); } });
      return;
    }
    botReply(entry);
  }

  var open = false, greeted = false;
  function greet(seed) {
    if (!greeted) {
      greeted = true;
      addMsg("gx-ai-a", KB[0].a);
      CHIPS.forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "gx-ai-chip"; b.textContent = c.q;
        b.addEventListener("click", function () { ask(c.q, c.id); });
        chipsEl.appendChild(b);
      });
    }
    if (seed && seed.id) setTimeout(function () { ask(seed.q, seed.id); }, reduce ? 0 : 350);
  }
  function setOpen(v, seed) {
    open = v;
    panel.classList.toggle("open", v);
    fab.setAttribute("aria-expanded", v ? "true" : "false");
    hideNudge();
    if (v) { greet(seed); setTimeout(function () { input.focus(); }, 200); }
  }
  fab.addEventListener("click", function () { setOpen(!open); });
  panel.querySelector(".gx-ai-x").addEventListener("click", function () { setOpen(false); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && open) setOpen(false); });
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = "";
    ask(q);
  });

  /* ---- reveal: scroll threshold, or forced by the nudge ---- */
  var shown = false;
  function reveal() {
    if (shown) return;
    shown = true;
    fab.classList.add("on");
    if (reduce) fab.classList.add("bar");
    else setTimeout(function () { fab.classList.add("bar"); }, 500);
    window.removeEventListener("scroll", onScroll);
  }
  function onScroll() { if (window.scrollY > 420) reveal(); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- proactive nudge: 5s dwell on secondary pages, once per session ---- */
  var nudgeEl = null;
  function hideNudge() { if (nudgeEl) { nudgeEl.classList.remove("in"); var n = nudgeEl; nudgeEl = null; setTimeout(function () { n.remove(); }, 300); } }
  var nd = NUDGES[path];
  var canNudge = nd && !sessionStorage.getItem("gxai.nudged");
  if (canNudge) {
    setTimeout(function () {
      if (open) return;
      try { sessionStorage.setItem("gxai.nudged", "1"); } catch (e) {}
      reveal();
      nudgeEl = document.createElement("div");
      nudgeEl.className = "gx-ai-nudge";
      nudgeEl.setAttribute("role", "status");
      nudgeEl.innerHTML = '<button class="gx-ai-x" aria-label="Dismiss">&times;</button>' + esc(nd.m) +
        '<span class="gx-ai-nudge-hint">Click to ask</span>';
      document.body.appendChild(nudgeEl);
      requestAnimationFrame(function () { requestAnimationFrame(function () { nudgeEl.classList.add("in"); }); });
      nudgeEl.querySelector(".gx-ai-x").addEventListener("click", function (ev) { ev.stopPropagation(); hideNudge(); });
      nudgeEl.addEventListener("click", function () { var seed = nd.id ? { id: nd.id, q: nd.q } : null; setOpen(true, seed); });
      setTimeout(hideNudge, 15000); // quietly retire if ignored
    }, 5000);
  }
})();
