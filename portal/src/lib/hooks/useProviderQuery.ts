"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Tiny {data, loading, error, refetch} hook over a provider Promise.
    Runs client-side only (providers read localStorage in demo mode). */
export function useProviderQuery<T>(fn: () => Promise<T>, deps: readonly unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const alive = useRef(true);

  const run = useCallback(() => {
    setLoading(true);
    setError(null);
    fn().then(
      (d) => {
        if (alive.current) {
          setData(d);
          setLoading(false);
        }
      },
      (e: Error) => {
        if (alive.current) {
          setError(e);
          setLoading(false);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    alive.current = true;
    run();
    return () => {
      alive.current = false;
    };
  }, [run]);

  return { data, loading, error, refetch: run };
}
