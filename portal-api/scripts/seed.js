/* Force a fresh local seed: delete the file store's db.json so the next
   server start re-seeds from seed-data.js. */
import { rmSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { config } from "../src/config.js";

const file = join(resolve(config.dataDir), "db.json");
if (existsSync(file)) {
  rmSync(file);
  console.log("removed", file);
} else {
  console.log("no existing db.json at", file);
}
console.log("next `npm start` will re-seed.");
