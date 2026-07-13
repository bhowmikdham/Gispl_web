import type { Engagement, Finding, Milestone, Severity } from "./types";

export function progressPct(e: Engagement): number {
  if (e.status === "complete") return 100;
  return Math.round((Math.min(e.currentPhase, 8) / 8) * 100);
}

export function nextMilestone(e: Engagement): Milestone | null {
  return e.milestones.find((m) => !m.completedAt) ?? null;
}

export interface FindingSummary {
  open: number;
  bySeverity: Record<Severity, number>;
  topOpen: Severity | null;
}

const RANK: Severity[] = ["critical", "high", "medium", "low", "info"];

export function summariseFindings(findings: Finding[]): FindingSummary {
  const bySeverity: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  let open = 0;
  findings.forEach((f) => {
    if (f.status !== "closed") {
      open++;
      bySeverity[f.severity]++;
    }
  });
  const topOpen = RANK.find((s) => bySeverity[s] > 0) ?? null;
  return { open, bySeverity, topOpen };
}
