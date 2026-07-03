/* GISPL Admin — Jobs & Posts CRUD + candidate pipeline + email templates.
 * Talks only to GISPL.data (localStorage locally, AWS API in prod). Auth is a
 * dev stub locally; swap GISPL.auth for Cognito Hosted UI in production. */
(function () {
  "use strict";
  var esc = GISPL.util.esc, slugify = GISPL.util.slugify, fmtDate = GISPL.util.fmtDate;
  var view = document.getElementById("view");
  var tabs = document.getElementById("tabs");
  var who = document.getElementById("who");
  var TEAMS = ["Assessments", "Compliance", "Managed Security", "Forensics", "Early Careers", "Corporate"];
  var CATS = ["Compliance", "Forensics", "Payments", "Phishing", "DPDP"];
  var STAGE_META = {
    applied: ["#5B647C", "Applied"], screening: ["#2D6CDF", "Screening"], interview: ["#7A4DD6", "Interview"],
    offer: ["#C77C1E", "Offer"], hired: ["#2E9E5B", "Hired"], rejected: ["#C0392B", "Rejected"], withdrawn: ["#8A92A4", "Withdrawn"]
  };
  var TPL = null;
  var current = "jobs";

  function q(id) { return document.getElementById(id); }
  function opt(v, sel, label) { return '<option value="' + esc(v) + '"' + (v === sel ? " selected" : "") + ">" + esc(label || v) + "</option>"; }
  function stagePill(s) {
    var m = STAGE_META[s] || ["#5B647C", s];
    return '<span class="pill" style="background:' + m[0] + '1a;color:' + m[0] + '">' + esc(m[1]) + "</span>";
  }
  function lines(str) { return String(str || "").split("\n").map(function (x) { return x.trim(); }).filter(Boolean); }
  // returns a slug not already used in the collection (appends -2, -3, … on collision)
  function uniqueSlug(kind, base) {
    return GISPL.data.listAll(kind).then(function (all) {
      var taken = {}; all.forEach(function (x) { taken[x.slug] = 1; });
      if (!taken[base]) return base;
      var n = 2; while (taken[base + "-" + n]) n++;
      return base + "-" + n;
    });
  }
  function toast(msg) {
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0B1E3B;color:#fff;font:600 14px 'IBM Plex Sans';padding:12px 20px;border-radius:10px;z-index:200;box-shadow:0 10px 30px rgba(7,20,43,.4)";
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  }
  function openModal(html) {
    var bg = document.createElement("div"); bg.className = "modal-bg";
    bg.innerHTML = '<div class="modal">' + html + "</div>";
    document.body.appendChild(bg);
    bg.addEventListener("click", function (e) { if (e.target === bg) bg.remove(); });
    return { el: bg, close: function () { bg.remove(); } };
  }

  /* ---------------- auth gate ---------------- */
  function renderLogin() {
    tabs.style.display = "none"; who.style.display = "none";
    view.innerHTML =
      '<div class="adm-card" style="max-width:430px;margin:56px auto">' +
      '<h2 class="sec">Sign in</h2>' +
      '<p class="muted" style="margin:2px 0 18px">Development mode — no Cognito yet. Enter any email + password. In production this screen becomes the Cognito Hosted UI (PKCE), and every write is authorized with the returned token.</p>' +
      '<div class="field"><label>Email</label><input id="liEmail" value="admin@gispl.com"></div>' +
      '<div class="field"><label>Password</label><input id="liPass" type="password" value="demo"></div>' +
      '<button class="adm-btn" id="liBtn" style="width:100%">Sign in</button></div>';
    q("liBtn").addEventListener("click", function () {
      var email = q("liEmail").value.trim() || "admin@gispl.com";
      GISPL.auth.signIn(email).then(showApp);
    });
  }
  function showApp() {
    tabs.style.display = "flex"; who.style.display = "flex";
    q("whoEmail").textContent = GISPL.auth.user();
    GISPL.data.templates.get().then(function (t) { TPL = t; route(current); });
  }
  function route(tab) {
    Array.prototype.forEach.call(tabs.children, function (c) { c.classList.toggle("on", c.getAttribute("data-tab") === tab); });
    if (tab === "jobs") renderJobs();
    else if (tab === "posts") renderPosts();
    else if (tab === "apps") renderApps();
    else renderTemplates();
  }
  tabs.addEventListener("click", function (e) {
    var t = e.target.closest(".adm-tab"); if (!t) return;
    current = t.getAttribute("data-tab"); route(current);
  });
  q("signOut").addEventListener("click", function () { GISPL.auth.signOut(); renderLogin(); });

  /* ---------------- Jobs ---------------- */
  function renderJobs() {
    GISPL.data.listAll("jobs").then(function (jobs) {
      var rows = jobs.map(function (j) {
        return "<tr><td><strong>" + esc(j.title) + "</strong><br><span class='muted'>" + esc(j.slug) + "</span></td>"
          + "<td>" + esc(j.team) + "</td><td>" + esc(j.loc) + "</td><td>" + esc(j.type) + "</td>"
          + "<td>" + (j.status === "draft" ? "<span class='pill' style='background:#8A92A41a;color:#8A92A4'>Draft</span>" : "<span class='pill' style='background:#2E9E5B1a;color:#2E9E5B'>Published</span>") + "</td>"
          + "<td style='text-align:right;white-space:nowrap'><button class='adm-btn subtle' data-edit='" + esc(j.slug) + "'>Edit</button> "
          + "<button class='adm-btn danger' data-del='" + esc(j.slug) + "'>Delete</button></td></tr>";
      }).join("");
      view.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'
        + '<h2 class="sec">Jobs <span class="muted">(' + jobs.length + ")</span></h2>"
        + '<button class="adm-btn" id="newJob">+ New job</button></div>'
        + '<div class="adm-card"><table><thead><tr><th>Role</th><th>Team</th><th>Location</th><th>Type</th><th>Status</th><th></th></tr></thead><tbody>'
        + (rows || '<tr><td colspan="6" class="muted">No jobs yet.</td></tr>') + "</tbody></table></div>";
      q("newJob").addEventListener("click", function () { jobForm(null); });
      Array.prototype.forEach.call(view.querySelectorAll("[data-edit]"), function (b) {
        b.addEventListener("click", function () { GISPL.data.get("jobs", b.getAttribute("data-edit")).then(jobForm); });
      });
      Array.prototype.forEach.call(view.querySelectorAll("[data-del]"), function (b) {
        b.addEventListener("click", function () {
          if (!confirm("Delete this job posting?")) return;
          GISPL.data.remove("jobs", b.getAttribute("data-del")).then(function () { toast("Job deleted"); renderJobs(); });
        });
      });
    });
  }
  function jobForm(job) {
    job = job || {};
    var m = openModal(
      "<h2 class='sec'>" + (job.slug ? "Edit job" : "New job") + "</h2>"
      + "<div class='field'><label>Title</label><input id='jfTitle' value='" + esc(job.title || "") + "'></div>"
      + "<div class='row2'><div class='field'><label>Team</label><select id='jfTeam'>" + TEAMS.map(function (t) { return opt(t, job.team); }).join("") + "</select></div>"
      + "<div class='field'><label>Location</label><input id='jfLoc' value='" + esc(job.loc || "Gurgaon") + "'></div></div>"
      + "<div class='row2'><div class='field'><label>Employment type</label><input id='jfType' value='" + esc(job.type || "Full-time") + "'></div>"
      + "<div class='field'><label>Status</label><select id='jfStatus'>" + opt("published", job.status || "published", "Published") + opt("draft", job.status, "Draft") + "</select></div></div>"
      + "<div class='field'><label>Apply email</label><input id='jfEmail' value='" + esc(job.applyEmail || "careers@gispl.com") + "'></div>"
      + "<div class='field'><label>Description (markdown)</label><textarea id='jfDesc' rows='5'>" + esc(job.descriptionMd || "") + "</textarea></div>"
      + "<div class='field'><label>Responsibilities (one per line)</label><textarea id='jfResp' rows='4'>" + esc((job.responsibilities || []).join("\n")) + "</textarea></div>"
      + "<div class='field'><label>Requirements (one per line)</label><textarea id='jfReq' rows='4'>" + esc((job.requirements || []).join("\n")) + "</textarea></div>"
      + "<div style='display:flex;gap:10px;justify-content:flex-end;margin-top:8px'><button class='adm-btn ghost' id='jfCancel'>Cancel</button><button class='adm-btn' id='jfSave'>Save</button></div>"
    );
    m.el.querySelector("#jfCancel").addEventListener("click", m.close);
    m.el.querySelector("#jfSave").addEventListener("click", function () {
      var title = q("jfTitle").value.trim();
      if (!title) { alert("Title is required"); return; }
      var obj = {
        title: title,
        team: q("jfTeam").value, loc: q("jfLoc").value.trim(), type: q("jfType").value.trim(),
        status: q("jfStatus").value, applyEmail: q("jfEmail").value.trim(),
        descriptionMd: q("jfDesc").value, responsibilities: lines(q("jfResp").value), requirements: lines(q("jfReq").value)
      };
      if (job.createdAt) obj.createdAt = job.createdAt;
      var slugP = job.slug ? Promise.resolve(job.slug) : uniqueSlug("jobs", slugify(title));
      slugP.then(function (slug) {
        obj.slug = slug; obj._isNew = !job.slug;
        return GISPL.data.save("jobs", obj);
      }).then(function () { m.close(); toast("Job saved"); renderJobs(); });
    });
  }

  /* ---------------- Posts ---------------- */
  function renderPosts() {
    GISPL.data.listAll("posts").then(function (posts) {
      var rows = posts.map(function (p) {
        return "<tr><td><strong>" + esc(p.title) + "</strong><br><span class='muted'>" + esc(p.slug) + "</span></td>"
          + "<td>" + esc(p.category) + "</td><td>" + esc(p.dateLabel || fmtDate(p.date)) + "</td>"
          + "<td>" + (p.status === "draft" ? "<span class='pill' style='background:#8A92A41a;color:#8A92A4'>Draft</span>" : "<span class='pill' style='background:#2E9E5B1a;color:#2E9E5B'>Published</span>") + "</td>"
          + "<td style='text-align:right;white-space:nowrap'><button class='adm-btn subtle' data-edit='" + esc(p.slug) + "'>Edit</button> "
          + "<button class='adm-btn danger' data-del='" + esc(p.slug) + "'>Delete</button></td></tr>";
      }).join("");
      view.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">'
        + '<h2 class="sec">Blog posts <span class="muted">(' + posts.length + ")</span></h2>"
        + '<button class="adm-btn" id="newPost">+ New post</button></div>'
        + '<div class="adm-card"><table><thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>'
        + (rows || '<tr><td colspan="5" class="muted">No posts yet.</td></tr>') + "</tbody></table></div>";
      q("newPost").addEventListener("click", function () { postForm(null); });
      Array.prototype.forEach.call(view.querySelectorAll("[data-edit]"), function (b) {
        b.addEventListener("click", function () { GISPL.data.get("posts", b.getAttribute("data-edit")).then(postForm); });
      });
      Array.prototype.forEach.call(view.querySelectorAll("[data-del]"), function (b) {
        b.addEventListener("click", function () {
          if (!confirm("Delete this post?")) return;
          GISPL.data.remove("posts", b.getAttribute("data-del")).then(function () { toast("Post deleted"); renderPosts(); });
        });
      });
    });
  }
  function postForm(post) {
    post = post || {};
    var m = openModal(
      "<h2 class='sec'>" + (post.slug ? "Edit post" : "New post") + "</h2>"
      + "<div class='field'><label>Title</label><input id='pfTitle' value='" + esc(post.title || "") + "'></div>"
      + "<div class='row2'><div class='field'><label>Category</label><select id='pfCat'>" + CATS.map(function (c) { return opt(c, post.category); }).join("") + "</select></div>"
      + "<div class='field'><label>Status</label><select id='pfStatus'>" + opt("published", post.status || "published", "Published") + opt("draft", post.status, "Draft") + "</select></div></div>"
      + "<div class='row2'><div class='field'><label>Read time</label><input id='pfRead' value='" + esc(post.readTime || "5 MIN READ") + "'></div>"
      + "<div class='field'><label>Date label</label><input id='pfDate' value='" + esc(post.dateLabel || "") + "' placeholder='JUL 2026'></div></div>"
      + "<div class='field'><label>Author</label><input id='pfAuthor' value='" + esc(post.author || "GISPL") + "'></div>"
      + "<div class='field'><label>Excerpt</label><textarea id='pfExcerpt' rows='2'>" + esc(post.excerpt || "") + "</textarea></div>"
      + "<div class='field'><label>Body (markdown)</label><textarea id='pfBody' rows='7'>" + esc(post.bodyMd || "") + "</textarea></div>"
      + "<div style='display:flex;gap:10px;justify-content:flex-end;margin-top:8px'><button class='adm-btn ghost' id='pfCancel'>Cancel</button><button class='adm-btn' id='pfSave'>Save</button></div>"
    );
    m.el.querySelector("#pfCancel").addEventListener("click", m.close);
    m.el.querySelector("#pfSave").addEventListener("click", function () {
      var title = q("pfTitle").value.trim();
      if (!title) { alert("Title is required"); return; }
      var dateLabel = q("pfDate").value.trim();
      var obj = {
        title: title, category: q("pfCat").value,
        status: q("pfStatus").value, readTime: q("pfRead").value.trim(), dateLabel: dateLabel,
        date: post.date || (dateLabel ? "" : GISPL.util.nowISO().slice(0, 10)),
        author: q("pfAuthor").value.trim(), excerpt: q("pfExcerpt").value.trim(),
        bodyMd: q("pfBody").value, coverImageKey: post.coverImageKey || null
      };
      if (post.createdAt) obj.createdAt = post.createdAt;
      var slugP = post.slug ? Promise.resolve(post.slug) : uniqueSlug("posts", slugify(title));
      slugP.then(function (slug) {
        obj.slug = slug; obj._isNew = !post.slug;
        return GISPL.data.save("posts", obj);
      }).then(function () { m.close(); toast("Post saved"); renderPosts(); });
    });
  }

  /* ---------------- Applications / pipeline ---------------- */
  var appFilter = "all";
  function renderApps() {
    GISPL.data.apps.list({}).then(function (all) {
      var counts = { all: all.length };
      GISPL.STAGES.forEach(function (s) { counts[s] = 0; });
      all.forEach(function (a) { counts[a.stage] = (counts[a.stage] || 0) + 1; });
      // if the active stage just emptied, fall back to All so the view isn't stranded
      if (appFilter !== "all" && !counts[appFilter]) appFilter = "all";
      var chips =['<button class="adm-btn ' + (appFilter === "all" ? "" : "subtle") + '" data-f="all">All (' + counts.all + ")</button>"]
        .concat(GISPL.STAGES.filter(function (s) { return counts[s]; }).map(function (s) {
          return '<button class="adm-btn ' + (appFilter === s ? "" : "subtle") + '" data-f="' + s + '">' + (STAGE_META[s][1]) + " (" + counts[s] + ")</button>";
        })).join(" ");
      var shown = appFilter === "all" ? all : all.filter(function (a) { return a.stage === appFilter; });
      var rows = shown.map(function (a) {
        return "<tr><td><strong>" + esc(a.name) + "</strong><br><span class='muted'>" + esc(a.email) + "</span></td>"
          + "<td>" + esc(a.jobTitle) + "</td><td>" + stagePill(a.stage) + "</td>"
          + "<td class='muted'>" + esc(fmtDate(a.createdAt)) + "</td>"
          + "<td style='text-align:right'><button class='adm-btn subtle' data-view='" + esc(a.id) + "'>View</button></td></tr>";
      }).join("");
      view.innerHTML = '<h2 class="sec" style="margin-bottom:12px">Applications</h2>'
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">' + chips + "</div>"
        + '<div class="adm-card"><table><thead><tr><th>Candidate</th><th>Role</th><th>Stage</th><th>Applied</th><th></th></tr></thead><tbody>'
        + (rows || '<tr><td colspan="5" class="muted">No applications' + (appFilter === "all" ? " yet — submit one from a job page." : " at this stage.") + "</td></tr>") + "</tbody></table></div>";
      Array.prototype.forEach.call(view.querySelectorAll("[data-f]"), function (b) {
        b.addEventListener("click", function () { appFilter = b.getAttribute("data-f"); renderApps(); });
      });
      Array.prototype.forEach.call(view.querySelectorAll("[data-view]"), function (b) {
        b.addEventListener("click", function () { GISPL.data.apps.get(b.getAttribute("data-view")).then(appDetail); });
      });
    });
  }
  function appDetail(a) {
    if (!a) return;
    var resume = a.resumeDataUrl
      ? "<a href='" + a.resumeDataUrl + "' download='" + esc(a.resumeName || "resume") + "'>Download résumé (" + esc(a.resumeName || "file") + ")</a>"
      : (a.resumeName ? "<span class='muted'>" + esc(a.resumeName) + " (stored server-side in production)</span>" : "<span class='muted'>No résumé attached</span>");
    var history = (a.stageHistory || []).map(function (h) {
      return "<div style='display:flex;gap:10px;align-items:baseline;padding:6px 0;border-top:1px solid rgba(11,30,59,.07)'>"
        + stagePill(h.stage) + "<span class='muted' style='flex:1'>" + esc(h.note || "") + "</span>"
        + "<span class='muted' style='font-size:12px'>" + esc(fmtDate(h.at)) + (h.emailSent ? " · emailed" : "") + "</span></div>";
    }).join("");
    var notes = (a.notes || []).map(function (n) {
      return "<div style='padding:6px 0;border-top:1px solid rgba(11,30,59,.07)'><span>" + esc(n.text) + "</span> <span class='muted' style='font-size:12px'>— " + esc(n.byUser) + ", " + esc(fmtDate(n.at)) + "</span></div>";
    }).join("") || "<div class='muted'>No notes yet.</div>";
    var emails = (a.emails || []).map(function (m2) {
      return "<div style='padding:8px 0;border-top:1px solid rgba(11,30,59,.07)'>"
        + "<div style='font:600 13px \"IBM Plex Sans\";color:#0B1E3B'>" + esc(m2.subject) + "</div>"
        + "<div class='muted' style='font-size:12px;margin:2px 0 4px'>to " + esc(m2.to) + " · " + esc(fmtDate(m2.at)) + "</div>"
        + "<div style='font:400 13px/1.5 \"IBM Plex Sans\";color:#5B647C;white-space:pre-wrap'>" + esc(m2.body) + "</div></div>";
    }).join("");

    var m = openModal(
      "<div style='display:flex;justify-content:space-between;align-items:start'><div><h2 class='sec'>" + esc(a.name) + "</h2>"
      + "<div class='muted'>" + esc(a.email) + (a.phone ? " · " + esc(a.phone) : "") + "</div></div>" + stagePill(a.stage) + "</div>"
      + "<div style='margin:12px 0'><strong>" + esc(a.jobTitle) + "</strong></div>"
      + (a.message ? "<div class='adm-card' style='background:#F6F7F9;margin:0 0 14px'>" + esc(a.message) + "</div>" : "")
      + "<div class='field'>" + resume + "</div>"
      + "<h3 style='font:600 13px \"IBM Plex Mono\";letter-spacing:.1em;color:#8A92A4;text-transform:uppercase;margin:18px 0 6px'>Stage history</h3>" + history
      + "<h3 style='font:600 13px \"IBM Plex Mono\";letter-spacing:.1em;color:#8A92A4;text-transform:uppercase;margin:18px 0 6px'>Notes</h3>" + notes
      + "<div style='display:flex;gap:8px;margin:8px 0 4px'><input id='adNote' placeholder='Add an internal note…'><button class='adm-btn subtle' id='adNoteBtn'>Add</button></div>"
      + (a.emails && a.emails.length ? "<h3 style='font:600 13px \"IBM Plex Mono\";letter-spacing:.1em;color:#8A92A4;text-transform:uppercase;margin:18px 0 6px'>Sent emails</h3>" + emails : "")
      + "<hr style='border:none;border-top:1px solid rgba(11,30,59,.1);margin:20px 0'>"
      + "<h3 style='font:600 15px Archivo;margin:0 0 10px'>Advance / update stage</h3>"
      + "<div class='row2'><div class='field'><label>Move to stage</label><select id='mvStage'>" + GISPL.STAGES.map(function (s) { return opt(s, a.stage, STAGE_META[s][1]); }).join("") + "</select></div>"
      + "<div class='field'><label>Internal note (optional)</label><input id='mvNote'></div></div>"
      + "<label style='display:flex;align-items:center;gap:8px;text-transform:none;font:500 14px \"IBM Plex Sans\";color:#0B1E3B;margin-bottom:10px'><input type='checkbox' id='mvNotify' checked style='width:auto'> Email the candidate (review before sending)</label>"
      + "<div id='mvMail'><div class='field'><label>Email subject</label><input id='mvSubject'></div>"
      + "<div class='field'><label>Email body</label><textarea id='mvBody' rows='6'></textarea></div></div>"
      + "<div style='display:flex;gap:10px;justify-content:flex-end;margin-top:8px'><button class='adm-btn ghost' id='mvCancel'>Close</button><button class='adm-btn' id='mvSave'>Save stage change</button></div>"
    );
    function fillMail() {
      var stage = q("mvStage").value;
      var t = (TPL && TPL[stage]) || { subject: "", body: "" };
      var filled = GISPL.util.fillTemplate(t, a);
      q("mvSubject").value = filled.subject; q("mvBody").value = filled.body;
    }
    function syncMailVisibility() { q("mvMail").style.display = q("mvNotify").checked ? "block" : "none"; }
    fillMail(); syncMailVisibility();
    m.el.querySelector("#mvStage").addEventListener("change", fillMail);
    m.el.querySelector("#mvNotify").addEventListener("change", syncMailVisibility);
    m.el.querySelector("#mvCancel").addEventListener("click", m.close);
    m.el.querySelector("#adNoteBtn").addEventListener("click", function () {
      var txt = q("adNote").value.trim(); if (!txt) return;
      GISPL.data.apps.addNote(a.id, txt).then(function (updated) { m.close(); appDetail(updated); });
    });
    m.el.querySelector("#mvSave").addEventListener("click", function () {
      var notify = q("mvNotify").checked;
      GISPL.data.apps.moveStage(a.id, {
        stage: q("mvStage").value, note: q("mvNote").value.trim(), notify: notify,
        subject: notify ? q("mvSubject").value : "", body: notify ? q("mvBody").value : ""
      }).then(function () {
        m.close();
        toast(notify ? "Stage updated · candidate emailed" : "Stage updated");
        renderApps();
      });
    });
  }

  /* ---------------- Email templates ---------------- */
  function renderTemplates() {
    GISPL.data.templates.get().then(function (t) {
      TPL = t;
      var blocks = GISPL.STAGES.map(function (s) {
        var tt = t[s] || { subject: "", body: "" };
        return "<div class='adm-card'><h3 style='font:600 16px Archivo;margin:0 0 4px'>" + stagePill(s) + " &nbsp;" + STAGE_META[s][1] + "</h3>"
          + "<div class='field'><label>Subject</label><input data-tpl-sub='" + s + "' value='" + esc(tt.subject) + "'></div>"
          + "<div class='field'><label>Body</label><textarea data-tpl-body='" + s + "' rows='5'>" + esc(tt.body) + "</textarea></div></div>";
      }).join("");
      view.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">'
        + '<h2 class="sec">Candidate email templates</h2><button class="adm-btn" id="tplSave">Save all</button></div>'
        + '<p class="muted" style="margin:0 0 16px">Use <code>{{name}}</code> and <code>{{jobTitle}}</code>. These pre-fill when you move a candidate; HR reviews before sending.</p>'
        + blocks
        + '<div style="text-align:right"><button class="adm-btn" id="tplSave2">Save all</button></div>';
      function save() {
        var obj = {};
        GISPL.STAGES.forEach(function (s) {
          obj[s] = {
            subject: view.querySelector("[data-tpl-sub='" + s + "']").value,
            body: view.querySelector("[data-tpl-body='" + s + "']").value
          };
        });
        GISPL.data.templates.save(obj).then(function () { TPL = obj; toast("Templates saved"); });
      }
      q("tplSave").addEventListener("click", save);
      q("tplSave2").addEventListener("click", save);
    });
  }

  /* ---------------- boot ---------------- */
  if (!GISPL.auth.isSignedIn()) renderLogin(); else showApp();
})();
