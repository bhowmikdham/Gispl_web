"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProviderQuery } from "@/lib/hooks/useProviderQuery";
import { getData } from "@/lib/providers";
import { daysOpen, fmtDate } from "@/lib/format";
import {
  FINDING_STATUSES,
  SEVERITIES,
  SEVERITY_META,
  STATUS_META,
  type Finding,
  type FindingStatus,
  type Severity,
} from "@/lib/types";
import { Card, Dot, EmptyState, PageTitle, Pill, Skeleton } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { FindingDrawer } from "@/components/findings/FindingDrawer";

const SEV_RANK: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
type SortKey = "severity" | "cvss" | "reportedAt";

function FindingsInner() {
  const params = useSearchParams();
  const engagements = useProviderQuery(() => getData().listEngagements(), []);
  const findings = useProviderQuery(() => getData().listFindings(), []);

  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState<Severity | "all">((params.get("severity") as Severity) || "all");
  const [status, setStatus] = useState<FindingStatus | "all">((params.get("status") as FindingStatus) || "all");
  const engSlug = params.get("engagement") || "all";
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "severity", dir: 1 });
  const [active, setActive] = useState<Finding | null>(null);

  const engById = useMemo(() => new Map((engagements.data ?? []).map((e) => [e.id, e])), [engagements.data]);
  const engBySlug = useMemo(() => new Map((engagements.data ?? []).map((e) => [e.slug, e])), [engagements.data]);
  const engFilterId = engSlug !== "all" ? engBySlug.get(engSlug)?.id : undefined;

  const rows = useMemo(() => {
    let out = (findings.data ?? []).slice();
    if (engFilterId) out = out.filter((f) => f.engagementId === engFilterId);
    if (severity !== "all") out = out.filter((f) => f.severity === severity);
    if (status !== "all") out = out.filter((f) => f.status === status);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      out = out.filter((f) => (f.title + " " + f.id + " " + f.category + " " + f.affectedAsset).toLowerCase().includes(s));
    }
    out.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "severity") cmp = SEV_RANK[a.severity] - SEV_RANK[b.severity];
      else if (sort.key === "cvss") cmp = (b.cvss ?? -1) - (a.cvss ?? -1);
      else cmp = a.reportedAt.localeCompare(b.reportedAt);
      return cmp * sort.dir;
    });
    return out;
  }, [findings.data, engFilterId, severity, status, q, sort]);

  if (findings.loading || engagements.loading) return <Skeleton className="h-96" />;
  const all = findings.data ?? [];

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));
  }
  const ariaSort = (key: SortKey) => (sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none");

  return (
    <>
      <PageTitle meta={`${all.length} findings across ${engById.size} engagements`}>Findings register</PageTitle>

      <Reveal className="block mb-4">
      <Card>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search findings…"
            aria-label="Search findings"
            className="border border-border-card-strong rounded-lg px-3.5 py-2.5 text-sm font-body min-w-[220px] focus:border-orange outline-none"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value as FindingStatus | "all")} aria-label="Filter by status" className="border border-border-card-strong rounded-lg px-3 py-2.5 text-sm font-body">
            <option value="all">All statuses</option>
            {FINDING_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Filter by severity">
          <button type="button" onClick={() => setSeverity("all")} className="eyebrow rounded-[20px] px-3 py-1.5 border cursor-pointer" style={severity === "all" ? { background: "var(--color-navy)", color: "#fff", borderColor: "var(--color-navy)" } : { color: "var(--color-muted-strong)", borderColor: "var(--color-border-card-strong)" }}>
            All {all.length}
          </button>
          {SEVERITIES.map((s) => {
            const n = all.filter((f) => f.severity === s).length;
            const on = severity === s;
            return (
              <button key={s} type="button" onClick={() => setSeverity(on ? "all" : s)} className="eyebrow rounded-[20px] px-3 py-1.5 border cursor-pointer" style={on ? { background: SEVERITY_META[s].color, color: "#fff", borderColor: SEVERITY_META[s].color } : { color: SEVERITY_META[s].color, borderColor: "var(--color-border-card-strong)" }}>
                {SEVERITY_META[s].label} {n}
              </button>
            );
          })}
        </div>
      </Card>
      </Reveal>

      <Reveal className="block" delay={80}>
      <Card className="p-0 overflow-x-auto">
        {rows.length ? (
          <table className="w-full border-collapse">
            <caption className="sr-only">Findings, sortable by severity, CVSS and reported date</caption>
            <thead>
              <tr className="text-left">
                {[
                  ["Ref", null],
                  ["Title", null],
                  ["Engagement", null],
                  ["Severity", "severity"],
                  ["CVSS", "cvss"],
                  ["Status", null],
                  ["Reported", "reportedAt"],
                  ["Age", null],
                ].map(([label, key]) => (
                  <th key={label as string} scope="col" aria-sort={key ? ariaSort(key as SortKey) : undefined} className="eyebrow text-muted px-4 py-3 border-b border-border-card">
                    {key ? (
                      <button type="button" onClick={() => toggleSort(key as SortKey)} className="eyebrow text-muted cursor-pointer hover:text-navy">
                        {label as string} {sort.key === key ? (sort.dir === 1 ? "▲" : "▼") : ""}
                      </button>
                    ) : (
                      (label as string)
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => (
                <tr key={f.id} className="border-b border-border-card hover:bg-bg-cool">
                  <td className="px-4 py-3 font-mono text-[12px] text-muted-strong whitespace-nowrap">{f.id}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setActive(f)} className="text-left font-medium text-sm text-navy hover:text-orange cursor-pointer">
                      {f.title}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-strong max-w-[200px] truncate">{engById.get(f.engagementId)?.name ?? "—"}</td>
                  <td className="px-4 py-3"><Dot color={SEVERITY_META[f.severity].color} label={SEVERITY_META[f.severity].label} /></td>
                  <td className="px-4 py-3 font-mono text-[13px] text-muted-strong">{f.cvss != null ? f.cvss.toFixed(1) : "—"}</td>
                  <td className="px-4 py-3"><Pill label={STATUS_META[f.status].label} color={STATUS_META[f.status].color} /></td>
                  <td className="px-4 py-3 font-mono text-[12px] text-muted whitespace-nowrap">{fmtDate(f.reportedAt)}</td>
                  <td className="px-4 py-3 font-mono text-[12px] text-muted">{f.status === "closed" ? "—" : `${daysOpen(f.reportedAt)}d`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="No findings match these filters" hint="Clear a filter to widen the search." />
        )}
      </Card>
      </Reveal>

      <FindingDrawer finding={active} onClose={() => setActive(null)} />
    </>
  );
}

export default function FindingsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <FindingsInner />
    </Suspense>
  );
}
