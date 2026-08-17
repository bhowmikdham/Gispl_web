/* Store factory — file store for local dev, DynamoDB for AWS. The DynamoDB
   module is imported lazily so local dev needs no AWS SDK installed.

   Both stores implement the same surface:
     ready()
     putLead(lead)                     record a proposal / gated-download lead
     putApplication(app)               record a job application
     getSubscriber(email)              → subscriber | null
     putSubscriber(sub)                upsert a subscriber
     bumpRate(key, windowSeconds)      → hits so far in the current window
*/

import { config } from "../config.js";
import { createFileStore } from "./file-store.js";

let _store = null;

export async function getStore() {
  if (_store) return _store;
  if (config.store === "dynamo") {
    const { createDynamoStore } = await import("./dynamo-store.js");
    _store = createDynamoStore();
  } else {
    _store = createFileStore();
  }
  await _store.ready();
  return _store;
}

/** Test seam: drop the cached instance so a suite can rebuild it. */
export function resetStore() {
  _store = null;
}
