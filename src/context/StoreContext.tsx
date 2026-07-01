"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, ORDERS, type Product, type Order } from "@/data/products";
import { toast } from "sonner";

export type CartItem = { product: Product; qty: number };

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "freeship";
  value: number;
  minSpend: number;
  status: "active" | "expired";
  expiresAt: string; // ISO String
  uses: number;
  applicableTo: "all" | "specific";
  productIds?: string[];
}

export type BannerAd = {
  img: string;
  tag: string;
  title: string;
  sub: string;
};

const INITIAL_BANNERS: BannerAd[] = [
  {
    img: "/assets/product-5.png",
    tag: "Handicrafts",
    title: "Heritage Wood & Brass",
    sub: "Authentic carvings by generational island artisans",
  },
  {
    img: "/assets/product-10.png",
    tag: "Ceylon Tea",
    title: "Imperial Silver Tips",
    sub: "Single-origin luxury tea placked in Nuwara Eliya hills",
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "c1",
    code: "DISCOUNT10",
    type: "percentage",
    value: 10,
    minSpend: 50,
    status: "active",
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), // 2d 5h
    uses: 142,
    applicableTo: "all",
    productIds: [],
  },
  {
    id: "c2",
    code: "FREESHIP",
    type: "freeship",
    value: 0,
    minSpend: 150,
    status: "active",
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(), // 5d 12h
    uses: 98,
    applicableTo: "all",
    productIds: [],
  },
  {
    id: "c3",
    code: "BRAND25",
    type: "percentage",
    value: 25,
    minSpend: 200,
    status: "active",
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString(), // 12h 4m
    uses: 64,
    applicableTo: "specific",
    productIds: ["p1", "p3"],
  },
];

type StoreContextType = {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  wishlist: string[];
  toggleWishlist: (id: string) => void;

  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  coupons: Coupon[];
  addCoupon: (c: Coupon) => void;
  deleteCoupon: (id: string) => void;

  voucher: string | null;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
  discount: number;
  subtotal: number;
  shipping: number;
  total: number;

  orders: Order[];
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  addOrder: (o: Order) => void;

  currency: "USD" | "LKR";
  setCurrency: (c: "USD" | "LKR") => void;
  formatPrice: (usdPrice: number) => string;
  user: { email: string; name: string } | null;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => void;
  logout: () => void;

  flashSaleActive: boolean;
  setFlashSaleActive: (v: boolean) => void;
  flashSaleProgress: number;
  setFlashSaleProgress: (v: number) => void;
  flashSaleTime: { h: number; m: number; s: number };
  setFlashSaleTime: (time: { h: number; m: number; s: number }) => void;

  banners: BannerAd[];
  updateBanner: (index: number, patch: Partial<BannerAd>) => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], qty: 1 },
    { product: PRODUCTS[6], qty: 2 },
  ]);
  const [wishlist, setWishlist] = useState<string[]>(["p2", "p4"]);
  const [cartOpen, setCartOpen] = useState(false);
  const [voucher, setVoucher] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [currency, setCurrency] = useState<"USD" | "LKR">("USD");
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const [flashSaleActive, setFlashSaleActive] = useState(true);
  const [flashSaleProgress, setFlashSaleProgress] = useState(50);
  const [flashSaleTime, setFlashSaleTime] = useState({ h: 8, m: 24, s: 48 });

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [banners, setBanners] = useState<BannerAd[]>(INITIAL_BANNERS);

  const updateBanner = (index: number, patch: Partial<BannerAd>) => {
    setBanners((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  // Load coupons from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("Slmalkoha_coupons");
    if (stored) {
      try {
        setCoupons(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse Slmalkoha_coupons", e);
        setCoupons(INITIAL_COUPONS);
        localStorage.setItem("Slmalkoha_coupons", JSON.stringify(INITIAL_COUPONS));
      }
    } else {
      setCoupons(INITIAL_COUPONS);
      localStorage.setItem("Slmalkoha_coupons", JSON.stringify(INITIAL_COUPONS));
    }
  }, []);

  const addCoupon = (c: Coupon) => {
    setCoupons((prev) => {
      const next = [c, ...prev];
      localStorage.setItem("Slmalkoha_coupons", JSON.stringify(next));
      return next;
    });
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => {
      const next = prev.filter((c) => c.id !== id);
      localStorage.setItem("Slmalkoha_coupons", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    if (!flashSaleActive) return;
    const interval = setInterval(() => {
      setFlashSaleTime((p) => {
        let { h, m, s } = p;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 0;
          m = 0;
          s = 0;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [flashSaleActive]);

  const login = (email: string, pass: string) => {
    if (email.trim() === "buyer@Slmalkohacom" && pass === "password123") {
      setUser({ email: "buyer@Slmalkohacom", name: "Emily Carter" });
      toast.success("Successfully logged in!");
      return true;
    }
    if (email.includes("@")) {
      setUser({ email, name: email.split("@")[0].toUpperCase() });
      toast.success("Logged in successfully!");
      return true;
    }
    toast.error("Invalid email or password");
    return false;
  };

  const signup = (name: string, email: string, pass: string) => {
    setUser({ email, name });
    toast.success("Registered and logged in!");
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  const formatPrice = (usdPrice: number) => {
    if (currency === "USD") {
      return `$${usdPrice.toFixed(2)}`;
    } else {
      return `Rs. ${(usdPrice * 300).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const addToCart = (p: Product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === p.id);
      if (found) return prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { product: p, qty }];
    });
    toast.success(`${p.title.split(" — ")[0]} added to cart`);
  };
  const updateQty = (id: string, qty: number) =>
    setCart((prev) => prev.map((i) => (i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));
  const clearCart = () => setCart([]);

  const toggleWishlist = (id: string) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const subtotal = useMemo(() => {
    return cart.reduce((s, i) => {
      const activeProd = products.find((p) => p.id === i.product.id) || i.product;
      const price = activeProd.flashSale && activeProd.flashSalePrice ? activeProd.flashSalePrice : activeProd.price;
      return s + price * i.qty;
    }, 0);
  }, [cart, products]);

  const activeCoupon = useMemo(() => {
    if (!voucher) return null;
    return coupons.find((c) => c.code.toUpperCase() === voucher.toUpperCase());
  }, [voucher, coupons]);

  const discount = useMemo(() => {
    if (!activeCoupon) return 0;

    // Check expiration date
    const expiry = new Date(activeCoupon.expiresAt);
    if (expiry.getTime() < Date.now()) {
      return 0;
    }

    // Check min spend
    if (subtotal < activeCoupon.minSpend) {
      return 0;
    }

    if (activeCoupon.type === "freeship") {
      return 0; // Handled separately in shipping
    }

    if (activeCoupon.applicableTo === "all") {
      if (activeCoupon.type === "percentage") {
        return subtotal * (activeCoupon.value / 100);
      } else {
        return Math.min(subtotal, activeCoupon.value);
      }
    } else {
      // Specific products rule
      const applicableProductIds = activeCoupon.productIds || [];
      const applicableSubtotal = cart.reduce((sum, item) => {
        const activeProd = products.find((p) => p.id === item.product.id) || item.product;
        const price = activeProd.flashSale && activeProd.flashSalePrice ? activeProd.flashSalePrice : activeProd.price;
        if (applicableProductIds.includes(item.product.id)) {
          return sum + price * item.qty;
        }
        return sum;
      }, 0);

      if (applicableSubtotal === 0) return 0;

      if (activeCoupon.type === "percentage") {
        return applicableSubtotal * (activeCoupon.value / 100);
      } else {
        return Math.min(applicableSubtotal, activeCoupon.value);
      }
    }
  }, [activeCoupon, subtotal, cart, products]);

  const shipping = useMemo(() => {
    if (cart.length === 0) return 0;
    if (subtotal > 500) return 0;

    // Check if free shipping voucher is applied
    if (activeCoupon && activeCoupon.type === "freeship") {
      if (activeCoupon.applicableTo === "all") {
        return 0;
      } else {
        // Only if at least one applicable product is in cart
        const applicableProductIds = activeCoupon.productIds || [];
        const hasApplicableProduct = cart.some((item) => applicableProductIds.includes(item.product.id));
        if (hasApplicableProduct) return 0;
      }
    }
    return 12;
  }, [activeCoupon, cart, subtotal]);

  const total = Math.max(0, subtotal - discount + shipping);

  const applyVoucher = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    // Search in state coupons first
    let found = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    // If not loaded yet or state empty, fall back to check localStorage directly
    if (!found && typeof window !== "undefined") {
      const stored = localStorage.getItem("Slmalkoha_coupons");
      if (stored) {
        try {
          const list = JSON.parse(stored) as Coupon[];
          found = list.find((c) => c.code.toUpperCase() === cleanCode);
        } catch (e) { }
      }
    }

    if (found) {
      if (found.status === "expired" || new Date(found.expiresAt).getTime() < Date.now()) {
        toast.error("This promo code has expired");
        return false;
      }
      if (subtotal < found.minSpend) {
        toast.error(`Minimum spend of $${found.minSpend} required`);
        return false;
      }
      setVoucher(cleanCode);
      toast.success(`Voucher ${cleanCode} applied`);
      return true;
    }

    toast.error("Invalid voucher code");
    return false;
  };

  const removeVoucher = () => setVoucher(null);

  const addProduct = (p: Product) => {
    setProducts((prev) => [p, ...prev]);
    toast.success("Product added");
  };
  const updateProduct = (id: string, patch: Partial<Product>) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  const updateOrderStatus = (id: string, status: Order["status"]) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  const addOrder = (o: Order) => {
    setOrders((prev) => [o, ...prev]);
  };

  return (
    <StoreContext.Provider
      value={{
        products, addProduct, updateProduct, deleteProduct,
        cart, addToCart, updateQty, removeFromCart, clearCart,
        wishlist, toggleWishlist,
        cartOpen, setCartOpen,
        coupons, addCoupon, deleteCoupon,
        voucher, applyVoucher, removeVoucher,
        discount, subtotal, shipping, total,
        orders, updateOrderStatus, addOrder,
        currency, setCurrency, formatPrice,
        user, login, signup, logout,
        flashSaleActive, setFlashSaleActive,
        flashSaleProgress, setFlashSaleProgress,
        flashSaleTime, setFlashSaleTime,
        banners, updateBanner,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
