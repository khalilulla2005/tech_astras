import type { RecordedNetworkEvent } from "@/types/recording";

export class NetworkReplayer {
  private originalFetch: typeof fetch | null = null;
  private events: RecordedNetworkEvent[] = [];
  public missing: { method: string; url: string }[] = [];

  constructor(events: RecordedNetworkEvent[]) {
    this.events = [...events].sort((a, b) => a.seq - b.seq);
  }

  install() {
    if (this.originalFetch) return;
    this.originalFetch = window.fetch.bind(window);
    const remaining = [...this.events];
    const self = this;

    window.fetch = async function (input, init) {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : (input as Request).url;
      const method = init?.method ?? "GET";
      const idx = remaining.findIndex(
        (e) =>
          e.method.toUpperCase() === method.toUpperCase() && e.url === url,
      );
      if (idx === -1) {
        self.missing.push({ method, url });
        throw new Error(`Replay: no recorded response for ${method} ${url}`);
      }
      const rec = remaining.splice(idx, 1)[0];
      await new Promise((r) => setTimeout(r, Math.min(rec.durationMs || 0, 1000)));
      return new Response(rec.responseBody, {
        status: rec.status,
        headers: rec.responseHeaders,
      });
    };
  }

  uninstall() {
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
      this.originalFetch = null;
    }
  }
}