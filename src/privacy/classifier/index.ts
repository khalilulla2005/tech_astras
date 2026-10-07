/**
 * Classify a field name into a privacy category.
 * Deterministic, pure, no network.
 */
export type PrivacyCategory =
  | "PUBLIC"
  | "INTERNAL"
  | "SENSITIVE"
  | "SECRET"
  | "UNSUPPORTED";

const SECRET_PATTERNS = [
  /^password$/i,
  /^passwd$/i,
  /^pwd$/i,
  /^authorization$/i,
  /^auth$/i,
  /^bearer$/i,
  /^token$/i,
  /^access[_-]?token$/i,
  /^refresh[_-]?token$/i,
  /^api[_-]?key$/i,
  /^apikey$/i,
  /^secret$/i,
  /^client[_-]?secret$/i,
  /^card[_-]?number$/i,
  /^cardnumber$/i,
  /^cc[_-]?num$/i,
  /^cvv$/i,
  /^cvc$/i,
  /^pin$/i,
];

const SENSITIVE_PATTERNS = [
  /^email$/i,
  /^e[_-]?mail$/i,
  /^phone$/i,
  /^phone[_-]?number$/i,
  /^mobile$/i,
  /^ssn$/i,
  /^social[_-]?security$/i,
  /^address$/i,
  /^street$/i,
  /^zip$/i,
  /^postal$/i,
  /^name$/i,
  /^full[_-]?name$/i,
  /^first[_-]?name$/i,
  /^last[_-]?name$/i,
];

export function classifyField(field: string): PrivacyCategory {
  for (const p of SECRET_PATTERNS) if (p.test(field)) return "SECRET";
  for (const p of SENSITIVE_PATTERNS) if (p.test(field)) return "SENSITIVE";
  return "PUBLIC";
}