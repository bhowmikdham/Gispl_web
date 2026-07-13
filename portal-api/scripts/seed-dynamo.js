/* Populate the DynamoDB table from seed-data.js using the single-table schema
   the DynamoStore reads. Run once after `sam deploy`:

     DDB_TABLE=gispl-portal AWS_REGION=ap-south-1 node scripts/seed-dynamo.js

   Requires AWS credentials in the environment (the deploying user/role). */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { config } from "../src/config.js";
import { hashPassword } from "../src/auth/crypto-util.js";
import { CLIENTS, USERS, ENGAGEMENTS, FINDINGS, DOCUMENTS } from "../src/store/seed-data.js";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: config.region }), {
  marshallOptions: { removeUndefinedValues: true },
});
const TABLE = config.ddbTable;

function item(pk, sk, data) {
  return { PutRequest: { Item: { PK: pk, SK: sk, data } } };
}

function allItems() {
  const rows = [];
  for (const c of CLIENTS) rows.push(item(`CLIENT#${c.id}`, "#META", c));
  for (const u of USERS) {
    rows.push(item(`USER#${u.email.toLowerCase()}`, "#USER", { email: u.email.toLowerCase(), name: u.name, clientId: u.clientId, passwordHash: hashPassword(u.password) }));
  }
  const clientOf = new Map(ENGAGEMENTS.map((e) => [e.id, e.clientId]));
  for (const e of ENGAGEMENTS) rows.push(item(`CLIENT#${e.clientId}`, `ENG#${e.id}`, e));
  for (const f of FINDINGS) {
    const cid = clientOf.get(f.engagementId);
    if (cid) rows.push(item(`CLIENT#${cid}`, `FND#${f.id}`, f));
  }
  for (const d of DOCUMENTS) {
    const cid = clientOf.get(d.engagementId);
    if (cid) rows.push(item(`CLIENT#${cid}`, `DOC#${d.id}`, { ...d, s3Key: `documents/${d.id}.${d.fileExt}` }));
  }
  return rows;
}

async function main() {
  if (config.store !== "dynamo") {
    console.warn("Note: STORE is not 'dynamo'. Seeding table", TABLE, "anyway.");
  }
  const rows = allItems();
  for (let i = 0; i < rows.length; i += 25) {
    const batch = rows.slice(i, i + 25);
    await ddb.send(new BatchWriteCommand({ RequestItems: { [TABLE]: batch } }));
    console.log(`wrote ${Math.min(i + 25, rows.length)}/${rows.length}`);
  }
  console.log(`Seeded ${rows.length} items into ${TABLE}. Remember to upload real document files to s3://${config.s3Bucket}/documents/ (demo uses a placeholder).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
