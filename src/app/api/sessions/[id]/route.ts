import { NextResponse } from "next/server";
import { loadSession } from "@/sessions/storage";
import { sha256Hex, canonicalize } from "@/sessions/integrity";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const pkg = await loadSession(id);
    const recomputed = await sha256Hex(canonicalize({ ...pkg, integrity: null }));
    const integrityOk = pkg.integrity?.hash === recomputed;
    return NextResponse.json({ session: pkg, integrityOk, recomputed });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Load failed" },
      { status: 404 },
    );
  }
}