import { NextResponse } from "next/server";
import { saveSession, listSessions } from "@/sessions/storage";
import { SessionPackageSchema } from "@/types/recording";
import { sha256Hex, canonicalize } from "@/sessions/integrity";

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

  // Always hash the package WITHOUT the integrity field so save and
  // verify compute the same digest.
  const pkgWithoutIntegrity = { ...parsed.data, integrity: null };
  const hash = await sha256Hex(canonicalize(pkgWithoutIntegrity));

  await saveSession({
    ...parsed.data,
    integrity: { algorithm: "SHA-256" as const, hash },
  });

  return NextResponse.json({ sessionId: parsed.data.sessionId, hash });
}