"use client";

import { useEffect, useRef } from "react";
import { getData } from "@/lib/providers";
import { DEMO_CLIENT } from "@/lib/seed/seed-data";
import { DOCUMENT_TYPE_META, type DocumentItem } from "@/lib/types";
import { Button } from "@/components/ui/primitives";

/** Demo download: explains the placeholder, then serves the sample PDF
    renamed per row. In API mode getDocumentUrl returns a presigned S3
    URL and the same flow just works. */
export function DemoDownloadModal({ doc, onClose }: { doc: DocumentItem | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (doc && !dlg.open) dlg.showModal();
    if (!doc && dlg.open) dlg.close();
  }, [doc]);

  function download() {
    if (!doc) return;
    void getData().getDocumentUrl(doc.id).then(({ url }) => {
      const clientTag = DEMO_CLIENT.name.replace(/[^A-Za-z0-9]+/g, "-").replace(/-+$/, "");
      const typeTag = DOCUMENT_TYPE_META[doc.type].replace(/\s+/g, "-");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${clientTag}_${typeTag}_v${doc.version}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      onClose();
    });
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="rounded-[16px] p-0 max-w-[440px] w-[calc(100%-32px)] backdrop:bg-navy-deep/50"
    >
      {doc && (
        <div className="p-7 animate-modal">
          <h2 className="font-display font-bold text-xl m-0 mb-2">Demo deliverable</h2>
          <p className="text-muted-strong text-sm mt-0 mb-1.5">
            This is a demo environment. Deliverables here are placeholders, not the real report.
          </p>
          <p className="text-navy text-sm font-medium mt-0 mb-6">{doc.title}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={download}>Download sample</Button>
          </div>
        </div>
      )}
    </dialog>
  );
}
