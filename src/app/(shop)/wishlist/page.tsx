"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/user/ProductCard";

export default function WishlistPage() {
  const { wishlist, products } = useStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-muted/40 pb-16 min-h-[60vh]">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Your Wishlist</h1>
        <p className="text-sm text-muted-foreground">{wishlistProducts.length} item{wishlistProducts.length !== 1 ? "s" : ""} saved</p>

        {wishlistProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-card border border-border p-16 text-center shadow-card max-w-2xl mx-auto">
            <Heart className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-bold">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mt-1">Save your favorite items here to review them later.</p>
            <Link href="/products" className="mt-5 inline-block rounded-xl bg-brand text-brand-foreground px-5 py-2.5 text-sm font-bold shadow-glow hover:bg-brand-dark transition">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
