/* GISPL Contact — RFP form validation + success state (no backend), and live office clocks. */
(function () {
  "use strict";
  var form = document.getElementById("rfpForm");
  if (form) {
    var ok = document.getElementById("rfpOk");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (ok) ok.style.display = "block";
      form.reset();
      if (ok && ok.scrollIntoView) ok.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* live local time on the office cards */
  var clocks = document.querySelectorAll("[data-tz]");
  if (clocks.length && window.Intl && Intl.DateTimeFormat) {
    var tick = function () {
      var now = new Date();
      Array.prototype.forEach.call(clocks, function (el) {
        try {
          el.textContent = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit", minute: "2-digit", hour12: false,
            timeZone: el.getAttribute("data-tz")
          }).format(now);
        } catch (err) { /* unknown zone: keep placeholder */ }
      });
    };
    tick();
    setInterval(tick, 30000);
  }
})();
