import { NextResponse } from "next/server";
import {
  buildCart,
  getSession,
  getSessionKey,
  resetSession,
} from "@/lib/cart-store";
import { getProductById } from "@/lib/demo-data";

export async function GET(req: Request) {
  const key = getSessionKey(req);
  return NextResponse.json({ cart: buildCart(getSession(key)) });
}

export async function POST(req: Request) {
  let body: { productId?: string; quantity?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { productId, quantity = 1 } = body;
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }
  if (!getProductById(productId)) {
    return NextResponse.json({ error: "Unknown productId" }, { status: 400 });
  }
  const qty = Number.isFinite(quantity) ? Math.trunc(quantity) : 1;
  if (qty < 1 || qty > 20) {
    return NextResponse.json({ error: "quantity out of range" }, { status: 400 });
  }

  const key = getSessionKey(req);
  const session = getSession(key);
  const existing = session.items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity = Math.min(20, existing.quantity + qty);
  } else {
    session.items.push({ productId, quantity: qty });
  }

  return NextResponse.json({ cart: buildCart(session) });
}

export async function DELETE(req: Request) {
  const key = getSessionKey(req);
  resetSession(key);
  return NextResponse.json({ cart: buildCart({ items: [] }) });
}