/* Local dev server — Node's built-in http, no dependencies. Parses the request
   into the normalized shape the router expects and adds CORS. Run it with
   `npm start`; with no AWS configuration it stores to .data/site.json and
   prints the notification emails to the console. */

import { createServer } from "node:http";
import { config, isProdSecretMissing } from "../config.js";
import { getStore } from "../store/index.js";
import { handleRequest } from "../router.js";
import { corsHeaders } from "./cors.js";

// A form post is a few kilobytes. Anything larger is either a mistake or an
// attempt to make the process hold a large buffer, so the socket is cut.
const MAX_BODY_BYTES = 64 * 1024;

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    let size = 0;
    let done = false;
    const finish = (v) => { if (!done) { done = true; resolve(v); } };
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) { req.destroy(); finish(null); return; }
      data += c;
    });
    req.on("end", () => finish(data));
    req.on("error", () => finish(null));
  });
}

async function main() {
  if (isProdSecretMissing()) {
    console.error("REFUSING TO START: SITE_SECRET is the dev default while STORE=dynamo. Set a strong SITE_SECRET.");
    process.exit(1);
  }
  const store = await getStore();

  const server = createServer(async (req, res) => {
    const cors = corsHeaders(req.headers.origin);
    const url = new URL(req.url, "http://localhost");

    if (req.method === "OPTIONS") {
      res.writeHead(204, cors);
      res.end();
      return;
    }

    const raw = req.method === "POST" ? await readBody(req) : "";
    if (raw === null) {
      res.writeHead(413, { ...cors, "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Request too large." }));
      return;
    }
    let body;
    if (raw) {
      try { body = JSON.parse(raw); } catch { body = undefined; }
    }

    const result = await handleRequest(
      {
        method: req.method,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams.entries()),
        headers: req.headers,
        body,
        // Local dev talks to the socket directly; no proxy header is trusted.
        clientIp: req.socket.remoteAddress,
        userAgent: req.headers["user-agent"] || "",
      },
      { store }
    );

    const extra = result.headers || {};
    if (result.html !== undefined) {
      res.writeHead(result.status, { ...cors, ...extra, "Content-Type": "text/html; charset=utf-8" });
      res.end(result.html);
      return;
    }
    res.writeHead(result.status, { ...cors, ...extra, "Content-Type": "application/json" });
    res.end(JSON.stringify(result.body));
  });

  server.listen(config.port, () => {
    console.log(
      `GISPL site API — store=${config.store} mail=${config.mail.from ? "ses" : "console"} — http://localhost:${config.port}`
    );
  });
}

main();
