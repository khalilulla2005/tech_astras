"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionRecorder, finalizeSession } from "@/recorder";
import {
  APPLICATION_VERSION,
  APPLICATION_COMMIT,
} from "@/lib/demo-data";

export function RecordBar() {
  const router = useRouter();
  const recorder = useRef<SessionRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  function start() {
    const r = new SessionRecorder({
      applicationVersion: APPLICATION_VERSION,
      applicationCommit: APPLICATION_COMMIT,
    });
    r.start();
    recorder.current = r;
    setRecording(true);
    setSavedId(null);
  }

  async function stop() {
    const r = recorder.current;
    if (!r) return;
    recorder.current = null;
    setRecording(false);
    setSaving(true);
    try {
      const pkg = r.stop();
      const withHash = await finalizeSession(pkg);
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(withHash),
      });
      const data = (await res.json()) as { sessionId?: string; error?: string };
      if (!res.ok || !data.sessionId) {
        throw new Error(data.error ?? "Save failed");
      }
      setSavedId(data.sessionId);
      router.push("/sessions");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {savedId && (
        <span className="text-xs text-emerald-400">Saved {savedId}</span>
      )}
      <button
        onClick={recording ? stop : start}
        disabled={saving}
        data-testid="record-toggle"
        className={`rounded-md px-3 py-1 text-sm font-medium transition ${
          recording
            ? "bg-red-600 text-white animate-pulse"
            : "bg-white text-neutral-900"
        } disabled:opacity-60`}
      >
        {saving ? "Saving..." : recording ? "Stop recording" : "Start recording"}
      </button>
    </div>
  );
}