export interface FurnitureItemConfig {
  id: string;
  name: string;
  category?: string;
  price?: number;
  slug?: string;
  /** Primary image asset path (supports full-canvas 1920x1080 or isolated cut-outs) */
  image: string;
  /** Optional cropped/cut-out asset path */
  croppedImage?: string;
  /** Optional 3D Model URL (.glb, .gltf, .obj, .fbx) for real-time 3D ModelViewer */
  model3dUrl?: string;
  /** Optional AI depth map URL for 2.5D interactive parallax displacement */
  depthMapUrl?: string;
  alt: string;
  /** True if the image is a 1920x1080 full canvas exported layer */
  isFullCanvas?: boolean;
  /** Fine-tune positioning for isolated furniture cut-outs */
  position?: {
    bottom?: string;
    right?: string;
    left?: string;
    top?: string;
    width?: string;
    maxWidth?: string;
    height?: string;
    transform?: string;
  };
  mobilePosition?: {
    width?: string;
    maxWidth?: string;
    height?: string;
    bottom?: string;
    right?: string;
  };
}

export interface HeroConfig {
  // Layer 1: Background
  backgroundImage: string;
  backgroundColor: string;

  // Layer 2: Organic shape
  organicShapeImage: string;
  organicShapeCropped?: string;

  // Layer 3: Main featured furniture (SWAPPABLE!)
  featuredFurniture: FurnitureItemConfig;

  // Layer 4: Side table and vase
  sideTableImage: string;
  sideTableCropped?: string;

  // Layer 5: Hanging pendant light
  pendantImage: string;
  pendantCropped?: string;

  // Layer 6: Headline
  headlineImage: string;
  headlineCropped?: string;
  headlineText: string;

  // Layer 7: Testimonial & Decorative arrow
  testimonial: {
    show: boolean;
    quote: string;
    author: string;
    role: string;
    rating: number;
    avatarUrl: string;
    arrowText?: string;
  };

  // Layer 8: Button and scroll indicator
  buttonImage: string;
  buttonCropped?: string;
  buttonLink: string;
  buttonText: string;
  scrollIndicator: {
    show: boolean;
    text: string;
  };

  // Layer 9: Navigation header
  headerAssetImage: string;
}

/**
 * Pre-configured furniture presets for easy replacement.
 * The user can swap the featured furniture simply by changing `featuredFurniture`
 * in `heroConfig` below!
 */
export const heroFurniturePresets: Record<string, FurnitureItemConfig> = {
  // Default: Photopea original wooden armchair with cushions
  "original-armchair": {
    id: "original-armchair",
    name: "Nordic Sculptural Armchair",
    category: "Lounge Seating",
    price: 1450,
    slug: "nordic-lounge-armchair",
    image: "/hero 1/New Project (20).png",
    croppedImage: "/hero 1/cropped/New Project (20)_crop.png",
    depthMapUrl: "/hero 1/cropped/New Project (20)_depth.png",
    alt: "Square Nordic Sculptural Armchair in natural oak and woven oat bouclé",
    isFullCanvas: true,
    position: {
      left: "42.5%",
      top: "22%",
      width: "41%",
      height: "64%",
    },
    mobilePosition: {
      width: "82%",
      maxWidth: "380px",
    },
  },

  // Preset 2: Curved Bouclé Sofa
  "arcadia-sofa": {
    id: "arcadia-sofa",
    name: "Arcadia Curved Bouclé Sofa",
    category: "Sofas & Seating",
    price: 3450,
    slug: "arcadia-curved-boucle-sofa",
    image: "/furniture-cutouts/prod-1.png",
    alt: "Arcadia Curved Bouclé Sofa in ivory textured boucle",
    isFullCanvas: false,
    position: {
      left: "42%",
      top: "32%",
      width: "48%",
      height: "auto",
    },
    mobilePosition: {
      width: "90%",
      maxWidth: "420px",
    },
  },

  // Preset 3: Travertine Dining Table
  "solis-travertine-table": {
    id: "solis-travertine-table",
    name: "Solis Travertine Dining Table",
    category: "Dining Tables",
    price: 4850,
    slug: "solis-travertine-dining-table",
    image: "/furniture-cutouts/prod-5.png",
    alt: "Solis Monolithic Travertine Dining Table",
    isFullCanvas: false,
    position: {
      left: "40%",
      top: "34%",
      width: "48%",
      height: "auto",
    },
    mobilePosition: {
      width: "90%",
      maxWidth: "420px",
    },
  },

  // Preset 4: Saddle Leather Lounge Armchair
  "vaster-lounge-chair": {
    id: "vaster-lounge-chair",
    name: "Väster Saddle Leather Lounge Chair",
    category: "Chairs",
    price: 1680,
    slug: "vaster-saddle-leather-lounge-chair",
    image: "/furniture-cutouts/prod-2.png",
    alt: "Väster Lounge Armchair in full-grain cognac leather",
    isFullCanvas: false,
    position: {
      left: "44%",
      top: "27%",
      width: "36%",
      height: "auto",
    },
    mobilePosition: {
      width: "80%",
      maxWidth: "360px",
    },
  },

  // Preset 6: Zephyr Sculptural Lounge Armchair
  "zephyr-sculptural-armchair": {
    id: "zephyr-sculptural-armchair",
    name: "Zephyr Sculptural Lounge Chair",
    category: "Chairs & Seating",
    price: 1850,
    slug: "zephyr-sculptural-lounge-chair",
    image: "/hero 5/hero5_composite.png",
    alt: "Square Zephyr Sculptural Lounge Chair in bentwood walnut ribbon frame with olive moss velvet cushion, glowing spiral chandelier, and solid wood side table",
    isFullCanvas: true,
  },
};

export interface HeroDecorationsConfig {
  sideTableImage?: string;
  sideTableCropped?: string;
  sideTableAlt?: string;
  sideTableStyle?: {
    right?: string;
    top?: string;
    bottom?: string;
    width?: string;
    height?: string;
  };
  pendantImage?: string;
  pendantCropped?: string;
  pendantAlt?: string;
  pendantStyle?: {
    right?: string;
    top?: string;
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
  };
  showPendant?: boolean;
}

export interface HeroFurnitureSet {
  id: string;
  title: string;
  subtitle: string;
  furniture: FurnitureItemConfig;
  decorations?: HeroDecorationsConfig;
}

export const defaultHeroFurnitureSets: HeroFurnitureSet[] = [
  {
    id: "set-1-living",
    title: "Nordic Lounge Armchair",
    subtitle: "01 • Living Room",
    furniture: heroFurniturePresets["original-armchair"],
    decorations: {
      sideTableImage: "/hero 1/New Project (19).png",
      sideTableCropped: "/hero 1/cropped/New Project (19)_crop.png",
      sideTableAlt: "Handcrafted solid wooden side table with ceramic vase and art books",
      sideTableStyle: {
        right: "0px",
        top: "26%",
        width: "23%",
        height: "42%",
      },
      pendantImage: "/hero 1/New Project (21).png",
      pendantCropped: "/hero 1/cropped/New Project (21)_crop.png",
      pendantAlt: "Hanging gold architectural pendant light fixture",
      showPendant: true,
    },
  },
  {
    id: "set-2-bedroom",
    title: "Havn Channeled Platform Bed",
    subtitle: "02 • Bedroom Suite",
    furniture: {
      id: "havn-channeled-bed",
      name: "Havn Channeled Platform Bed",
      category: "Beds & Suites",
      price: 2850,
      slug: "havn-channeled-platform-bed",
      image: "/hero 2/New Project (26).png",
      croppedImage: "/hero 2/cropped/bed_crop.png",
      alt: "Square Havn Channeled Upholstered Platform Bed in oat bouclé with terracotta throw blanket",
      isFullCanvas: true,
      position: {
        left: "32.5%",
        top: "27%",
        width: "51%",
        height: "63%",
      },
      mobilePosition: {
        width: "90%",
        maxWidth: "480px",
      },
    },
    decorations: {
      sideTableImage: "/hero 2/New Project (25).png",
      sideTableCropped: "/hero 2/cropped/nightstand_crop.png",
      sideTableAlt: "Blonde oak bedside nightstand with dome lamp and dried florals",
      sideTableStyle: {
        right: "0px",
        top: "28%",
        width: "18%",
        height: "44%",
      },
      showPendant: false,
    },
  },
  {
    id: "set-3-sofa",
    title: "Sora Nordic 2-Seater Sofa",
    subtitle: "03 • Lounge Suite",
    furniture: {
      id: "sora-nordic-sofa",
      name: "Sora Nordic 2-Seater Sofa",
      category: "Sofas & Seating",
      price: 2450,
      slug: "sora-nordic-2-seater-sofa",
      image: "/hero3/New Project (30).png",
      alt: "Square Sora Nordic 2-Seater Sofa in oatmeal textured linen with moss green velvet cushions",
      isFullCanvas: true,
    },
    decorations: {
      sideTableImage: "/hero3/New Project (31).png",
      sideTableAlt: "Solid oak tapered pedestal side table with ceramic leaf vase and art books",
      pendantImage: "/hero3/New Project (32).png",
      pendantAlt: "Retro-modern wood and brass glowing dome pendant lamp",
      showPendant: true,
    },
  },
  {
    id: "set-4-dining",
    title: "Elysian Oak Dining Suite",
    subtitle: "04 • Dining Room",
    furniture: {
      id: "elysian-oak-dining-suite",
      name: "Elysian Oak Dining Suite",
      category: "Dining & Kitchen",
      price: 3650,
      slug: "elysian-oak-dining-suite",
      image: "/hero 4/hero4_dining.png",
      alt: "Square Elysian Solid Oak Dining Table with 4 upholstered cream chairs on woven wool rug and autumn floral centerpiece",
      isFullCanvas: true,
    },
    decorations: {
      sideTableImage: "/hero 4/hero4_plant.png",
      sideTableAlt: "Lush potted broadleaf plant in textured ceramic planter",
      pendantImage: "/hero 4/hero4_lamp.png",
      pendantAlt: "Warm glowing amber dome dining pendant light fixture",
      showPendant: true,
    },
  },
  {
    id: "set-5-sculptural",
    title: "Zephyr Sculptural Lounge Chair",
    subtitle: "05 • Sculptural Suite",
    furniture: {
      id: "zephyr-sculptural-armchair",
      name: "Zephyr Sculptural Lounge Chair",
      category: "Chairs & Seating",
      price: 1850,
      slug: "zephyr-sculptural-lounge-chair",
      image: "/hero 5/hero5_composite.png",
      alt: "Square Zephyr Sculptural Lounge Chair in bentwood walnut ribbon frame with olive moss velvet cushion, glowing spiral chandelier, and solid wood side table",
      isFullCanvas: true,
    },
  },
];

/**
 * =======================================================================
 * CENTRAL HERO CONFIGURATION
 * =======================================================================
 * To change the featured furniture piece, simply change `featuredFurniture`
 * to another preset from `heroFurniturePresets` or provide a custom object:
 *
 * Example:
 *   featuredFurniture: heroFurniturePresets["arcadia-sofa"]
 *
 * All background layers, organic shapes, headlines, buttons, and decorative
 * elements will remain perfectly intact.
 */
export const defaultHeroConfig: HeroConfig = {
  // Layer 1: Light sage-green background
  backgroundImage: "/hero 1/New Project (24).png",
  backgroundColor: "#E2ECE0",

  // Layer 2: Dark-green organic decorative shape
  organicShapeImage: "/hero 1/New Project (23).png",
  organicShapeCropped: "/hero 1/cropped/New Project (23)_crop.png",

  // Layer 3: Furniture chair (Change this to replace the furniture!)
  featuredFurniture: heroFurniturePresets["original-armchair"],

  // Layer 4: Wooden side table with vase & books
  sideTableImage: "/hero 1/New Project (19).png",
  sideTableCropped: "/hero 1/cropped/New Project (19)_crop.png",

  // Layer 5: Hanging gold pendant light
  pendantImage: "/hero 1/New Project (21).png",
  pendantCropped: "/hero 1/cropped/New Project (21)_crop.png",

  // Layer 6: Headline
  headlineImage: "/hero 1/New Project (18).png",
  headlineCropped: "/hero 1/cropped/New Project (18)_crop.png",
  headlineText: "FURNITURE DESIGN MADE FOR YOU",

  // Layer 7: Customer testimonial & curved decorative arrow (Removed as requested)
  testimonial: {
    show: false,
    quote: "",
    author: "",
    role: "",
    rating: 5,
    avatarUrl: "",
    arrowText: "",
  },

  // Layer 8: Terracotta SHOW MORE button and scroll indicator
  buttonImage: "/hero 1/New Project (22).png",
  buttonCropped: "/hero 1/cropped/New Project (22)_crop.png",
  buttonLink: "/shop",
  buttonText: "SHOW MORE",
  scrollIndicator: {
    show: true,
    text: "Scroll",
  },

  // Layer 9: Navigation header asset reference
  headerAssetImage: "/hero 1/New Project (17).png",
};
