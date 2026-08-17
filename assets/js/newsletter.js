/* GISPL — newsletter signup.

   With a backend configured this posts to /v1/subscribe, which records a
   PENDING subscriber and emails a confirmation link. Nothing is ever sent to an
   address that has not clicked that link — under DPDP §6 the burden of proving
   consent sits with the data fiduciary, and the `mailto:` this replaced proved
   nothing. With no backend configured it keeps that mailto handoff. */
(function () {
  "use strict";

  var form = document.getElementById("nlForm");
  var note = document.getElementById("nlNote");
  if (!form) return;

  var api = window.GISPL && window.GISPL.api;

  /* Honeypot, added here rather than in the page markup so every generated
     page that carries this form gets it without a rebuild. Off-screen and
     aria-hidden: a person never sees it, a form-filling bot does. */
  var hp = document.createElement("input");
  hp.type = "text";
  hp.name = "website";
  hp.tabIndex = -1;
  hp.autocomplete = "off";
  hp.setAttribute("aria-hidden", "true");
  hp.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:0;height:0;opacity:0;pointer-events:none";
  form.appendChild(hp);

  function say(msg) {
    if (!note) return;
    note.textContent = msg;
    note.style.display = "block";
  }

  function handOffToMailClient(email) {
    say("Your email app should have opened — press send there to confirm. " +
        "If it didn't, write to info@gisconsulting.in.");
    location.href = "mailto:info@gisconsulting.in" +
      "?subject=" + encodeURIComponent("Subscribe to GISPL insights") +
      "&body=" + encodeURIComponent("Please add " + email + " to the GISPL insights mailing list.\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = form.querySelector('input[type="email"]');
    var email = (input && input.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      if (input) input.focus();
      return;
    }

    if (!api || !api.enabled()) {
      if (!hp.value) handOffToMailClient(email);
      else say("Thanks — check your inbox.");  // same reply either way, no signal to bots
      return;
    }

    api.post("/v1/subscribe", { email: email, website: hp.value }).then(function (res) {
      if (res.ok) {
        say(res.data.message || "Check your inbox — we have sent a link to confirm your subscription.");
        form.reset();
        return;
      }
      if (res.status === 429) {
        say(res.data.error || "Too many attempts from this address. Please try again later.");
        return;
      }
      if (res.status === 400) {
        say(api.firstFieldError(res.data) || "That address did not look right — please check it.");
        return;
      }
      handOffToMailClient(email);
    }).catch(function () {
      handOffToMailClient(email);
    });
  });
})();
