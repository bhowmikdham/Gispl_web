/* GISPL Contact — RFP form submission and live office clocks.

   Two paths, decided by whether assets/js/api.js carries an API base:
     • backend configured → POST /v1/leads, inline validation errors, and a
       reference number in the acknowledgement
     • no backend, or the request fails → the original `mailto:` handoff, so a
       lead still reaches info@gisconsulting.in rather than being discarded */
(function () {
  "use strict";
  var form = document.getElementById("rfpForm");
  if (form) {
    var ok = document.getElementById("rfpOk");
    var api = window.GISPL && window.GISPL.api;
    var submitBtn = form.querySelector('button[type="submit"]');

    /* selects show a muted placeholder until a value is chosen */
    var sels = form.querySelectorAll("select");
    function paintSel(s) { s.style.color = s.value ? "#fff" : "rgba(255,255,255,.5)"; }
    Array.prototype.forEach.call(sels, function (s) {
      paintSel(s);
      s.addEventListener("change", function () { paintSel(s); });
    });

    /* error region, created lazily so the markup stays as-is when unused */
    var err = null;
    function showError(msg) {
      if (!err) {
        err = document.createElement("div");
        err.id = "rfpErr";
        err.setAttribute("role", "alert");
        err.style.cssText = "background:rgba(179,38,30,.14);border:1px solid rgba(255,120,110,.45);" +
          "border-radius:10px;padding:14px;font:500 14px 'IBM Plex Sans';color:#FFB4AE";
        if (ok && ok.parentNode) ok.parentNode.insertBefore(err, ok);
        else form.appendChild(err);
      }
      err.textContent = msg;
      err.style.display = "block";
      if (err.scrollIntoView) err.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    function clearError() { if (err) err.style.display = "none"; }

    function succeed(message) {
      if (!ok) return;
      if (message) ok.textContent = message;
      ok.style.display = "block";
      if (ok.scrollIntoView) ok.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    /* Every field the form posts. `title` (job title) was missing here, so the
       mailto handoff silently dropped it out of every enquiry. */
    var FIELD_LABELS = { name: "Name", title: "Job title", company: "Company", email: "Email", phone: "Phone", industry: "Industry", service: "Service", location: "Location", message: "Message" };

    function values() {
      var out = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !FIELD_LABELS[el.name]) return; // skips the honeypot too
        out[el.name] = String(el.value || "").trim();
      });
      return out;
    }

    function mailtoURL() {
      var v = values(), lines = [];
      Object.keys(FIELD_LABELS).forEach(function (k) {
        if (v[k]) lines.push(FIELD_LABELS[k] + ": " + v[k]);
      });
      var subject = "Proposal request" + (v.service ? " — " + v.service : "");
      var body = "Hello GISPL,\n\nPlease send a proposal for the following:\n\n" + lines.join("\n") + "\n";
      return "mailto:info@gisconsulting.in?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }

    /* The pre-backend behaviour, kept as the fallback path. */
    function handOffToMailClient() {
      location.href = mailtoURL();
      succeed();
    }

    function busy(on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      submitBtn.style.opacity = on ? ".6" : "";
      submitBtn.style.cursor = on ? "default" : "pointer";
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      clearError();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var hp = form.querySelector('input[name="website"]'); // honeypot: bots fill it, humans never see it
      var isBot = !!(hp && hp.value);

      if (!api || !api.enabled()) {
        // keep the filled form on screen: if no mail client opened, nothing typed is lost
        if (!isBot) handOffToMailClient();
        else succeed(); // same UX either way — no signal to bots
        return;
      }

      var consentBox = form.querySelector('input[type="checkbox"]');
      var payload = values();
      payload.source = "contact-form";
      payload.consent = !!(consentBox && consentBox.checked);
      if (hp) payload.website = hp.value;

      busy(true);
      api.post("/v1/leads", payload).then(function (res) {
        busy(false);
        if (res.ok) {
          succeed(
            (res.data.message || "Thank you — your request is with a GISPL specialist.") +
            (res.data.ref ? " Your reference is " + res.data.ref + "." : "")
          );
          form.reset();
          Array.prototype.forEach.call(sels, paintSel);
          return;
        }
        if (res.status === 429) {
          showError(res.data.error || "Too many submissions from this address. Please email info@gisconsulting.in.");
          return;
        }
        if (res.status === 400) {
          showError(api.firstFieldError(res.data) || "Please check the form and try again.");
          return;
        }
        // 5xx: the server is the broken part, so hand the lead to the mail client
        handOffToMailClient();
      }).catch(function () {
        busy(false);
        handOffToMailClient();
      });
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
