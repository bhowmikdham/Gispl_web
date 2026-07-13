"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { config } from "@/lib/config";
import { getAuth } from "@/lib/providers";

/* Cognito Hosted UI redirect target (API mode). Inert in demo mode. */
function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [err, setErr] = useState("");

  useEffect(() => {
    if (config.MODE !== "api") {
      router.replace("/");
      return;
    }
    const code = params.get("code");
    if (!code) {
      setErr("Missing authorization code.");
      return;
    }
    getAuth()
      .completeHostedUiLogin(code)
      .then(() => {
        const next = sessionStorage.getItem("gispl:portal:next") || "/dashboard/";
        sessionStorage.removeItem("gispl:portal:next");
        router.replace(next);
      })
      .catch((e: Error) => setErr(e.message));
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-strong text-sm">{err || "Completing sign-in…"}</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackInner />
    </Suspense>
  );
}
