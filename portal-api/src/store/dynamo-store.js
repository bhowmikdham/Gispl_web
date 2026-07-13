/* DynamoDB store (AWS mode). Single-table, tenant-partitioned design:

     PK = CLIENT#<clientId>   groups every item a tenant owns
       SK = #META             the client record
       SK = ENG#<engId>       an engagement
       SK = FND#<findingId>   a finding
       SK = DOC#<docId>       a document
     PK = USER#<email>, SK = #USER   a login user (separate partition)

   Because every data query is Query(PK = CLIENT#<clientId from the token>),
   tenant isolation is structural — one tenant physically cannot query
   another's partition. Documents resolve to short-lived S3 presigned URLs.

   AWS SDK is imported here only (this module is lazy-loaded), so local dev
   never needs it installed. */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config.js";
import { filterFindings, filterDocuments } from "./filters.js";

export function createDynamoStore() {
  const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: config.region }), {
    marshallOptions: { removeUndefinedValues: true },
  });
  const s3 = new S3Client({ region: config.region });
  const TABLE = config.ddbTable;

  async function queryClient(clientId, skPrefix) {
    // page through the full partition — a single Query caps at 1MB, and
    // truncation would silently drop (or 404) items a tenant legitimately owns.
    const items = [];
    let ExclusiveStartKey;
    do {
      const out = await ddb.send(
        new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
          ExpressionAttributeValues: { ":pk": `CLIENT#${clientId}`, ":sk": skPrefix },
          ExclusiveStartKey,
        })
      );
      for (const i of out.Items || []) items.push(i.data);
      ExclusiveStartKey = out.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return items;
  }

  return {
    async ready() {
      /* table is provisioned by the SAM stack; nothing to do at runtime */
    },
    async getUserByEmail(email) {
      const out = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: `USER#${String(email).toLowerCase()}`, SK: "#USER" } }));
      return out.Item ? out.Item.data : null;
    },
    async getClient(clientId) {
      const out = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: `CLIENT#${clientId}`, SK: "#META" } }));
      return out.Item ? out.Item.data : null;
    },
    async listEngagements(clientId) {
      const items = await queryClient(clientId, "ENG#");
      return items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    },
    async getEngagement(clientId, idOrSlug) {
      const items = await queryClient(clientId, "ENG#");
      return items.find((e) => e.id === idOrSlug || e.slug === idOrSlug) || null;
    },
    async listFindings(clientId, filter) {
      const [engagements, findings] = await Promise.all([queryClient(clientId, "ENG#"), queryClient(clientId, "FND#")]);
      const engIds = new Set(engagements.map((e) => e.id));
      return filterFindings(findings, engIds, filter || {});
    },
    async getFinding(clientId, id) {
      const findings = await queryClient(clientId, "FND#");
      return findings.find((x) => x.id === id || x.slug === id) || null;
    },
    async listDocuments(clientId, filter) {
      const [engagements, documents] = await Promise.all([queryClient(clientId, "ENG#"), queryClient(clientId, "DOC#")]);
      const engIds = new Set(engagements.map((e) => e.id));
      return filterDocuments(documents, engIds, filter || {});
    },
    async getDocument(clientId, id) {
      const documents = await queryClient(clientId, "DOC#");
      return documents.find((x) => x.id === id || x.slug === id) || null;
    },
    async documentUrl(doc) {
      // real deliverable: short-lived presigned S3 URL
      const key = doc.s3Key || `documents/${doc.id}.${doc.fileExt}`;
      const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: config.s3Bucket, Key: key }), { expiresIn: 300 });
      return { url, demo: false };
    },
  };
}
