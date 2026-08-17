/* GISPL Contact — RFP form validation + mailto handoff (no backend yet), and live office clocks. */
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

    /* No backend yet: hand the enquiry to the visitor's email client, fully composed,
       so the lead actually reaches info@gisconsulting.in instead of being discarded. */
    var FIELD_LABELS = { name: "Name", company: "Company", email: "Email", phone: "Phone", industry: "Industry", service: "Service", location: "Location", message: "Message" };
    function mailtoURL() {
      var lines = [], service = "";
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !FIELD_LABELS[el.name]) return; // skips the honeypot too
        var v = String(el.value || "").trim();
        if (el.name === "service") service = v;
        if (v) lines.push(FIELD_LABELS[el.name] + ": " + v);
      });
      var subject = "Proposal request" + (service ? " — " + service : "");
      var body = "Hello GISPL,\n\nPlease send a proposal for the following:\n\n" + lines.join("\n") + "\n";
      return "mailto:info@gisconsulting.in?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var hp = form.querySelector('input[name="website"]'); // honeypot: bots fill it, humans never see it
      var isBot = !!(hp && hp.value);
      if (!isBot) location.href = mailtoURL();
      // keep the filled form on screen: if no mail client opened, nothing typed is lost
      if (ok) ok.style.display = "block"; // same UX either way — no signal to bots
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
