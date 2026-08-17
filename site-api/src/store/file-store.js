/* Local persistence: a single JSON file under <dataDir>. Zero dependencies,
   same surface as the DynamoDB store so the handlers never know which one they
   are talking to.

   This is a DEV store. It rewrites the whole file on every write and keeps rate
   limits in process memory, so it is single-process only — which is exactly the
   shape of `npm start` on a laptop, and never the shape of production. */

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from "node:fs";
import { join, resolve } from "node:path";
import { config } from "../config.js";

const EMPTY = { leads: [], applications: [], subscribers: [] };

export function createFileStore() {
  const dir = resolve(config.dataDir);
  const file = join(dir, "site.json");
  let db = null;
  // key → { windowStart, hits }. Deliberately in-memory: a restart forgiving a
  // few requests is fine, corrupting the JSON file under concurrent writes is not.
  const rate = new Map();

  function load() {
    if (db) return db;
    if (existsSync(file)) {
      try {
        db = { ...EMPTY, ...JSON.parse(readFileSync(file, "utf8")) };
      } catch {
        // A truncated file must not take the whole service down on boot.
        db = { ...EMPTY };
      }
    } else {
      db = { ...EMPTY };
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      save();
    }
    return db;
  }

  function save() {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    // write-then-rename: a crash mid-write leaves the previous file intact
    const tmp = `${file}.tmp`;
    writeFileSync(tmp, JSON.stringify(db, null, 2));
    renameSync(tmp, file);
  }

  return {
    async ready() {
      load();
    },

    async putLead(lead) {
      const d = load();
      d.leads.push(lead);
      save();
      return lead;
    },

    async putApplication(app) {
      const d = load();
      d.applications.push(app);
      save();
      return app;
    },

    async getSubscriber(email) {
      const d = load();
      return d.subscribers.find((s) => s.email === email) || null;
    },

    async putSubscriber(sub) {
      const d = load();
      const i = d.subscribers.findIndex((s) => s.email === sub.email);
      if (i >= 0) d.subscribers[i] = sub;
      else d.subscribers.push(sub);
      save();
      return sub;
    },

    async bumpRate(key, windowSeconds) {
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - (now % windowSeconds);
      // drop entries whose window has closed, so a long-running dev server
      // does not accumulate one map entry per IP it has ever seen
      if (rate.size > 5000) {
        for (const [k, v] of rate) if (v.windowStart !== windowStart) rate.delete(k);
      }
      const cur = rate.get(key);
      if (!cur || cur.windowStart !== windowStart) {
        rate.set(key, { windowStart, hits: 1 });
        return 1;
      }
      cur.hits += 1;
      return cur.hits;
    },
  };
}
