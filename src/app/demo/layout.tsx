import Link from "next/link";
import type { ReactNode } from "react";
import { CartBadge } from "@/components/demo/CartBadge";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 bg-neutral-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/demo" className="font-semibold">
              Demo Store
            </Link>
            <Link href="/demo/products" className="text-neutral-300 hover:text-white">
              Products
            </Link>
            <Link href="/demo/cart" className="text-neutral-300 hover:text-white">
              Cart
            </Link>
            <Link href="/demo/checkout" className="text-neutral-300 hover:text-white">
              Checkout
            </Link>
          </nav>
          <CartBadge />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-neutral-500">
        Controlled demo application. Not connected to any production API.
      </footer>
    </div>
  );
}