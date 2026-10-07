"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/types/demo";

type State =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; product: Product };

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [state, setState] = useState<State>({ kind: "loading" });
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    let cancelled = false;
    async function load() {
      setState({ kind: "loading" });
      try {
        const res = await fetch(`/api/products/${params.id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { product: Product };
        if (!cancelled) setState({ kind: "ready", product: data.product });
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
  }, [params?.id]);

  async function addToCart() {
    if (state.kind !== "ready") return;
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: state.product.id, quantity: 1 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setAdded(true);
    } finally {
      setAdding(false);
    }
  }

  if (state.kind === "loading") return <p>Loading...</p>;
  if (state.kind === "error")
    return <p className="text-red-400">Failed: {state.message}</p>;

  const p = state.product;
  return (
    <div className="space-y-4">
      <Link href="/demo/products" className="text-sm text-neutral-400 hover:text-white">
        Back
      </Link>
      <h1 className="text-2xl font-semibold" data-testid="product-name">
        {p.name}
      </h1>
      <p className="text-neutral-300">{p.description}</p>
      <p className="text-lg">
        ${p.price.toFixed(2)} {p.currency}
      </p>
      <p className="text-sm text-neutral-400">
        {p.inStock ? "In stock" : "Out of stock"}
      </p>
      <button
        onClick={addToCart}
        disabled={adding || !p.inStock}
        data-testid="add-to-cart"
        className="rounded-md bg-white px-4 py-2 text-neutral-900 disabled:opacity-50"
      >
        {adding ? "Adding..." : added ? "Added" : "Add to cart"}
      </button>
    </div>
  );
}