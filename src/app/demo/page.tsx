import Link from "next/link";

export default function DemoHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Demo Store</h1>
      <p className="text-neutral-300">
        A small controlled shopping application used to exercise the record,
        replay, verify, and certify pipeline. All responses are local.
      </p>
      <div className="flex gap-3">
        <Link
          href="/demo/products"
          className="rounded-md bg-white px-4 py-2 text-neutral-900"
        >
          Browse products
        </Link>
        <Link
          href="/demo/cart"
          className="rounded-md border border-neutral-700 px-4 py-2"
        >
          View cart
        </Link>
      </div>
    </div>
  );
}