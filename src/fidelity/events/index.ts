import type { RecordedNetworkEvent } from "@/types/recording";

export interface NetworkMismatch {
  seq: number;
  expected: Partial<RecordedNetworkEvent>;
  actual: Partial<RecordedNetworkEvent>;
  reason: string;
}

export function compareNetwork(
  original: RecordedNetworkEvent[],
  replay: RecordedNetworkEvent[],
): { matches: number; total: number; mismatches: NetworkMismatch[] } {
  const mismatches: NetworkMismatch[] = [];
  const total = original.length;
  let matches = 0;
  const n = Math.max(original.length, replay.length);
  for (let i = 0; i < n; i++) {
    const a = original[i];
    const b = replay[i];
    if (!a || !b) {
      mismatches.push({
        seq: i,
        expected: a ?? {},
        actual: b ?? {},
        reason: !a ? "extra replay event" : "missing replay event",
      });
      continue;
    }
    if (
      a.method === b.method &&
      a.url === b.url &&
      a.status === b.status &&
      a.responseBody === b.responseBody
    ) {
      matches++;
    } else {
      mismatches.push({
        seq: i,
        expected: a,
        actual: b,
        reason: "field mismatch",
      });
    }
  }
  return { matches, total, mismatches };
}