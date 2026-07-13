/* Local dev server — Node's built-in http, no dependencies. Parses the
   request into the normalized shape the router expects, adds CORS, and serves
   the static /files/* directory (the demo placeholder PDF). */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, resolve, normalize } from "node:path";
import { config, isProdSecretMissing } from "../config.js";
import { getStore } from "../store/index.js";
import { handleRequest } from "../router.js";
import { corsHeaders } from "./cors.js";

const FILES_DIR = resolve(new URL("../../files", import.meta.url).pathname);
const MIME = { ".pdf": "application/pdf", ".txt": "text/plain" };

function readBody(req) {
  return new Promise((res) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => res(data));
    req.on("error", () => res(""));
  });
}

async function serveFile(res, pathname, cors) {
  const rel = normalize(pathname.replace(/^\/files\//, "")).replace(/^(\.\.(\/|\\|$))+/, "");
  try {
    const buf = await readFile(join(FILES_DIR, rel));
    const ext = rel.slice(rel.lastIndexOf("."));
    res.writeHead(200, { ...cors, "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(404, { ...cors, "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "File not found" }));
  }
}

async function main() {
  if (isProdSecretMissing()) {
    console.error("REFUSING TO START: JWT_SECRET is the dev default while STORE=dynamo. Set a strong JWT_SECRET.");
    process.exit(1);
  }
  const store = await getStore();

  const server = createServer(async (req, res) => {
    const origin = req.headers.origin;
    const cors = corsHeaders(origin);
    const url = new URL(req.url, "http://localhost");
    const pathname = url.pathname;

    if (req.method === "OPTIONS") {
      res.writeHead(204, cors);
      res.end();
      return;
    }
    if (pathname.startsWith("/files/")) {
      await serveFile(res, pathname, cors);
      return;
    }

    const raw = req.method === "POST" ? await readBody(req) : "";
    let body = undefined;
    if (raw) {
      try { body = JSON.parse(raw); } catch { body = undefined; }
    }
    const query = Object.fromEntries(url.searchParams.entries());
    const scheme = (req.headers["x-forwarded-proto"] || "http").toString().split(",")[0];
    const selfBase = `${scheme}://${req.headers.host}`;

    const result = await handleRequest(
      { method: req.method, path: pathname, query, headers: req.headers, body, selfBase },
      { store }
    );
    res.writeHead(result.status, { ...cors, "Content-Type": "application/json" });
    res.end(JSON.stringify(result.body));
  });

  server.listen(config.port, () => {
    console.log(`GISPL portal API — store=${config.store} auth=${config.authMode} — http://localhost:${config.port}`);
  });
}

main();
