import { Suspense } from "react";
import AuditClient from "./audit-client";

export default function AuditDetailPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-neutral-950 p-10 text-neutral-400">Loading audit...</main>}>
      <AuditClient />
    </Suspense>
  );
}