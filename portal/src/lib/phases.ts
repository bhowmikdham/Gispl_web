import type { Engagement } from "./types";

/** The site's 8-phase VAPT methodology — the default engagement spine. */
export const VAPT_PHASES = [
  "Planning & Scoping",
  "Information Gathering",
  "Vulnerability Assessment",
  "Penetration Testing",
  "Risk Validation",
  "Remediation Guidance",
  "Retesting Support",
  "Final Reporting",
] as const;

export function phaseLabels(e: Engagement): readonly string[] {
  return e.phaseLabels && e.phaseLabels.length === 8 ? e.phaseLabels : VAPT_PHASES;
}

export function currentPhaseName(e: Engagement): string {
  return phaseLabels(e)[Math.min(Math.max(e.currentPhase, 1), 8) - 1];
}
