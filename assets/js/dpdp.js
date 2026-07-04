/* GISPL DPDP readiness — milestone day counts + checklist gate. */
(function () {
  "use strict";

  /* days remaining until each fixed milestone (calm: whole days, no ticking) */
  var marks = document.querySelectorAll("[data-deadline]");
  Array.prototype.forEach.call(marks, function (el) {
    var target = new Date(el.getAttribute("data-deadline") + "T00:00:00");
    if (isNaN(target)) return;
    var days = Math.ceil((target - new Date()) / 86400000);
    el.textContent = days > 0 ? String(days) : "0";
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
