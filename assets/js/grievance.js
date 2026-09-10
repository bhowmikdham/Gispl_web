/* GISPL — data-principal rights and grievance form (/privacy/grievance/).

   Same two paths as contact.js, decided by assets/js/api.js:
     • backend configured → POST /v1/grievances, inline validation, and a GRV
       reference with the acknowledgement timelines in the confirmation
     • no backend, or the request fails → a `mailto:` addressed to the
       Grievance Officer, so a statutory request is never silently dropped */
(function () {
  "use strict";
  var form = document.getElementById("grvForm");
  if (!form) return;
  var ok = document.getElementById("grvOk");
  var api = window.GISPL && window.GISPL.api;
  var submitBtn = form.querySelector('button[type="submit"]');
  var TO = form.getAttribute("data-officer-email") || "info@gisconsulting.in";

  var TYPE_LABELS = {
    access: "Access to personal data", correction: "Correction or updating", erasure: "Erasure",
    "withdraw-consent": "Withdrawal of consent", nominate: "Nomination", grievance: "Grievance", other: "Other request"
  };
  var FIELD_LABELS = { requestType: "Request type", name: "Name", email: "Email", phone: "Phone", relationship: "Relationship", details: "Details" };

  var err = null;
  function showError(msg) {
    if (!err) {
      err = document.createElement("div");
      err.setAttribute("role", "alert");
      err.style.cssText = "background:#FDECEA;border:1px solid rgba(179,38,30,.35);border-radius:10px;padding:14px;" +
        "font:500 14px 'IBM Plex Sans';color:#8A1F17";
      if (ok && ok.parentNode) ok.parentNode.insertBefore(err, ok); else form.appendChild(err);
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
  function values() {
    var out = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || !FIELD_LABELS[el.name]) return; // skips the honeypot
      out[el.name] = String(el.value || "").trim();
    });
    return out;
  }
  function mailtoURL() {
    var v = values(), lines = [];
    Object.keys(FIELD_LABELS).forEach(function (k) {
      if (!v[k]) return;
      lines.push(FIELD_LABELS[k] + ": " + (k === "requestType" ? (TYPE_LABELS[v[k]] || v[k]) : v[k]));
    });
    var subject = "Data-principal request — " + (TYPE_LABELS[v.requestType] || "Grievance");
    var body = "To the Grievance Officer, G-Info Technology Solutions Pvt. Ltd.\n\n" +
      "I am making the following request under the Digital Personal Data Protection Act, 2023:\n\n" +
      lines.join("\n") + "\n";
    return "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function busy(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.style.opacity = on ? ".6" : "";
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    clearError();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var hp = form.querySelector('input[name="website"]');
    var isBot = !!(hp && hp.value);

    if (!api || !api.enabled()) {
      if (!isBot) { location.href = mailtoURL(); }
      succeed();
      return;
    }

    var consentBox = form.querySelector('input[type="checkbox"][name="consent"]');
    var payload = values();
    payload.consent = !!(consentBox && consentBox.checked);
    if (hp) payload.website = hp.value;

    busy(true);
    api.post("/v1/grievances", payload).then(function (res) {
      busy(false);
      if (res.ok) {
        succeed(res.data.message || ("Thank you — your request is logged" + (res.data.ref ? " as " + res.data.ref : "") + "."));
        form.reset();
        return;
      }
      if (res.status === 429) { showError(res.data.error || "Too many submissions from this address. Please email " + TO + "."); return; }
      if (res.status === 400) { showError(api.firstFieldError(res.data) || "Please check the form and try again."); return; }
      // 5xx: the request must still reach the officer
      location.href = mailtoURL();
      succeed();
    }).catch(function () {
      busy(false);
      location.href = mailtoURL();
      succeed();
    });
  });
})();
