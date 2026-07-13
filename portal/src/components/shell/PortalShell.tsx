"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import { asset } from "@/lib/paths";
import { getAuth, getData } from "@/lib/providers";
import { useSession } from "@/lib/hooks/useSession";

const TABS = [
  { href: "/dashboard/", label: "Dashboard" },
  { href: "/engagements/", label: "Engagements" },
  { href: "/findings/", label: "Findings" },
  { href: "/documents/", label: "Documents" },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function signOut() {
    void getAuth().signOut().then(() => router.replace("/"));
  }
  function resetDemo() {
    setMenuOpen(false);
    void getData().resetDemo().then(() => location.reload());
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="bg-navy-nav">
        <div className="hairline-brand" aria-hidden="true" />
        <div className="portal-rail h-[60px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/gispl-logo-ondark.png")} alt="GISPL" width={45} height={30} style={{ height: 30, width: "auto" }} />
            <span className="text-white/55 text-[13px] font-medium border-l border-white/20 pl-3.5 hidden sm:inline">Client Portal</span>
            <span className="text-orange-light/90 bg-orange-light/10 rounded-[20px] px-2.5 py-1 text-[10px] font-semibold tracking-wide">Demo</span>
          </div>
          <div className="relative flex items-center gap-4">
            <span className="text-white/60 text-[13px] hidden md:inline">{session?.clientName}</span>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="text-white font-body font-semibold text-[13px] bg-white/8 border border-white/20 rounded-[9px] px-3.5 py-2 cursor-pointer hover:border-orange"
            >
              {session?.name ?? "Account"} ▾
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 top-[110%] z-40 min-w-[190px] bg-navy-panel border border-white/10 rounded-[10px] p-1.5 shadow-xl">
                <button role="menuitem" type="button" onClick={resetDemo} className="block w-full text-left text-white/85 text-[13px] font-body px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer">
                  Reset demo data
                </button>
                <button role="menuitem" type="button" onClick={signOut} className="block w-full text-left text-white/85 text-[13px] font-body px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer">
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
        <nav className="border-t border-white/8" aria-label="Portal">
          <div className="portal-rail flex gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const on = pathname.startsWith(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  aria-current={on ? "page" : undefined}
                  className={clsx(
                    "font-body text-sm px-4 py-3.5 border-b-2 whitespace-nowrap",
                    on ? "text-white border-orange font-semibold" : "text-white/70 border-transparent hover:text-white"
                  )}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <main id="main" className="flex-1">
        <div className="portal-rail py-9">{children}</div>
      </main>
      <footer className="border-t border-border-card">
        <div className="portal-rail py-4 flex flex-wrap gap-x-6 gap-y-1 justify-between">
          <span className="label text-muted">Demo environment — Meridian First Bank is a fictional organisation</span>
          <span className="text-muted text-xs">© 2026 G-Info Technology Solutions Pvt. Ltd.</span>
        </div>
      </footer>
    </div>
  );
}
