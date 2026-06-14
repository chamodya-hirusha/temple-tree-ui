export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  comparePrice: number;
  rating: number;
  reviews: number;
  sold: number;
  stock: number;
  sku: string;
  badge?: "Free Shipping" | "Express" | "Bestseller" | "New";
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
};

const img = (id: string, w = 800) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const index = (Math.abs(hash) % 20) + 1;
  return `/assets/product-${index}.png`;
};

export type SubcategoryItem = {
  name: string;
  items?: string[];
};

export type CategoryItem = {
  name: string;
  icon: string;
  subcategories: (string | SubcategoryItem)[];
};

export const CATEGORIES: CategoryItem[] = [
  { 
    name: "Traditional Handicrafts", 
    icon: "Palette", 
    subcategories: [
      { name: "Masks", items: ["Kolam Masks", "Raksha Masks", "Sanni Masks"] }, 
      { name: "Wooden Statues", items: ["Buddha Statues", "Elephant Carvings", "Abstract Art"] }, 
      "Brassware"
    ] 
  },
  { 
    name: "Antique & Vintage Ceylon", 
    icon: "Clock", 
    subcategories: [
      { name: "Coins", items: ["Dutch Era", "British Era", "Ancient Sinhala"] }, 
      "Furniture", 
      "Manuscripts"
    ] 
  },
  { name: "Handloom & Textiles", icon: "Shirt", subcategories: ["Sarees", "Sarongs", "Table Runners"] },
  { name: "Ayurveda & Natural Products", icon: "Leaf", subcategories: ["Oils", "Soaps", "Herbal Supplements"] },
  { name: "Ceylon Tea Collection", icon: "Coffee", subcategories: ["Black Tea", "Green Tea", "White Tea"] },
  { name: "Home & Living", icon: "Sofa", subcategories: ["Furniture", "Decor", "Kitchenware"] },
  { name: "Souvenirs & Gifts", icon: "Gift", subcategories: ["Keychains", "Magnets", "Miniatures"] },
  { name: "Jewelry & Accessories", icon: "Gem", subcategories: ["Rings", "Necklaces", "Bracelets"] },
  { name: "Village Artisan Collections", icon: "Flame", subcategories: ["Pottery", "Weaving", "Woodwork"] },
  { name: "Limited Heritage Collection", icon: "Sparkles", subcategories: ["Rare Artifacts", "Museum Replicas", "Heirlooms"] },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Hand-Carved Yaka Mask — Traditional Kolam Art",
    brand: "CeylonArtisan",
    category: "Traditional Handicrafts",
    price: 120,
    comparePrice: 180,
    rating: 4.8,
    reviews: 341,
    sold: 1200,
    stock: 12,
    sku: "CA-YAKA-01",
    badge: "Bestseller",
    images: [img("mask1"), img("mask2"), img("mask3")],
    description: "Authentic hand-carved wooden devil mask used in traditional Sri Lankan Kolam dances. Crafted from sustainable Kaduru wood and painted with natural pigments.",
    specs: [
      { label: "Material", value: "Kaduru Wood" },
      { label: "Origin", value: "Ambalangoda" },
      { label: "Craft", value: "Hand-painted" },
    ],
  },
  {
    id: "p2",
    title: "Antique Brass Pahana — Traditional Oil Lamp",
    brand: "HeritageBrass",
    category: "Antique & Vintage Ceylon",
    price: 350,
    comparePrice: 420,
    rating: 4.9,
    reviews: 182,
    sold: 400,
    stock: 8,
    sku: "HB-PAHANA-LG",
    badge: "New",
    images: [img("brass1"), img("brass2"), img("brass3")],
    description: "A heavy, ornately decorated traditional brass oil lamp. Symbolizes prosperity and light in Sri Lankan culture. Perfect for cultural events or luxurious home decor.",
    specs: [
      { label: "Material", value: "Solid Brass" },
      { label: "Height", value: "3.5 Feet" },
      { label: "Weight", value: "12kg" },
    ],
  },
  {
    id: "p3",
    title: "Premium Handloom Saree — Cinnamon & Gold",
    brand: "LoomCeylon",
    category: "Handloom & Textiles",
    price: 85,
    comparePrice: 120,
    rating: 4.9,
    reviews: 440,
    sold: 880,
    stock: 25,
    sku: "LC-SAREE-CG",
    badge: "Express",
    images: [img("loom1"), img("loom2"), img("loom3")],
    description: "Elegant 100% cotton handloom saree with intricate traditional motifs. Woven by skilled artisans in rural villages using heritage techniques.",
    specs: [
      { label: "Material", value: "100% Cotton" },
      { label: "Length", value: "6 Yards" },
      { label: "Care", value: "Dry clean only" },
    ],
  },
  {
    id: "p4",
    title: "Ayurvedic Wellness Kit — Herbal Oils & Soaps",
    brand: "NatureLanka",
    category: "Ayurvedic & Natural Products",
    price: 45,
    comparePrice: 65,
    rating: 4.7,
    reviews: 612,
    sold: 1980,
    stock: 150,
    sku: "NL-WELL-KIT",
    badge: "Free Shipping",
    images: [img("ayur1"), img("ayur2"), img("ayur3")],
    description: "Complete holistic wellness kit featuring organic Sandalwood soap, pure King Coconut oil, and Gotukola herbal extracts for rejuvenation.",
    specs: [
      { label: "Contents", value: "5 items" },
      { label: "Type", value: "100% Organic" },
      { label: "Cruelty Free", value: "Yes" },
    ],
  },
  {
    id: "p5",
    title: "Luxury Ceylon Tea Hamper — Silver Tips",
    brand: "CeylonBrew",
    category: "Ceylon Tea Collection",
    price: 150,
    comparePrice: 190,
    rating: 4.8,
    reviews: 312,
    sold: 410,
    stock: 45,
    sku: "CB-HAMPER-ST",
    badge: "Express",
    images: [img("tea1"), img("tea2"), img("tea3")],
    description: "Exclusive selection of Nuwara Eliya Silver Tips and rare Uva black teas, packaged in a handcrafted wooden gift box.",
    specs: [
      { label: "Weight", value: "500g Total" },
      { label: "Grade", value: "Premium Silver Tips" },
      { label: "Packaging", value: "Wooden Box" },
    ],
  },
  {
    id: "p6",
    title: "Rustic Teak Wood Elephant Carving",
    brand: "CeylonArtisan",
    category: "Home & Living",
    price: 210,
    comparePrice: 260,
    rating: 4.9,
    reviews: 120,
    sold: 300,
    stock: 5,
    sku: "CA-ELEPHANT-TK",
    badge: "Bestseller",
    images: [img("wood1"), img("wood2"), img("wood3")],
    description: "A masterful hand-carved solid teak wood elephant, showcasing the majestic wildlife of Sri Lanka and traditional craftsmanship.",
    specs: [
      { label: "Material", value: "Teak Wood" },
      { label: "Size", value: "12x10 inches" },
      { label: "Finish", value: "Natural Polish" },
    ],
  },
  {
    id: "p7",
    title: "Cultural Gift Box — Spices & Miniature Crafts",
    brand: "IsleGifts",
    category: "Souvenirs & Gifts",
    price: 65,
    comparePrice: 90,
    rating: 4.6,
    reviews: 540,
    sold: 1200,
    stock: 80,
    sku: "IG-BOX-CULT",
    badge: "Free Shipping",
    images: [img("gift1"), img("gift2"), img("gift3")],
    description: "The perfect taste of Sri Lanka featuring premium cinnamon quills, cardamom, and a miniature wooden Tuk-Tuk replica.",
    specs: [
      { label: "Contents", value: "Spices & Craft" },
      { label: "Ideal for", value: "Souvenirs" },
    ],
  },
  {
    id: "p8",
    title: "Ceylon Blue Sapphire Silver Ring",
    brand: "JewelLanka",
    category: "Jewelry & Accessories",
    price: 599,
    comparePrice: 850,
    rating: 4.9,
    reviews: 85,
    sold: 120,
    stock: 3,
    sku: "JL-SAPPHIRE-R",
    badge: "Express",
    images: [img("gem1"), img("gem2"), img("gem3")],
    description: "Stunning authentic Ceylon Blue Sapphire set in a handcrafted 925 Sterling Silver ring. Ethically sourced from Ratnapura.",
    specs: [
      { label: "Gemstone", value: "Blue Sapphire" },
      { label: "Metal", value: "925 Silver" },
      { label: "Certification", value: "Included" },
    ],
  },
  {
    id: "p9",
    title: "Dumbara Woven Wall Hanging",
    brand: "VillageWeave",
    category: "Village Artisan Collections",
    price: 110,
    comparePrice: 150,
    rating: 4.7,
    reviews: 98,
    sold: 210,
    stock: 14,
    sku: "VW-DUMBARA-W",
    badge: "Free Shipping",
    images: [img("weave1"), img("weave2"), img("weave3")],
    description: "Intricate Dumbara weaving from the central highlands. Features traditional geometric patterns, woven entirely by hand using natural agave fibers.",
    specs: [
      { label: "Material", value: "Agave Fiber" },
      { label: "Size", value: "40x60 cm" },
      { label: "Origin", value: "Dumbara Valley" },
    ],
  },
  {
    id: "p10",
    title: "Museum-Grade Antique Betel Nut Cracker",
    brand: "HeritageCollect",
    category: "Limited Heritage Collection",
    price: 850,
    comparePrice: 1200,
    rating: 5.0,
    reviews: 12,
    sold: 15,
    stock: 1,
    sku: "HC-GIRAYA-ANT",
    badge: "Bestseller",
    images: [img("ant1"), img("ant2"), img("ant3")],
    description: "A highly rare 19th-century Giraya (Betel Nut Cracker) featuring intricate silver and brass inlay work. A true collector's piece of Ceylon history.",
    specs: [
      { label: "Era", value: "Late 19th Century" },
      { label: "Material", value: "Steel & Silver Inlay" },
      { label: "Condition", value: "Preserved Antique" },
    ],
  },
  {
    id: "p11",
    title: "Hand-Painted Batik Wall Art",
    brand: "CeylonArtisan",
    category: "Handloom & Textiles",
    price: 180,
    comparePrice: 250,
    rating: 4.5,
    reviews: 340,
    sold: 620,
    stock: 24,
    sku: "CA-BATIK-ART",
    badge: "New",
    images: [img("batik1"), img("batik2"), img("batik3")],
    description: "Vibrant handcrafted Batik tapestry depicting a traditional Perahera (elephant procession). Made using the ancient wax-resist dyeing technique.",
    specs: [
      { label: "Material", value: "100% Cotton" },
      { label: "Size", value: "3x4 Feet" },
    ],
  },
  {
    id: "p12",
    title: "Terracotta Clay Cooking Pots Set",
    brand: "NatureLanka",
    category: "Pottery & Clay",
    price: 55,
    comparePrice: 80,
    rating: 4.8,
    reviews: 510,
    sold: 1180,
    stock: 45,
    sku: "NL-CLAY-SET",
    badge: "Express",
    images: [img("clay1"), img("clay2"), img("clay3")],
    description: "Authentic Sri Lankan terracotta cooking pots. Perfect for slow-cooking traditional curries, enhancing flavor and retaining nutrients.",
    specs: [
      { label: "Material", value: "Natural Clay" },
      { label: "Set", value: "3 Pots & Lids" },
      { label: "Care", value: "Handwash only" },
    ],
  },
];

export const FLASH_SALE = PRODUCTS.slice(0, 8);
export const JUST_FOR_YOU = PRODUCTS;

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";
export type Order = {
  id: string;
  customer: string;
  email: string;
  address: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: { productId: string; title: string; qty: number; price: number; image: string }[];
};

export const ORDERS: Order[] = [
  {
    id: "ORD-10245",
    customer: "Emily Carter",
    email: "emily.c@example.com",
    address: "221B Baker Street, London, UK",
    date: "2026-05-18",
    total: 378,
    status: "Pending",
    items: [
      { productId: "p1", title: "AuraSound Pro Max", qty: 1, price: 249, image: PRODUCTS[0].images[0] },
      { productId: "p7", title: "AuraSound Mini Buds 3", qty: 1, price: 129, image: PRODUCTS[6].images[0] },
    ],
  },
  {
    id: "ORD-10244",
    customer: "James Wong",
    email: "james.w@example.com",
    address: "12 Orchard Road, Singapore",
    date: "2026-05-18",
    total: 1199,
    status: "Shipped",
    items: [
      { productId: "p2", title: "AuraPhone 15 Ultra", qty: 1, price: 1199, image: PRODUCTS[1].images[0] },
    ],
  },
  {
    id: "ORD-10243",
    customer: "Sofia Martinez",
    email: "sofia.m@example.com",
    address: "5 Av. Reforma, Mexico City",
    date: "2026-05-17",
    total: 549,
    status: "Delivered",
    items: [
      { productId: "p6", title: "AuraPlay Console X", qty: 1, price: 549, image: PRODUCTS[5].images[0] },
    ],
  },
  {
    id: "ORD-10242",
    customer: "Liam O'Brien",
    email: "liam.o@example.com",
    address: "88 George St, Sydney AU",
    date: "2026-05-17",
    total: 258,
    status: "Delivered",
    items: [
      { productId: "p7", title: "AuraSound Mini Buds 3", qty: 2, price: 129, image: PRODUCTS[6].images[0] },
    ],
  },
  {
    id: "ORD-10241",
    customer: "Aisha Khan",
    email: "aisha.k@example.com",
    address: "House 14, Gulshan, Dhaka",
    date: "2026-05-16",
    total: 429,
    status: "Shipped",
    items: [
      { productId: "p4", title: "AuraWatch Series 9", qty: 1, price: 429, image: PRODUCTS[3].images[0] },
    ],
  },
  {
    id: "ORD-10240",
    customer: "Noah Kim",
    email: "noah.k@example.com",
    address: "31 Gangnam, Seoul",
    date: "2026-05-16",
    total: 1899,
    status: "Pending",
    items: [
      { productId: "p3", title: "AuraBook Pro 14", qty: 1, price: 1899, image: PRODUCTS[2].images[0] },
    ],
  },
  {
    id: "ORD-10239",
    customer: "Olivia Brown",
    email: "olivia.b@example.com",
    address: "404 Pine St, Seattle WA",
    date: "2026-05-15",
    total: 49,
    status: "Cancelled",
    items: [
      { productId: "p10", title: "AuraGlow Serum", qty: 1, price: 49, image: PRODUCTS[9].images[0] },
    ],
  },
];

export const CUSTOMERS = [
  { id: "C-001", name: "Emily Carter", email: "emily.c@example.com", orders: 12, spent: 3420, joined: "2024-08-12", avatar: "EC" },
  { id: "C-002", name: "James Wong", email: "james.w@example.com", orders: 7, spent: 2890, joined: "2023-11-02", avatar: "JW" },
  { id: "C-003", name: "Sofia Martinez", email: "sofia.m@example.com", orders: 5, spent: 1240, joined: "2025-01-19", avatar: "SM" },
  { id: "C-004", name: "Liam O'Brien", email: "liam.o@example.com", orders: 18, spent: 5410, joined: "2022-06-04", avatar: "LO" },
  { id: "C-005", name: "Aisha Khan", email: "aisha.k@example.com", orders: 3, spent: 870, joined: "2025-09-30", avatar: "AK" },
  { id: "C-006", name: "Noah Kim", email: "noah.k@example.com", orders: 9, spent: 4120, joined: "2024-02-22", avatar: "NK" },
  { id: "C-007", name: "Olivia Brown", email: "olivia.b@example.com", orders: 22, spent: 7890, joined: "2021-12-15", avatar: "OB" },
];

export const REVIEWS = [
  { name: "Daniel R.", rating: 5, date: "2 days ago", title: "Studio-grade sound", body: "These headphones blew me away. ANC is class-leading and comfort over 8h is unbeatable.", avatar: "DR" },
  { name: "Priya S.", rating: 5, date: "1 week ago", title: "Worth every penny", body: "Battery life is no joke — 40 hours real-world. Build quality feels premium.", avatar: "PS" },
  { name: "Marco T.", rating: 4, date: "3 weeks ago", title: "Great, minor nitpick", body: "Sound is amazing but the case is a bit bulky. Still 100% recommend.", avatar: "MT" },
  { name: "Ana L.", rating: 5, date: "1 month ago", title: "Best I've owned", body: "Transparency mode is uncanny. Calls are crystal clear.", avatar: "AL" },
];

export const MONTHLY_SALES = [
  { month: "Jan", value: 28 },
  { month: "Feb", value: 34 },
  { month: "Mar", value: 41 },
  { month: "Apr", value: 38 },
  { month: "May", value: 52 },
  { month: "Jun", value: 47 },
  { month: "Jul", value: 61 },
  { month: "Aug", value: 58 },
  { month: "Sep", value: 70 },
  { month: "Oct", value: 66 },
  { month: "Nov", value: 78 },
  { month: "Dec", value: 92 },
];
