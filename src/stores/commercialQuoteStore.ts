import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CommercialCategory, CommercialQuoteItem, Product, ProductColor } from "@/types";

export interface CommercialQuoteSubmission {
  id: string;
  quoteNumber: string;
  date: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  projectType: CommercialCategory | string;
  projectScope: string;
  targetTimeline: string;
  estimatedBudget: string;
  items: CommercialQuoteItem[];
  status: "Under Review" | "Proposal Generated" | "Finalized";
  notes?: string;
}

interface CommercialQuoteState {
  items: CommercialQuoteItem[];
  submissions: CommercialQuoteSubmission[];
  addItem: (product: Product, quantity?: number, selectedColor?: ProductColor, customNotes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearItems: () => void;
  submitQuote: (details: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    projectType: string;
    projectScope: string;
    targetTimeline: string;
    estimatedBudget: string;
    notes?: string;
  }) => CommercialQuoteSubmission;
}

export const useCommercialQuoteStore = create<CommercialQuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      submissions: [
        {
          id: "quote-1",
          quoteNumber: "RFQ-2026-4401",
          date: "November 14, 2026",
          companyName: "Luminary Hospitality Group",
          contactName: "Marcus Sterling",
          email: "m.sterling@luminaryhotels.com",
          phone: "+1 (555) 789-2341",
          projectType: "hotel",
          projectScope: "45 Guest Suites & Presidential Lounge",
          targetTimeline: "Q1 2027",
          estimatedBudget: "LKR 120,000 - LKR 180,000",
          status: "Under Review",
          items: [],
          notes: "Need custom Martindale rub count test certification for boutique seaside climate.",
        },
      ],

      addItem: (product, quantity = 5, selectedColor, customNotes) => {
        set((state) => {
          const index = state.items.findIndex((item) => item.product.id === product.id);
          if (index > -1) {
            const updated = [...state.items];
            updated[index].quantity += quantity;
            if (customNotes) updated[index].customNotes = customNotes;
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                selectedColor: selectedColor || product.colours[0],
                customNotes,
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearItems: () => {
        set({ items: [] });
      },

      submitQuote: (details) => {
        const quoteNumber = `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const dateStr = new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        const newSubmission: CommercialQuoteSubmission = {
          ...details,
          id: `quote-${Date.now()}`,
          quoteNumber,
          date: dateStr,
          items: [...get().items],
          status: "Under Review",
        };

        set((state) => ({
          submissions: [newSubmission, ...state.submissions],
          items: [],
        }));

        return newSubmission;
      },
    }),
    {
      name: "square-commercial-quote-storage",
    }
  )
);
