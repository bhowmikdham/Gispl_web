/* Derived "what's new" feed — no provider changes: events are reconstructed
   from timestamps already carried by findings, documents, phases and milestones. */

import { phaseLabels } from "./phases";
import { SEVERITY_META, type DocumentItem, type Engagement, type Finding } from "./types";

export type ActivityKind =
  | "engagement-started"
  | "phase-entered"
  | "milestone-complete"
  | "finding-reported"
  | "finding-remediated"
  | "finding-closed"
  | "document-issued";

export interface ActivityEvent {
  at: string;
  kind: ActivityKind;
  engagementId: string;
  /** Event verb, e.g. "Finding reported". */
  label: string;
  /** Subject line — the finding/document/milestone title. */
  title: string;
  /** Status-dot colour (CSS value). */
  color: string;
  /** Portal-relative link to the underlying record. */
  href: string;
}

export function buildActivity(
  engagements: Engagement[],
  findings: Finding[],
  documents: DocumentItem[]
): ActivityEvent[] {
  const events: ActivityEvent[] = [];
  const byId = new Map(engagements.map((e) => [e.id, e]));
  const findingsHref = (engagementId: string) => {
    const e = byId.get(engagementId);
    return e ? `/findings/?engagement=${e.slug}` : "/findings/";
  };

  findings.forEach((f) => {
    const href = findingsHref(f.engagementId);
    events.push({ at: f.reportedAt, kind: "finding-reported", engagementId: f.engagementId, label: "Finding reported", title: f.title, color: SEVERITY_META[f.severity].color, href });
    if (f.remediatedAt)
      events.push({ at: f.remediatedAt, kind: "finding-remediated", engagementId: f.engagementId, label: "Fix deployed", title: f.title, color: "var(--color-orange-onlight)", href });
    if (f.closedAt)
      events.push({ at: f.closedAt, kind: "finding-closed", engagementId: f.engagementId, label: "Finding closed", title: f.title, color: "var(--color-sev-low)", href });
  });

  documents.forEach((d) => {
    events.push({ at: d.issuedAt, kind: "document-issued", engagementId: d.engagementId, label: "Document issued", title: `${d.title} — v${d.version}`, color: "var(--color-navy)", href: "/documents/" });
  });

  engagements.forEach((e) => {
    const href = `/engagements/view/?id=${e.slug}`;
    const labels = phaseLabels(e);
    e.phaseHistory.forEach((h) => {
      if (h.phase === 1) {
        events.push({ at: h.enteredAt, kind: "engagement-started", engagementId: e.id, label: "Engagement started", title: e.name, color: "var(--color-orange)", href });
      } else {
        events.push({ at: h.enteredAt, kind: "phase-entered", engagementId: e.id, label: `Phase ${h.phase} started`, title: labels[h.phase - 1], color: "var(--color-orange)", href });
      }
    });
    e.milestones.forEach((m) => {
      if (m.completedAt)
        events.push({ at: m.completedAt, kind: "milestone-complete", engagementId: e.id, label: "Milestone complete", title: m.label, color: "var(--color-sev-low)", href });
    });
  });

  // ISO strings share one shape, so lexicographic order is chronological.
  return events.sort((a, b) => b.at.localeCompare(a.at));
}

/** Count of events inside the trailing `days` window — drives the "n new" badge. */
export function countRecent(events: ActivityEvent[], days: number, nowMs: number): number {
  const cutoff = nowMs - days * 86400000;
  return events.reduce((n, ev) => (Date.parse(ev.at) >= cutoff ? n + 1 : n), 0);
}
