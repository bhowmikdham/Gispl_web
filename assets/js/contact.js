/* GISPL Contact — RFP form validation + success state (no backend), and live office clocks. */
(function () {
  "use strict";
  var form = document.getElementById("rfpForm");
  if (form) {
    var ok = document.getElementById("rfpOk");

    /* selects show a muted placeholder until a value is chosen */
    var sels = form.querySelectorAll("select");
    function paintSel(s) { s.style.color = s.value ? "#fff" : "rgba(255,255,255,.5)"; }
    Array.prototype.forEach.call(sels, function (s) {
      paintSel(s);
      s.addEventListener("change", function () { paintSel(s); });
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var hp = form.querySelector('input[name="website"]'); // honeypot: bots fill it, humans never see it
      var isBot = !!(hp && hp.value);
      if (!isBot) {
        /* real submission goes here once the backend lands */
      }
      if (ok) ok.style.display = "block"; // same UX either way — no signal to bots
      form.reset();
      Array.prototype.forEach.call(sels, paintSel);
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
