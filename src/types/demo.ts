/**
 * Types for the controlled demo application.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  couponDiscount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface CheckoutResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
}