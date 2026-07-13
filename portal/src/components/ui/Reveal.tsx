"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/* Scroll/entrance reveal. Starts hidden, animates up when it enters the
   viewport (once). Elements already in view on load animate on mount, so it
   doubles as a page-entrance. `delay` staggers siblings. Reduced-motion is
   handled in globals.css (the .reveal rules collapse to no-op). */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    // safety net: never leave content invisible if the observer is slow/unsupported
    const t = setTimeout(() => setShown(true), 1200);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={clsx("reveal", shown && "is-in", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
