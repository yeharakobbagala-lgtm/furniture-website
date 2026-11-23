import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RoomItem, RoomDoor, RoomWindow, WallSide } from "@/types";

export type FloorFinishType =
  | "light-oak"
  | "dark-walnut"
  | "concrete"
  | "herringbone"
  | "marble"
  | "terrazzo";

export type WallFinishType =
  | "warm-linen"
  | "sage-mist"
  | "studio-white"
  | "smoked-forest";

interface RoomDesignerState {
  roomName: string;
  roomWidth: number; // in meters (e.g. 5.5)
  roomLength: number; // in meters (e.g. 4.2)
  wallHeight: number; // in meters (e.g. 2.8)
  wallThickness: number; // in meters (e.g. 0.15)
  wallColor: string;
  wallFinish: WallFinishType;
  floorType: FloorFinishType;
  gridVisible: boolean;
  gridSnap: boolean;
  gridSnapSize: number; // in meters (e.g. 0.05 = 5cm, 0.1 = 10cm, 0.25 = 25cm)
  zoom: number;
  viewMode: "2d" | "3d";
  activeTool: "select" | "pan" | "door" | "window" | "measure";

  items: RoomItem[];
  doors: RoomDoor[];
  windows: RoomWindow[];

  selectedItemId: string | null;
  selectedDoorId: string | null;
  selectedWindowId: string | null;

  // History for Undo/Redo
  past: {
    items: RoomItem[];
    doors: RoomDoor[];
    windows: RoomWindow[];
    roomWidth: number;
    roomLength: number;
  }[];
  future: {
    items: RoomItem[];
    doors: RoomDoor[];
    windows: RoomWindow[];
    roomWidth: number;
    roomLength: number;
  }[];

  // Actions
  setRoomDimensions: (width: number, length: number) => void;
  setWallHeight: (height: number) => void;
  setWallThickness: (thickness: number) => void;
  setWallColor: (color: string) => void;
  setWallFinish: (finish: WallFinishType) => void;
  setFloorType: (floor: FloorFinishType) => void;
  setGridVisible: (visible: boolean) => void;
  setGridSnap: (snap: boolean) => void;
  setGridSnapSize: (size: number) => void;
  setZoom: (zoom: number) => void;
  setViewMode: (mode: "2d" | "3d") => void;
  setActiveTool: (tool: "select" | "pan" | "door" | "window" | "measure") => void;

  selectItem: (id: string | null) => void;
  selectDoor: (id: string | null) => void;
  selectWindow: (id: string | null) => void;

  addItem: (item: Omit<RoomItem, "id" | "zIndex">) => void;
  updateItemPosition: (id: string, x: number, y: number) => void;
  updateItemRotation: (id: string, rotation: number) => void;
  updateItemSize: (id: string, width: number, height: number) => void;
  updateItemColor: (id: string, colorHex: string) => void;
  duplicateItem: (id: string) => void;
  removeItem: (id: string) => void;

  addDoor: (door: Omit<RoomDoor, "id">) => void;
  updateDoor: (id: string, updates: Partial<RoomDoor>) => void;
  removeDoor: (id: string) => void;

  addWindow: (window: Omit<RoomWindow, "id">) => void;
  updateWindow: (id: string, updates: Partial<RoomWindow>) => void;
  removeWindow: (id: string) => void;

  resetRoom: () => void;
  loadPreset: (preset: {
    name: string;
    width: number;
    length: number;
    wallColor: string;
    floorType: FloorFinishType;
    doors?: RoomDoor[];
    windows?: RoomWindow[];
    items?: RoomItem[];
  }) => void;

  undo: () => void;
  redo: () => void;
}

export const useRoomDesignerStore = create<RoomDesignerState>()(
  persist(
    (set, get) => ({
      roomName: "Square Studio Suite",
      roomWidth: 5.2,
      roomLength: 4.5,
      wallHeight: 2.8,
      wallThickness: 0.15,
      wallColor: "#F4F7F2",
      wallFinish: "warm-linen",
      floorType: "light-oak",
      gridVisible: true,
      gridSnap: true,
      gridSnapSize: 0.1, // 10 cm snapping
      zoom: 1,
      viewMode: "2d",
      activeTool: "select",

      items: [
        {
          id: "item-default-1",
          productId: "prod-1",
          name: "Arcadia Curved Bouclé Sofa",
          category: "sofas",
          x: 140,
          y: 173,
          width: 240, // 240 cm = 240 px
          height: 105, // 105 cm = 105 px
          realWidthCm: 240,
          realDepthCm: 105,
          realHeightCm: 78,
          rotation: 0,
          colorHex: "#F8F7F0",
          zIndex: 1,
        },
      ],

      doors: [
        {
          id: "door-default-1",
          name: "Interior Passage Door",
          type: "single",
          wall: "bottom",
          offset: 0.6,
          width: 0.9,
          swing: "inside",
        },
      ],

      windows: [
        {
          id: "win-default-1",
          name: "Panoramic Picture Window",
          type: "large",
          wall: "top",
          offset: 1.5,
          width: 2.2,
          height: 1.8,
        },
      ],

      selectedItemId: "item-default-1",
      selectedDoorId: null,
      selectedWindowId: null,

      past: [],
      future: [],

      setRoomDimensions: (width, length) => {
        const { items, doors, windows, roomWidth, roomLength, past } = get();
        set({
          past: [...past, { items, doors, windows, roomWidth, roomLength }],
          future: [],
          roomWidth: Math.max(2.5, Math.min(15, width)),
          roomLength: Math.max(2.5, Math.min(15, length)),
        });
      },

      setWallHeight: (height) => set({ wallHeight: height }),
      setWallThickness: (thickness) => set({ wallThickness: thickness }),
      setWallColor: (wallColor) => set({ wallColor }),
      setWallFinish: (wallFinish) => set({ wallFinish }),
      setFloorType: (floorType) => set({ floorType }),
      setGridVisible: (gridVisible) => set({ gridVisible }),
      setGridSnap: (gridSnap) => set({ gridSnap }),
      setGridSnapSize: (gridSnapSize) => set({ gridSnapSize }),
      setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.4), 3.0) }),
      setViewMode: (viewMode) => set({ viewMode }),
      setActiveTool: (activeTool) => set({ activeTool }),

      selectItem: (id) =>
        set({
          selectedItemId: id,
          selectedDoorId: null,
          selectedWindowId: null,
        }),

      selectDoor: (id) =>
        set({
          selectedDoorId: id,
          selectedItemId: null,
          selectedWindowId: null,
        }),

      selectWindow: (id) =>
        set({
          selectedWindowId: id,
          selectedItemId: null,
          selectedDoorId: null,
        }),

      addItem: (itemData) => {
        const state = get();
        const currentItems = state.items;
        const newItem: RoomItem = {
          ...itemData,
          id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          zIndex: currentItems.length + 1,
        };

        set({
          past: [
            ...state.past,
            {
              items: currentItems,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          items: [...currentItems, newItem],
          selectedItemId: newItem.id,
          selectedDoorId: null,
          selectedWindowId: null,
        });
      },

      updateItemPosition: (id, x, y) => {
        const state = get();
        set({
          items: state.items.map((item) =>
            item.id === id ? { ...item, x, y } : item
          ),
        });
      },

      updateItemRotation: (id, rotation) => {
        const state = get();
        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          items: state.items.map((item) =>
            item.id === id ? { ...item, rotation: (rotation + 360) % 360 } : item
          ),
        });
      },

      updateItemSize: (id, width, height) => {
        const state = get();
        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          items: state.items.map((item) =>
            item.id === id ? { ...item, width, height, realWidthCm: width, realDepthCm: height } : item
          ),
        });
      },

      updateItemColor: (id, colorHex) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, colorHex } : item
          ),
        }));
      },

      duplicateItem: (id) => {
        const state = get();
        const target = state.items.find((i) => i.id === id);
        if (!target) return;

        const copy: RoomItem = {
          ...target,
          id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          x: target.x + 20,
          y: target.y + 20,
          zIndex: state.items.length + 1,
        };

        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          items: [...state.items, copy],
          selectedItemId: copy.id,
        });
      },

      removeItem: (id) => {
        const state = get();
        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          items: state.items.filter((item) => item.id !== id),
          selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
        });
      },

      addDoor: (doorData) => {
        const state = get();
        const newDoor: RoomDoor = {
          ...doorData,
          id: `door-${Date.now()}`,
        };
        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          doors: [...state.doors, newDoor],
          selectedDoorId: newDoor.id,
          selectedItemId: null,
          selectedWindowId: null,
        });
      },

      updateDoor: (id, updates) => {
        set((state) => ({
          doors: state.doors.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }));
      },

      removeDoor: (id) => {
        const state = get();
        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          doors: state.doors.filter((d) => d.id !== id),
          selectedDoorId: state.selectedDoorId === id ? null : state.selectedDoorId,
        });
      },

      addWindow: (windowData) => {
        const state = get();
        const newWindow: RoomWindow = {
          ...windowData,
          id: `win-${Date.now()}`,
        };
        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          windows: [...state.windows, newWindow],
          selectedWindowId: newWindow.id,
          selectedItemId: null,
          selectedDoorId: null,
        });
      },

      updateWindow: (id, updates) => {
        set((state) => ({
          windows: state.windows.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        }));
      },

      removeWindow: (id) => {
        const state = get();
        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          windows: state.windows.filter((w) => w.id !== id),
          selectedWindowId: state.selectedWindowId === id ? null : state.selectedWindowId,
        });
      },

      resetRoom: () => {
        const state = get();
        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          items: [],
          doors: [],
          windows: [],
          selectedItemId: null,
          selectedDoorId: null,
          selectedWindowId: null,
        });
      },

      loadPreset: (preset) => {
        const state = get();
        set({
          past: [
            ...state.past,
            {
              items: state.items,
              doors: state.doors,
              windows: state.windows,
              roomWidth: state.roomWidth,
              roomLength: state.roomLength,
            },
          ],
          future: [],
          roomName: preset.name,
          roomWidth: preset.width,
          roomLength: preset.length,
          wallColor: preset.wallColor,
          floorType: preset.floorType,
          doors: preset.doors || [
            {
              id: `door-${Date.now()}`,
              name: "Standard Door",
              type: "single",
              wall: "bottom",
              offset: 0.8,
              width: 0.9,
              swing: "inside",
            },
          ],
          windows: preset.windows || [
            {
              id: `win-${Date.now()}`,
              name: "Panoramic Window",
              type: "large",
              wall: "top",
              offset: 1.5,
              width: 2.0,
            },
          ],
          items: preset.items || [],
          selectedItemId: null,
          selectedDoorId: null,
          selectedWindowId: null,
        });
      },

      undo: () => {
        const { past, future, items, doors, windows, roomWidth, roomLength } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        set({
          past: newPast,
          future: [{ items, doors, windows, roomWidth, roomLength }, ...future],
          items: previous.items,
          doors: previous.doors,
          windows: previous.windows,
          roomWidth: previous.roomWidth,
          roomLength: previous.roomLength,
          selectedItemId: null,
          selectedDoorId: null,
          selectedWindowId: null,
        });
      },

      redo: () => {
        const { past, future, items, doors, windows, roomWidth, roomLength } = get();
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);

        set({
          past: [...past, { items, doors, windows, roomWidth, roomLength }],
          future: newFuture,
          items: next.items,
          doors: next.doors,
          windows: next.windows,
          roomWidth: next.roomWidth,
          roomLength: next.roomLength,
          selectedItemId: null,
          selectedDoorId: null,
          selectedWindowId: null,
        });
      },
    }),
    {
      name: "square-room-designer-storage",
      partialize: (state) => ({
        roomName: state.roomName,
        roomWidth: state.roomWidth,
        roomLength: state.roomLength,
        wallHeight: state.wallHeight,
        wallThickness: state.wallThickness,
        wallColor: state.wallColor,
        wallFinish: state.wallFinish,
        floorType: state.floorType,
        items: state.items,
        doors: state.doors,
        windows: state.windows,
      }),
    }
  )
);
