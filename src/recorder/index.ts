"use client";

import { record } from "@rrweb/record";
import { NetworkRecorder } from "@/recorder/network";
import { sha256Hex, canonicalize } from "@/sessions/integrity";
import { sanitize } from "@/privacy/sanitizer";
import type { PrivacyAuditEntry, SessionPackage } from "@/types/recording";

export interface RecorderOptions {
  applicationVersion: string;
  applicationCommit: string;
  onAudit?: (entries: PrivacyAuditEntry[]) => void;
}

export class SessionRecorder {
  private stopFn: (() => void) | null = null;
  private events: unknown[] = [];
  private net = new NetworkRecorder();
  private startedAt = 0;
  private allAudit: PrivacyAuditEntry[] = [];
  private opts: RecorderOptions;

  constructor(opts: RecorderOptions) {
    this.opts = opts;
  }

  start() {
    if (this.stopFn) return;
    this.startedAt = Date.now();
    this.events = [];
    this.net = new NetworkRecorder();
    this.net.start();

    const handle = record({
      emit: (e) => {
        const { sanitized, audit } = sanitize(e);
        this.events.push(sanitized);
        if (audit.length) this.allAudit.push(...audit);
      },
      maskAllInputs: true,
      maskTextSelector: "[data-sensitive]",
      blockClass: "rr-block",
      recordCanvas: false,
      collectFonts: false,
    });

    this.stopFn =
      typeof handle === "function"
        ? (handle as () => void)
        : () => {
            /* no-op if record returns undefined */
          };
  }

  stop(): SessionPackage {
    if (this.stopFn) {
      this.stopFn();
      this.stopFn = null;
    }
    this.net.stop();
    this.allAudit.push(...this.net.audit);
    this.opts.onAudit?.(this.allAudit);

    const sessionId = `s-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    return {
      schemaVersion: 1,
      sessionId,
      applicationVersion: this.opts.applicationVersion,
      applicationCommit: this.opts.applicationCommit,
      createdAtIso: new Date().toISOString(),
      durationMs: Date.now() - this.startedAt,
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      viewport: {
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
      },
      rrwebEvents: this.events,
      networkEvents: this.net.events,
      privacyAudit: dedupeAudit(this.allAudit),
      integrity: null,
    };
  }
}

export async function finalizeSession(
  pkg: SessionPackage,
): Promise<SessionPackage> {
  const hash = await sha256Hex(canonicalize(pkg));
  return { ...pkg, integrity: { algorithm: "SHA-256", hash } };
}

function dedupeAudit(entries: PrivacyAuditEntry[]): PrivacyAuditEntry[] {
  const seen = new Set<string>();
  const out: PrivacyAuditEntry[] = [];
  for (const e of entries) {
    const key = `${e.path}|${e.field}|${e.action}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}