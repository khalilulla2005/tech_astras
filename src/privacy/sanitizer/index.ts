import { classifyField } from "@/privacy/classifier";
import { POLICY, SYNTHETIC } from "@/privacy/policies";
import type { PrivacyAuditEntry } from "@/types/recording";

/**
 * Sanitize a value BEFORE persistence.
 * Returns a sanitized copy plus an audit trail.
 * The audit trail never contains the original sensitive value.
 */
export function sanitize<T>(
  value: T,
  path = "$",
): { sanitized: T; audit: PrivacyAuditEntry[] } {
  const audit: PrivacyAuditEntry[] = [];
  const sanitized = walk(value, path, audit) as T;
  return { sanitized, audit };
}

function walk(
  value: unknown,
  path: string,
  audit: PrivacyAuditEntry[],
): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    return value.map((v, i) => walk(v, `${path}[${i}]`, audit));
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const childPath = `${path}.${k}`;
      const cat = classifyField(k);
      const action = POLICY[cat];
      audit.push({ field: k, category: cat, action, path: childPath });
      if (action === "BLOCK") {
        out[k] = "[BLOCKED]";
      } else if (action === "REPLACE") {
        out[k] = SYNTHETIC.default;
      } else {
        out[k] = walk(v, childPath, audit);
      }
    }
    return out;
  }
  return value;
}