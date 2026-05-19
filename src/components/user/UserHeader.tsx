"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Heart, User, Globe, Phone, Truck,
  LayoutDashboard, ChevronDown, Menu, Sparkles, X,
  Headphones, Smartphone, Laptop, Watch, Camera, Gamepad2, Sofa, Shirt, Dumbbell,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CATEGORIES } from "@/data/products";
import { cn } from "@/lib/utils";

const ICONS = { Headphones, Smartphone, Laptop, Watch, Camera, Gamepad2, Sofa, Shirt, Sparkles, Dumbbell } as const;

export function UserHeader() {
  const { cart, wishlist, setCartOpen, products } = useStore();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const router = useRouter();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const results = query.trim()
    ? products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      {/* Top bar */}
      <div className="bg-slate-deep text-background/90 text-xs">
        <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Phone size={12} /> Customer Care</span>
            <span className="flex items-center gap-1.5"><Truck size={12} /> Track Order</span>
            <span className="flex items-center gap-1.5"><Sparkles size={12} /> Save more on app</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="flex items-center gap-1 hover:text-brand transition">
              <Globe size={12} /> EN / USD <ChevronDown size={10} />
            </button>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full bg-brand text-brand-foreground px-3 py-1 font-semibold hover:opacity-90 transition"
            >
              <LayoutDashboard size={12} /> Admin Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto max-w-7xl px-4 h-20 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand shadow-glow">
            <Sparkles className="text-brand-foreground" size={20} />
          </div>
          <div className="leading-none">
            <div className="text-lg font-extrabold tracking-tight text-foreground">AURA<span className="text-brand">.</span></div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">single-vendor store</div>
          </div>
        </Link>

        <div className="relative flex-1 max-w-2xl">
          <div className="flex items-center rounded-full border-2 border-border focus-within:border-brand transition-colors bg-card overflow-hidden">
            <Search size={16} className="ml-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              placeholder="Search for headphones, watches, cameras…"
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
            />
            <button className="bg-brand text-brand-foreground px-5 py-2.5 text-sm font-semibold hover:bg-brand-dark transition">
              Search
            </button>
          </div>

          <AnimatePresence>
            {searchOpen && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute top-full mt-2 left-0 right-0 rounded-2xl bg-popover border border-border shadow-soft overflow-hidden z-50"
              >
                <div className="grid grid-cols-2 gap-1 p-2">
                  {results.map((p) => (
                    <button
                      key={p.id}
                      onMouseDown={() => { router.push(`/product/${p.id}`); setSearchOpen(false); setQuery(""); }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted text-left"
                    >
                      <img src={p.images[0]} alt={p.title} className="h-12 w-12 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium line-clamp-2">{p.title}</div>
                        <div className="text-xs font-bold text-brand mt-0.5">${p.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted transition text-sm">
            <User size={18} /> <span className="hidden lg:inline">Sign in</span>
          </button>
          <Link href="/cart" className="relative grid place-items-center h-10 w-10 rounded-lg hover:bg-muted transition">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button onClick={() => setCartOpen(true)} className="relative grid place-items-center h-10 w-10 rounded-lg hover:bg-muted transition">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.4 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground text-[10px] font-bold"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Mega nav */}
      <div className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 h-11 flex items-center gap-2">
          <div className="relative" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-brand-foreground text-sm font-semibold">
              <Menu size={15} /> All Categories <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full left-0 mt-1 w-[640px] rounded-2xl bg-popover border border-border shadow-soft p-3 grid grid-cols-2 gap-1 z-50"
                >
                  {CATEGORIES.map((c) => {
                    const Icon = ICONS[c.icon as keyof typeof ICONS] ?? Sparkles;
                    return (
                      <a key={c.name} href="#" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-brand">
                          <Icon size={16} />
                        </span>
                        <span className="text-sm font-medium">{c.name}</span>
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {["Flash Sale", "New Arrivals", "Bestsellers", "Lookbook", "Brand Story", "Support"].map((l) => (
              <a key={l} href="#" className={cn("px-3 py-2 rounded-lg hover:text-brand transition", l === "Flash Sale" && "text-brand font-semibold")}>{l}</a>
            ))}
          </nav>
          <div className="ml-auto text-xs text-muted-foreground hidden md:block">
            Free shipping over <span className="font-bold text-foreground">$500</span> · 2-year warranty
          </div>
        </div>
      </div>
    </header>
  );
}

export { X };
