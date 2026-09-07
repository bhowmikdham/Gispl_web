/* GISPL — viz.js: dependency-free animated figures for the hand-maintained pages.

   Count-ups          are NOT here: site.js animates any .gx-count element (upstream pattern).
   Bars / dumbbells / <figure class="gx-viz" data-viz="bars|dumbbell|line">…<table>…</table></figure>
   lines              the <table> is the data source AND the accessible table
                      view; the chart is drawn from it, so the two can't drift.
   Meters             <div class="gx-viz-meter" data-viz-meter="91" data-from="24">
   Runway             <div class="gx-viz-meter" data-viz-runway data-start="…" data-end="…">
   Reveal hook        <div data-viz-reveal> gains .gx-reveal-armed at load and .is-in on first view

   Progressive enhancement: without JS the page shows the final numbers and the
   plain tables. Marks animate once, when they scroll into view. Honours
   prefers-reduced-motion by rendering the final state with no animation.
   Chart colours were validated with the dataviz palette checks (orange/blue
   on white and on navy; navy ordinal ramp on light, orange ramp on navy). */
(function () {
  "use strict";
  var SVG = "http://www.w3.org/2000/svg";
  var pref = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var reduce = !!pref.matches;

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function svg(tag, attrs) {
    var e = document.createElementNS(SVG, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    return e;
  }
  function fmt(n, decimals) {
    return Number(n).toLocaleString("en-US", { minimumFractionDigits: decimals || 0, maximumFractionDigits: decimals || 0 });
  }
  function ease(p) { return 1 - Math.pow(1 - p, 3); }
  function attr(node, name, fallback) { var v = node.getAttribute(name); return v == null || v === "" ? fallback : v; }

  /* ---- run once, when a node scrolls into view ---- */
  var pending = new Map();
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    each(entries, function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      var fn = pending.get(en.target);
      if (fn) { pending.delete(en.target); fn(); }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }) : null;
  function whenVisible(node, fn) {
    if (!io || reduce) { fn(); return; }
    pending.set(node, fn);
    io.observe(node);
  }

  /* ---- theme tokens: marks wear the series colour, text wears ink ---- */
  function theme(fig) {
    var dark = fig.getAttribute("data-theme") === "dark";
    return dark ? {
      series: ["#E85F17", "#3987E5", "#1BAF7A"], context: "rgba(255,255,255,.22)",
      ink: "#fff", ink2: "rgba(255,255,255,.7)", muted: "rgba(255,255,255,.45)",
      grid: "rgba(255,255,255,.1)", axis: "rgba(255,255,255,.26)", surface: "#0C2136",
      ramp: ["#FCD5BD", "#F8A97A", "#F26A21", "#B5440C"]
    } : {
      series: ["#F26A21", "#2A78D6", "#1BAF7A"], context: "#CDD3DE",
      ink: "#0B1E3B", ink2: "#5B647C", muted: "#8A92A4",
      grid: "rgba(11,30,59,.1)", axis: "rgba(11,30,59,.22)", surface: "#fff",
      ramp: ["#A9B8D1", "#7E93B4", "#546C94", "#2F4A75", "#0B1E3B"]
    };
  }

  /* ---- reveal hooks: an element gets .is-in the first time it scrolls into view.
     Armed only when JS runs, so without JS the CSS never hides anything. ---- */
  each(document.querySelectorAll("[data-viz-reveal]"), function (node) {
    node.classList.add("gx-reveal-armed");
    whenVisible(node, function () { requestAnimationFrame(function () { node.classList.add("is-in"); }); });
  });

  /* ---- meters: a single ratio against a limit ---- */
  each(document.querySelectorAll("[data-viz-meter]"), function (node) {
    var value = parseFloat(node.getAttribute("data-viz-meter"));
    var from = parseFloat(attr(node, "data-from", "0")) || 0;
    var max = parseFloat(attr(node, "data-max", "100")) || 100;
    if (isNaN(value)) return;
    var fill = node.querySelector(".gx-viz-meter-fill") || node.appendChild(el("span", "gx-viz-meter-fill"));
    var pct = function (v) { return Math.max(0, Math.min(100, (v / max) * 100)) + "%"; };
    fill.style.width = pct(reduce ? value : from);
    whenVisible(node, function () {
      requestAnimationFrame(function () { fill.style.width = pct(value); });
    });
  });

  /* ---- runway: how much of a fixed window has elapsed, in IST like the rest of the site ---- */
  function istToday() {
    try { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date()); }
    catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  each(document.querySelectorAll("[data-viz-runway]"), function (node) {
    var start = Date.parse(node.getAttribute("data-start")), end = Date.parse(node.getAttribute("data-end"));
    if (isNaN(start) || isNaN(end) || end <= start) return;
    var now = Date.parse(istToday());
    var used = Math.max(0, Math.min(1, (now - start) / (end - start)));
    var left = Math.max(0, Math.round((end - now) / 86400000));
    var fill = node.querySelector(".gx-viz-meter-fill") || node.appendChild(el("span", "gx-viz-meter-fill"));
    var label = document.getElementById(attr(node, "data-label", ""));
    var text = used >= 1 ? "Runway used — deadline passed"
      : Math.round(used * 100) + "% of the runway used · " + fmt(left) + (left === 1 ? " day left" : " days left");
    node.setAttribute("role", "img");
    node.setAttribute("aria-label", text);
    if (label) label.textContent = text;
    fill.style.width = reduce ? (used * 100) + "%" : "0%";
    whenVisible(node, function () {
      requestAnimationFrame(function () { fill.style.width = (used * 100) + "%"; });
    });
  });

  /* ---- table-driven figures ---- */
  function parseTable(fig) {
    var table = fig.querySelector("table");
    if (!table) return null;
    var head = [];
    each(table.querySelectorAll("thead th"), function (th) { head.push(th.textContent.trim()); });
    var rows = [];
    each(table.querySelectorAll("tbody tr"), function (tr) {
      var cells = tr.querySelectorAll("th,td");
      if (!cells.length) return;
      var values = [];
      for (var i = 1; i < cells.length; i++) {
        var v = parseFloat(String(cells[i].textContent).replace(/[^0-9.\-]/g, ""));
        values.push(isNaN(v) ? 0 : v);
      }
      rows.push({ label: cells[0].textContent.trim(), values: values, emphasis: tr.hasAttribute("data-emphasis") });
    });
    return { head: head, rows: rows, table: table };
  }

  function tooltip(fig) {
    var tip = fig.querySelector(".gx-viz-tip");
    if (!tip) { tip = el("div", "gx-viz-tip"); tip.setAttribute("aria-hidden", "true"); fig.appendChild(tip); }
    return {
      show: function (lines, x, y) {
        // lines: [{ value, label, color }] — value leads, label follows; names are data, so textContent only
        while (tip.firstChild) tip.removeChild(tip.firstChild);
        each(lines, function (ln) {
          var row = el("div", "gx-viz-tip-row");
          if (ln.color) { var key = el("span", "gx-viz-tip-key"); key.style.background = ln.color; row.appendChild(key); }
          row.appendChild(el("strong", null, ln.value));
          row.appendChild(el("span", null, ln.label));
          tip.appendChild(row);
        });
        var rect = fig.getBoundingClientRect();
        var px = x - rect.left, py = y - rect.top;
        tip.classList.add("on");
        var w = tip.offsetWidth, h = tip.offsetHeight;
        var left = Math.max(8, Math.min(rect.width - w - 8, px + 14));
        var top = py - h - 12;
        if (top < 4) top = py + 16;
        tip.style.left = left + "px";
        tip.style.top = top + "px";
      },
      hide: function () { tip.classList.remove("on"); }
    };
  }

  function toggle(fig, table) {
    var btn = el("button", "gx-viz-toggle", "Show the data");
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    table.hidden = true;
    btn.addEventListener("click", function () {
      table.hidden = !table.hidden;
      btn.textContent = table.hidden ? "Show the data" : "Hide the data";
      btn.setAttribute("aria-expanded", table.hidden ? "false" : "true");
    });
    fig.insertBefore(btn, table);
  }

  function legend(fig, names, colors, kind) {
    var box = el("div", "gx-viz-legend");
    box.setAttribute("aria-hidden", "true");
    each(names, function (n, i) {
      var key = el("span", "gx-viz-key");
      var sw = el("span", kind === "line" ? "gx-viz-swatch-line" : "gx-viz-swatch");
      sw.style.background = colors[i % colors.length];
      key.appendChild(sw);
      key.appendChild(el("span", null, n));
      box.appendChild(key);
    });
    return box;
  }

  function centreOf(node) {
    var r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top };
  }

  /* bars: one series (emphasis or ordinal ramp) — magnitude, low -> high */
  function buildBars(fig, data, T, tip) {
    var unit = attr(fig, "data-unit", "");
    var max = parseFloat(attr(fig, "data-max", "")) || 0;
    if (!max) each(data.rows, function (r) { max = Math.max(max, r.values[0] || 0); });
    var ordinal = fig.getAttribute("data-ramp") === "ordinal";
    var anyEmphasis = data.rows.some(function (r) { return r.emphasis; });
    var wrap = el("div", "gx-viz-rows");
    wrap.setAttribute("role", "list");
    var bars = [];
    each(data.rows, function (r, i) {
      var v = r.values[0] || 0;
      var row = el("div", "gx-viz-row");
      row.setAttribute("role", "listitem");
      row.tabIndex = 0;
      row.setAttribute("aria-label", r.label + ": " + fmt(v, unit === "%" ? 0 : 0) + unit);
      var track = el("span", "gx-viz-track");
      var bar = el("span", "gx-viz-bar");
      var color = ordinal ? T.ramp[Math.min(T.ramp.length - 1, Math.floor(i * T.ramp.length / data.rows.length))]
        : (anyEmphasis && !r.emphasis ? T.context : T.series[0]);
      bar.style.background = color;
      bar.style.transitionDelay = (i * 70) + "ms";
      bar.style.width = reduce ? (v / max * 100) + "%" : "0%";
      track.appendChild(bar);
      row.appendChild(el("span", "gx-viz-label", r.label));
      row.appendChild(track);
      row.appendChild(el("span", "gx-viz-val", fmt(v) + unit));
      var show = function () { var c = centreOf(bar); tip.show([{ value: fmt(v) + unit, label: r.label, color: color }], c.x, c.y); };
      row.addEventListener("pointerenter", show);
      row.addEventListener("focus", show);
      row.addEventListener("pointerleave", tip.hide);
      row.addEventListener("blur", tip.hide);
      wrap.appendChild(row);
      bars.push({ bar: bar, v: v });
    });
    fig.insertBefore(wrap, data.table);
    whenVisible(fig, function () {
      requestAnimationFrame(function () {
        each(bars, function (b) { b.bar.style.width = (b.v / max * 100) + "%"; });
      });
    });
  }

  /* dumbbell: before -> after per item — two shades, the "after" carries the accent */
  function buildDumbbell(fig, data, T, tip) {
    var unit = attr(fig, "data-unit", "");
    var max = parseFloat(attr(fig, "data-max", "")) || 0;
    if (!max) each(data.rows, function (r) { max = Math.max(max, r.values[0] || 0, r.values[1] || 0); });
    var names = data.head.slice(1, 3);
    var colors = [T.context, T.series[0]];
    fig.insertBefore(legend(fig, names, colors, "dot"), data.table);
    var wrap = el("div", "gx-viz-rows");
    wrap.setAttribute("role", "list");
    var items = [];
    each(data.rows, function (r, i) {
      var a = r.values[0] || 0, b = r.values[1] || 0;
      var pa = a / max * 100, pb = b / max * 100;
      var row = el("div", "gx-viz-row");
      row.setAttribute("role", "listitem");
      row.tabIndex = 0;
      row.setAttribute("aria-label", r.label + ": " + names[0] + " " + fmt(a) + unit + ", " + names[1] + " " + fmt(b) + unit);
      var track = el("span", "gx-viz-track gx-viz-db");
      var line = el("span", "gx-viz-db-line");
      line.style.background = T.axis;
      var d0 = el("span", "gx-viz-dot"), d1 = el("span", "gx-viz-dot");
      d0.style.background = T.context; d1.style.background = T.series[0];
      d0.style.boxShadow = d1.style.boxShadow = "0 0 0 2px " + T.surface;
      d0.style.left = pa + "%";
      var startAt = reduce ? pb : pa;
      d1.style.left = startAt + "%";
      line.style.left = Math.min(pa, startAt) + "%";
      line.style.width = Math.abs(startAt - pa) + "%";
      d1.style.transitionDelay = line.style.transitionDelay = (i * 70) + "ms";
      track.appendChild(line); track.appendChild(d0); track.appendChild(d1);
      row.appendChild(el("span", "gx-viz-label", r.label));
      row.appendChild(track);
      var val = el("span", "gx-viz-val");
      val.appendChild(el("span", "gx-viz-val-from", fmt(a) + unit));
      val.appendChild(document.createTextNode(" → "));
      val.appendChild(el("span", null, fmt(b) + unit));
      row.appendChild(val);
      var show = function () {
        var c = centreOf(d1);
        tip.show([{ value: fmt(b) + unit, label: names[1], color: T.series[0] }, { value: fmt(a) + unit, label: names[0], color: T.context }], c.x, c.y);
      };
      row.addEventListener("pointerenter", show);
      row.addEventListener("focus", show);
      row.addEventListener("pointerleave", tip.hide);
      row.addEventListener("blur", tip.hide);
      wrap.appendChild(row);
      items.push({ line: line, dot: d1, pa: pa, pb: pb });
    });
    fig.insertBefore(wrap, data.table);
    whenVisible(fig, function () {
      requestAnimationFrame(function () {
        each(items, function (it) {
          it.dot.style.left = it.pb + "%";
          it.line.style.left = Math.min(it.pa, it.pb) + "%";
          it.line.style.width = Math.abs(it.pb - it.pa) + "%";
        });
      });
    });
  }

  function niceStep(max) {
    if (max <= 0) return 1;
    var raw = max / 4, p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), f = raw / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }

  /* line: change over time — rows are the x positions, columns the series */
  function buildLine(fig, data, T, tip) {
    var unit = attr(fig, "data-unit", "");
    var names = data.head.slice(1);
    var n = data.rows.length;
    if (n < 2 || !names.length) return;
    var cs = window.getComputedStyle(fig);
    var inner = fig.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    var W = Math.max(300, Math.round(inner) || 640);
    var H = Math.round(Math.min(320, Math.max(200, W * 0.42)));
    var L = 46, R = 60, TP = 18, B = 36;
    var max = 0;
    each(data.rows, function (r) { each(r.values, function (v) { max = Math.max(max, v); }); });
    var step = niceStep(max), top = Math.max(step, Math.ceil(max / step) * step);
    var x = function (i) { return L + (W - L - R) * i / (n - 1); };
    var y = function (v) { return TP + (H - TP - B) * (1 - v / top); };
    var colors = T.series;
    var root = svg("svg", { viewBox: "0 0 " + W + " " + H, "class": "gx-viz-svg", role: "img", "aria-label": attr(fig, "data-summary", names.join(", ") + " over " + data.rows[0].label + " to " + data.rows[n - 1].label) });

    // recessive hairline grid + clean ticks
    for (var g = 0; g <= top; g += step) {
      root.appendChild(svg("line", { x1: L, x2: W - R, y1: y(g), y2: y(g), stroke: g === 0 ? T.axis : T.grid, "stroke-width": 1 }));
      var t = svg("text", { x: L - 10, y: y(g) + 4, "text-anchor": "end", fill: T.muted, "font-size": 11, "font-family": "'IBM Plex Mono',monospace" });
      t.textContent = fmt(g);
      root.appendChild(t);
    }
    // x labels — thin them by the room each label actually needs, so they never collide
    var longest = 0;
    each(data.rows, function (r) { longest = Math.max(longest, r.label.length); });
    var slots = Math.max(1, Math.floor((W - L - R) / (longest * 6.8 + 16)));
    var every = Math.max(1, Math.ceil((n - 1) / slots));
    var lastShown = -1;
    each(data.rows, function (r, i) {
      var show = i % every === 0 || (i === n - 1 && i - lastShown >= every);
      if (!show) return;
      lastShown = i;
      var t = svg("text", { x: x(i), y: H - 10, "text-anchor": i === 0 ? "start" : i === n - 1 ? "end" : "middle", fill: T.muted, "font-size": 11, "font-family": "'IBM Plex Mono',monospace" });
      t.textContent = r.label;
      root.appendChild(t);
    });

    var paths = [], markers = [], labels = [];
    each(names, function (name, s) {
      var color = colors[s % colors.length];
      var d = "";
      each(data.rows, function (r, i) { d += (i ? " L" : "M") + x(i).toFixed(1) + "," + y(r.values[s] || 0).toFixed(1); });
      if (names.length === 1) {
        var area = svg("path", { d: d + " L" + x(n - 1).toFixed(1) + "," + y(0) + " L" + x(0).toFixed(1) + "," + y(0) + " Z", fill: color, "fill-opacity": ".1", stroke: "none" });
        root.appendChild(area);
      }
      var p = svg("path", { d: d, fill: "none", stroke: color, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" });
      root.appendChild(p);
      paths.push(p);
      each(data.rows, function (r, i) {
        var m = svg("circle", { cx: x(i), cy: y(r.values[s] || 0), r: 4, fill: color, stroke: T.surface, "stroke-width": 2, "class": "gx-viz-marker" });
        root.appendChild(m);
        markers.push(m);
      });
      var last = data.rows[n - 1].values[s] || 0;
      var lbl = svg("text", { x: x(n - 1) + 9, y: y(last) + 4, fill: T.ink2, "font-size": 12, "font-weight": 500, "font-family": "'IBM Plex Sans',sans-serif", "class": "gx-viz-endlabel" });
      lbl.textContent = fmt(last) + unit;
      root.appendChild(lbl);
      labels.push(lbl);
    });

    var hair = svg("line", { x1: x(0), x2: x(0), y1: TP, y2: y(0), stroke: T.axis, "stroke-width": 1, "class": "gx-viz-hair" });
    root.appendChild(hair);
    var hit = svg("rect", { x: L, y: TP, width: W - L - R, height: H - TP - B, fill: "transparent" });
    root.appendChild(hit);

    if (names.length > 1) fig.insertBefore(legend(fig, names, colors, "line"), data.table);
    var box = el("div", "gx-viz-plot");
    box.tabIndex = 0;
    box.setAttribute("aria-label", "Chart. Use the arrow keys to read each point.");
    box.appendChild(root);
    fig.insertBefore(box, data.table);

    var current = -1;
    function readout(i) {
      current = i;
      hair.setAttribute("x1", x(i)); hair.setAttribute("x2", x(i));
      hair.classList.add("on");
      var lines = names.map(function (nm, s) { return { value: fmt(data.rows[i].values[s] || 0) + unit, label: nm, color: colors[s % colors.length] }; });
      var rect = root.getBoundingClientRect(), scale = rect.width / W;
      var topV = 0; each(data.rows[i].values, function (v) { topV = Math.max(topV, v); });
      tip.show(lines, rect.left + x(i) * scale, rect.top + y(topV) * scale);
      each(markers, function (m, k) { m.classList.toggle("is-on", k % n === i); });
    }
    function clear() { hair.classList.remove("on"); tip.hide(); each(markers, function (m) { m.classList.remove("is-on"); }); }
    hit.addEventListener("pointermove", function (ev) {
      var rect = root.getBoundingClientRect(), scale = rect.width / W;
      var px = (ev.clientX - rect.left) / scale;
      var i = Math.round((px - L) / (W - L - R) * (n - 1));
      readout(Math.max(0, Math.min(n - 1, i)));
    });
    hit.addEventListener("pointerleave", clear);
    box.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowRight" || ev.key === "ArrowLeft") {
        ev.preventDefault();
        readout(current < 0 ? (ev.key === "ArrowRight" ? 0 : n - 1) : Math.max(0, Math.min(n - 1, current + (ev.key === "ArrowRight" ? 1 : -1))));
      } else if (ev.key === "Escape") clear();
    });
    box.addEventListener("blur", clear);

    // draw-in: each line traces itself, then markers and end-labels settle in
    if (reduce) return;
    each(paths, function (p, s) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = "stroke-dashoffset 1400ms cubic-bezier(.22,.68,0,1) " + (s * 260) + "ms";
    });
    each(markers.concat(labels), function (m) { m.style.opacity = 0; m.style.transition = "opacity 500ms ease 1300ms"; });
    whenVisible(fig, function () {
      requestAnimationFrame(function () {
        each(paths, function (p) { p.style.strokeDashoffset = 0; });
        each(markers.concat(labels), function (m) { m.style.opacity = 1; });
      });
    });
  }

  each(document.querySelectorAll(".gx-viz[data-viz]"), function (fig) {
    var data = parseTable(fig);
    if (!data || !data.rows.length) return;
    var T = theme(fig), tip = tooltip(fig), kind = fig.getAttribute("data-viz");
    fig.style.setProperty("--gx-viz-surface", T.surface);
    if (kind === "bars") buildBars(fig, data, T, tip);
    else if (kind === "dumbbell") buildDumbbell(fig, data, T, tip);
    else if (kind === "line") buildLine(fig, data, T, tip);
    else return;
    toggle(fig, data.table);
    fig.classList.add("is-enhanced");
  });

  pref.addEventListener && pref.addEventListener("change", function () { reduce = !!pref.matches; });
})();
