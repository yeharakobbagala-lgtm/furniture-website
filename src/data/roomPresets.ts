export interface RoomPreset {
  id: string;
  name: string;
  category: string;
  width: number; // in meters (e.g. 5.5)
  length: number; // in meters (e.g. 4.2)
  wallColor: string;
  floorType: 'light-oak' | 'dark-walnut' | 'concrete' | 'herringbone';
  description: string;
}

export const roomPresets: RoomPreset[] = [
  {
    id: "living-standard",
    name: "Sunlit Open Living Room",
    category: "Living",
    width: 6.0,
    length: 4.8,
    wallColor: "#F4F7F2",
    floorType: "herringbone",
    description: "Spacious layout with generous wall spans ideal for curved sectionals, lounge chairs, and plinths.",
  },
  {
    id: "executive-office",
    name: "Executive Corner Study",
    category: "Office",
    width: 4.5,
    length: 4.0,
    wallColor: "#E5EDE1",
    floorType: "dark-walnut",
    description: "Quiet proportion designed for architectural desks, credenzas, and acoustic zoning.",
  },
  {
    id: "master-suite",
    name: "Sanctuary Master Bedroom",
    category: "Bedroom",
    width: 5.2,
    length: 4.5,
    wallColor: "#F8F7F0",
    floorType: "light-oak",
    description: "Serene bedroom canvas suited for low platform beds, floating nightstands, and dressing credenzas.",
  },
  {
    id: "formal-dining",
    name: "Architectural Dining Studio",
    category: "Dining",
    width: 5.5,
    length: 4.2,
    wallColor: "#F4F7F2",
    floorType: "concrete",
    description: "Centered proportion optimized for monolithic stone or solid timber 8-10 guest dining tables.",
  },
];

export interface VisualizerSampleRoom {
  id: string;
  title: string;
  type: string;
  image: string;
}

export const sampleVisualizerRooms: VisualizerSampleRoom[] = [
  {
    id: "sample-living-1",
    title: "Minimalist Loft Living Room",
    type: "Living Room",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "sample-bedroom-1",
    title: "Warm Light Modern Bedroom",
    type: "Bedroom",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "sample-dining-1",
    title: "Open Concept Dining Space",
    type: "Dining Room",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "sample-office-1",
    title: "Sunlit Studio Workspace",
    type: "Office",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  },
];
