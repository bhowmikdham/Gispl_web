/* Store factory — file store for local dev, DynamoDB for AWS.
   The DynamoDB module is imported lazily so local dev needs no AWS SDK. */

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
