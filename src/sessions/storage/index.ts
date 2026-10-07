import { promises as fs } from "node:fs";
import path from "node:path";
import { SessionPackageSchema, type SessionPackage } from "@/types/recording";

const ROOT = path.join(process.cwd(), "recordings");

async function ensureRoot(): Promise<void> {
  await fs.mkdir(ROOT, { recursive: true });
}

function fileFor(id: string): string {
  // Guard against path traversal.
  if (!/^[a-z0-9-]{6,64}$/i.test(id)) {
    throw new Error("Invalid session id");
  }
  return path.join(ROOT, `${id}.json`);
}

export async function saveSession(pkg: SessionPackage): Promise<void> {
  await ensureRoot();
  const parsed = SessionPackageSchema.parse(pkg);
  await fs.writeFile(fileFor(pkg.sessionId), JSON.stringify(parsed, null, 2));
}

export async function loadSession(id: string): Promise<SessionPackage> {
  const raw = await fs.readFile(fileFor(id), "utf8");
  return SessionPackageSchema.parse(JSON.parse(raw));
}

export async function listSessions(): Promise<
  Array<
    Pick<
      SessionPackage,
      "sessionId" | "createdAtIso" | "durationMs" | "applicationVersion" | "integrity"
    >
  >
> {
  await ensureRoot();
  const files = await fs.readdir(ROOT);
  const out: Array<
    Pick<
      SessionPackage,
      "sessionId" | "createdAtIso" | "durationMs" | "applicationVersion" | "integrity"
    >
  > = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(ROOT, f), "utf8");
      const p = SessionPackageSchema.parse(JSON.parse(raw));
      out.push({
        sessionId: p.sessionId,
        createdAtIso: p.createdAtIso,
        durationMs: p.durationMs,
        applicationVersion: p.applicationVersion,
        integrity: p.integrity,
      });
    } catch {
      // Skip malformed files silently at listing time.
    }
  }
  return out.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
}