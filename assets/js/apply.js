/* GISPL — job application form.
   Mounted into #applyMount on a generated role page (/careers/roles/<slug>/),
   which carries the role's slug, title and apply address as data attributes.

   INTERIM BEHAVIOUR: this hands off to the candidate's mail client, matching
   the interim already used by the contact and newsletter forms.

   It replaces a flow that wrote the application — and the CV, base64-encoded —
   into the CANDIDATE'S OWN localStorage, while the page told them "your
   application has been logged, our talent team will review it". Nothing was
   transmitted; nobody at GISPL could ever see it. A mailto cannot carry an
   attachment, so the candidate is asked to attach the CV themselves — which is
   less slick, and is the first version of this form that actually delivers an
   application to a human.

   Phase 5 replaces this with POST /v1/applications + a presigned CV upload. */
(function () {
  "use strict";

  var mount = document.getElementById("applyMount");
  if (!mount) return;

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

  function field(id, label, type, required, extra) {
    return '<label for="' + id + '" style="' + labelCss + '">' + label + "</label>" +
      (type === "textarea"
        ? '<textarea id="' + id + '" name="' + id + '" rows="3" style="' + inputCss +
          ';resize:vertical"' + (required ? " required" : "") + "></textarea>"
        : '<input id="' + id + '" name="' + id + '" type="' + type + '" style="' +
          inputCss + '"' + (required ? " required" : "") + (extra || "") + " />");
  }

  mount.innerHTML =
    '<form id="applyForm" novalidate>' +
    field("afName", "Your name", "text", true) +
    field("afEmail", "Email", "email", true) +
    field("afPhone", "Phone (optional)", "tel", false) +
    field("afMsg", "Anything you'd like us to know", "textarea", false) +
    '<div id="applyErr" role="alert" style="display:none;font:500 13px ' + SANS +
    ';color:#B3261E;margin:0 0 12px"></div>' +
    '<button id="applyBtn" type="submit" style="width:100%;border:none;cursor:pointer;' +
    "background:#F26A21;color:#fff;font:600 15px " + SANS +
    ';padding:14px;border-radius:9px">Continue to email &rarr;</button>' +
    '<p style="font:400 12px/1.5 ' + SANS + ';color:#8A92A4;margin:12px 0 0">' +
    "This opens your email app with the details filled in. " +
    "<strong>Attach your CV there</strong> before sending.</p>" +
    "</form>" +
    '<div id="applyOk" style="display:none">' +
    '<h3 style="font:600 18px Archivo;color:#0B1E3B;margin:0 0 8px">Almost there</h3>' +
    '<p style="font:400 14px/1.6 ' + SANS + ';color:#5B647C;margin:0 0 10px">' +
    "Your email app should have opened with your details. " +
    "<strong>Attach your CV and press send</strong> — we reply to every application.</p>" +
    '<p style="font:400 13px/1.6 ' + SANS + ';color:#8A92A4;margin:0">' +
    "Nothing opened? Email <a href=\"mailto:" + to + '" style="color:#C4632A">' +
    to + "</a> directly.</p></div>";

  var form = document.getElementById("applyForm");
  var err = document.getElementById("applyErr");

  function fail(msg) { err.textContent = msg; err.style.display = "block"; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.style.display = "none";

    var name = document.getElementById("afName").value.trim();
    var email = document.getElementById("afEmail").value.trim();
    if (!name) return fail("Please enter your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return fail("Please enter a valid email address.");
    }

    var body = [
      "Role: " + title + " (" + slug + ")",
      "Name: " + name,
      "Email: " + email,
      "Phone: " + (document.getElementById("afPhone").value.trim() || "—"),
      "",
      document.getElementById("afMsg").value.trim() || "",
      "",
      "--",
      "PLEASE ATTACH YOUR CV TO THIS EMAIL BEFORE SENDING."
    ].join("\n");

    var href = "mailto:" + encodeURIComponent(to) +
      "?subject=" + encodeURIComponent("Application — " + title) +
      "&body=" + encodeURIComponent(body);

    form.style.display = "none";
    document.getElementById("applyOk").style.display = "block";
    location.href = href;
  });
})();
