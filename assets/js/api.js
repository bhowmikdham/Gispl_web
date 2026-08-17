/* GISPL — site API client.

   One place decides whether the site has a backend. With API_BASE empty (the
   shipped default, and what the GitHub Pages review deploy runs on) every form
   keeps its `mailto:` handoff. Set it and the same forms post JSON to site-api
   instead, with the mailto kept as the fallback for a network failure — a lead
   is never dropped because a request timed out.

   Set it at deploy time rather than by hand:
       python3 scripts/build-dist.py --api-base https://www.example.com/api
*/
(function () {
  "use strict";

  var API_BASE = ""; /* build-dist:api-base */

  /* Stamped when the page's scripts run, sent with every submission. The API
     treats a form returned faster than a human could type it as scripted. */
  var RENDERED_AT = Date.now();

  var GISPL = (window.GISPL = window.GISPL || {});

  function post(path, payload) {
    if (!API_BASE) return Promise.reject(new Error("no-api"));
    if (!window.fetch) return Promise.reject(new Error("no-fetch"));

    var body = { renderedAt: RENDERED_AT };
    for (var k in payload) if (Object.prototype.hasOwnProperty.call(payload, k)) body[k] = payload[k];

    return fetch(API_BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        return { status: res.status, ok: res.status >= 200 && res.status < 300, data: data };
      });
    });
  }

  /* Upload a CV straight to S3 with the presigned policy the API returned.
     The policy — not this code — caps the size and pins the content type, so a
     tampered call just gets a 403 from S3. */
  function uploadFile(upload, file) {
    if (!upload || !file || !window.FormData) return Promise.reject(new Error("no-upload"));
    var fd = new FormData();
    for (var k in upload.fields) if (Object.prototype.hasOwnProperty.call(upload.fields, k)) fd.append(k, upload.fields[k]);
    fd.append("file", file);
    return fetch(upload.url, { method: "POST", body: fd }).then(function (res) {
      if (!res.ok) throw new Error("upload-failed");
      return true;
    });
  }

  /* Pull the first message out of a 400 so a form can show it inline. */
  function firstFieldError(data) {
    if (!data || !data.fields) return data && data.error ? data.error : "";
    for (var k in data.fields) if (Object.prototype.hasOwnProperty.call(data.fields, k)) return data.fields[k];
    return data.error || "";
  }

  GISPL.api = {
    base: API_BASE,
    enabled: function () { return !!API_BASE && !!window.fetch; },
    post: post,
    uploadFile: uploadFile,
    firstFieldError: firstFieldError,
    maxCvBytes: 8 * 1024 * 1024
  };
})();
