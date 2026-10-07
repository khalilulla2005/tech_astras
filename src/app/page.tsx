"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/sessions", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { sessions: unknown[] }) => setCount(d.sessions.length))
      .catch(() => setCount(null));
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold">
          Deterministic Replay Platform
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-400">
          A local-first research prototype for recording, deterministically
          replaying, and formally auditing a supported class of browser
          sessions.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Recorded sessions" value={count} />
          <Stat label="Model" value="certified-class" />
        </div>

        <h2 className="mt-12 text-lg font-semibold">Start here</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          <Tile
            href="/demo"
            title="1. Record a session"
            desc="Open the demo store and walk through the flow."
          />
          <Tile
            href="/sessions"
            title="2. Inspect recordings"
            desc="Every session shows integrity hash, fidelity, and privacy audit."
          />
          <Tile
            href="/audit"
            title="3. View certificates"
            desc="Machine-readable status for each session."
          />
        </ul>

        <h2 className="mt-12 text-lg font-semibold">
          Why we don&apos;t claim universal guarantees
        </h2>
        <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-300">
          <p>
            Perfect fidelity and perfect privacy are information-theoretically
            incompatible in general. See docs/impossibility-theorem.md for the
            full proof.
          </p>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string | null;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold">
        {value === null ? "..." : value}
      </div>
    </div>
  );
}

function Tile({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-600"
    >
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-sm text-neutral-400">{desc}</div>
    </Link>
  );
}