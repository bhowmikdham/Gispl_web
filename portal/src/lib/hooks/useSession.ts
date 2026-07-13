"use client";

import { useEffect, useState } from "react";
import { getAuth } from "../providers";
import type { Session } from "../types";

/** Mounted-safe session read: `checked` stays false until the client
    has actually looked at localStorage, so first paint is deterministic
    (no hydration mismatch). */
export function useSession(): { session: Session | null; checked: boolean } {
  const [state, setState] = useState<{ session: Session | null; checked: boolean }>({
    session: null,
    checked: false,
  });

  useEffect(() => {
    setState({ session: getAuth().getSession(), checked: true });
  }, []);

  return state;
}
