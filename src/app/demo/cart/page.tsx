"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Cart } from "@/types/demo";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    const res = await fetch("/api/cart", { cache: "no-store" });
    const data = (await res.json()) as { cart: Cart };
    setCart(data.cart);
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  async function applyCoupon() {
    setCouponError(null);
    const res = await fetch("/api/coupon", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code: couponInput }),
    });
    const data = (await res.json()) as { cart?: Cart; error?: string };
    if (!res.ok || !data.cart) {
      setCouponError(data.error ?? `HTTP ${res.status}`);
      return;
    }
    setCart(data.cart);
    setCouponInput("");
  }

  if (!cart) return <p>Loading cart...</p>;

  return (
    <div className="space-y-4" data-testid="cart-page">
      <h1 className="text-xl font-semibold">Cart</h1>

      {cart.items.length === 0 ? (
        <p data-testid="cart-empty">Your cart is empty.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-400">
            <tr>
              <th className="py-1">Product</th>
              <th className="py-1">Qty</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((l) => (
              <tr key={l.productId} className="border-t border-neutral-800">
                <td className="py-2">{l.productId}</td>
                <td className="py-2">{l.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-end gap-2">
        <div>
          <label className="block text-xs text-neutral-400" htmlFor="coupon">
            Coupon code
          </label>
          <input
            id="coupon"
            data-testid="coupon-input"
            className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="SAVE20"
          />
        </div>
        <button
          onClick={applyCoupon}
          data-testid="apply-coupon"
          className="rounded-md border border-neutral-700 px-3 py-1"
        >
          Apply
        </button>
        {couponError && (
          <span className="text-sm text-red-400" data-testid="coupon-error">
            {couponError}
          </span>
        )}
      </div>

      <div className="space-y-1 rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm">
        <Row label="Subtotal" value={cart.subtotal} />
        {cart.couponCode && (
          <Row
            label={`Discount (${cart.couponCode})`}
            value={-cart.couponDiscount}
          />
        )}
        <Row label="Tax" value={cart.tax} />
        <Row label="Total" value={cart.total} bold />
      </div>

      <div className="flex gap-3">
        <Link
          href="/demo/checkout"
          className="rounded-md bg-white px-4 py-2 text-neutral-900"
          data-testid="go-checkout"
        >
          Go to checkout
        </Link>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold" : ""}`}>
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}