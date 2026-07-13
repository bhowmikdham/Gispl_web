/* The only file that knows which mode is running. Pages import
   getData()/getAuth() and never branch on mode themselves. */

import { config } from "../config";
import { apiAuth, apiData } from "./api";
import { localAuth, localData } from "./local";
import type { AuthProvider, DataProvider } from "./types";

export function getData(): DataProvider {
  return config.MODE === "api" ? apiData : localData;
}

export function getAuth(): AuthProvider {
  return config.MODE === "api" ? apiAuth : localAuth;
}

export type { AuthProvider, DataProvider, FindingFilter } from "./types";
