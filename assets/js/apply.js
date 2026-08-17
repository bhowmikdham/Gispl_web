/* GISPL — job application form.
   Mounted into #applyMount on a generated role page (/careers/roles/<slug>/),
   which carries the role's slug, title and apply address as data attributes.

   Two paths, decided by whether assets/js/api.js carries an API base:

   • Backend configured — the application posts to /v1/applications and the CV
     goes straight to S3 with a presigned policy that caps its size and pins its
     content type. The candidate never leaves the page.

   • No backend, or the request fails — the original `mailto:` handoff. A mailto
     cannot carry an attachment, so the candidate is asked to attach the CV
     themselves. Less slick, but it delivers the application to a human, which
     the flow this replaced did not: that one wrote the application (and the CV,
     base64-encoded) into the CANDIDATE'S OWN localStorage while telling them
     "your application has been logged". Nothing was ever transmitted. */
(function () {
  "use strict";

  var mount = document.getElementById("applyMount");
  if (!mount) return;

  var api = window.GISPL && window.GISPL.api;
  var live = !!(api && api.enabled());

  var slug = mount.getAttribute("data-role-slug") || "";
  var title = mount.getAttribute("data-role-title") || "this role";
  // Matches the applyEmail in content/roles/*.md — change them together, or
  // applications route to a mailbox nobody reads. Not hypothetical: the site
  // previously advertised @gispl.com, a domain GISPL does not own (it is listed
  // for sale and has no MX records), so every application mailto went nowhere.
  var to = mount.getAttribute("data-apply-email") || "careers@gisconsulting.in";

  var SANS = "'IBM Plex Sans'";
  var MONO = "'IBM Plex Mono'";
  var labelCss = "display:block;font:500 12px " + MONO +
    ";letter-spacing:.1em;color:#8A92A4;text-transform:uppercase;margin:0 0 6px";
  var inputCss = "width:100%;box-sizing:border-box;border:1px solid rgba(11,30,59,.18);" +
    "border-radius:9px;padding:12px 13px;font:400 15px " + SANS + ";color:#0B1E3B;" +
    "background:#fff;outline:none;margin-bottom:16px";

  var CV_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  var MAX_CV_BYTES = (api && api.maxCvBytes) || 8 * 1024 * 1024;

  function field(id, label, type, required, extra) {
    return '<label for="' + id + '" style="' + labelCss + '">' + label + "</label>" +
      (type === "textarea"
        ? '<textarea id="' + id + '" name="' + id + '" rows="3" style="' + inputCss +
          ';resize:vertical"' + (required ? " required" : "") + "></textarea>"
        : '<input id="' + id + '" name="' + id + '" type="' + type + '" style="' +
          inputCss + '"' + (required ? " required" : "") + (extra || "") + " />");
  }

  var cvField = live
    ? field("afCv", "CV (PDF or Word, optional)", "file", false,
            ' accept=".pdf,.doc,.docx,' + CV_TYPES.join(",") + '"')
    : "";

  var buttonLabel = live ? "Send application &rarr;" : "Continue to email &rarr;";
  var footNote = live
    ? "We reply to every application. Your details are used only to assess it."
    : "This opens your email app with the details filled in. " +
      "<strong>Attach your CV there</strong> before sending.";

  mount.innerHTML =
    '<form id="applyForm" novalidate>' +
    field("afName", "Your name", "text", true) +
    field("afEmail", "Email", "email", true) +
    field("afPhone", "Phone (optional)", "tel", false) +
    cvField +
    field("afMsg", "Anything you'd like us to know", "textarea", false) +
    '<div id="applyErr" role="alert" style="display:none;font:500 13px ' + SANS +
    ';color:#B3261E;margin:0 0 12px"></div>' +
    '<button id="applyBtn" type="submit" style="width:100%;border:none;cursor:pointer;' +
    "background:#F26A21;color:#fff;font:600 15px " + SANS +
    ';padding:14px;border-radius:9px">' + buttonLabel + "</button>" +
    '<p style="font:400 12px/1.5 ' + SANS + ';color:#8A92A4;margin:12px 0 0">' + footNote + "</p>" +
    "</form>" +
    '<div id="applyOk" style="display:none">' +
    '<h3 id="applyOkTitle" style="font:600 18px Archivo;color:#0B1E3B;margin:0 0 8px">Almost there</h3>' +
    '<p id="applyOkBody" style="font:400 14px/1.6 ' + SANS + ';color:#5B647C;margin:0 0 10px">' +
    "Your email app should have opened with your details. " +
    "<strong>Attach your CV and press send</strong> — we reply to every application.</p>" +
    '<p style="font:400 13px/1.6 ' + SANS + ';color:#8A92A4;margin:0">' +
    "Nothing opened? Email <a href=\"mailto:" + to + '" style="color:#C4632A">' +
    to + "</a> directly.</p></div>";

  var form = document.getElementById("applyForm");
  var err = document.getElementById("applyErr");
  var btn = document.getElementById("applyBtn");

  function fail(msg) { err.textContent = msg; err.style.display = "block"; }

  function busy(on) {
    btn.disabled = on;
    btn.style.opacity = on ? ".6" : "";
    btn.style.cursor = on ? "default" : "pointer";
    if (on) btn.innerHTML = "Sending…";
    else btn.innerHTML = buttonLabel;
  }

  function reveal(heading, bodyHtml) {
    form.style.display = "none";
    var okBox = document.getElementById("applyOk");
    if (heading) document.getElementById("applyOkTitle").textContent = heading;
    if (bodyHtml) document.getElementById("applyOkBody").innerHTML = bodyHtml;
    okBox.style.display = "block";
  }

  function fields() {
    return {
      name: document.getElementById("afName").value.trim(),
      email: document.getElementById("afEmail").value.trim(),
      phone: document.getElementById("afPhone").value.trim(),
      message: document.getElementById("afMsg").value.trim()
    };
  }

  function handOffToMailClient(v) {
    var body = [
      "Role: " + title + " (" + slug + ")",
      "Name: " + v.name,
      "Email: " + v.email,
      "Phone: " + (v.phone || "—"),
      "",
      v.message || "",
      "",
      "--",
      "PLEASE ATTACH YOUR CV TO THIS EMAIL BEFORE SENDING."
    ].join("\n");

    reveal("Almost there",
      "Your email app should have opened with your details. " +
      "<strong>Attach your CV and press send</strong> — we reply to every application.");

    location.href = "mailto:" + encodeURIComponent(to) +
      "?subject=" + encodeURIComponent("Application — " + title) +
      "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.style.display = "none";

    var v = fields();
    if (!v.name) return fail("Please enter your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) {
      return fail("Please enter a valid email address.");
    }

    if (!live) { handOffToMailClient(v); return; }

    var cvInput = document.getElementById("afCv");
    var file = cvInput && cvInput.files && cvInput.files[0];
    if (file) {
      if (CV_TYPES.indexOf(file.type) < 0) {
        return fail("Please attach a PDF or Word document.");
      }
      if (file.size > MAX_CV_BYTES) {
        return fail("That file is larger than " + Math.round(MAX_CV_BYTES / 1048576) + " MB. Please attach a smaller one.");
      }
    }

    var payload = {
      role: slug,
      roleTitle: title,
      name: v.name,
      email: v.email,
      phone: v.phone,
      message: v.message
    };
    if (file) payload.cvContentType = file.type;

    busy(true);
    api.post("/v1/applications", payload).then(function (res) {
      if (!res.ok) {
        busy(false);
        if (res.status === 429) return fail(res.data.error || "Too many applications from this address. Please try again later.");
        if (res.status === 400) return fail(api.firstFieldError(res.data) || "Please check the form and try again.");
        handOffToMailClient(v); // the server is the broken part — do not lose the application
        return;
      }

      var ref = res.data.ref ? " Your reference is <strong>" + res.data.ref + "</strong>." : "";

      // No presigned upload came back: the bucket is not configured, so the
      // application is recorded and the CV is asked for by email instead.
      if (file && !res.data.upload) {
        busy(false);
        reveal("Application received",
          "We have your application for <strong>" + title + "</strong>." + ref +
          " Please email your CV to <a href=\"mailto:" + to + "\" style=\"color:#C4632A\">" + to + "</a>.");
        return;
      }

      if (!file) {
        busy(false);
        reveal("Application received",
          "We have your application for <strong>" + title + "</strong>." + ref +
          " If you would like to send a CV, email it to " +
          "<a href=\"mailto:" + to + "\" style=\"color:#C4632A\">" + to + "</a>.");
        return;
      }

      return api.uploadFile(res.data.upload, file).then(function () {
        busy(false);
        reveal("Application received",
          "We have your application and your CV for <strong>" + title + "</strong>." + ref +
          " Someone from the talent team will be in touch.");
      }).catch(function () {
        // The application itself is already stored — only the file failed.
        busy(false);
        reveal("Application received",
          "We have your application for <strong>" + title + "</strong>." + ref +
          " Your CV did not upload, though — please email it to " +
          "<a href=\"mailto:" + to + "\" style=\"color:#C4632A\">" + to + "</a>.");
      });
    }).catch(function () {
      busy(false);
      handOffToMailClient(v);
    });
  });
})();
