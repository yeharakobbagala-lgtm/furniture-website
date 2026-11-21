export type FurnitureStyle =
  | 'Scandinavian'
  | 'Minimalist'
  | 'Contemporary'
  | 'Mid-Century Modern'
  | 'Industrial'
  | 'Classic'
  | 'Modern Luxury';

export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'made_to_order';

export type CommercialCategory =
  | 'office'
  | 'hotel'
  | 'restaurant'
  | 'reception'
  | 'conference'
  | 'workspace';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductDimensions {
  width: number;
  depth: number;
  height: number;
  unit: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string; // e.g. "sofas", "lounge-chairs"
  categoryName: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  images: string[];
  transparentImage?: string; // High-res transparent PNG for visualizer/canvas
  plannerType?: 'sofa' | 'chair' | 'table' | 'bed' | 'storage' | 'desk' | 'plant' | 'rug';
  colours: ProductColor[];
  materials: string[];
  dimensions: ProductDimensions;
  rating: number;
  reviewCount: number;
  tags: string[];
  style: FurnitureStyle;
  availability: AvailabilityStatus;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  suitableFor: ('residential' | 'commercial')[];
  commercialCategories?: CommercialCategory[];
  designerId?: string;
  designerName?: string;
  collectionId?: string;
  specifications: ProductSpecification[];
  reviews: Review[];
  deliveryInfo?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  bannerImage: string;
  featured?: boolean;
}

export interface Designer {
  id: string;
  slug: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  portraitImage: string;
  coverImage: string;
  biography: string;
  philosophy: string;
  speciality: string;
  featuredCollections: string[];
  productIds: string[];
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  designerName?: string;
  productCount: number;
  style: FurnitureStyle;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Trends' | 'Interior Inspiration' | 'Design Stories' | 'Care & Living';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
  relatedProductIds?: string[];
}

export interface CartItem {
  id: string; // unique item id (productId + color + material)
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
  selectedMaterial?: string;
}

export interface CommercialQuoteItem {
  product: Product;
  quantity: number;
  selectedColor?: ProductColor;
  customNotes?: string;
}

export interface RoomItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  x: number; // in canvas pixels
  y: number; // in canvas pixels
  width: number; // in canvas pixels
  height: number; // in canvas pixels (depth)
  realWidthCm?: number; // Real physical dimension in cm
  realDepthCm?: number; // Real physical depth in cm
  realHeightCm?: number; // Real physical height in cm
  rotation: number; // in degrees 0-360
  colorHex?: string;
  image?: string;
  transparentImage?: string;
  zIndex: number;
}

export type WallSide = 'top' | 'bottom' | 'left' | 'right';

export interface RoomDoor {
  id: string;
  name: string;
  type: 'single' | 'double' | 'sliding';
  wall: WallSide;
  offset: number; // in meters along the wall from the wall's start
  width: number; // in meters (e.g. 0.9m)
  swing: 'inside' | 'outside';
}

export interface RoomWindow {
  id: string;
  name: string;
  type: 'standard' | 'large' | 'casement';
  wall: WallSide;
  offset: number; // in meters along the wall from the wall's start
  width: number; // in meters (e.g. 1.2m)
  height?: number; // in meters
}

export interface CollisionWarning {
  type: 'overlap' | 'boundary' | 'clearance' | 'door-blocked';
  message: string;
  itemIds: string[];
  severity: 'warning' | 'critical';
}

export interface VisualizerPlacedItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  flipX: boolean;
  zIndex: number;
  transparentImage: string;
}

export interface QuizAnswerOption {
  id: string;
  label: string;
  sublabel?: string;
  image: string;
  styleScores: Partial<Record<FurnitureStyle, number>>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  description: string;
  options: QuizAnswerOption[];
}

export interface StyleQuizResult {
  style: FurnitureStyle;
  title: string;
  tagline: string;
  description: string;
  colorPalette: { name: string; hex: string }[];
  materials: string[];
  keyCharacteristics: string[];
  recommendedCategoryIds: string[];
}
