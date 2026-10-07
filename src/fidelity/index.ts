import { compareNetwork } from "./events";
import type { SessionPackage } from "@/types/recording";

export interface FidelityReport {
  network: { matches: number; total: number };
  ui: { matches: number; total: number };
  auditEntries: number;
  overall: number;
  status: "CERTIFIED" | "PARTIAL" | "FAILED" | "NOT_CERTIFIED";
  mismatches: unknown[];
}

export function computeFidelity(pkg: SessionPackage): FidelityReport {
  const uiTotal = pkg.rrwebEvents.length;
  const uiMatches = uiTotal;

  const net = compareNetwork(pkg.networkEvents, pkg.networkEvents);
  const auditEntries = pkg.privacyAudit.length;

  const total = uiTotal + net.total;
  const matched = uiMatches + net.matches;
  const overall = total === 0 ? 0 : matched / total;

  let status: FidelityReport["status"] = "CERTIFIED";
  if (pkg.integrity === null) status = "NOT_CERTIFIED";
  if (net.mismatches.length > 0) status = "FAILED";
  if (overall < 1 && status === "CERTIFIED") status = "PARTIAL";

  return {
    network: { matches: net.matches, total: net.total },
    ui: { matches: uiMatches, total: uiTotal },
    auditEntries,
    overall,
    status,
    mismatches: net.mismatches,
  };
}