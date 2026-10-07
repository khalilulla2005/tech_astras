"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Row {
  sessionId: string;
  createdAtIso: string;
  durationMs: number;
  integrity: { hash: string } | null;
}

export default function SessionsPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    fetch("/api/sessions", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { sessions: Row[] }) => setRows(d.sessions));
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Recorded Sessions</h1>
          <Link
            href="/demo"
            className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-900"
          >
            Record new session
          </Link>
        </div>

        {!rows && <p className="mt-4 text-neutral-400">Loading...</p>}

        {rows?.length === 0 && (
          <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 p-6 text-neutral-300">
            No sessions recorded yet. Open the demo, click Start recording,
            walk through the flow, then stop.
          </div>
        )}

        {rows && rows.length > 0 && (
          <table className="mt-6 w-full text-sm">
            <thead className="text-left text-neutral-400">
              <tr>
                <th className="py-2">Session</th>
                <th className="py-2">When</th>
                <th className="py-2">Duration</th>
                <th className="py-2">Integrity</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.sessionId} className="border-t border-neutral-800">
                  <td className="py-2 font-mono text-xs">{r.sessionId}</td>
                  <td className="py-2 text-neutral-300">
                    {new Date(r.createdAtIso).toLocaleString()}
                  </td>
                  <td className="py-2 text-neutral-300">
                    {(r.durationMs / 1000).toFixed(1)}s
                  </td>
                  <td className="py-2">
                    {r.integrity ? (
                      <span className="rounded bg-emerald-900/60 px-2 py-0.5 text-xs text-emerald-300">
                        SHA-256
                      </span>
                    ) : (
                      <span className="rounded bg-yellow-900/60 px-2 py-0.5 text-xs text-yellow-300">
                        missing
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-right">
                    <Link
                      href={`/replay/${r.sessionId}`}
                      className="mr-3 underline"
                    >
                      Replay
                    </Link>
                    <Link href={`/audit/${r.sessionId}`} className="underline">
                      Audit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}