export interface BestSellerItem {
  id: string;
  name: string;
  titleLines?: [string, string];
  category: string;
  image: string;
  description?: string;
  destination: string;
  imageWidth?: string;
  imageHeight?: string;
  imagePosition?: {
    marginTop?: string;
    scale?: number;
    top?: string;
  };
}

/**
 * Editorial Best Sellers Collection data
 * Matches the reference image layout:
 * - 4 large dark green cards
 * - Overlapping realistic cutouts of:
 *   1. Anna Bouclé Sofa
 *   2. Walnut Dining Table Set
 *   3. Avery Lounge Chair
 *   4. Lena Dining Chair
 */
export const bestSellersData: BestSellerItem[] = [
  {
    id: "bs-1",
    name: "Anna Bouclé Sofa",
    titleLines: ["Anna Bouclé", "Sofa"],
    category: "SOFA",
    image: "/bestsellers/sofa-anna.webp",
    destination: "/shop/sofas",
    description: "Deep tactile comfort upholstered in textured ivory bouclé with feather cushions.",
  },
  {
    id: "bs-2",
    name: "Walnut Dining Table Set",
    titleLines: ["Walnut Dining", "Table Set"],
    category: "DINING TABLE",
    image: "/bestsellers/dining-table-walnut.webp",
    destination: "/shop/dining-tables",
    description: "Solid American walnut dining suite engineered with sculptural angled joinery.",
  },
  {
    id: "bs-3",
    name: "Avery Lounge Chair",
    titleLines: ["Avery Lounge", "Chair"],
    category: "LOUNGE CHAIR",
    image: "/bestsellers/lounge-chair-avery.webp",
    destination: "/shop/lounge-chairs",
    description: "Scalloped shell-back cocoon lounge armchair upholstered in tactile cream wool bouclé.",
  },
  {
    id: "bs-4",
    name: "Lena Dining Chair",
    titleLines: ["Lena Dining", "Chair"],
    category: "DINING CHAIR",
    image: "/bestsellers/dining-chair-lena.webp",
    destination: "/shop/dining-chairs",
    description: "Mid-century sculpted solid oak curved dining chair with a plush oatmeal cushioned seat.",
  },
];
