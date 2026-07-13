"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useProviderQuery } from "@/lib/hooks/useProviderQuery";
import { getData } from "@/lib/providers";
import { currentPhaseName } from "@/lib/phases";
import { fmtDate } from "@/lib/format";
import { nextMilestone, progressPct, summariseFindings } from "@/lib/engagement-util";
import { SERVICE_LINE_META, SEVERITY_META, type Engagement, type Finding } from "@/lib/types";
import { Card, EmptyState, MiniSeverityBar, PageTitle, Pill, Segmented, Skeleton } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { PhaseTicks } from "@/components/engagement/PhaseTimeline";

type Filter = "all" | "active" | "complete";

export default function EngagementsPage() {
  const engagements = useProviderQuery(() => getData().listEngagements(), []);
  const findings = useProviderQuery(() => getData().listFindings(), []);
  const [filter, setFilter] = useState<Filter>("all");

  const byEng = useMemo(() => {
    const m = new Map<string, Finding[]>();
    (findings.data ?? []).forEach((f) => {
      const a = m.get(f.engagementId) ?? [];
      a.push(f);
      m.set(f.engagementId, a);
    });
    return m;
  }, [findings.data]);

  if (engagements.loading) return <Skeleton className="h-96" />;
  const all = engagements.data ?? [];
  const shown = all.filter((e) => (filter === "all" ? true : filter === "active" ? e.status !== "complete" : e.status === "complete"));

  return (
    <>
      <PageTitle
        meta={`${all.length} engagements`}
        aside={
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: all.length },
              { value: "active", label: "Active", count: all.filter((e) => e.status !== "complete").length },
              { value: "complete", label: "Complete", count: all.filter((e) => e.status === "complete").length },
            ]}
          />
        }
      >
        Engagements
      </PageTitle>

      {shown.length === 0 ? (
        <EmptyState title="Nothing here yet" hint="Switch the filter to see other engagements." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 items-stretch">
          {shown.map((e, i) => (
            <Reveal key={e.id} delay={i * 90} className="flex">
              <EngagementCard e={e} findings={byEng.get(e.id) ?? []} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}

function EngagementCard({ e, findings }: { e: Engagement; findings: Finding[] }) {
  const sum = summariseFindings(findings);
  const next = nextMilestone(e);
  const pct = progressPct(e);

  return (
    <Link href={`/engagements/view/?id=${e.slug}`} className="block no-underline text-inherit w-full group">
      <Card className="h-full flex flex-col transition-[transform,box-shadow,border-color] duration-200 group-hover:-translate-y-1 group-hover:shadow-lift group-hover:border-orange/40">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="eyebrow text-orange-onlight">{SERVICE_LINE_META[e.serviceLine]}</span>
          <Pill
            label={e.status === "complete" ? "Complete" : e.status === "on-hold" ? "On hold" : "Active"}
            color={e.status === "active" ? "var(--color-sev-low)" : "var(--color-muted)"}
          />
        </div>

        <h2 className="font-display font-semibold text-[19px] leading-snug m-0 mb-2 group-hover:text-orange transition-colors">{e.name}</h2>
        <p className="text-muted-strong text-sm m-0 mb-5 line-clamp-2 flex-1">{e.scopeSummary}</p>

        {/* progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="label text-muted">Phase {e.currentPhase} of 8 &middot; {currentPhaseName(e)}</span>
            <span className="font-mono text-[12px] font-medium text-navy">{pct}%</span>
          </div>
          <PhaseTicks engagement={e} />
        </div>

        {/* findings + next milestone footer */}
        <div className="mt-auto pt-4 border-t border-border-card flex items-center justify-between gap-3">
          <MiniSeverityBar
            counts={[
              { color: SEVERITY_META.critical.color, n: sum.bySeverity.critical },
              { color: SEVERITY_META.high.color, n: sum.bySeverity.high },
              { color: SEVERITY_META.medium.color, n: sum.bySeverity.medium },
              { color: SEVERITY_META.low.color, n: sum.bySeverity.low },
              { color: SEVERITY_META.info.color, n: sum.bySeverity.info },
            ]}
          />
          <span className="font-mono text-[11px] text-muted whitespace-nowrap">
            {next ? `Next ${fmtDate(next.due)}` : fmtDate(e.targetEndDate)}
          </span>
        </div>
      </Card>
    </Link>
  );
}
