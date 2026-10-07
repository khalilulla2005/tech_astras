/**
 * Deterministic local demo data for the controlled demo application.
 *
 * INTENTIONAL BUG: The SAVE20 coupon discount is computed as
 * (subtotal + tax) * 0.20 instead of subtotal * 0.20.
 *
 * For a $129.99 keyboard:
 *   tax      = 129.99 * 0.10           = $13.00
 *   discount = (129.99 + 13.00) * 0.20 = $28.60   (WRONG)
 *   correct  = 129.99 * 0.20           = $26.00
 *
 * DO NOT FIX. This bug is required for the debugging demo.
 */

import type { Product } from "@/types/demo";

export const APPLICATION_VERSION = "1.0.0";
export const APPLICATION_COMMIT = "deterministic-demo";

const DISCOUNT_RATE = 0.2;
const TAX_RATE = 0.1;

export function computeCart(
  subtotal: number,
  couponCode?: string,
): { couponDiscount: number; tax: number; total: number } {
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;

  let couponDiscount = 0;
  if (couponCode && couponCode.trim().toUpperCase() === "SAVE20") {
    // BUG: discount applied to (subtotal + tax)
    couponDiscount = Math.round((subtotal + tax) * DISCOUNT_RATE * 100) / 100;
  }

  const total = Math.round((subtotal + tax - couponDiscount) * 100) / 100;
  return { couponDiscount, tax, total };
}

export function generateProducts(): Product[] {
  return [
    { id: "p1", name: "Mechanical Keyboard", description: "A high-quality mechanical keyboard with tactile switches.", price: 129.99, currency: "USD", imageUrl: "/demo/keyboard.png", inStock: true },
    { id: "p2", name: "Wireless Mouse", description: "An ergonomic wireless mouse with adjustable DPI.", price: 49.99, currency: "USD", imageUrl: "/demo/mouse.png", inStock: true },
    { id: "p3", name: "USB-C Hub", description: "A 7-in-1 USB-C hub with HDMI and SD card reader.", price: 79.99, currency: "USD", imageUrl: "/demo/usbhub.png", inStock: true },
    { id: "p4", name: "Monitor Stand", description: "An adjustable aluminum monitor stand with storage drawer.", price: 59.99, currency: "USD", imageUrl: "/demo/monitstand.png", inStock: true },
    { id: "p5", name: "Webcam HD", description: "A 1080p webcam with built-in microphone.", price: 89.99, currency: "USD", imageUrl: "/demo/webcam.png", inStock: false },
    { id: "p6", name: "Laptop Sleeve", description: "A padded laptop sleeve for 13-14 inch laptops.", price: 29.99, currency: "USD", imageUrl: "/demo/sleeve.png", inStock: true },
  ];
}

export function getProductById(id: string): Product | undefined {
  return generateProducts().find((p) => p.id === id);
}