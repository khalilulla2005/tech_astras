"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/types/demo";

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; products: Product[] };

export default function ProductsPage() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { products: Product[] };
        if (!cancelled) setState({ kind: "ready", products: data.products });
      } catch (err) {
        if (!cancelled) {
          setState({
            kind: "error",
            message: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    return <p data-testid="products-loading">Loading products...</p>;
  }
  if (state.kind === "error") {
    return (
      <p data-testid="products-error" className="text-red-400">
        Failed: {state.message}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Products</h1>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-testid="product-list">
        {state.products.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
          >
            <Link
              href={`/demo/products/${p.id}`}
              className="text-lg font-medium hover:underline"
              data-testid={`product-link-${p.id}`}
            >
              {p.name}
            </Link>
            <p className="mt-1 text-sm text-neutral-400">{p.description}</p>
            <p className="mt-2 text-sm text-neutral-200">
              ${p.price.toFixed(2)} {p.currency}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}