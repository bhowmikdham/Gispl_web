"use client";

import Link from "next/link";
import { useProviderQuery } from "@/lib/hooks/useProviderQuery";
import { useSession } from "@/lib/hooks/useSession";
import { getData } from "@/lib/providers";
import { currentPhaseName } from "@/lib/phases";
import { daysOpen, fmtDate } from "@/lib/format";
import { SERVICE_LINE_META } from "@/lib/types";
import { Card, PageTitle, Pill, Skeleton, StatTile } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { PhaseTicks } from "@/components/engagement/PhaseTimeline";
import { SeverityDonut, StatusBar } from "@/components/charts/SeverityDonut";

export default function DashboardPage() {
  const { session } = useSession();
  const engagements = useProviderQuery(() => getData().listEngagements(), []);
  const findings = useProviderQuery(() => getData().listFindings(), []);
  const documents = useProviderQuery(() => getData().listDocuments(), []);

  if (engagements.loading || findings.loading || documents.loading) {
    return <Skeleton className="h-96" />;
  }
  const eng = engagements.data ?? [];
  const fnd = findings.data ?? [];
  const docs = documents.data ?? [];
  const open = fnd.filter((f) => f.status !== "closed");
  const critHigh = open.filter((f) => f.severity === "critical" || f.severity === "high");
  const oldestCrit = open
    .filter((f) => f.severity === "critical")
    .sort((a, b) => a.reportedAt.localeCompare(b.reportedAt))[0];

  return (
    <>
      <PageTitle meta={session?.clientName}>Welcome back, {session?.name.split(" ")[0]}</PageTitle>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[
          { label: "Active engagements", value: eng.filter((e) => e.status === "active").length },
          { label: "Open findings", value: open.length },
          { label: "Critical / High open", value: critHigh.length, tone: critHigh.length ? "var(--color-sev-critical)" : undefined },
          { label: "Documents available", value: docs.length },
        ].map((t, i) => (
          <Reveal key={t.label} delay={i * 70}>
            <StatTile label={t.label} value={t.value} tone={t.tone} />
          </Reveal>
        ))}
      </div>

      {oldestCrit && (
        <Reveal delay={120} className="block mb-6">
          <Link
            href="/findings/?severity=critical"
            className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-white border border-border-card border-l-2 border-l-sev-critical rounded-[10px] px-5 py-3.5 no-underline text-inherit hover:border-border-card-strong transition-colors"
          >
            <span className="eyebrow text-sev-critical">Needs attention</span>
            <span className="text-sm font-medium flex-1 min-w-[220px]">{oldestCrit.title}</span>
            <span className="font-mono text-[12px] text-muted-strong">{daysOpen(oldestCrit.reportedAt)} days open</span>
            <span className="text-orange font-semibold text-[13px]">Review &rarr;</span>
          </Link>
        </Reveal>
      )}

      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-4 mb-4">
        <Reveal>
          <Card title="Open findings by severity">
            <SeverityDonut findings={fnd} />
          </Card>
        </Reveal>
        <Reveal delay={80}>
          <Card title="Remediation status">
            <StatusBar findings={fnd} />
          </Card>
        </Reveal>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-start">
        <Reveal>
          <Card title="Your engagements" action={<Link href="/engagements/" className="text-orange font-semibold text-[13px] no-underline">View all &rarr;</Link>}>
            <ul className="list-none m-0 p-0 divide-y divide-border-card -my-2">
              {eng.map((e) => (
                <li key={e.id}>
                  <Link href={`/engagements/view/?id=${e.slug}`} className="flex items-center gap-4 py-4 no-underline text-inherit group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="font-display font-semibold text-[15px] truncate group-hover:text-orange transition-colors">{e.name}</span>
                        <Pill label={SERVICE_LINE_META[e.serviceLine]} color="var(--color-muted-strong)" />
                      </div>
                      <PhaseTicks engagement={e} />
                      <span className="label text-muted mt-2 block">Phase {e.currentPhase} of 8 &middot; {currentPhaseName(e)}</span>
                    </div>
                    <span aria-hidden="true" className="text-muted group-hover:text-orange transition-colors">&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal delay={80}>
          <Card title="Recent documents" action={<Link href="/documents/" className="text-orange font-semibold text-[13px] no-underline">All &rarr;</Link>}>
            <ul className="list-none m-0 p-0 divide-y divide-border-card -my-1">
              {docs.slice(0, 4).map((d) => (
                <li key={d.id} className="py-3">
                  <p className="text-[13px] font-medium m-0 truncate">{d.title}</p>
                  <p className="label text-muted m-0 mt-1">{fmtDate(d.issuedAt)}</p>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </>
  );
}
