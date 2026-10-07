"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import type { SessionPackage } from "@/types/recording";
import { mountReplay, type ReplayHandle } from "@/replay/ui";

export default function ReplayClient() {
  const params = useParams<{ id: string }>();
  const container = useRef<HTMLDivElement>(null);
  const [pkg, setPkg] = useState<SessionPackage | null>(null);
  const [handle, setHandle] = useState<ReplayHandle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/sessions/${params.id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { session: SessionPackage; error?: string }) => {
        if (d.error) setError(d.error);
        else setPkg(d.session);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Load failed"),
      );
  }, [params?.id]);

  useEffect(() => {
    if (!pkg || !container.current) return;
    const h = mountReplay(container.current, pkg);
    setHandle(h);
    return () => h.destroy();
  }, [pkg]);

  function play() {
    handle?.replayer.play(0);
    setPlaying(true);
  }
  function pause() {
    handle?.replayer.pause();
    setPlaying(false);
  }
  function restart() {
    handle?.replayer.play(0);
    setPlaying(true);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="text-2xl font-semibold">Replay</h1>
        <p className="text-sm text-neutral-400">
          Session <span className="font-mono">{params?.id}</span> - deterministic playback
        </p>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            onClick={play}
            disabled={playing}
            className="rounded-md bg-white px-4 py-1.5 text-neutral-900 disabled:opacity-50"
          >
            Play
          </button>
          <button
            onClick={pause}
            className="rounded-md border border-neutral-700 px-4 py-1.5"
          >
            Pause
          </button>
          <button
            onClick={restart}
            className="rounded-md border border-neutral-700 px-4 py-1.5"
          >
            Restart
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <div ref={container} className="min-h-[400px] bg-neutral-950" />
        </div>
      </div>
    </main>
  );
}