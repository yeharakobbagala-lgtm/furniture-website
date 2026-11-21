import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface RecentlyViewedState {
  items: Product[];
  addRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addRecentlyViewed: (product: Product) => {
        const filtered = get().items.filter((p) => p.id !== product.id);
        set({ items: [product, ...filtered].slice(0, 8) });
      },

      clearRecentlyViewed: () => {
        set({ items: [] });
      },
    }),
    {
      name: "square-recently-viewed-storage",
    }
  )
);
