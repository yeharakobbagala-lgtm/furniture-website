import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FurnitureStyle, StyleQuizResult } from "@/types";

export interface SavedAddress {
  id: string;
  isDefault: boolean;
  fullName: string;
  company?: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color: string;
  }[];
  total: number;
  status: "Confirmed" | "In Production" | "Dispatched" | "Delivered";
  shippingAddress: SavedAddress;
  estimatedDelivery: string;
}

interface UserState {
  isLoggedIn: boolean;
  customerType: "residential" | "commercial";
  user: {
    name: string;
    email: string;
    companyName?: string;
    phone?: string;
  } | null;
  addresses: SavedAddress[];
  orders: MockOrder[];
  styleQuizResult: StyleQuizResult | null;
  savedDesigns: {
    id: string;
    name: string;
    date: string;
    itemCount: number;
    roomType: string;
  }[];

  login: (email: string, name?: string, companyName?: string, isCommercial?: boolean) => void;
  logout: () => void;
  setCustomerType: (type: "residential" | "commercial") => void;
  saveQuizResult: (result: StyleQuizResult) => void;
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  removeAddress: (id: string) => void;
  addOrder: (order: Omit<MockOrder, "id" | "orderNumber" | "date">) => MockOrder;
  saveRoomDesign: (name: string, itemCount: number, roomType: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      customerType: "residential",
      user: null,
      addresses: [
        {
          id: "addr-1",
          isDefault: true,
          fullName: "Alexander Wright",
          company: "Wright Studio",
          street: "742 Evergreen Terrace",
          apartment: "Suite 4B",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "United States",
          phone: "+1 (555) 349-2810",
        },
      ],
      orders: [
        {
          id: "ord-1",
          orderNumber: "SQ-2026-8910",
          date: "November 10, 2026",
          status: "In Production",
          total: 3450,
          estimatedDelivery: "November 25, 2026",
          shippingAddress: {
            id: "addr-1",
            isDefault: true,
            fullName: "Alexander Wright",
            street: "742 Evergreen Terrace",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "United States",
            phone: "+1 (555) 349-2810",
          },
          items: [
            {
              productId: "prod-1",
              name: "Arcadia Curved Bouclé Sofa",
              price: 3450,
              quantity: 1,
              image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
              color: "Ivory Cloud",
            },
          ],
        },
      ],
      styleQuizResult: null,
      savedDesigns: [
        {
          id: "des-save-1",
          name: "Main Living Room Layout v1",
          date: "November 15, 2026",
          itemCount: 4,
          roomType: "Sunlit Open Living Room",
        },
      ],

      login: (email, name = "Alexander Wright", companyName, isCommercial = false) => {
        set({
          isLoggedIn: true,
          customerType: isCommercial ? "commercial" : "residential",
          user: {
            email,
            name,
            companyName: companyName || (isCommercial ? "Studio Architecture Ltd" : undefined),
            phone: "+1 (555) 349-2810",
          },
        });
      },

      logout: () => {
        set({ isLoggedIn: false, user: null });
      },

      setCustomerType: (type) => {
        set({ customerType: type });
      },

      saveQuizResult: (result) => {
        set({ styleQuizResult: result });
      },

      addAddress: (addressData) => {
        const newAddress: SavedAddress = {
          ...addressData,
          id: `addr-${Date.now()}`,
        };
        set((state) => ({
          addresses: [...state.addresses, newAddress],
        }));
      },

      removeAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }));
      },

      addOrder: (orderData) => {
        const orderNumber = `SQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const dateStr = new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        const newOrder: MockOrder = {
          ...orderData,
          id: `ord-${Date.now()}`,
          orderNumber,
          date: dateStr,
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
        return newOrder;
      },

      saveRoomDesign: (name, itemCount, roomType) => {
        const design = {
          id: `des-save-${Date.now()}`,
          name,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          itemCount,
          roomType,
        };
        set((state) => ({
          savedDesigns: [design, ...state.savedDesigns],
        }));
      },
    }),
    {
      name: "square-user-storage",
    }
  )
);
