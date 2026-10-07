import { NextResponse } from "next/server";
import {
  buildCart,
  getSession,
  getSessionKey,
  setCoupon,
} from "@/lib/cart-store";
import { computeCart, getProductById } from "@/lib/demo-data";

const VALID_COUPONS = new Set(["SAVE20", "WELCOME10"]);

export async function POST(req: Request) {
  let body: { code?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const code = body.code?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Missing coupon code" }, { status: 400 });
  }
  if (!VALID_COUPONS.has(code)) {
    return NextResponse.json({ error: "Unknown coupon code" }, { status: 404 });
  }

  const key = getSessionKey(req);
  setCoupon(key, code);
  const session = getSession(key);

  let subtotal = 0;
  for (const item of session.items) {
    const p = getProductById(item.productId);
    if (p) subtotal += p.price * item.quantity;
  }
  subtotal = Math.round(subtotal * 100) / 100;
  computeCart(subtotal, code);

  return NextResponse.json({ cart: buildCart(session) });
}