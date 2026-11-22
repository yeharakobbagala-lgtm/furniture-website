import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, ProductColor } from "@/types";

interface CartState {
  items: CartItem[];
  deliveryMethod: "standard" | "white-glove" | "express";
  promoCode: string | null;
  discountPercentage: number;
  addItem: (
    product: Product,
    quantity?: number,
    selectedColor?: ProductColor,
    selectedMaterial?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryMethod: (method: "standard" | "white-glove" | "express") => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryMethod: "standard",
      promoCode: null,
      discountPercentage: 0,

      addItem: (product, quantity = 1, selectedColor, selectedMaterial) => {
        const color = selectedColor || product.colours[0];
        const material = selectedMaterial || product.materials[0];
        const itemId = `${product.id}-${color.name}-${material || "default"}`;

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === itemId);
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              {
                id: itemId,
                product,
                quantity,
                selectedColor: color,
                selectedMaterial: material,
              },
            ],
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discountPercentage: 0 });
      },

      setDeliveryMethod: (method) => {
        set({ deliveryMethod: method });
      },

      applyPromoCode: (code: string) => {
        const clean = code.trim().toUpperCase();
        if (clean === "SQUARE10") {
          set({ promoCode: "SQUARE10", discountPercentage: 10 });
          return true;
        }
        if (clean === "ARCHITECT15") {
          set({ promoCode: "ARCHITECT15", discountPercentage: 15 });
          return true;
        }
        return false;
      },

      removePromoCode: () => {
        set({ promoCode: null, discountPercentage: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const method = get().deliveryMethod;
        if (method === "white-glove") return 195;
        if (method === "express") return 120;
        // Free standard delivery over LKR 2,000
        return subtotal >= 2000 ? 0 : 75;
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const pct = get().discountPercentage;
        return (subtotal * pct) / 100;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const fee = get().getDeliveryFee();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal - discount + fee);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "square-cart-storage",
    }
  )
);
