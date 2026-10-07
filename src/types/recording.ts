import { z } from "zod";

export const RecordedNetworkEventSchema = z.object({
  seq: z.number().int().nonnegative(),
  method: z.string(),
  url: z.string(),
  requestHeaders: z.record(z.string(), z.string()),
  requestBody: z.string().nullable(),
  status: z.number().int(),
  responseHeaders: z.record(z.string(), z.string()),
  responseBody: z.string(),
  startedAtMs: z.number(),
  durationMs: z.number(),
  error: z.string().nullable(),
});

export type RecordedNetworkEvent = z.infer<typeof RecordedNetworkEventSchema>;

export const PrivacyAuditEntrySchema = z.object({
  field: z.string(),
  category: z.enum(["PUBLIC", "INTERNAL", "SENSITIVE", "SECRET", "UNSUPPORTED"]),
  action: z.enum(["ALLOW", "BLOCK", "REPLACE"]),
  path: z.string(),
});

export type PrivacyAuditEntry = z.infer<typeof PrivacyAuditEntrySchema>;

export const SessionPackageSchema = z.object({
  schemaVersion: z.literal(1),
  sessionId: z.string(),
  applicationVersion: z.string(),
  applicationCommit: z.string(),
  createdAtIso: z.string(),
  durationMs: z.number(),
  url: z.string(),
  userAgent: z.string(),
  viewport: z.object({ width: z.number(), height: z.number() }),
  rrwebEvents: z.array(z.unknown()),
  networkEvents: z.array(RecordedNetworkEventSchema),
  privacyAudit: z.array(PrivacyAuditEntrySchema),
  integrity: z
    .object({
      algorithm: z.literal("SHA-256"),
      hash: z.string(),
    })
    .nullable(),
});

export type SessionPackage = z.infer<typeof SessionPackageSchema>;