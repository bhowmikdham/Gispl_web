import { config } from "../config.js";

/** Resolve the Access-Control-Allow-Origin value for a request origin. */
export function corsHeaders(origin) {
  const allowAll = config.corsOrigins.includes("*");
  const allowed = allowAll || (origin && config.corsOrigins.includes(origin));
  const h = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  // No Access-Control-Allow-Credentials anywhere: these endpoints take no
  // cookies and no Authorization header, so a browser has nothing to attach.
  if (allowAll && !origin) h["Access-Control-Allow-Origin"] = "*";
  else if (allowed) h["Access-Control-Allow-Origin"] = origin || "*";
  return h;
}
