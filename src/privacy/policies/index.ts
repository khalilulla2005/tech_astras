import type { PrivacyCategory } from "@/privacy/classifier";

export type PrivacyAction = "ALLOW" | "BLOCK" | "REPLACE";

export const POLICY: Record<PrivacyCategory, PrivacyAction> = {
  PUBLIC: "ALLOW",
  INTERNAL: "ALLOW",
  SENSITIVE: "REPLACE",
  SECRET: "BLOCK",
  UNSUPPORTED: "BLOCK",
};

export const SYNTHETIC = {
  email: "user@example.test",
  phone: "+1-555-0100",
  name: "Alex Example",
  default: "[REDACTED]",
} as const;