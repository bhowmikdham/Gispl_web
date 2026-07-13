/* Central config, read once from the environment. Mirrors the frontend's
   config.js philosophy: one place decides file-vs-dynamo and password-vs-cognito. */

const env = process.env;

export const config = {
  port: Number(env.PORT || 4000),
  store: env.STORE || "file", // "file" | "dynamo"
  authMode: env.AUTH_MODE || "password", // "password" | "cognito"
  dataDir: env.DATA_DIR || "./.data",
  jwtSecret: env.JWT_SECRET || "dev-only-change-me",
  tokenTtlSeconds: Number(env.TOKEN_TTL_SECONDS || 28800),
  corsOrigins: (env.CORS_ORIGINS || "*").split(",").map((s) => s.trim()).filter(Boolean),
  filesBase: env.FILES_BASE || "", // empty → this API serves /files/*

  // AWS
  region: env.AWS_REGION || "ap-south-1",
  ddbTable: env.DDB_TABLE || "gispl-portal",
  s3Bucket: env.S3_BUCKET || "",

  // Cognito (optional)
  cognito: {
    region: env.COGNITO_REGION || env.AWS_REGION || "ap-south-1",
    userPoolId: env.COGNITO_USER_POOL_ID || "",
    clientId: env.COGNITO_CLIENT_ID || "",
  },
};

export function isProdSecretMissing() {
  return config.jwtSecret === "dev-only-change-me" && config.store === "dynamo";
}
