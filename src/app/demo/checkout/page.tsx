"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Cart, CheckoutResponse } from "@/types/demo";

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [result, setResult] = useState<CheckoutResponse | null>(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetch("/api/cart", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { cart: Cart }) => setCart(d.cart));
  }, []);

  async function placeOrder() {
    setPlacing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await res.json()) as CheckoutResponse;
      if (data.success) {
        setResult(data);
        setCart(null);
      }
    } finally {
      setPlacing(false);
    }
  }

  if (result?.success) {
    return (
      <div className="space-y-3" data-testid="order-success">
        <h1 className="text-xl font-semibold">Order placed</h1>
        <p>
          Order ID: <span className="font-mono">{result.orderId}</span>
        </p>
        <Link href="/demo/products" className="text-sm underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="checkout-page">
      <h1 className="text-xl font-semibold">Checkout</h1>
      {cart && (
        <p className="text-neutral-300">
          {cart.items.length} item(s) - Total ${cart.total.toFixed(2)}
        </p>
      )}
      <button
        onClick={placeOrder}
        disabled={placing || !cart || cart.items.length === 0}
        data-testid="place-order"
        className="rounded-md bg-white px-4 py-2 text-neutral-900 disabled:opacity-50"
      >
        {placing ? "Placing..." : "Place order"}
      </button>
    </div>
  );
}