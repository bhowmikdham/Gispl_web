"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  lift,
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  lift?: boolean;
  /** Quiet, consistent card header. */
  title?: string;
  action?: ReactNode;
}) {
  return (
    <div className={clsx("bg-white border border-border-card rounded-[13px]", lift && "lift", title ? "p-0" : "p-6", className)}>
      {title && (
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-border-card">
          <h2 className="font-display font-semibold text-[15px] m-0">{title}</h2>
          {action}
        </div>
      )}
      {title ? <div className="p-6">{children}</div> : children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "font-body font-semibold text-sm rounded-[9px] px-5 py-3 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-default",
        variant === "primary" && "bg-orange text-white hover:bg-orange-hover",
        variant === "ghost" && "bg-white text-navy border border-border-card-strong hover:border-orange",
        className
      )}
    >
      {children}
    </button>
  );
}

/** Colored dot + plain text — the quiet way to show severity in dense rows. */
export function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium whitespace-nowrap">
      <span aria-hidden="true" className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      {label}
    </span>
  );
}

/** Soft tinted pill — one per row, for the primary status only. */
export function Pill({ label, color, filled }: { label: string; color: string; filled?: boolean }) {
  return (
    <span
      className="eyebrow inline-block rounded-[20px] px-2.5 py-1 whitespace-nowrap"
      style={
        filled
          ? { background: color, color: "#fff" }
          : { color, background: `color-mix(in srgb, ${color} 10%, transparent)` }
      }
    >
      {label}
    </span>
  );
}

export function StatTile({ label, value, tone }: { label: string; value: string | number; tone?: string }) {
  return (
    <div className="bg-white border border-border-card border-t-2 border-t-orange rounded-[4px] p-5 flex flex-col gap-2 lift">
      <span className="font-display font-bold text-[30px] leading-none" style={tone ? { color: tone } : undefined}>
        {value}
      </span>
      <span className="label text-muted">{label}</span>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-14">
      <p className="font-display font-semibold text-lg m-0">{title}</p>
      {hint && <p className="text-muted-strong text-sm mt-2">{hint}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("animate-pulse rounded-lg bg-navy/8", className)} aria-hidden="true" />;
}

/** Segmented filter control — pill-tab group with active fill. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; count?: number }[];
}) {
  return (
    <div className="inline-flex items-center gap-0.5 p-1 bg-white border border-border-card rounded-[11px]" role="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={clsx(
              "font-body text-[13px] font-medium rounded-[8px] px-3.5 py-1.5 cursor-pointer transition-colors duration-150 whitespace-nowrap",
              on ? "bg-navy text-white" : "text-muted-strong hover:text-navy hover:bg-bg-cool"
            )}
          >
            {o.label}
            {o.count != null && <span className={clsx("ml-1.5 font-mono text-[11px]", on ? "text-white/70" : "text-muted")}>{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Tiny stacked severity bar (open findings) for cards. */
export function MiniSeverityBar({ counts }: { counts: { color: string; n: number }[] }) {
  const total = counts.reduce((s, c) => s + c.n, 0);
  if (!total) return <span className="text-[12px] text-muted">No open findings</span>;
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-1.5 w-24 rounded-full overflow-hidden bg-border-card">
        {counts.map((c, i) => (c.n ? <span key={i} style={{ width: `${(c.n / total) * 100}%`, background: c.color }} /> : null))}
      </div>
      <span className="font-mono text-[12px] text-muted-strong">{total} open</span>
    </div>
  );
}

export function PageTitle({ children, meta, aside }: { children: ReactNode; meta?: string; aside?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display font-bold text-[24px] tracking-tight m-0">{children}</h1>
        {meta && <p className="label text-muted mt-2 mb-0">{meta}</p>}
      </div>
      {aside}
    </div>
  );
}
