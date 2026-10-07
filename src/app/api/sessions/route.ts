import { NextResponse } from "next/server";
import { saveSession, listSessions } from "@/sessions/storage";
import { SessionPackageSchema } from "@/types/recording";
import { sha256Hex, canonicalize } from "@/sessions/integrity";

export const runtime = "nodejs";

export async function GET() {
  const sessions = await listSessions();
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SessionPackageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Schema validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const pkg = parsed.data;
  const hash = await sha256Hex(canonicalize(pkg));
  await saveSession({
    ...pkg,
    integrity: { algorithm: "SHA-256" as const, hash },
  });
  return NextResponse.json({ sessionId: pkg.sessionId, hash });
}