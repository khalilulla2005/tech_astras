import { Suspense } from "react";
import ReplayClient from "./replay-client";

export default function ReplayPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-neutral-950 p-10 text-neutral-400">Loading replay...</main>}>
      <ReplayClient />
    </Suspense>
  );
}