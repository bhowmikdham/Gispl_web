/* Deterministic formatters — fixed locale + UTC so build-time HTML and
   client hydration always agree. */

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function fmtDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : dateFmt.format(d);
}

export function fmtBytes(n: number): string {
  if (n >= 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + " MB";
  if (n >= 1024) return Math.round(n / 1024) + " KB";
  return n + " B";
}

export function daysOpen(reportedAt: string, closedAt?: string): number {
  const end = closedAt ? Date.parse(closedAt) : Date.now();
  return Math.max(0, Math.floor((end - Date.parse(reportedAt)) / 86400000));
}

/** CVSS v3.1 qualitative band for a base score. */
export function cvssBand(score: number | null): "critical" | "high" | "medium" | "low" | "info" {
  if (score == null) return "info";
  if (score >= 9) return "critical";
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  if (score > 0) return "low";
  return "info";
}
