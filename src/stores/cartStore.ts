
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../types/product";
import { CartItem, Cart } from "../types/cart";

interface CartState {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        subtotal: 0,
      },
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.cart.items.findIndex(
            (item) => item.product.id === product.id
          );

          let updatedItems;
          if (existingItemIndex >= 0) {
            // Update quantity if item already exists
            updatedItems = [...state.cart.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + quantity,
            };
          } else {
            // Add new item to cart
            updatedItems = [...state.cart.items, { product, quantity }];
          }

          // Calculate new subtotal
          const subtotal = updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );

          return { cart: { items: updatedItems, subtotal } };
        });
      },
      removeFromCart: (productId) => {
        set((state) => {
          const updatedItems = state.cart.items.filter(
            (item) => item.product.id !== productId
          );

          // Calculate new subtotal
          const subtotal = updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );

          return { cart: { items: updatedItems, subtotal } };
        });
      },
      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return state;
          }

          const updatedItems = state.cart.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          );

          // Calculate new subtotal
          const subtotal = updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );

          return { cart: { items: updatedItems, subtotal } };
        });
      },
      clearCart: () => {
        set({ cart: { items: [], subtotal: 0 } });
      },
      getTotal: () => {
        return get().cart.subtotal;
      },
      getTotalItems: () => {
        return get().cart.items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "youorganic-cart-storage",
    }
  )
);
