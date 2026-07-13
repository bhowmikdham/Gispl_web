"use client";

import { useMemo, useState } from "react";
import { useProviderQuery } from "@/lib/hooks/useProviderQuery";
import { getData } from "@/lib/providers";
import { fmtBytes, fmtDate } from "@/lib/format";
import { DOCUMENT_TYPE_META, SERVICE_LINE_META, type DocumentItem, type DocumentType } from "@/lib/types";
import { EmptyState, PageTitle, Pill, Segmented, Skeleton } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { DemoDownloadModal } from "@/components/documents/DemoDownloadModal";

const EXT_TINT: Record<string, string> = {
  pdf: "var(--color-sev-critical)",
  pptx: "var(--color-orange)",
  xlsx: "var(--color-sev-low)",
};

type Cat = "all" | "reports" | "certificates" | "scope";
const CAT_OF: Record<DocumentType, Cat> = {
  "executive-summary": "reports",
  "technical-report": "reports",
  "management-presentation": "reports",
  "retest-report": "reports",
  certificate: "certificates",
  "attestation-letter": "certificates",
  "scope-document": "scope",
};

export default function DocumentsPage() {
  const engagements = useProviderQuery(() => getData().listEngagements(), []);
  const documents = useProviderQuery(() => getData().listDocuments(), []);
  const [pending, setPending] = useState<DocumentItem | null>(null);
  const [cat, setCat] = useState<Cat>("all");

  const all = documents.data ?? [];
  const shown = cat === "all" ? all : all.filter((d) => CAT_OF[d.type] === cat);

  const grouped = useMemo(() => {
    const m = new Map<string, DocumentItem[]>();
    shown.forEach((d) => {
      const a = m.get(d.engagementId) ?? [];
      a.push(d);
      m.set(d.engagementId, a);
    });
    return m;
  }, [shown]);

  if (engagements.loading || documents.loading) return <Skeleton className="h-96" />;
  const eng = engagements.data ?? [];
  const count = (c: Cat) => (c === "all" ? all.length : all.filter((d) => CAT_OF[d.type] === c).length);

  return (
    <>
      <PageTitle
        meta={`${all.length} deliverables`}
        aside={
          <Segmented<Cat>
            value={cat}
            onChange={setCat}
            options={[
              { value: "all", label: "All", count: count("all") },
              { value: "reports", label: "Reports", count: count("reports") },
              { value: "certificates", label: "Certificates", count: count("certificates") },
              { value: "scope", label: "Scope", count: count("scope") },
            ]}
          />
        }
      >
        Documents & reports
      </PageTitle>

      {shown.length === 0 ? (
        <EmptyState title="No documents in this view" hint="Switch the filter to see other deliverables." />
      ) : (
        <div className="space-y-7">
          {eng.map((e, i) => {
            const docs = grouped.get(e.id);
            if (!docs?.length) return null;
            return (
              <Reveal key={e.id} as="section" delay={i * 80}>
                <div className="flex items-center gap-3 mb-3.5">
                  <h2 className="font-display font-bold text-lg m-0">{e.name}</h2>
                  <Pill label={SERVICE_LINE_META[e.serviceLine]} color="var(--color-orange-onlight)" />
                  <span className="font-mono text-[11px] text-muted ml-auto">{docs.length} {docs.length === 1 ? "file" : "files"}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {docs.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setPending(d)}
                      className="text-left bg-white border border-border-card rounded-[12px] p-4 flex flex-col gap-3.5 cursor-pointer transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:shadow-lift hover:border-orange/40 group"
                    >
                      <div className="flex items-start gap-3">
                        <span aria-hidden="true" className="w-10 h-10 rounded-lg grid place-items-center font-mono text-[10px] font-medium text-white shrink-0" style={{ background: EXT_TINT[d.fileExt] }}>
                          {d.fileExt.toUpperCase().slice(0, 3)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold m-0 leading-snug">{d.title}</p>
                          <p className="label text-muted m-0 mt-1">{DOCUMENT_TYPE_META[d.type]}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border-card">
                        <span className="font-mono text-[11px] text-muted">v{d.version} · {fmtBytes(d.sizeBytes)}</span>
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-orange">
                          Download
                          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      <DemoDownloadModal doc={pending} onClose={() => setPending(null)} />
    </>
  );
}
