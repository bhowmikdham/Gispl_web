/* Presigned CV uploads.

   The browser never gets S3 credentials and never uploads through this API.
   Instead the application record is written first, and the response carries a
   presigned POST scoped to exactly one object key. The policy — not the client
   — enforces the size cap and the content type, so a caller cannot turn the
   careers page into free file hosting:

     • key is server-chosen (`<prefix>/<role>/<applicationId>.<ext>`), so one
       signature cannot overwrite another candidate's CV
     • content-length-range caps the object at MAX_CV_BYTES
     • Content-Type must equal the type that was signed, and only the three
       document types below are ever signed
     • the signature expires in 10 minutes

   With no UPLOAD_BUCKET configured this returns null and the careers form falls
   back to asking the candidate to email the CV — which is the current live
   behaviour, so an unconfigured deploy degrades instead of breaking. */

import { config } from "./config.js";

// Extension is derived from the signed content type, never from the filename
// the candidate supplied.
const ALLOWED = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export const ALLOWED_CV_TYPES = Object.keys(ALLOWED);

let presignPromise = null;

async function presigner() {
  if (!presignPromise) {
    presignPromise = Promise.all([import("@aws-sdk/client-s3"), import("@aws-sdk/s3-presigned-post")])
      .then(([s3mod, postmod]) => ({
        client: new s3mod.S3Client({ region: config.region }),
        createPresignedPost: postmod.createPresignedPost,
      }))
      .catch(() => null);
  }
  return presignPromise;
}

export function cvKey(roleSlug, applicationId, contentType) {
  const ext = ALLOWED[contentType];
  if (!ext) return null;
  return `${config.uploadPrefix}/${roleSlug || "general"}/${applicationId}.${ext}`;
}

/**
 * @returns {Promise<{url, fields, key, maxBytes, expiresIn} | null>} — null when
 * uploads are not configured or the content type is not one we accept.
 */
export async function presignCvUpload(roleSlug, applicationId, contentType) {
  if (!config.uploadBucket) return null;
  const key = cvKey(roleSlug, applicationId, contentType);
  if (!key) return null;

  const p = await presigner();
  if (!p) {
    console.error("[uploads] @aws-sdk/s3-presigned-post is not installed — CV upload disabled.");
    return null;
  }

  try {
    const { url, fields } = await p.createPresignedPost(p.client, {
      Bucket: config.uploadBucket,
      Key: key,
      Conditions: [
        ["content-length-range", 1, config.maxCvBytes],
        ["eq", "$Content-Type", contentType],
      ],
      Fields: { "Content-Type": contentType },
      Expires: 600,
    });
    return { url, fields, key, maxBytes: config.maxCvBytes, expiresIn: 600 };
  } catch (err) {
    console.error("[uploads] presign failed", err);
    return null;
  }
}
