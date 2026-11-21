import { Article } from "@/types";

export const articles: Article[] = [
  {
    id: "art-1",
    slug: "quiet-luxury-and-the-rebirth-of-warm-minimalism",
    title: "Quiet Luxury & The Rebirth of Warm Minimalism",
    excerpt: "How natural lime washes, curved bouclé, and smoked oak are transforming sterile interiors into intimate sanctuaries.",
    content: `
Interior design is undergoing a profound cultural pivot. The austere, clinical white boxes that dominated the 2010s are giving way to an aesthetic defined by emotional warmth, sensory tactility, and quiet permanence.

At Square, our design ethos has long rested on the belief that furniture is not merely functional geometry; it is the tactile interface through which we experience our daily lives. Warm minimalism does not ask you to live without possessions—it invites you to live with pieces that possess enduring integrity.

### The Return of Honest Timber
Smoked European oak, FSC-certified walnut, and fluted ash bring an unmistakable grounding rhythm to open-plan living rooms. When paired with unlacquered brass and brushed limestone, natural wood breathes life into residential spaces.

### Tactile Textiles
Bouclé, heavyweight Belgian linen, and vegetable-tanned saddle leather invite touch. These materials develop a rich patina over time, recording the quiet history of a home rather than degrading with use.

### Sculptural Proportions
Rather than filling rooms with numerous lightweight decorative items, architects are anchoring spaces around single, sculptural statements: a monolithic travertine coffee table or an asymmetrical curved sofa that invites fluid conversation.
    `,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    category: "Trends",
    author: {
      name: "Sophia Sterling",
      role: "Design Critic & Senior Editor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    date: "November 14, 2026",
    readTime: "5 min read",
    featured: true,
    tags: ["Warm Minimalism", "Interior Trends", "Living Room", "Wood Craft"],
    relatedProductIds: ["prod-1", "prod-3", "prod-7"],
  },
  {
    id: "art-2",
    slug: "architectural-dining-spaces-gathering-around-solid-timber",
    title: "Architectural Dining Spaces: Gathering Around Solid Timber",
    excerpt: "Why the dining table remains the emotional heart of the home, and how to choose proportions that elevate daily ritual.",
    content: `
Few pieces of furniture bear witness to as much of life's drama and celebration as the dining table. From morning espresso poured in morning light to late-night dinners with friends, the table is where bonds are forged.

When selecting a dining table, architectural scale and edge joinery dictate the ambiance of the entire room. A solid oak table with rounded radius edges softens the rigidity of square dining rooms, while fluted pillar pedestals maximize leg clearance for large gatherings.
    `,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80",
    category: "Interior Inspiration",
    author: {
      name: "Matteo Rossi",
      role: "Master Joinery Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    date: "October 28, 2026",
    readTime: "4 min read",
    tags: ["Dining Room", "Solid Timber", "Craftsmanship"],
    relatedProductIds: ["prod-2", "prod-4"],
  },
  {
    id: "art-3",
    slug: "designing-hybrid-workspaces-balancing-focus-and-calm",
    title: "Designing Hybrid Workspaces: Balancing Focus & Calm",
    excerpt: "Creating executive home and commercial offices that banish clinical office sterility in favor of organic warmth.",
    content: `
The modern workspace is no longer a sea of gray cubicles or makeshift kitchen counters. Commercial leaders and remote professionals alike understand that cognitive clarity is intimately connected to environmental aesthetics.

Incorporating natural timber grain, acoustic linen paneling, and tactile leather desk blotters transforms work from an exhausting chore into a focused creative ritual. Ergonomic precision does not need to look like a machine; it can look like an organic sculpture.
    `,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    category: "Design Stories",
    author: {
      name: "Kenji Takahashi",
      role: "Workspace Architect",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    date: "October 15, 2026",
    readTime: "6 min read",
    tags: ["Office", "Commercial", "Workspace", "Productivity"],
    relatedProductIds: ["prod-6", "prod-10"],
  },
  {
    id: "art-4",
    slug: "caring-for-natural-timber-and-full-grain-leather",
    title: "Caring for Natural Timber & Full-Grain Leather",
    excerpt: "Essential rituals and organic balms to ensure your heirloom furniture develops a breathtaking patina over generations.",
    content: `
Natural materials are alive. Unlike synthetic laminates and vinyls that degrade irreversibly, genuine European oak, walnut, and vegetable-tanned leather actually improve with age when treated with gentle care.

Learn our workshop's seasonal oiling techniques, optimal humidity balances, and simple daily practices to preserve the velvety tactile luster of your furniture.
    `,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
    category: "Care & Living",
    author: {
      name: "Elena Lindqvist",
      role: "Principal Furniture Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    date: "September 30, 2026",
    readTime: "4 min read",
    tags: ["Care Guide", "Wood Care", "Leather Maintenance"],
    relatedProductIds: ["prod-1", "prod-2", "prod-3"],
  },
];
