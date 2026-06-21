"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQty, removeFromCart, subtotal, formatPrice, products } = useStore();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-slate-deep/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col"
          >
            <header className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand" /> Your Cart ({cart.length})
              </h3>
              <button onClick={() => setCartOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted transition">
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
                  Your cart is empty
                </div>
              )}
              {cart.map((item) => {
                const activeProd = products.find((p) => p.id === item.product.id) || item.product;
                const activePrice = activeProd.flashSale && activeProd.flashSalePrice ? activeProd.flashSalePrice : activeProd.price;
                return (
                  <div key={item.product.id} className="flex gap-3 rounded-xl border border-border p-3 bg-card">
                    <img src={item.product.images[0]} alt={item.product.title} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-2">{item.product.title}</div>
                      <div className="mt-1 text-sm font-bold text-brand">{formatPrice(activePrice)}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-border">
                          <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="grid h-7 w-7 place-items-center hover:bg-muted">
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-sm font-semibold tabular-nums">{item.qty}</span>
                          <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="grid h-7 w-7 place-items-center hover:bg-muted">
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="grid h-7 w-7 place-items-center rounded-md hover:bg-destructive/10 text-destructive">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <footer className="border-t border-border p-5 space-y-3 bg-card">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-base">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="block w-full rounded-xl border-2 border-border py-3 text-center text-sm font-semibold hover:bg-muted transition"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="block w-full rounded-xl bg-brand text-brand-foreground py-3 text-center text-sm font-bold hover:bg-brand-dark transition shadow-glow"
              >
                Checkout · {formatPrice(subtotal)}
              </Link>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
