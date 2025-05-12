
import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Wishlist {
  items: WishlistItem[];
}
