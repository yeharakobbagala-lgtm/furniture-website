export interface NewArrivalItem {
  id: string;
  name: string;
  titleLines: [string, string];
  category: string;
  image: string;
  destination: string;
  price: string;
  tag?: string;
  description?: string;
}

export const newArrivalsData: NewArrivalItem[] = [
  {
    id: "na-1",
    name: "Havn Channeled Platform Bed",
    titleLines: ["Havn Channeled", "Platform Bed"],
    category: "BEDROOM",
    image: "/newarrivals/bed-havn.webp",
    destination: "/product/havn-floating-platform-bed",
    price: "LKR 2,850",
    tag: "New Release",
    description: "Solid hardwood frame with channel-tufted bouclé headboard and terracotta throw.",
  },
  {
    id: "na-2",
    name: "Sora Nordic 2-Seater Sofa",
    titleLines: ["Sora Nordic", "2-Seater Sofa"],
    category: "SOFAS",
    image: "/newarrivals/sofa-sora.webp",
    destination: "/product/arcadia-curved-boucle-sofa",
    price: "LKR 2,450",
    tag: "New Release",
    description: "Architectural 2-seater lounge in oatmeal textured linen with moss green velvet cushions.",
  },
  {
    id: "na-3",
    name: "Nordic Sculptural Armchair",
    titleLines: ["Nordic Sculptural", "Armchair"],
    category: "LOUNGE SEATING",
    image: "/newarrivals/armchair-nordic.webp",
    destination: "/product/vaster-leather-lounge-armchair",
    price: "LKR 1,450",
    tag: "New Release",
    description: "Sculpted solid Nordic oak armchair wrapped in heavy-weave natural bouclé.",
  },
  {
    id: "na-4",
    name: "Zephyr Bentwood Lounge Chair",
    titleLines: ["Zephyr Bentwood", "Lounge Chair"],
    category: "CHAIRS",
    image: "/newarrivals/chair-zephyr.webp",
    destination: "/product/brera-sculpted-timber-dining-chair",
    price: "LKR 1,850",
    tag: "New Release",
    description: "Sculptural continuous bentwood walnut ribbon frame with plush olive moss velvet cushion.",
  },
];
