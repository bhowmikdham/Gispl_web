/* DynamoDB store (AWS mode). Single table, one partition per record:

     PK = LEAD#<id>        SK = #META    a proposal request / gated download
     PK = APP#<id>         SK = #META    a job application
     PK = SUB#<email>      SK = #META    a newsletter subscriber
     PK = RL#<key>#<win>   SK = #RL      a rate-limit counter (TTL'd)

   GSI1 (GSI1PK = TYPE#<kind>, GSI1SK = <createdAt>) exists so operations can
   read leads back in chronological order without a table Scan. The API itself
   never reads them — nothing in this service exposes a stored lead over HTTP,
   which is what keeps a public, unauthenticated write API from also being a
   customer-data leak.

   Every record carries `ttl` (epoch seconds), so DynamoDB erases it once the
   retention window closes rather than leaving personal data to accumulate.

   The AWS SDK is imported here only, and this module is lazy-loaded, so local
   dev never needs it installed. */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { config } from "../config.js";

const RETENTION_SECONDS = () => config.retentionDays * 86400;

export function createDynamoStore() {
  const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: config.region }), {
    marshallOptions: { removeUndefinedValues: true },
  });
  const TABLE = config.ddbTable;

  function ttlFor(createdAt) {
    const base = Date.parse(createdAt || "") || Date.now();
    return Math.floor(base / 1000) + RETENTION_SECONDS();
  }

  async function putRecord(pk, kind, data) {
    await ddb.send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          PK: pk,
          SK: "#META",
          GSI1PK: `TYPE#${kind}`,
          GSI1SK: data.createdAt,
          ttl: ttlFor(data.createdAt),
          data,
        },
      })
    );
    return data;
  }

  return {
    async ready() {
      /* table is provisioned by the SAM stack; nothing to do at runtime */
    },

    async putLead(lead) {
      return putRecord(`LEAD#${lead.id}`, "lead", lead);
    },

    async putApplication(app) {
      return putRecord(`APP#${app.id}`, "application", app);
    },

    async getSubscriber(email) {
      const out = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: `SUB#${email}`, SK: "#META" } }));
      return out.Item ? out.Item.data : null;
    },

    async putSubscriber(sub) {
      // A subscriber outlives the lead-retention window by design: the record
      // IS the consent evidence and the suppression list. Refreshing its ttl on
      // every write keeps it alive while the subscription is active.
      await ddb.send(
        new PutCommand({
          TableName: TABLE,
          Item: {
            PK: `SUB#${sub.email}`,
            SK: "#META",
            GSI1PK: "TYPE#subscriber",
            GSI1SK: sub.createdAt,
            ttl: Math.floor(Date.now() / 1000) + RETENTION_SECONDS(),
            data: sub,
          },
        })
      );
      return sub;
    },

    async bumpRate(key, windowSeconds) {
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - (now % windowSeconds);
      // ADD is atomic, so concurrent Lambda containers share one true count.
      const out = await ddb.send(
        new UpdateCommand({
          TableName: TABLE,
          Key: { PK: `RL#${key}#${windowStart}`, SK: "#RL" },
          UpdateExpression: "ADD hits :one SET expiresAt = if_not_exists(expiresAt, :exp), #ttl = if_not_exists(#ttl, :exp)",
          ExpressionAttributeNames: { "#ttl": "ttl" },
          ExpressionAttributeValues: { ":one": 1, ":exp": windowStart + windowSeconds * 2 },
          ReturnValues: "UPDATED_NEW",
        })
      );
      return Number(out.Attributes?.hits || 1);
    },
  };
}
