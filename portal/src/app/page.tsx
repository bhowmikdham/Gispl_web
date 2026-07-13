"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { asset } from "@/lib/paths";
import { getAuth } from "@/lib/providers";
import { useSession } from "@/lib/hooks/useSession";
import { DEMO_LOGIN } from "@/lib/seed/seed-data";
import { Button } from "@/components/ui/primitives";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { session, checked } = useSession();
  const next = params.get("next") || "/dashboard/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (checked && session) router.replace(next);
  }, [checked, session, router, next]);

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setErr("");
    setBusy(true);
    getAuth()
      .signIn(email, password)
      .then(() => router.replace(next))
      .catch((e: Error) => {
        setErr(e.message);
        setBusy(false);
      });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      {/* brand panel */}
      <div className="bg-navy-deep text-white px-8 py-10 lg:px-14 lg:py-14 flex flex-col">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/gispl-logo-ondark.png")} alt="GISPL — G-Info Technology Solutions" width={69} height={46} style={{ height: 46, width: "auto" }} />
          <span className="text-white/55 text-[14px] font-medium border-l border-white/20 pl-4">Client Portal</span>
        </div>
        <div className="my-auto max-w-[48ch] py-14 animate-fade">
          <h1 className="font-display font-bold text-[clamp(34px,4vw,50px)] leading-[1.06] tracking-tight m-0">
            Your engagements, <em className="not-italic italic font-bold text-orange">in focus</em>.
          </h1>
          <p className="text-white/70 text-[17px] leading-relaxed mt-5 mb-9">
            Track testing progress, review findings as they land, and collect your deliverables — in one place, from one accountable team.
          </p>
          <ul className="m-0 p-0 list-none space-y-3">
            {["CERT-IN empanelled security partner", "Findings with CVSS v3.1 scoring and retest status", "Deliverables from executive summary to attestation"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-white/80 text-[15px]">
                <span aria-hidden="true" className="w-[3px] h-4 bg-orange rounded-sm" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <span className="eyebrow text-white/35">Protect · Comply · Grow</span>
      </div>

      {/* form panel */}
      <div className="bg-bg-cool flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px] animate-modal">
          <div className="bg-white border border-border-card rounded-[13px] p-8">
            <h2 className="font-display font-bold text-[22px] m-0 mb-1.5">Sign in</h2>
            <p className="text-muted-strong text-sm m-0 mb-6">Access is provisioned by your GISPL engagement manager.</p>
            <form onSubmit={submit}>
              <label htmlFor="pl-email" className="eyebrow text-muted-strong block mb-1.5">Email</label>
              <input
                id="pl-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border-card-strong rounded-lg px-3.5 py-3 text-sm font-body mb-4 focus:border-orange outline-none"
              />
              <label htmlFor="pl-pass" className="eyebrow text-muted-strong block mb-1.5">Password</label>
              <input
                id="pl-pass"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border-card-strong rounded-lg px-3.5 py-3 text-sm font-body mb-5 focus:border-orange outline-none"
              />
              {err && (
                <p role="alert" className="text-sev-critical text-[13px] font-medium mt-0 mb-4">{err}</p>
              )}
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </div>
          <div className="mt-4 border border-dashed border-border-card-strong rounded-[10px] px-4 py-3.5 bg-bg-soft">
            <p className="eyebrow text-orange-onlight m-0 mb-1">Demo access</p>
            <p className="font-mono text-[12px] text-muted-strong m-0 break-all">
              {DEMO_LOGIN.email} · {DEMO_LOGIN.password}
            </p>
            <p className="text-muted text-[11px] mt-1.5 mb-0">Demo environment with fictional data — not a live client system.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
