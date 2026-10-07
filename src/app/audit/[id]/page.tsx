"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { SessionPackage } from "@/types/recording";
import { computeFidelity, type FidelityReport } from "@/fidelity";

export default function AuditDetailPage() {
  const params = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<SessionPackage | null>(null);
  const [integrityOk, setIntegrityOk] = useState<boolean | null>(null);
  const [report, setReport] = useState<FidelityReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/sessions/${params.id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { session?: SessionPackage; integrityOk?: boolean; error?: string }) => {
        if (d.error || !d.session) {
          setError(d.error ?? "Load failed");
          return;
        }
        setPkg(d.session);
        setIntegrityOk(d.integrityOk ?? false);
        setReport(computeFidelity(d.session));
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Load failed"),
      );
  }, [params?.id]);

  if (error)
    return (
      <main className="min-h-screen bg-neutral-950 p-10 text-red-400">
        {error}
      </main>
    );
  if (!pkg || !report)
    return (
      <main className="min-h-screen bg-neutral-950 p-10 text-neutral-400">
        Loading...
      </main>
    );

  const statusColor: Record<FidelityReport["status"], string> = {
    CERTIFIED: "bg-emerald-900/60 text-emerald-300 border-emerald-800",
    PARTIAL: "bg-yellow-900/60 text-yellow-300 border-yellow-800",
    FAILED: "bg-red-900/60 text-red-300 border-red-800",
    NOT_CERTIFIED: "bg-neutral-800 text-neutral-300 border-neutral-700",
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Audit Certificate</h1>
        <p className="text-sm text-neutral-400">
          Session <span className="font-mono">{pkg.sessionId}</span> -{" "}
          {new Date(pkg.createdAtIso).toLocaleString()}
        </p>

        <div
          className={`mt-4 inline-block rounded-lg border px-4 py-2 text-sm font-medium ${statusColor[report.status]}`}
        >
          Status: {report.status}
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card label="Integrity">
            {integrityOk === null
              ? "..."
              : integrityOk
                ? "SHA-256 verified"
                : "MISMATCH"}
          </Card>
          <Card label="Overall fidelity">
            {(report.overall * 100).toFixed(2)}%
          </Card>
          <Card label="UI events">
            {report.ui.matches} / {report.ui.total}
          </Card>
          <Card label="Network calls">
            {report.network.matches} / {report.network.total}
          </Card>
          <Card label="Privacy rules applied">{report.auditEntries}</Card>
          <Card label="Application version">{pkg.applicationVersion}</Card>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Privacy Audit Trail</h2>
          <p className="text-sm text-neutral-400">
            Fields classified by the policy engine. Original values are never
            stored.
          </p>
          {pkg.privacyAudit.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-500">
              No sensitive fields observed in this session.
            </p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <thead className="text-left text-neutral-400">
                <tr>
                  <th className="py-2">Path</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pkg.privacyAudit.slice(0, 40).map((e, i) => (
                  <tr key={i} className="border-t border-neutral-800">
                    <td className="py-1.5 font-mono text-xs">{e.path}</td>
                    <td className="py-1.5">{e.category}</td>
                    <td className="py-1.5">
                      <span
                        className={
                          e.action === "BLOCK"
                            ? "text-red-400"
                            : e.action === "REPLACE"
                              ? "text-yellow-400"
                              : "text-emerald-400"
                        }
                      >
                        {e.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Integrity hash</h2>
          <pre className="mt-2 overflow-x-auto rounded-md border border-neutral-800 bg-neutral-900 p-3 text-xs">
            {pkg.integrity?.hash ?? "(none)"}
          </pre>
          <p className="mt-2 text-xs text-neutral-500">
            Integrity proves the recording was not modified. It does NOT prove
            the recording is private. These are separate claims.
          </p>
        </section>
      </div>
    </main>
  );
}

function Card({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-medium">{children}</div>
    </div>
  );
}