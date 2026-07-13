"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProviderQuery } from "@/lib/hooks/useProviderQuery";
import { getData } from "@/lib/providers";
import { fmtDate } from "@/lib/format";
import { progressPct, nextMilestone, summariseFindings } from "@/lib/engagement-util";
import { SERVICE_LINE_META, SEVERITIES, SEVERITY_META } from "@/lib/types";
import { Card, Dot, EmptyState, PageTitle, Pill, Skeleton } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { PhaseTimeline } from "@/components/engagement/PhaseTimeline";

function daysBetween(a: string, b: number): number {
  return Math.round((Date.parse(a) - b) / 86400000);
}

function EngagementDetail() {
  const id = useSearchParams().get("id") || "";
  const engagement = useProviderQuery(() => getData().getEngagement(id), [id]);
  const findings = useProviderQuery(
    () => (engagement.data ? getData().listFindings({ engagementId: engagement.data.id }) : Promise.resolve([])),
    [engagement.data?.id]
  );
  const documents = useProviderQuery(
    () => (engagement.data ? getData().listDocuments({ engagementId: engagement.data.id }) : Promise.resolve([])),
    [engagement.data?.id]
  );

  if (engagement.loading) return <Skeleton className="h-96" />;
  const e = engagement.data;
  if (!e) return <EmptyState title="Engagement not found" hint="It may have been renamed — head back to Engagements." />;
  const fnd = findings.data ?? [];

  return (
    <>
      <Link href="/engagements/" className="label text-muted-strong no-underline hover:text-orange transition-colors">&larr; All engagements</Link>
      <div className="mt-3">
        <PageTitle
          meta={`${SERVICE_LINE_META[e.serviceLine]} · ${fmtDate(e.startDate)} → ${fmtDate(e.targetEndDate)}`}
          aside={<Pill label={e.status === "complete" ? "Complete" : e.status === "on-hold" ? "On hold" : "Active"} color={e.status === "active" ? "var(--color-sev-low)" : "var(--color-muted)"} />}
        >
          {e.name}
        </PageTitle>
      </div>

      {/* KPI strip */}
      <Reveal className="block mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-card border border-border-card rounded-[13px] overflow-hidden">
          {(() => {
            const sum = summariseFindings(fnd);
            const next = nextMilestone(e);
            const daysLeft = daysBetween(e.targetEndDate, Date.now());
            const tiles: { label: string; value: string; tone?: string }[] = [
              { label: "Progress", value: `${progressPct(e)}%` },
              { label: "Open findings", value: String(sum.open) },
              { label: "Critical / High", value: String(sum.bySeverity.critical + sum.bySeverity.high), tone: sum.bySeverity.critical + sum.bySeverity.high ? "var(--color-sev-critical)" : undefined },
              e.status === "complete"
                ? { label: "Completed", value: fmtDate(e.targetEndDate) }
                : { label: next ? "Next milestone" : "Target date", value: next ? fmtDate(next.due) : `${daysLeft > 0 ? daysLeft + "d left" : "due"}` },
            ];
            return tiles.map((t) => (
              <div key={t.label} className="bg-white px-5 py-4">
                <div className="font-display font-bold text-[22px] leading-none" style={t.tone ? { color: t.tone } : undefined}>{t.value}</div>
                <div className="label text-muted mt-1.5">{t.label}</div>
              </div>
            ));
          })()}
        </div>
      </Reveal>

      <Reveal className="block mb-4">
      <Card title="Progress">
        <p className="text-muted-strong text-sm mt-0 mb-6 max-w-[90ch]">{e.scopeSummary}</p>
        <PhaseTimeline engagement={e} />
        {e.frameworks.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-6 pt-5 border-t border-border-card">
            <span className="eyebrow text-muted mr-1">Frameworks</span>
            {e.frameworks.map((f) => (
              <span key={f} className="font-mono text-[11px] text-muted-strong">{f}</span>
            ))}
          </div>
        )}
      </Card>
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Reveal><Card title="Milestones">
          <ul className="list-none m-0 p-0 divide-y divide-border-card -my-3">
            {e.milestones.map((m) => {
              const overdue = !m.completedAt && Date.parse(m.due) < Date.now();
              return (
                <li key={m.id} className="py-3 flex items-center gap-3">
                  <span aria-hidden="true" className="w-4 h-4 grid place-items-center text-[11px] rounded-full shrink-0" style={m.completedAt ? { background: "var(--color-sev-low)", color: "#fff" } : { border: "1.5px solid var(--color-border-card-strong)" }}>
                    {m.completedAt ? "✓" : ""}
                  </span>
                  <span className="flex-1 text-sm font-medium">{m.label}</span>
                  <span className="font-mono text-[11px]" style={{ color: overdue ? "var(--color-sev-critical)" : "var(--color-muted)" }}>
                    {m.completedAt ? fmtDate(m.completedAt) : `due ${fmtDate(m.due)}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card></Reveal>
        <Reveal delay={80}><Card title="Your team">
          {(["gispl", "client"] as const).map((side) => (
            <div key={side} className="mb-5 last:mb-0">
              <p className="label text-muted mb-2.5 font-semibold">{side === "gispl" ? "GISPL" : "Client side"}</p>
              <ul className="list-none m-0 p-0 space-y-2.5">
                {e.team.filter((t) => t.side === side).map((t) => (
                  <li key={t.email} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
                    <span className="font-semibold">{t.name}</span>
                    <span className="text-muted-strong text-[13px]">{t.role}</span>
                    <a href={`mailto:${t.email}`} className="text-orange text-[12px] font-medium ml-auto hover:text-orange-hover">{t.email}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card></Reveal>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Reveal><Card title="Findings" action={fnd.length ? <Link href={`/findings/?engagement=${e.slug}`} className="text-orange font-semibold text-[13px] no-underline">View all &rarr;</Link> : undefined}>
          <div className="flex flex-col gap-2.5">
            {SEVERITIES.map((s) => {
              const n = fnd.filter((f) => f.severity === s).length;
              if (!n) return null;
              return (
                <Link key={s} href={`/findings/?engagement=${e.slug}&severity=${s}`} className="flex items-center justify-between no-underline text-inherit group">
                  <Dot color={SEVERITY_META[s].color} label={SEVERITY_META[s].label} />
                  <span className="font-mono text-[13px] text-muted-strong group-hover:text-orange transition-colors">{n}</span>
                </Link>
              );
            })}
            {!fnd.length && <span className="text-muted text-sm">No findings recorded.</span>}
          </div>
        </Card></Reveal>
        <Reveal delay={80}><Card title="Deliverables" action={<Link href="/documents/" className="text-orange font-semibold text-[13px] no-underline">All &rarr;</Link>}>
          <ul className="list-none m-0 p-0 divide-y divide-border-card -my-2.5">
            {(documents.data ?? []).map((d) => (
              <li key={d.id} className="py-2.5 flex items-center gap-3">
                <span className="flex-1 text-sm font-medium truncate">{d.title}</span>
                <span className="font-mono text-[11px] text-muted whitespace-nowrap">v{d.version} &middot; {fmtDate(d.issuedAt)}</span>
              </li>
            ))}
            {!documents.data?.length && <li className="py-2.5 text-muted text-sm">No documents yet.</li>}
          </ul>
        </Card></Reveal>
      </div>
    </>
  );
}

export default function EngagementViewPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <EngagementDetail />
    </Suspense>
  );
}
