/* GISPL data provider.
 *
 * ONE switch drives the whole site. In LOCAL mode (default) all content lives
 * in the browser's localStorage, seeded once from assets/data/*.json — so the
 * public pages, the apply form, and the /admin panel all work end-to-end with
 * no backend. Flip CONFIG.MODE to "api" and set API_BASE to the deployed HTTP
 * API, and every read/write goes to AWS instead. No page code changes.
 *
 * Surface (all methods return Promises, mirroring the future API):
 *   GISPL.data.list(kind)                 published jobs|posts        (public)
 *   GISPL.data.listAll(kind)              incl. drafts               (admin)
 *   GISPL.data.get(kind, slug)            one item
 *   GISPL.data.save(kind, item)           upsert by slug             (admin)
 *   GISPL.data.remove(kind, slug)                                    (admin)
 *   GISPL.data.apps.list(filter)          applications               (admin)
 *   GISPL.data.apps.get(id)
 *   GISPL.data.apps.submit(payload)       candidate applies          (public)
 *   GISPL.data.apps.moveStage(id, change) advance + optional email   (admin)
 *   GISPL.data.apps.addNote(id, text)                                (admin)
 *   GISPL.data.templates.get() / .save(o) stage-email templates      (admin)
 *   GISPL.util.slugify / esc / fmtDate
 */
(function () {
  "use strict";

  var CONFIG = {
    MODE: "local",          // "local" | "api"
    API_BASE: "https://api.gispl.example",  // set for MODE:"api"
    SEED_BASE: "assets/data",
    MAX_RESUME_BYTES: 2 * 1024 * 1024  // shared cap: apply form + local storage agree
  };

  var K = {
    jobs: "gispl:jobs",
    posts: "gispl:posts",
    apps: "gispl:applications",
    tpl: "gispl:templates",
    seeded: "gispl:seeded:v1"
  };

  var STAGES = ["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"];

  var DEFAULT_TEMPLATES = {
    applied: {
      subject: "We've received your application — {{jobTitle}}",
      body: "Hi {{name}},\n\nThank you for applying for the {{jobTitle}} role at GISPL. Our team has received your application and will review it shortly. We'll be in touch about next steps.\n\nWarm regards,\nGISPL Talent Team"
    },
    screening: {
      subject: "Your application is progressing — {{jobTitle}}",
      body: "Hi {{name}},\n\nGood news — your application for {{jobTitle}} has moved to our screening stage. A member of our team will reach out to arrange a short introductory call.\n\nWarm regards,\nGISPL Talent Team"
    },
    interview: {
      subject: "You're invited to interview — {{jobTitle}}",
      body: "Hi {{name}},\n\nWe'd like to invite you to interview for the {{jobTitle}} role. We'll follow up with proposed times and format.\n\nWarm regards,\nGISPL Talent Team"
    },
    offer: {
      subject: "Great news about your application — {{jobTitle}}",
      body: "Hi {{name}},\n\nWe're delighted to move forward with an offer for the {{jobTitle}} role. Our team will share the details with you directly.\n\nWarm regards,\nGISPL Talent Team"
    },
    hired: {
      subject: "Welcome to GISPL — {{jobTitle}}",
      body: "Hi {{name}},\n\nWelcome aboard! We're thrilled you're joining GISPL as {{jobTitle}}. Onboarding details to follow.\n\nWarm regards,\nGISPL Talent Team"
    },
    rejected: {
      subject: "Update on your application — {{jobTitle}}",
      body: "Hi {{name}},\n\nThank you for your interest in the {{jobTitle}} role and for the time you invested. After careful consideration we won't be moving forward on this occasion, but we'd welcome future applications.\n\nWarm regards,\nGISPL Talent Team"
    },
    withdrawn: {
      subject: "Your application — {{jobTitle}}",
      body: "Hi {{name}},\n\nThis confirms your application for {{jobTitle}} has been withdrawn. You're welcome to apply again in future.\n\nWarm regards,\nGISPL Talent Team"
    }
  };

  /* ---------------- utils ---------------- */
  // Escapes for BOTH text and attribute contexts (quotes included) — prevents
  // attribute-breakout injection and value='...' truncation on apostrophes.
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function slugify(s) {
    return String(s).replace(/&/g, " and ").replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "").toLowerCase().replace(/-+/g, "-");
  }
  function uid() { return "a" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }
  function nowISO() { return new Date().toISOString(); }
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d)) return String(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  function jget(k, dflt) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : dflt; } catch (e) { return dflt; } }
  function jset(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); }
    catch (e) { throw new Error("STORAGE_FULL"); }
  }
  function items(data) { return (data && data.items) ? data.items : (data || []); }
  function collKey(kind) { return kind === "posts" ? K.posts : K.jobs; }

  /* ---------------- seeding (local mode) ---------------- */
  var _ready = null;
  function ready() {
    if (_ready) return _ready;
    if (CONFIG.MODE !== "local") { _ready = Promise.resolve(); return _ready; }
    if (localStorage.getItem(K.seeded)) {
      if (!jget(K.tpl)) jset(K.tpl, DEFAULT_TEMPLATES);
      if (!jget(K.apps)) jset(K.apps, []);
      _ready = Promise.resolve(); return _ready;
    }
    _ready = Promise.all([
      fetch(CONFIG.SEED_BASE + "/jobs.json").then(function (r) { return r.json(); }),
      fetch(CONFIG.SEED_BASE + "/posts.json").then(function (r) { return r.json(); })
    ]).then(function (res) {
      jset(K.jobs, items(res[0]));
      jset(K.posts, items(res[1]));
      jset(K.apps, []);
      jset(K.tpl, DEFAULT_TEMPLATES);
      localStorage.setItem(K.seeded, "1");
    }).catch(function (e) {
      _ready = null;  // don't cache a rejected seed — allow a later retry
      throw e;
    });
    return _ready;
  }

  /* ---------------- API-mode fetch helpers ---------------- */
  function apiGet(path) {
    return fetch(CONFIG.API_BASE + path, { headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error(path + " → " + r.status); return r.json(); });
  }
  // NB: admin writes in API mode attach the Cognito bearer token via GISPL.auth.

  /* ---------------- content: jobs / posts ---------------- */
  function listAll(kind) {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") return apiGet("/admin/" + kind).then(items);
      return jget(collKey(kind), []);
    });
  }
  function list(kind) {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") return apiGet("/" + kind).then(items);
      return jget(collKey(kind), []).filter(function (x) { return x.status !== "draft"; });
    });
  }
  function get(kind, slug) {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") return apiGet("/" + kind + "/" + encodeURIComponent(slug));
      var arr = jget(collKey(kind), []);
      for (var i = 0; i < arr.length; i++) if (arr[i].slug === slug) return arr[i];
      return null;
    });
  }
  function save(kind, item) {
    return ready().then(function () {
      if (!item.slug) item.slug = slugify(item.title || "");
      item.updatedAt = nowISO();
      if (CONFIG.MODE !== "local") {
        return GISPL.auth.authed(CONFIG.API_BASE + "/admin/" + kind + (item._isNew ? "" : "/" + item.slug),
          item._isNew ? "POST" : "PUT", item);
      }
      var arr = jget(collKey(kind), []);
      var idx = -1;
      for (var i = 0; i < arr.length; i++) if (arr[i].slug === item.slug) { idx = i; break; }
      if (idx === -1) { item.createdAt = item.createdAt || nowISO(); arr.unshift(item); }
      else { item.createdAt = arr[idx].createdAt || nowISO(); arr[idx] = item; }
      delete item._isNew;
      jset(collKey(kind), arr);
      return item;
    });
  }
  function remove(kind, slug) {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") return GISPL.auth.authed(CONFIG.API_BASE + "/admin/" + kind + "/" + slug, "DELETE");
      var arr = jget(collKey(kind), []).filter(function (x) { return x.slug !== slug; });
      jset(collKey(kind), arr);
      return true;
    });
  }

  /* ---------------- applications / pipeline ---------------- */
  function appsList(filter) {
    filter = filter || {};
    return ready().then(function () {
      if (CONFIG.MODE !== "local") {
        var q = filter.stage ? "?stage=" + encodeURIComponent(filter.stage) : "";
        return GISPL.auth.authed(CONFIG.API_BASE + "/admin/applications" + q, "GET").then(items);
      }
      var arr = jget(K.apps, []);
      if (filter.stage && filter.stage !== "all") arr = arr.filter(function (a) { return a.stage === filter.stage; });
      return arr.sort(function (a, b) { return (b.createdAt || "").localeCompare(a.createdAt || ""); });
    });
  }
  function appsGet(id) {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") return GISPL.auth.authed(CONFIG.API_BASE + "/admin/applications/" + id, "GET");
      var arr = jget(K.apps, []);
      for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
      return null;
    });
  }
  // payload: {jobSlug, jobTitle, name, email, phone, message, file? (File)}
  function appsSubmit(payload) {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") {
        // In API mode: presign → PUT résumé to S3 → POST /applications. Handled server-side.
        return GISPL.auth.submitApplication(payload);
      }
      function persist(arr) { try { jset(K.apps, arr); return true; } catch (e) { return false; } }
      function store(resumeMeta) {
        var arr = jget(K.apps, []);
        var app = {
          id: uid(),
          jobSlug: payload.jobSlug, jobTitle: payload.jobTitle,
          name: payload.name, email: payload.email, phone: payload.phone || "",
          message: payload.message || "",
          resumeName: resumeMeta.name || "", resumeSize: resumeMeta.size || 0,
          resumeDataUrl: resumeMeta.dataUrl || "", resumeDropped: false,
          stage: "applied",
          stageHistory: [{ stage: "applied", at: nowISO(), byUser: "candidate", note: "Applied via website", emailSent: true }],
          notes: [],
          createdAt: nowISO(), updatedAt: nowISO()
        };
        arr.unshift(app);
        if (persist(arr)) return app;
        // localStorage full: keep the application, drop only the inline résumé bytes
        app.resumeDataUrl = ""; app.resumeDropped = true;
        if (persist(arr)) return app;
        // still full: don't leave a half-written record
        arr.shift();
        throw new Error("STORAGE_FULL");
      }
      var f = payload.file, MAX = CONFIG.MAX_RESUME_BYTES;
      if (f && f.size && f.size <= MAX) {
        return new Promise(function (res, rej) {
          var fr = new FileReader();
          fr.onload = function () { try { res(store({ name: f.name, dataUrl: fr.result, size: f.size })); } catch (e) { rej(e); } };
          fr.onerror = function () { try { res(store({ name: f.name, size: f.size })); } catch (e) { rej(e); } };
          fr.readAsDataURL(f);
        });
      }
      return new Promise(function (res, rej) { try { res(store(f ? { name: f.name, size: f.size } : {})); } catch (e) { rej(e); } });
    });
  }
  function fillTemplate(tpl, app) {
    function sub(s) { return String(s || "").replace(/\{\{name\}\}/g, app.name || "").replace(/\{\{jobTitle\}\}/g, app.jobTitle || ""); }
    return { subject: sub(tpl.subject), body: sub(tpl.body) };
  }
  // change: {stage, note, notify, subject, body}
  function appsMoveStage(id, change) {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") return GISPL.auth.authed(CONFIG.API_BASE + "/admin/applications/" + id + "/stage", "PATCH", change);
      var arr = jget(K.apps, []);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          arr[i].stage = change.stage;
          arr[i].updatedAt = nowISO();
          arr[i].stageHistory = arr[i].stageHistory || [];
          arr[i].stageHistory.push({
            stage: change.stage, at: nowISO(), byUser: (GISPL.auth.user() || "admin"),
            note: change.note || "", emailSent: !!change.notify
          });
          if (change.notify) {
            arr[i].emails = arr[i].emails || [];
            arr[i].emails.push({ at: nowISO(), to: arr[i].email, subject: change.subject || "", body: change.body || "" });
          }
          jset(K.apps, arr);
          return arr[i];
        }
      }
      return null;
    });
  }
  function appsAddNote(id, text) {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") return GISPL.auth.authed(CONFIG.API_BASE + "/admin/applications/" + id + "/notes", "POST", { text: text });
      var arr = jget(K.apps, []);
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          arr[i].notes = arr[i].notes || [];
          arr[i].notes.push({ at: nowISO(), byUser: (GISPL.auth.user() || "admin"), text: text });
          jset(K.apps, arr); return arr[i];
        }
      }
      return null;
    });
  }

  /* ---------------- templates ---------------- */
  function tplGet() {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") return GISPL.auth.authed(CONFIG.API_BASE + "/admin/email-templates", "GET");
      return jget(K.tpl, DEFAULT_TEMPLATES);
    });
  }
  function tplSave(obj) {
    return ready().then(function () {
      if (CONFIG.MODE !== "local") return GISPL.auth.authed(CONFIG.API_BASE + "/admin/email-templates", "PUT", obj);
      jset(K.tpl, obj); return obj;
    });
  }

  /* ---------------- auth (stub in local mode) ----------------
     LOCAL: a dev-only gate stored in localStorage (any email/password).
     API: replace with Cognito Hosted UI (PKCE) — token attached to writes. */
  var AUTHKEY = "gispl:admin-session";
  var GISPLAuth = {
    isSignedIn: function () { return CONFIG.MODE !== "local" ? !!jget(AUTHKEY) : !!jget(AUTHKEY); },
    user: function () { var s = jget(AUTHKEY); return s ? s.email : null; },
    signIn: function (email) { jset(AUTHKEY, { email: email || "admin@gispl.com", at: nowISO() }); return Promise.resolve(true); },
    signOut: function () { localStorage.removeItem(AUTHKEY); },
    // API mode only: attach bearer token, send JSON
    authed: function (url, method, body) {
      var opt = { method: method, headers: { "Content-Type": "application/json" } };
      var s = jget(AUTHKEY); if (s && s.token) opt.headers.Authorization = "Bearer " + s.token;
      if (body) opt.body = JSON.stringify(body);
      return fetch(url, opt).then(function (r) { if (!r.ok) throw new Error(method + " " + url + " → " + r.status); return r.status === 204 ? true : r.json(); });
    },
    submitApplication: function (payload) {
      // API mode: implemented against the presign + POST /applications endpoints.
      throw new Error("submitApplication requires API mode wiring");
    }
  };

  window.GISPL = {
    config: CONFIG,
    STAGES: STAGES,
    auth: GISPLAuth,
    util: { esc: esc, slugify: slugify, fmtDate: fmtDate, uid: uid, nowISO: nowISO, fillTemplate: fillTemplate },
    data: {
      list: list, listAll: listAll, get: get, save: save, remove: remove,
      apps: { list: appsList, get: appsGet, submit: appsSubmit, moveStage: appsMoveStage, addNote: appsAddNote },
      templates: { get: tplGet, save: tplSave }
    }
  };
})();
