"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import type { ActivityEvent } from "@/lib/activity";
import { fmtDate } from "@/lib/format";
import { currentPhaseName } from "@/lib/phases";
import { nextMilestone, progressPct, summariseFindings } from "@/lib/engagement-util";
import { SERVICE_LINE_META, type Engagement, type Finding } from "@/lib/types";
import { Pill } from "@/components/ui/primitives";

const NEW_WINDOW_DAYS = 7;
const FEED_LENGTH = 12;

/** AWS-console-style inspector: slides over the page from the right and shows
    every engagement's progress plus the latest activity across the account. */
export function ProgressOverview({
  open,
  onClose,
  engagements,
  findings,
  events,
}: {
  open: boolean;
  onClose: () => void;
  engagements: Engagement[];
  findings: Finding[];
  events: ActivityEvent[];
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  const serviceLine = new Map(engagements.map((e) => [e.id, SERVICE_LINE_META[e.serviceLine]]));
  const newCutoff = Date.now() - NEW_WINDOW_DAYS * 86400000;
  const feed = events.slice(0, FEED_LENGTH);

  const active = engagements.filter((e) => e.status === "active");
  const avgBase = active.length ? active : engagements;
  const avg = avgBase.length ? Math.round(avgBase.reduce((s, e) => s + progressPct(e), 0) / avgBase.length) : 0;
  const sum = summariseFindings(findings);
  const critHigh = sum.bySeverity.critical + sum.bySeverity.high;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-label="Progress overview"
      className="m-0 ml-auto h-dvh w-full max-w-[620px] rounded-l-[16px] p-0 overflow-hidden backdrop:bg-navy-deep/50"
    >
      {open && (
        <div className="h-full overflow-y-auto overscroll-contain bg-bg-cool animate-drawer">
          <header className="sticky top-0 z-10 bg-white border-b border-border-card">
            <div className="hairline-brand" aria-hidden="true" />
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <h2 className="font-display font-bold text-[18px] m-0">Progress overview</h2>
                <p className="label text-muted m-0 mt-0.5">
                  {engagements.length} engagements{events[0] ? <> &middot; updated {fmtDate(events[0].at)}</> : null}
                </p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="text-muted text-2xl leading-none cursor-pointer hover:text-navy">
                ×
              </button>
            </div>
          </header>

          <div className="p-5 sm:p-6 space-y-4">
            {/* KPI strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border-card border border-border-card rounded-[13px] overflow-hidden">
              {[
                { label: "Active", value: String(active.length) },
                { label: "Avg progress", value: `${avg}%` },
                { label: "Open findings", value: String(sum.open) },
                { label: "Critical / High", value: String(critHigh), tone: critHigh ? "var(--color-sev-critical)" : undefined },
              ].map((t) => (
                <div key={t.label} className="bg-white px-4 py-3.5">
                  <div className="font-display font-bold text-[20px] leading-none" style={t.tone ? { color: t.tone } : undefined}>{t.value}</div>
                  <div className="label text-muted mt-1.5">{t.label}</div>
                </div>
              ))}
            </div>

            <Section title="Engagements">
              <div className="divide-y divide-border-card">
                {engagements.map((e) => (
                  <EngagementProgress key={e.id} e={e} onNavigate={onClose} />
                ))}
              </div>
            </Section>

            <Section title="Latest activity" meta={events.length > feed.length ? `latest ${feed.length} of ${events.length}` : undefined}>
              <ul className="list-none m-0 p-0 divide-y divide-border-card">
                {feed.map((ev) => {
                  const isNew = Date.parse(ev.at) >= newCutoff;
                  return (
                    <li key={`${ev.kind}-${ev.at}-${ev.title}`}>
                      <Link href={ev.href} onClick={onClose} className="flex gap-3 py-3 px-2 -mx-2 rounded-[8px] no-underline text-inherit hover:bg-bg-cool transition-colors">
                        <span aria-hidden="true" className="w-2 h-2 rounded-full mt-[5px] shrink-0" style={{ background: ev.color }} />
                        <span className="flex-1 min-w-0">
                          <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                            <span className="text-[13px] font-semibold">{ev.label}</span>
                            <span className="eyebrow text-muted">{serviceLine.get(ev.engagementId)}</span>
                            {isNew && (
                              <span className="eyebrow rounded-[20px] px-1.5 py-0.5 text-orange-onlight" style={{ background: "color-mix(in srgb, var(--color-orange) 12%, transparent)" }}>
                                New
                              </span>
                            )}
                          </span>
                          <span className="block text-[13px] text-muted-strong mt-0.5 leading-snug">{ev.title}</span>
                        </span>
                        <span className="font-mono text-[11px] text-muted whitespace-nowrap">{fmtDate(ev.at)}</span>
                      </Link>
                    </li>
                  );
                })}
                {!feed.length && <li className="py-3 text-muted text-sm">No activity recorded yet.</li>}
              </ul>
            </Section>
          </div>
        </div>
      )}
    </dialog>
  );
}

function Section({ title, meta, children }: { title: string; meta?: string; children: ReactNode }) {
  return (
    <section className="bg-white border border-border-card rounded-[13px]">
      <div className="flex items-baseline justify-between gap-3 px-5 pt-4 pb-3 border-b border-border-card">
        <h3 className="font-display font-semibold text-[14px] m-0">{title}</h3>
        {meta && <span className="font-mono text-[11px] text-muted">{meta}</span>}
      </div>
      <div className="px-5 py-1.5">{children}</div>
    </section>
  );
}

function EngagementProgress({ e, onNavigate }: { e: Engagement; onNavigate: () => void }) {
  const pct = progressPct(e);
  const next = nextMilestone(e);
  const complete = e.status === "complete";

  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span className="eyebrow text-orange-onlight">{SERVICE_LINE_META[e.serviceLine]}</span>
        <Pill
          label={complete ? "Complete" : e.status === "on-hold" ? "On hold" : "Active"}
          color={e.status === "active" ? "var(--color-sev-low)" : "var(--color-muted)"}
        />
      </div>
      <Link
        href={`/engagements/view/?id=${e.slug}`}
        onClick={onNavigate}
        className="font-display font-semibold text-[15px] leading-snug no-underline text-inherit hover:text-orange transition-colors block mb-3"
      >
        {e.name}
      </Link>
      <div className="flex items-center gap-3" role="img" aria-label={`${pct}% complete`}>
        <div className="flex-1 h-2 rounded-full bg-border-card overflow-hidden">
          <div
            className="h-full rounded-full"
            style={
              complete
                ? { width: "100%", background: "var(--color-navy)" }
                : {
                    width: `${pct}%`,
                    // clip the site's signature tri-gradient to the fill so its
                    // colour ramp always spans the full track, not the fill
                    background: "linear-gradient(90deg, #f2b01e, #f26a21, #a91e47)",
                    backgroundSize: pct > 0 ? `${10000 / pct}% 100%` : undefined,
                    backgroundRepeat: "no-repeat",
                  }
            }
          />
        </div>
        <span className="font-mono text-[12px] font-medium text-navy w-9 text-right">{pct}%</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mt-2">
        <span className="label text-muted">Phase {e.currentPhase} of 8 &middot; {currentPhaseName(e)}</span>
        <span className="font-mono text-[11px] text-muted">
          {next ? `Next: ${next.label} · ${fmtDate(next.due)}` : complete ? `Completed ${fmtDate(e.targetEndDate)}` : `Target ${fmtDate(e.targetEndDate)}`}
        </span>
      </div>
    </div>
  );
}
