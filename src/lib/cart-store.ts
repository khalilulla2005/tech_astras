import { computeCart, getProductById } from "@/lib/demo-data";
import type { Cart, CartItem } from "@/types/demo";

export interface SessionData {
  items: CartItem[];
  couponCode?: string;
}

const g = globalThis as unknown as { __demoCartStore?: Map<string, SessionData> };
if (!g.__demoCartStore) g.__demoCartStore = new Map();
const store = g.__demoCartStore;

export function getSessionKey(req: Request): string {
  return req.headers.get("x-demo-session") ?? "default";
}

export function getSession(key: string): SessionData {
  let s = store.get(key);
  if (!s) { s = { items: [] }; store.set(key, s); }
  return s;
}

export function resetSession(key: string): void {
  store.set(key, { items: [] });
}

export function setCoupon(key: string, couponCode: string): void {
  const s = getSession(key);
  s.couponCode = couponCode;
}

export function buildCart(session: SessionData): Cart {
  let subtotal = 0;
  for (const item of session.items) {
    const product = getProductById(item.productId);
    if (product) subtotal += product.price * item.quantity;
  }
  subtotal = Math.round(subtotal * 100) / 100;
  const { couponDiscount, tax, total } = computeCart(subtotal, session.couponCode);
  return { items: session.items, couponCode: session.couponCode, couponDiscount, subtotal, tax, total };
}