import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface ComparisonState {
  items: Product[];
  addItem: (product: Product) => boolean;
  removeItem: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
  clearComparison: () => void;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const items = get().items;
        if (items.some((item) => item.id === product.id)) {
          return true;
        }
        if (items.length >= 4) {
          return false; // Max 4 products allowed for comparison
        }
        set({ items: [...items, product] });
        return true;
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      isInComparison: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },

      clearComparison: () => {
        set({ items: [] });
      },
    }),
    {
      name: "square-comparison-storage",
    }
  )
);
