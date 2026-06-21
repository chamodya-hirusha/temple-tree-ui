export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number; // USD price
  priceLKR: number; // local LKR price
  comparePrice: number; // USD compare
  rating: number;
  reviews: number;
  sold: number;
  stock: number;
  sku: string;
  badge?: "Free Shipping" | "Express" | "Bestseller" | "New";
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  weight: number; // in kg
  dimensions: { length: number; width: number; height: number }; // in cm
  hsCode: string;
  volumetricWeight: number; // in kg
  flashSale?: boolean;
  flashSalePrice?: number;
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
  { name: "Ceylon Tea", icon: "Coffee", subcategories: ["Black Tea", "Green Tea", "White Tea"] },
  { name: "Spices", icon: "Flame", subcategories: ["Cinnamon", "Cardamom", "Pepper", "Cloves"] },
  { name: "Handicrafts", icon: "Palette", subcategories: ["Masks", "Wooden Statues", "Brassware"] },
  { name: "Handloom & Textiles", icon: "Shirt", subcategories: ["Sarees", "Sarongs", "Table Runners"] },
  { name: "Ayurveda & Natural Products", icon: "Leaf", subcategories: ["Oils", "Soaps", "Herbal Supplements"] },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Premium Organic Ceylon Cinnamon Quills",
    brand: "CeylonArtisan",
    category: "Spices",
    price: 25,
    priceLKR: 7500,
    comparePrice: 35,
    rating: 4.9,
    reviews: 341,
    sold: 1200,
    stock: 80,
    sku: "CA-CINM-01",
    badge: "Bestseller",
    images: [img("cinnamon1")],
    description: "Authentic Grade C5 Ceylon Cinnamon quills, organically grown in Sri Lanka's southern province. Known for its delicate sweet flavor and health benefits.",
    specs: [
      { label: "Grade", value: "C5 Alba Premium" },
      { label: "Origin", value: "Matara, Sri Lanka" },
      { label: "Type", value: "100% Organic" },
    ],
    weight: 0.5,
    dimensions: { length: 25, width: 8, height: 8 },
    hsCode: "0906.11.00",
    volumetricWeight: 0.32,
    flashSale: true,
    flashSalePrice: 19,
  },
  {
    id: "p2",
    title: "Hand-Carved Wooden Elephant Statue (Teak)",
    brand: "CeylonArtisan",
    category: "Handicrafts",
    price: 210,
    priceLKR: 63000,
    comparePrice: 280,
    rating: 4.8,
    reviews: 120,
    sold: 300,
    stock: 5,
    sku: "CA-ELEPH-02",
    badge: "Bestseller",
    images: [img("elephant")],
    description: "Masterfully hand-carved solid teak wood elephant figurine. Perfect representation of Sri Lanka's majestic wildlife and artisan heritage.",
    specs: [
      { label: "Material", value: "Solid Teak Wood" },
      { label: "Finish", value: "Natural Beeswax Polish" },
      { label: "Origin", value: "Moratuwa, Sri Lanka" },
    ],
    weight: 3.5,
    dimensions: { length: 30, width: 15, height: 25 },
    hsCode: "4420.10.00",
    volumetricWeight: 2.25,
  },
  {
    id: "p3",
    title: "Luxury Ceylon Silver Tips White Tea",
    brand: "CeylonBrew",
    category: "Ceylon Tea",
    price: 150,
    priceLKR: 45000,
    comparePrice: 190,
    rating: 4.9,
    reviews: 182,
    sold: 410,
    stock: 0, // out of stock to verify metrics
    sku: "CB-SILV-TIPS",
    badge: "New",
    images: [img("silvertips")],
    description: "Highly prized sun-dried white tea buds, hand-plucked at dawn in Nuwara Eliya. Offers a delicate, velvety infusion with subtle sweet notes.",
    specs: [
      { label: "Grade", value: "Premium Silver Tips" },
      { label: "Elevation", value: "6,200 ft (High Grown)" },
      { label: "Packaging", value: "Velvet Pouch in Wooden Box" },
    ],
    weight: 0.2,
    dimensions: { length: 15, width: 15, height: 8 },
    hsCode: "0902.10.00",
    volumetricWeight: 0.36,
    flashSale: true,
    flashSalePrice: 129,
  },
  {
    id: "p4",
    title: "Ayurvedic Rejuvenation Wellness Kit",
    brand: "NatureLanka",
    category: "Ayurveda & Natural Products",
    price: 45,
    priceLKR: 13500,
    comparePrice: 65,
    rating: 4.7,
    reviews: 612,
    sold: 1980,
    stock: 150,
    sku: "NL-AYUR-WELL",
    badge: "Free Shipping",
    images: [img("ayurkit")],
    description: "Complete traditional wellness kit containing pure King Coconut body oil, organic Sandalwood soap, and herbal face pack mixtures.",
    specs: [
      { label: "Contents", value: "5 pieces" },
      { label: "Formulation", value: "100% Organic, Vegan" },
      { label: "Shelf Life", value: "24 months" },
    ],
    weight: 1.2,
    dimensions: { length: 20, width: 15, height: 10 },
    hsCode: "3307.90.00",
    volumetricWeight: 0.6,
  },
  {
    id: "p5",
    title: "Antique Brass Pahana — Traditional Oil Lamp",
    brand: "HeritageBrass",
    category: "Handicrafts",
    price: 350,
    priceLKR: 105000,
    comparePrice: 420,
    rating: 5.0,
    reviews: 32,
    sold: 150,
    stock: 2,
    sku: "HB-PAHANA-LG",
    badge: "Bestseller",
    images: [img("brasspahana")],
    description: "Heavy, ornate traditional brass oil lamp. Typically used at Sri Lankan cultural celebrations and weddings to symbolize light and prosperity.",
    specs: [
      { label: "Material", value: "Solid Brass" },
      { label: "Height", value: "2.5 Feet" },
      { label: "Origin", value: "Pilimatalawa, Sri Lanka" },
    ],
    weight: 8.5,
    dimensions: { length: 25, width: 25, height: 75 },
    hsCode: "8306.29.00",
    volumetricWeight: 9.375,
  },
  {
    id: "p6",
    title: "Premium Handloom Saree — Cinnamon & Gold",
    brand: "LoomCeylon",
    category: "Handloom & Textiles",
    price: 85,
    priceLKR: 25500,
    comparePrice: 120,
    rating: 4.9,
    reviews: 440,
    sold: 880,
    stock: 25,
    sku: "LC-SAREE-CG",
    badge: "Express",
    images: [img("saree")],
    description: "Elegant 100% cotton handloom saree featuring intricate gold border motifs. Woven by village weavers in central Sri Lanka.",
    specs: [
      { label: "Material", value: "100% Cotton Handloom" },
      { label: "Length", value: "6.2 Meters" },
      { label: "Colors", value: "Natural Cinnamon & Gold" },
    ],
    weight: 0.8,
    dimensions: { length: 30, width: 20, height: 6 },
    hsCode: "5208.52.00",
    volumetricWeight: 0.72,
    flashSale: true,
    flashSalePrice: 69,
  },
  {
    id: "p7",
    title: "Organic Ceylon Cardamom Pods (Green)",
    brand: "CeylonArtisan",
    category: "Spices",
    price: 35,
    priceLKR: 10500,
    comparePrice: 50,
    rating: 4.6,
    reviews: 94,
    sold: 600,
    stock: 0, // out of stock to verify metrics
    sku: "CA-CARD-250",
    badge: "Free Shipping",
    images: [img("cardamom")],
    description: "Hand-picked high-grade green cardamom pods. Extremely aromatic, sourced directly from smallholder forest gardens in Kandy.",
    specs: [
      { label: "Grade", value: "LG 1 Premium" },
      { label: "Weight Net", value: "250g" },
      { label: "Origin", value: "Kandy, Sri Lanka" },
    ],
    weight: 0.3,
    dimensions: { length: 15, width: 10, height: 5 },
    hsCode: "0908.31.00",
    volumetricWeight: 0.15,
    flashSale: true,
    flashSalePrice: 28,
  },
  {
    id: "p8",
    title: "Ceylon Blue Sapphire Silver Ring",
    brand: "JewelLanka",
    category: "Handicrafts", // Categorized with crafts/high-end
    price: 599,
    priceLKR: 179700,
    comparePrice: 850,
    rating: 5.0,
    reviews: 14,
    sold: 28,
    stock: 3,
    sku: "JL-SAPPH-R1",
    badge: "Express",
    images: [img("sapphire")],
    description: "Authentic, ethically sourced Ceylon Blue Sapphire mounted on a handcrafted 925 Sterling Silver ring. Certificate of authenticity included.",
    specs: [
      { label: "Gemstone", value: "Natural Blue Sapphire" },
      { label: "Metal", value: "925 Sterling Silver" },
      { label: "Origin", value: "Ratnapura, Sri Lanka" },
    ],
    weight: 0.05,
    dimensions: { length: 5, width: 5, height: 5 },
    hsCode: "7113.11.00",
    volumetricWeight: 0.025,
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
  total: number; // USD
  totalLKR: number; // LKR
  status: OrderStatus;
  country: string;
  paymentMethod: "Card" | "Bank Transfer" | "COD";
  depositSlipUrl?: string;
  items: { productId: string; title: string; qty: number; price: number; image: string }[];
};

export const ORDERS: Order[] = [
  {
    id: "ORD-10245",
    customer: "Emily Carter",
    email: "emily.c@example.com",
    address: "221B Baker Street, London, UK",
    date: "2026-06-20",
    total: 110,
    totalLKR: 33000,
    status: "Pending",
    country: "UK",
    paymentMethod: "Card",
    items: [
      { productId: "p1", title: "Premium Organic Ceylon Cinnamon Quills", qty: 2, price: 25, image: PRODUCTS[0].images[0] },
      { productId: "p7", title: "Organic Ceylon Cardamom Pods (Green)", qty: 1, price: 35, image: PRODUCTS[6].images[0] },
    ],
  },
  {
    id: "ORD-10244",
    customer: "James Wong",
    email: "james.w@example.com",
    address: "12 Orchard Road, Singapore",
    date: "2026-06-19",
    total: 350,
    totalLKR: 105000,
    status: "Shipped",
    country: "Singapore",
    paymentMethod: "Bank Transfer",
    depositSlipUrl: "/assets/deposit-slip.png",
    items: [
      { productId: "p5", title: "Antique Brass Pahana — Traditional Oil Lamp", qty: 1, price: 350, image: PRODUCTS[4].images[0] },
    ],
  },
  {
    id: "ORD-10243",
    customer: "Sofia Martinez",
    email: "sofia.m@example.com",
    address: "5 Av. Reforma, Mexico City",
    date: "2026-06-18",
    total: 510,
    totalLKR: 153000,
    status: "Delivered",
    country: "Mexico",
    paymentMethod: "Card",
    items: [
      { productId: "p2", title: "Hand-Carved Wooden Elephant Statue (Teak)", qty: 2, price: 210, image: PRODUCTS[1].images[0] },
      { productId: "p6", title: "Premium Handloom Saree — Cinnamon & Gold", qty: 1, price: 85, image: PRODUCTS[5].images[0] },
    ],
  },
  {
    id: "ORD-10242",
    customer: "Dilhan Fernando",
    email: "dilhan.f@example.lk",
    address: "45 Galle Road, Colombo 03, Sri Lanka",
    date: "2026-06-18",
    total: 85,
    totalLKR: 25500,
    status: "Delivered",
    country: "Sri Lanka",
    paymentMethod: "COD",
    items: [
      { productId: "p6", title: "Premium Handloom Saree — Cinnamon & Gold", qty: 1, price: 85, image: PRODUCTS[5].images[0] },
    ],
  },
  {
    id: "ORD-10241",
    customer: "Liam O'Brien",
    email: "liam.o@example.com",
    address: "88 George St, Sydney, Australia",
    date: "2026-06-17",
    total: 245,
    totalLKR: 73500,
    status: "Pending",
    country: "Australia",
    paymentMethod: "Bank Transfer",
    depositSlipUrl: "/assets/deposit-slip.png",
    items: [
      { productId: "p3", title: "Luxury Ceylon Silver Tips White Tea", qty: 1, price: 150, image: PRODUCTS[2].images[0] },
      { productId: "p4", title: "Ayurvedic Rejuvenation Wellness Kit", qty: 2, price: 45, image: PRODUCTS[3].images[0] },
    ],
  },
];

export const CUSTOMERS = [
  { id: "C-001", name: "Emily Carter", email: "emily.c@example.com", orders: 12, spent: 3420, joined: "2024-08-12", avatar: "EC" },
  { id: "C-002", name: "James Wong", email: "james.w@example.com", orders: 7, spent: 2890, joined: "2023-11-02", avatar: "JW" },
  { id: "C-003", name: "Sofia Martinez", email: "sofia.m@example.com", orders: 5, spent: 1240, joined: "2025-01-19", avatar: "SM" },
  { id: "C-004", name: "Dilhan Fernando", email: "dilhan.f@example.lk", orders: 18, spent: 5410, joined: "2022-06-04", avatar: "DF" },
  { id: "C-005", name: "Liam O'Brien", email: "liam.o@example.com", orders: 9, spent: 4120, joined: "2024-02-22", avatar: "LO" },
];

export const REVIEWS = [
  { name: "Daniel R.", rating: 5, date: "2 days ago", title: "Incredible Cinnamon Quality", body: "The fragrance is like nothing you can find in local supermarkets. Real Ceylon Alba cinnamon.", avatar: "DR" },
  { name: "Priya S.", rating: 5, date: "1 week ago", title: "Stunning craftsmanship", body: "The wood carving details on the teak elephant are phenomenal. Safe international shipping too.", avatar: "PS" },
];

export const MONTHLY_SALES = [
  { month: "Jan", value: 28, valueLKR: 8400 },
  { month: "Feb", value: 34, valueLKR: 10200 },
  { month: "Mar", value: 41, valueLKR: 12300 },
  { month: "Apr", value: 38, valueLKR: 11400 },
  { month: "May", value: 52, valueLKR: 15600 },
  { month: "Jun", value: 47, valueLKR: 14100 },
  { month: "Jul", value: 61, valueLKR: 18300 },
  { month: "Aug", value: 58, valueLKR: 17400 },
  { month: "Sep", value: 70, valueLKR: 21000 },
  { month: "Oct", value: 66, valueLKR: 19800 },
  { month: "Nov", value: 78, valueLKR: 23400 },
  { month: "Dec", value: 92, valueLKR: 27600 },
];
