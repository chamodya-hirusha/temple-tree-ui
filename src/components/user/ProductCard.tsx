"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Truck, Zap } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Stars } from "@/components/Stars";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const off = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
  const liked = wishlist.includes(product.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      className="group relative overflow-hidden rounded-2xl bg-card shadow-card border border-border/60 hover:shadow-glow hover:border-brand/40 transition-all"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {off > 0 && (
              <span className="rounded-md bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                -{off}%
              </span>
            )}
            {product.badge && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold",
                  product.badge === "Bestseller" && "bg-brand text-brand-foreground",
                  product.badge === "New" && "bg-success text-success-foreground",
                  product.badge === "Express" && "bg-foreground text-background",
                  product.badge === "Free Shipping" && "bg-accent text-accent-foreground",
                )}
              >
                {product.badge === "Express" && <Zap size={10} />}
                {product.badge === "Free Shipping" && <Truck size={10} />}
                {product.badge}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 backdrop-blur shadow-soft hover:scale-110 transition"
          >
            <Heart
              size={15}
              className={liked ? "fill-destructive text-destructive" : "text-foreground/70"}
            />
          </button>
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground min-h-[2.5rem] hover:text-brand transition">
            {product.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-brand">${product.price}</span>
          <span className="text-xs text-muted-foreground line-through">${product.comparePrice}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <Stars rating={product.rating} size={12} />
          <span className="text-[11px] text-muted-foreground">| {product.sold.toLocaleString()} sold</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-foreground text-background py-2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand"
        >
          <ShoppingCart size={13} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
