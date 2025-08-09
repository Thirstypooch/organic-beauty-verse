
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../lib/schemas.ts";
import { WishlistItem, Wishlist } from "../types/cart";

interface WishlistState {
  wishlist: Wishlist;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: {
        items: [],
      },
      addToWishlist: (product) => {
        set((state) => {
          const existingItem = state.wishlist.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return state; // Item already exists in wishlist
          }

          const newItem: WishlistItem = {
            product,
            addedAt: new Date(),
          };

          return {
            wishlist: {
              items: [...state.wishlist.items, newItem],
            },
          };
        });
      },
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: {
            items: state.wishlist.items.filter(
              (item) => item.product.id !== productId
            ),
          },
        }));
      },
      isInWishlist: (productId) => {
        return get().wishlist.items.some((item) => item.product.id === productId);
      },
      clearWishlist: () => {
        set({ wishlist: { items: [] } });
      },
    }),
    {
      name: "youorganic-wishlist-storage",
    }
  )
);
