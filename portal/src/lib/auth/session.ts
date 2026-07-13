import { config } from "../config";
import type { Session } from "../types";

/* Session storage — deliberately a DIFFERENT key from the admin panel's
   "gispl:admin-session" so client and admin sign-ins never collide. */

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(config.SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (!s.expiresAt || Date.parse(s.expiresAt) <= Date.now()) {
      localStorage.removeItem(config.SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function writeSession(s: Session): void {
  localStorage.setItem(config.SESSION_KEY, JSON.stringify(s));
}

export function clearSession(): void {
  localStorage.removeItem(config.SESSION_KEY);
}
