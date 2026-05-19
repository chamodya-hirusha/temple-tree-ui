"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, ORDERS, type Product, type Order } from "@/data/products";
import { toast } from "sonner";

export type CartItem = { product: Product; qty: number };

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

  voucher: string | null;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
  discount: number;
  subtotal: number;
  shipping: number;
  total: number;

  orders: Order[];
  updateOrderStatus: (id: string, status: Order["status"]) => void;
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

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.product.price * i.qty, 0), [cart]);
  const discount = useMemo(() => {
    if (!voucher) return 0;
    if (voucher === "DISCOUNT10") return subtotal * 0.1;
    if (voucher === "FREESHIP") return 0;
    if (voucher === "BRAND25") return subtotal * 0.25;
    return 0;
  }, [voucher, subtotal]);
  const shipping = voucher === "FREESHIP" || subtotal > 500 || cart.length === 0 ? 0 : 12;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyVoucher = (code: string) => {
    const c = code.trim().toUpperCase();
    if (["DISCOUNT10", "FREESHIP", "BRAND25"].includes(c)) {
      setVoucher(c);
      toast.success(`Voucher ${c} applied`);
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

  return (
    <StoreContext.Provider
      value={{
        products, addProduct, updateProduct, deleteProduct,
        cart, addToCart, updateQty, removeFromCart, clearCart,
        wishlist, toggleWishlist,
        cartOpen, setCartOpen,
        voucher, applyVoucher, removeVoucher,
        discount, subtotal, shipping, total,
        orders, updateOrderStatus,
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
