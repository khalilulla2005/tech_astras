"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CartBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        const data = (await res.json()) as { cart: { items: unknown[] } };
        if (!cancelled) setCount(data.cart.items.length);
      } catch {
        if (!cancelled) setCount(null);
      }
    }
    load();
    const t = setInterval(load, 1500);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  return (
    <Link
      href="/demo/cart"
      className="rounded-md border border-neutral-700 px-3 py-1 text-sm hover:bg-neutral-800"
      data-testid="cart-badge"
    >
      Cart{count !== null ? ` (${count})` : ""}
    </Link>
  );
}