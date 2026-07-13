"use client";

import { SEVERITIES, SEVERITY_META, type Finding } from "@/lib/types";

/** Hand-rolled SVG donut of OPEN findings by severity (no chart lib). */
export function SeverityDonut({ findings }: { findings: Finding[] }) {
  const open = findings.filter((f) => f.status !== "closed");
  const counts = SEVERITIES.map((s) => ({ s, n: open.filter((f) => f.severity === s).length }));
  const total = open.length || 1;
  const R = 56;
  const C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <div className="flex items-center gap-7 flex-wrap">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        role="img"
        aria-label={`${open.length} open findings: ` + counts.filter((c) => c.n).map((c) => `${c.n} ${SEVERITY_META[c.s].label}`).join(", ")}
      >
        <circle cx="80" cy="80" r={R} fill="none" stroke="var(--color-border-card)" strokeWidth="16" />
        {counts.map(({ s, n }) => {
          if (!n) return null;
          const frac = n / total;
          const el = (
            <circle
              key={s}
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke={SEVERITY_META[s].color}
              strokeWidth="16"
              strokeDasharray={`${frac * C} ${C}`}
              strokeDashoffset={-acc * C}
              transform="rotate(-90 80 80)"
            />
          );
          acc += frac;
          return el;
        })}
        <text x="80" y="76" textAnchor="middle" style={{ font: "700 30px var(--font-display)", fill: "var(--color-navy)" }}>
          {open.length}
        </text>
        <text x="80" y="96" textAnchor="middle" style={{ font: "500 9px var(--font-mono)", letterSpacing: ".14em", fill: "var(--color-muted)" }}>
          OPEN FINDINGS
        </text>
      </svg>
      <ul className="list-none m-0 p-0 space-y-2 min-w-[180px]">
        {counts.map(({ s, n }) => (
          <li key={s} className="flex items-center gap-2.5 text-[13px]">
            <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full" style={{ background: SEVERITY_META[s].color }} />
            <span className="flex-1">{SEVERITY_META[s].label}</span>
            <span className="font-mono text-muted-strong">
              {n} open · {findings.filter((f) => f.severity === s).length} total
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Stacked horizontal remediation-status bar. */
export function StatusBar({ findings }: { findings: Finding[] }) {
  const order = ["open", "in-remediation", "retest-pending", "closed"] as const;
  const meta: Record<string, { label: string; color: string }> = {
    open: { label: "Open", color: "var(--color-sev-critical)" },
    "in-remediation": { label: "In remediation", color: "var(--color-sev-medium)" },
    "retest-pending": { label: "Retest pending", color: "var(--color-orange-onlight)" },
    closed: { label: "Closed", color: "var(--color-sev-low)" },
  };
  const total = findings.length || 1;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden" role="img" aria-label={order.map((s) => `${findings.filter((f) => f.status === s).length} ${meta[s].label}`).join(", ")}>
        {order.map((s) => {
          const n = findings.filter((f) => f.status === s).length;
          return n ? <span key={s} style={{ width: `${(n / total) * 100}%`, background: meta[s].color }} /> : null;
        })}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
        {order.map((s) => (
          <span key={s} className="flex items-center gap-2 font-mono text-[11px] text-muted-strong">
            <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: meta[s].color }} />
            {meta[s].label} · {findings.filter((f) => f.status === s).length}
          </span>
        ))}
      </div>
    </div>
  );
}
