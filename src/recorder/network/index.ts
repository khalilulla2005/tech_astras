import { sanitize } from "@/privacy/sanitizer";
import type { PrivacyAuditEntry, RecordedNetworkEvent } from "@/types/recording";

export class NetworkRecorder {
  private seq = 0;
  private originalFetch: typeof fetch | null = null;
  public events: RecordedNetworkEvent[] = [];
  public audit: PrivacyAuditEntry[] = [];

  start() {
    if (this.originalFetch) return;
    this.originalFetch = window.fetch.bind(window);
    const self = this;

    window.fetch = async function (
      input: RequestInfo | URL,
      init?: RequestInit,
    ) {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const method = init?.method ?? "GET";
      const started = performance.now();
      const seq = self.seq++;

      let reqBody: string | null = null;
      if (init?.body && typeof init.body === "string") {
        const { sanitized, audit } = sanitize(init.body);
        reqBody =
          typeof sanitized === "string" ? sanitized : JSON.stringify(sanitized);
        self.audit.push(...audit);
      }

      try {
        const res = await self.originalFetch!(input, init);
        const clone = res.clone();
        const text = await clone.text();
        const { sanitized: bodySanitized, audit: bodyAudit } = sanitize(text);
        self.audit.push(...bodyAudit);

        const headers: Record<string, string> = {};
        res.headers.forEach((v, k) => {
          headers[k] = /authorization|cookie|set-cookie/i.test(k)
            ? "[BLOCKED]"
            : v;
        });

        self.events.push({
          seq,
          method,
          url,
          requestHeaders: {},
          requestBody: reqBody,
          status: res.status,
          responseHeaders: headers,
          responseBody:
            typeof bodySanitized === "string"
              ? bodySanitized
              : JSON.stringify(bodySanitized),
          startedAtMs: started,
          durationMs: Math.round(performance.now() - started),
          error: null,
        });

        return res;
      } catch (err) {
        self.events.push({
          seq,
          method,
          url,
          requestHeaders: {},
          requestBody: reqBody,
          status: 0,
          responseHeaders: {},
          responseBody: "",
          startedAtMs: started,
          durationMs: Math.round(performance.now() - started),
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    };
  }

  stop() {
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
      this.originalFetch = null;
    }
  }
}