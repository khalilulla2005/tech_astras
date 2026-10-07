import { Suspense } from "react";
import ProductDetailClient from "./product-client";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<p>Loading product...</p>}>
      <ProductDetailClient />
    </Suspense>
  );
}