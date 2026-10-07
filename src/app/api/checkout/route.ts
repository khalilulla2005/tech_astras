import { NextResponse } from "next/server";
import {
  buildCart,
  getSession,
  getSessionKey,
  resetSession,
} from "@/lib/cart-store";
import type { CheckoutResponse } from "@/types/demo";

export async function POST(req: Request) {
  const key = getSessionKey(req);
  const session = getSession(key);

  if (session.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const cart = buildCart(session);
  const orderId = `ord-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  resetSession(key);

  const response: CheckoutResponse = {
    success: true,
    orderId,
    message: `Order placed for $${cart.total.toFixed(2)}`,
  };
  return NextResponse.json(response);
}