"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/hooks/useSession";
import { Skeleton } from "@/components/ui/primitives";

/* Client-side gate (static export has no server). Renders a deterministic
   skeleton on first paint, reads the session in an effect, then either
   renders children or bounces to the login page with ?next=. In API mode
   the real gate is the API rejecting requests without a valid token —
   this guard is UX only. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, checked } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (checked && !session) {
      router.replace("/?next=" + encodeURIComponent(pathname));
    }
  }, [checked, session, router, pathname]);

  if (!checked || !session) {
    return (
      <div className="max-w-[1240px] mx-auto px-6 py-10" aria-busy="true">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
