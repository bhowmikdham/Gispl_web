/* GISPL — single job detail + apply form. */
(function () {
  "use strict";
  var esc = GISPL.util.esc;
  function qp(name) { var m = new RegExp("[?&]" + name + "=([^&]*)").exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : ""; }
  function byId(id) { return document.getElementById(id); }

  // tiny markdown-lite: paragraphs + **bold** + *italic*
  function md(src) {
    return String(src || "").split(/\n\s*\n/).map(function (para) {
      var t = esc(para).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\n/g, "<br>");
      return "<p style=\"margin:0 0 16px\">" + t + "</p>";
    }).join("");
  }
  function chip(text) {
    return '<span style="font:500 11px \'IBM Plex Mono\';letter-spacing:.06em;color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.25);padding:6px 12px;border-radius:20px;white-space:nowrap">' + esc(text) + "</span>";
  }
  function bullets(el, arr) {
    el.innerHTML = (arr || []).map(function (x) { return "<li style=\"margin:0 0 8px\">" + esc(x) + "</li>"; }).join("");
  }

  var slug = qp("slug");
  var form = byId("applyForm");
  if (!byId("jobTitle")) return;

  GISPL.data.get("jobs", slug).then(function (job) {
    if (!job || job.status === "draft") {
      byId("jobNotFound").style.display = "block";
      byId("jobBody").style.display = "none";
      var ac = byId("applyCard"); if (ac) ac.style.display = "none";
      byId("jobTitle").textContent = "Role unavailable";
      byId("jobMeta").innerHTML = "";
      document.title = "Role unavailable — GISPL Careers";
      return;
    }
    document.title = job.title + " — GISPL Careers";
    var desc = document.querySelector('meta[name="description"]'); if (desc) desc.setAttribute("content", (job.title + " — " + job.team + " · " + job.loc));
    byId("jobTeam").textContent = job.team || "";
    byId("jobTitle").textContent = job.title || "";
    byId("jobMeta").innerHTML = [job.loc, job.type].filter(Boolean).map(chip).join("");
    byId("jobDesc").innerHTML = md(job.descriptionMd || "");
    if (job.responsibilities && job.responsibilities.length) { byId("jobRespWrap").style.display = "block"; bullets(byId("jobResp"), job.responsibilities); }
    if (job.requirements && job.requirements.length) { byId("jobReqWrap").style.display = "block"; bullets(byId("jobReq"), job.requirements); }
    window.__job = job;
  }).catch(function (e) {
    if (window.console) console.error("job load failed", e);
    byId("jobTitle").textContent = "Something went wrong";
  });

  // ---- apply form ----
  var MAX = (GISPL.config && GISPL.config.MAX_RESUME_BYTES) || 2 * 1024 * 1024;
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = byId("applyErr"); err.style.display = "none";
      var name = byId("afName").value.trim();
      var email = byId("afEmail").value.trim();
      var fileInput = byId("afFile");
      var file = fileInput.files && fileInput.files[0];
      function fail(msg) { err.textContent = msg; err.style.display = "block"; }

      if (!name) return fail("Please enter your name.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Please enter a valid email address.");
      if (!file) return fail("Please attach your CV (PDF or DOC).");
      if (!/\.(pdf|docx?)$/i.test(file.name)) return fail("CV must be a PDF, DOC or DOCX file.");
      if (file.size > MAX) return fail("CV must be under " + Math.round(MAX / 1024 / 1024) + " MB.");

      var btn = byId("applyBtn"); btn.disabled = true; btn.textContent = "Submitting…";
      GISPL.data.apps.submit({
        jobSlug: (window.__job && window.__job.slug) || slug,
        jobTitle: (window.__job && window.__job.title) || slug,
        name: name, email: email,
        phone: byId("afPhone").value.trim(),
        message: byId("afMsg").value.trim(),
        file: file
      }).then(function () {
        form.style.display = "none";
        byId("applyOk").style.display = "block";
      }).catch(function (e2) {
        if (window.console) console.error("apply failed", e2);
        btn.disabled = false; btn.textContent = "Submit application";
        fail("Sorry — something went wrong submitting your application. Please email careers@gispl.com.");
      });
    });
  }
})();
