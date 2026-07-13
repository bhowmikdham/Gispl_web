"use client";

import clsx from "clsx";
import { fmtDate } from "@/lib/format";
import { phaseLabels } from "@/lib/phases";
import type { Engagement } from "@/lib/types";

/** The 8-phase engagement spine: navy = completed, orange halo = current. */
export function PhaseTimeline({ engagement }: { engagement: Engagement }) {
  const labels = phaseLabels(engagement);
  const current = engagement.currentPhase;
  const entered = new Map(engagement.phaseHistory.map((h) => [h.phase, h.enteredAt]));

  return (
    <ol className="list-none m-0 p-0 grid gap-4 sm:grid-cols-4 lg:grid-cols-8" aria-label="Engagement phases">
      {labels.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "completed" : n === current ? "current" : "upcoming";
        return (
          <li key={n} className="relative">
            {n > 1 && (
              <span
                aria-hidden="true"
                className={clsx(
                  "hidden lg:block absolute top-[15px] -left-1/2 w-full h-[2px]",
                  n <= current ? "bg-navy" : "bg-border-card-strong"
                )}
              />
            )}
            <div
              className="group relative flex flex-col items-start lg:items-center gap-2 cursor-default"
              title={`Phase ${n}: ${label} — ${state}${entered.get(n) ? ` (${fmtDate(entered.get(n))})` : ""}`}
            >
              <span
                aria-hidden="true"
                className={clsx(
                  "w-8 h-8 rounded-full grid place-items-center font-mono text-[12px] font-medium border transition-transform duration-200 group-hover:scale-110",
                  state === "completed" && "bg-navy text-white border-navy",
                  state === "current" && "bg-orange text-white border-orange shadow-[0_0_0_6px_rgba(242,106,33,.15)]",
                  state === "upcoming" && "bg-white text-muted border-border-card-strong group-hover:border-orange"
                )}
              >
                {state === "completed" ? "✓" : n}
              </span>
              <span className={clsx("text-[12px] leading-tight lg:text-center transition-colors", state === "upcoming" ? "text-muted group-hover:text-navy" : "text-navy font-medium")}>
                {label}
                <span className="sr-only"> — {state}</span>
              </span>
              {entered.get(n) && state !== "upcoming" && (
                <span className="font-mono text-[10px] text-muted">{fmtDate(entered.get(n))}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Compact 8-tick progress strip for cards. */
export function PhaseTicks({ engagement }: { engagement: Engagement }) {
  const current = engagement.currentPhase;
  return (
    <div className="flex gap-1" role="img" aria-label={`Phase ${current} of 8`}>
      {Array.from({ length: 8 }, (_, i) => (
        <span
          key={i}
          className={clsx(
            "h-[5px] flex-1 rounded-sm",
            i + 1 < current ? "bg-navy" : i + 1 === current ? "bg-orange" : "bg-border-card-strong"
          )}
        />
      ))}
    </div>
  );
}
