/* GISPL — newsletter signup.
   Interim mailto handoff, lifted out of the deleted insights.js so the
   generated insights pages keep the behaviour that shipped.

   Phase 5 replaces this with POST /v1/subscribe + double opt-in, which is what
   actually produces a consent record. Under DPDP §6 the burden of proving
   consent sits with the data fiduciary, and a mailto proves nothing. */
(function () {
  "use strict";

  var form = document.getElementById("nlForm");
  var note = document.getElementById("nlNote");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = form.querySelector('input[type="email"]');
    var email = (input && input.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      if (input) input.focus();
      return;
    }
    var href = "mailto:info@gispl.com" +
      "?subject=" + encodeURIComponent("Subscribe to GISPL insights") +
      "&body=" + encodeURIComponent(
        "Please add " + email + " to the GISPL insights mailing list.\n");
    if (note) {
      note.textContent = "Your email app should have opened — press send there " +
        "to confirm. If it didn't, write to info@gispl.com.";
      note.style.display = "block";
    }
    location.href = href;
  });
})();
