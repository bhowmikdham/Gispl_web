/* GISPL DPDP readiness — milestone day counts + checklist gate. */
(function () {
  "use strict";

  /* days remaining until each fixed milestone (calm: whole days, no ticking).
     Deadlines are Indian law — counted in IST regardless of the visitor's timezone. */
  function daysUntilIST(iso) {
    try {
      var todayIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
      return Math.round((Date.parse(iso) - Date.parse(todayIST)) / 86400000);
    } catch (e) {
      return Math.ceil((new Date(iso + "T00:00:00") - new Date()) / 86400000);
    }
  }
  var marks = document.querySelectorAll("[data-deadline]");
  Array.prototype.forEach.call(marks, function (el) {
    var days = daysUntilIST(el.getAttribute("data-deadline"));
    if (!isNaN(days)) el.textContent = days > 0 ? String(days) : "0";
  });

  /* gate: validate, then reveal the checklist in place of the form.

     The reveal is unconditional and happens first. Whoever filled the form in
     good faith gets the checklist whether or not the lead reaches us — holding
     the content hostage to a backend round trip would punish the visitor for
     our outage. The POST is fire-and-forget behind it.

     The form shows a notice ("Used only to follow up on your readiness") rather
     than a consent checkbox; the API records that notice as the consent basis.
     If a checkbox is added here, widen the contact-form consent test in
     site-api/src/handlers.js to cover this source too. */
  var gate = document.getElementById("dpdpGate");
  var list = document.getElementById("dpdpChecklist");
  if (gate && list) {
    var api = window.GISPL && window.GISPL.api;

    /* honeypot — off-screen, aria-hidden; humans never fill it */
    var hp = document.createElement("input");
    hp.type = "text";
    hp.name = "website";
    hp.tabIndex = -1;
    hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");
    hp.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:0;height:0;opacity:0;pointer-events:none";
    gate.appendChild(hp);

    gate.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!gate.checkValidity()) { gate.reportValidity(); return; }

      var read = function (n) {
        var el = gate.querySelector('[name="' + n + '"]');
        return el ? String(el.value || "").trim() : "";
      };

      gate.style.display = "none";
      list.style.display = "block";
      list.scrollIntoView({ behavior: "smooth", block: "center" });

      if (api && api.enabled()) {
        api.post("/v1/leads", {
          source: "dpdp-checklist",
          name: read("name"),
          email: read("email"),
          company: read("company"),
          website: hp.value
        }).catch(function () { /* the checklist is already open; nothing to tell the visitor */ });
      }
    });
  }
})();
