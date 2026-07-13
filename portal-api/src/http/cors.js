import { config } from "../config.js";

/** Resolve the Access-Control-Allow-Origin value for a request origin. */
export function corsHeaders(origin) {
  const allowAll = config.corsOrigins.includes("*");
  const allowed = allowAll || (origin && config.corsOrigins.includes(origin));
  const h = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (allowAll && !origin) h["Access-Control-Allow-Origin"] = "*";
  else if (allowed) h["Access-Control-Allow-Origin"] = origin || "*";
  return h;
}
