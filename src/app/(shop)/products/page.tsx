"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Filter } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/user/ProductCard";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="bg-muted/40 min-h-screen pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-5">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-brand transition">Home</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">All Products</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="rounded-2xl bg-card border border-border shadow-card p-4 sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                <Filter size={16} /> Filters
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    activeCategory === "All" ? "bg-brand text-brand-foreground font-semibold shadow-glow" : "hover:bg-accent hover:text-brand"
                  }`}
                >
                  All Products
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setActiveCategory(c.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      activeCategory === c.name ? "bg-brand text-brand-foreground font-semibold shadow-glow" : "hover:bg-accent hover:text-brand"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-extrabold tracking-tight">
                {activeCategory === "All" ? "Shop All" : activeCategory}
              </h1>
              <span className="text-sm text-muted-foreground">{filteredProducts.length} results</span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
                <p className="text-lg font-semibold text-muted-foreground">No products found</p>
                <button 
                  onClick={() => setActiveCategory("All")}
                  className="mt-4 text-sm font-bold text-brand hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
