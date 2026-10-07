import Link from "next/link";

export default function AuditHome() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-semibold">Audit</h1>
        <p className="mt-2 text-neutral-400">
          Every recorded session receives an integrity hash, a privacy audit
          trail, and a fidelity report. Open a session from{" "}
          <Link href="/sessions" className="underline">
            /sessions
          </Link>{" "}
          to view its certificate.
        </p>
      </div>
    </main>
  );
}