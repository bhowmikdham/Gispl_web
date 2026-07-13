"use client";

import { useEffect, useRef } from "react";
import { fmtDate } from "@/lib/format";
import { SEVERITY_META, STATUS_META, type Finding } from "@/lib/types";
import { Pill } from "@/components/ui/primitives";

export function FindingDrawer({ finding, onClose }: { finding: Finding | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (finding && !dlg.open) dlg.showModal();
    if (!finding && dlg.open) dlg.close();
  }, [finding]);

  const trail: [string, string | undefined][] = finding
    ? [
        ["Reported", finding.reportedAt],
        ["Due by", finding.dueBy],
        ["Remediated", finding.remediatedAt],
        ["Closed", finding.closedAt],
      ]
    : [];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-0 ml-auto h-dvh w-full max-w-[480px] rounded-l-[16px] p-0 backdrop:bg-navy-deep/50"
    >
      {finding && (
        <div className="p-7 h-full overflow-y-auto animate-drawer">
          <div className="flex items-start justify-between gap-4 mb-4">
            <span className="font-mono text-[12px] text-muted-strong">{finding.id}</span>
            <button type="button" onClick={onClose} aria-label="Close" className="text-muted text-2xl leading-none cursor-pointer hover:text-navy">×</button>
          </div>
          <h2 className="font-display font-bold text-xl m-0 mb-3">{finding.title}</h2>
          <div className="flex flex-wrap gap-2 mb-5">
            <Pill label={SEVERITY_META[finding.severity].label} color={SEVERITY_META[finding.severity].color} filled />
            <Pill label={STATUS_META[finding.status].label} color={STATUS_META[finding.status].color} />
            {finding.cvss != null && <Pill label={`CVSS ${finding.cvss.toFixed(1)}`} color="var(--color-muted-strong)" />}
          </div>

          {finding.cvssVector && (
            <p className="font-mono text-[11px] text-muted-strong break-all mb-5">{finding.cvssVector}</p>
          )}

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm mb-6">
            <dt className="text-muted">Category</dt>
            <dd className="m-0 font-medium">{finding.category}</dd>
            <dt className="text-muted">Affected asset</dt>
            <dd className="m-0 font-medium break-all">{finding.affectedAsset}</dd>
          </dl>

          <h3 className="eyebrow text-orange-onlight mb-1.5">Description</h3>
          <p className="text-sm text-navy leading-relaxed mt-0 mb-5">{finding.description}</p>
          <h3 className="eyebrow text-orange-onlight mb-1.5">Recommendation</h3>
          <p className="text-sm text-navy leading-relaxed mt-0 mb-6">{finding.recommendation}</p>

          <h3 className="eyebrow text-orange-onlight mb-2.5">Timeline</h3>
          <ul className="list-none m-0 p-0 space-y-2">
            {trail.filter(([, v]) => v).map(([label, v]) => (
              <li key={label} className="flex items-baseline gap-3 text-sm">
                <span className="text-muted w-24">{label}</span>
                <span className="font-mono text-[12px]">{fmtDate(v)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  );
}
