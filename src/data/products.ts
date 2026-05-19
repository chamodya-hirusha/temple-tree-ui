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

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const CATEGORIES = [
  { name: "Audio & Headphones", icon: "Headphones" },
  { name: "Smartphones", icon: "Smartphone" },
  { name: "Laptops & PCs", icon: "Laptop" },
  { name: "Watches", icon: "Watch" },
  { name: "Cameras", icon: "Camera" },
  { name: "Gaming", icon: "Gamepad2" },
  { name: "Home & Living", icon: "Sofa" },
  { name: "Fashion", icon: "Shirt" },
  { name: "Beauty", icon: "Sparkles" },
  { name: "Sports", icon: "Dumbbell" },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "AuraSound Pro Max — Wireless Noise-Cancelling Headphones",
    brand: "AuraSound",
    category: "Audio & Headphones",
    price: 249,
    comparePrice: 399,
    rating: 4.8,
    reviews: 2341,
    sold: 5200,
    stock: 42,
    sku: "AS-PRO-MAX-01",
    badge: "Bestseller",
    images: [
      img("photo-1505740420928-5e560c06d30e"),
      img("photo-1583394838336-acd977736f90"),
      img("photo-1546435770-a3e426bf472b"),
      img("photo-1577174881658-0f30ed549adc"),
    ],
    description:
      "Studio-grade 40mm drivers, hybrid active noise cancellation, 40-hour battery life, premium memory-foam ear cushions and adaptive transparency mode.",
    specs: [
      { label: "Driver", value: "40mm dynamic" },
      { label: "Battery", value: "40 hours" },
      { label: "Bluetooth", value: "5.3 LE Audio" },
      { label: "Weight", value: "248g" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    id: "p2",
    title: "AuraPhone 15 Ultra — 256GB Titanium",
    brand: "AuraSound",
    category: "Smartphones",
    price: 1199,
    comparePrice: 1399,
    rating: 4.9,
    reviews: 1820,
    sold: 3400,
    stock: 18,
    sku: "AP-15U-256-TI",
    badge: "New",
    images: [
      img("photo-1592750475338-74b7b21085ab"),
      img("photo-1511707171634-5f897ff02aa9"),
      img("photo-1601784551446-20c9e07cdbdb"),
    ],
    description:
      "6.7\" ProMotion OLED, A18 Bionic chip, 48MP triple-camera with periscope zoom, titanium frame, all-day battery.",
    specs: [
      { label: "Display", value: "6.7\" OLED 120Hz" },
      { label: "Chipset", value: "A18 Bionic" },
      { label: "Storage", value: "256GB" },
      { label: "Camera", value: "48MP + 12MP + 12MP" },
    ],
  },
  {
    id: "p3",
    title: "AuraBook Pro 14 — M3 Pro Chip, 16GB RAM",
    brand: "AuraSound",
    category: "Laptops & PCs",
    price: 1899,
    comparePrice: 2199,
    rating: 4.9,
    reviews: 940,
    sold: 1280,
    stock: 9,
    sku: "AB-P14-M3P",
    badge: "Express",
    images: [
      img("photo-1517336714731-489689fd1ca8"),
      img("photo-1496181133206-80ce9b88a853"),
      img("photo-1611186871348-b1ce696e52c9"),
    ],
    description:
      "Ultra-thin aluminum unibody, 14\" Liquid Retina XDR, 22-hour battery, studio-quality six-speaker system.",
    specs: [
      { label: "Chip", value: "M3 Pro 11-core" },
      { label: "RAM", value: "16GB unified" },
      { label: "Storage", value: "512GB SSD" },
      { label: "Display", value: "14.2\" XDR 120Hz" },
    ],
  },
  {
    id: "p4",
    title: "AuraWatch Series 9 — GPS + Cellular, Sport Loop",
    brand: "AuraSound",
    category: "Watches",
    price: 429,
    comparePrice: 499,
    rating: 4.7,
    reviews: 612,
    sold: 980,
    stock: 64,
    sku: "AW-S9-GPS",
    badge: "Free Shipping",
    images: [
      img("photo-1523275335684-37898b6baf30"),
      img("photo-1546868871-7041f2a55e12"),
      img("photo-1579586337278-3befd40fd17a"),
    ],
    description:
      "Always-on Retina display, blood oxygen sensor, ECG, crash detection and 18-hour battery.",
    specs: [
      { label: "Case", value: "45mm Aluminum" },
      { label: "Connectivity", value: "GPS + Cellular" },
      { label: "Water rating", value: "50m" },
    ],
  },
  {
    id: "p5",
    title: "AuraCam R5 Mirrorless — 24-105mm Kit",
    brand: "AuraSound",
    category: "Cameras",
    price: 2499,
    comparePrice: 2899,
    rating: 4.8,
    reviews: 312,
    sold: 410,
    stock: 6,
    sku: "AC-R5-KIT",
    badge: "Express",
    images: [
      img("photo-1502920917128-1aa500764cbd"),
      img("photo-1606986628253-49a4393cd05e"),
      img("photo-1516035069371-29a1b244cc32"),
    ],
    description: "45MP full-frame sensor, 8K RAW video, IBIS up to 8 stops, dual card slots.",
    specs: [
      { label: "Sensor", value: "45MP Full-frame" },
      { label: "Video", value: "8K30 RAW" },
      { label: "ISO", value: "100–51200" },
    ],
  },
  {
    id: "p6",
    title: "AuraPlay Console X — 1TB Disc Edition",
    brand: "AuraSound",
    category: "Gaming",
    price: 549,
    comparePrice: 599,
    rating: 4.9,
    reviews: 4120,
    sold: 9800,
    stock: 120,
    sku: "AP-X1TB",
    badge: "Bestseller",
    images: [
      img("photo-1606144042614-b2417e99c4e3"),
      img("photo-1612287230202-1ff1d85d1bdf"),
      img("photo-1593305841991-05c297ba4575"),
    ],
    description: "Next-gen 4K 120fps console with ray tracing, 1TB NVMe SSD and haptic controllers.",
    specs: [
      { label: "Storage", value: "1TB NVMe" },
      { label: "Output", value: "4K 120Hz / 8K" },
      { label: "Includes", value: "1 controller" },
    ],
  },
  {
    id: "p7",
    title: "AuraSound Mini Buds 3 — ANC True Wireless",
    brand: "AuraSound",
    category: "Audio & Headphones",
    price: 129,
    comparePrice: 199,
    rating: 4.6,
    reviews: 5400,
    sold: 14200,
    stock: 230,
    sku: "AS-MB3",
    badge: "Free Shipping",
    images: [
      img("photo-1606220945770-b5b6c2c55bf1"),
      img("photo-1590658268037-6bf12165a8df"),
      img("photo-1572569511254-d8f925fe2cbb"),
    ],
    description: "Adaptive ANC, 30-hour total battery with case, spatial audio, IPX4 sweat resistant.",
    specs: [
      { label: "Driver", value: "11mm dynamic" },
      { label: "Battery", value: "8h + 22h case" },
      { label: "Codecs", value: "LDAC, AAC" },
    ],
  },
  {
    id: "p8",
    title: "AuraHome Smart Speaker — Premium Walnut",
    brand: "AuraSound",
    category: "Home & Living",
    price: 199,
    comparePrice: 249,
    rating: 4.5,
    reviews: 720,
    sold: 1320,
    stock: 3,
    sku: "AH-SS-W",
    badge: "Express",
    images: [
      img("photo-1545454675-3531b543be5d"),
      img("photo-1558089687-f282ffcbc126"),
      img("photo-1589003077984-894e133dabab"),
    ],
    description: "Room-filling 360° sound, voice assistant, smart home hub with walnut accent.",
    specs: [
      { label: "Power", value: "60W RMS" },
      { label: "Connectivity", value: "Wi-Fi 6, BT 5.2" },
    ],
  },
  {
    id: "p9",
    title: "AuraFit Runner — Lightweight Performance Sneaker",
    brand: "AuraSound",
    category: "Sports",
    price: 159,
    comparePrice: 219,
    rating: 4.7,
    reviews: 980,
    sold: 4100,
    stock: 88,
    sku: "AF-RUN-01",
    badge: "Free Shipping",
    images: [
      img("photo-1542291026-7eec264c27ff"),
      img("photo-1600185365926-3a2ce3cdb9eb"),
      img("photo-1606107557195-0e29a4b5b4aa"),
    ],
    description: "Carbon fiber plate, breathable knit upper, 18mm responsive foam stack.",
    specs: [
      { label: "Drop", value: "8mm" },
      { label: "Weight", value: "212g" },
    ],
  },
  {
    id: "p10",
    title: "AuraGlow Serum — Vitamin C Brightening 30ml",
    brand: "AuraSound",
    category: "Beauty",
    price: 49,
    comparePrice: 79,
    rating: 4.6,
    reviews: 2200,
    sold: 7800,
    stock: 450,
    sku: "AG-VC-30",
    badge: "Bestseller",
    images: [
      img("photo-1556228720-195a672e8a03"),
      img("photo-1620916566398-39f1143ab7be"),
      img("photo-1571781926291-c477ebfd024b"),
    ],
    description: "15% L-ascorbic acid, hyaluronic acid, dermatologist-tested, cruelty-free.",
    specs: [
      { label: "Volume", value: "30ml" },
      { label: "Skin type", value: "All" },
    ],
  },
  {
    id: "p11",
    title: "AuraStyle Leather Jacket — Slim Fit Black",
    brand: "AuraSound",
    category: "Fashion",
    price: 289,
    comparePrice: 449,
    rating: 4.5,
    reviews: 340,
    sold: 620,
    stock: 24,
    sku: "AS-LJ-BLK",
    badge: "New",
    images: [
      img("photo-1551028719-00167b16eac5"),
      img("photo-1521223890158-f9f7c3d5d504"),
      img("photo-1591047139829-d91aecb6caea"),
    ],
    description: "Full-grain lambskin, satin-lined, YKK hardware, tailored slim fit.",
    specs: [
      { label: "Material", value: "100% Lambskin" },
      { label: "Care", value: "Professional clean" },
    ],
  },
  {
    id: "p12",
    title: "AuraDesk Pro — Standing Desk with Memory Settings",
    brand: "AuraSound",
    category: "Home & Living",
    price: 699,
    comparePrice: 899,
    rating: 4.8,
    reviews: 510,
    sold: 1180,
    stock: 14,
    sku: "AD-STAND-01",
    badge: "Express",
    images: [
      img("photo-1518455027359-f3f8164ba6bd"),
      img("photo-1593642632559-0c6d3fc62b89"),
      img("photo-1593062096033-9a26b09da705"),
    ],
    description: "Dual motor, 4 memory presets, bamboo top, supports up to 150kg.",
    specs: [
      { label: "Height", value: "65–125cm" },
      { label: "Top", value: "160×80cm bamboo" },
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
