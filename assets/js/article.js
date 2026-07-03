/* GISPL — single insight/article detail. */
(function () {
  "use strict";
  var esc = GISPL.util.esc;
  function qp(name) { var m = new RegExp("[?&]" + name + "=([^&]*)").exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : ""; }
  function byId(id) { return document.getElementById(id); }

  function md(src) {
    return String(src || "").split(/\n\s*\n/).map(function (para) {
      var t = esc(para).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\n/g, "<br>");
      return "<p style=\"margin:0 0 20px\">" + t + "</p>";
    }).join("");
  }

  if (!byId("artTitle")) return;
  var slug = qp("slug");

  GISPL.data.get("posts", slug).then(function (post) {
    if (!post || post.status === "draft") {
      byId("artNotFound").style.display = "block";
      byId("artCat").style.display = byId("artTitle").style.display = byId("artMeta").style.display = byId("artCover").style.display = byId("artBody").style.display = "none";
      document.title = "Article not found — GISPL";
      return;
    }
    document.title = post.title + " — GISPL Insights";
    var desc = document.querySelector('meta[name="description"]'); if (desc) desc.setAttribute("content", post.excerpt || post.title);
    byId("artCat").textContent = post.category || "";
    byId("artTitle").textContent = post.title || "";
    var meta = [post.readTime, post.dateLabel || GISPL.util.fmtDate(post.date), post.author].filter(Boolean).join("  ·  ");
    byId("artMeta").textContent = meta;
    // cover badge
    byId("artCover").innerHTML = '<div style="position:relative;width:100%;height:100%">'
      + '<div style="position:absolute;inset:0;background:repeating-linear-gradient(125deg,rgba(255,255,255,.045) 0 1px,transparent 1px 13px)"></div>'
      + '<div style="position:absolute;inset:0;background:radial-gradient(60% 70% at 74% 26%,rgba(242,106,33,.24),transparent 60%)"></div>'
      + '<span style="position:absolute;top:20px;left:20px;font:500 10px \'IBM Plex Mono\';letter-spacing:.14em;color:#fff;background:rgba(242,106,33,.95);padding:6px 12px;border-radius:20px">' + esc(String(post.category || "").toUpperCase()) + "</span></div>";
    byId("artBody").innerHTML = md(post.bodyMd || post.excerpt || "");
  }).catch(function (e) {
    if (window.console) console.error("article load failed", e);
    byId("artTitle").textContent = "Something went wrong";
  });
})();
