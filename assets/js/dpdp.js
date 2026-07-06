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

  /* gate: validate, then reveal the checklist in place of the form */
  var gate = document.getElementById("dpdpGate");
  var list = document.getElementById("dpdpChecklist");
  if (gate && list) {
    gate.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!gate.checkValidity()) { gate.reportValidity(); return; }
      gate.style.display = "none";
      list.style.display = "block";
      list.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
})();
