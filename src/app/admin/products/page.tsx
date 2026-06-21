"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Edit3, Trash2, Filter, AlertCircle
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

export default function ProductsAdmin() {
  const { products, deleteProduct } = useStore();
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Products Catalog</h1>
          <p className="text-sm text-muted-foreground">{products.length} active listings exported globally</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/import"
            className="flex items-center gap-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground px-4 py-3 text-sm font-bold transition-all duration-200"
          >
            Import CSV
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-5 py-3 text-sm font-extrabold shadow-glow hover:bg-brand-dark transition-all duration-200"
          >
            <Plus size={16} /> Add New Product
          </Link>
        </div>
      </div>

      {/* Main Listing Section */}
      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-muted/20">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by title or SKU…"
              className="w-full rounded-xl bg-background border border-border pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 ring-brand transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold hover:bg-muted/50 transition">
            <Filter size={12} /> Filter by Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground font-bold border-b border-border">
              <tr>
                <th className="p-4 font-bold">Product Details</th>
                <th className="p-4 font-bold">SKU</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold text-right">Price (LKR / USD)</th>
                <th className="p-4 font-bold text-center">Stock Status</th>
                <th className="p-4 font-bold text-center">Export Weight</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-all duration-150">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                        <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center flex-wrap gap-1.5">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="font-bold text-foreground text-sm line-clamp-1 hover:text-brand transition"
                          >
                            {p.title}
                          </Link>
                          {p.flashSale && (
                            <span className="shrink-0 inline-flex items-center gap-0.5 rounded bg-brand/15 text-brand px-1.5 py-0.5 text-[9px] font-extrabold uppercase border border-brand/20">
                              ⚡ Sale
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                          <span className="font-medium text-brand">★ {p.rating}</span>
                          <span>·</span>
                          <span>{p.sold} sold</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-foreground font-medium">{p.sku}</td>
                  <td className="p-4">
                    <span className="inline-block bg-muted/70 text-muted-foreground px-2 py-0.5 rounded text-xs font-medium border border-border/30">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {p.flashSale && p.flashSalePrice ? (
                      <>
                        <div className="font-bold text-brand tabular-nums">
                          Rs. {(p.flashSalePrice * 300).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-xs text-brand font-medium tabular-nums mt-0.5">
                          ${p.flashSalePrice.toFixed(2)} USD <span className="text-[10px] text-muted-foreground line-through font-normal">${p.price.toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-foreground tabular-nums">
                          Rs. {p.priceLKR.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium tabular-nums mt-0.5">
                          ${p.price.toFixed(2)} USD
                        </div>
                      </>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums border",
                      p.stock === 0
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : p.stock < 10
                        ? "bg-warning/10 text-warning border-warning/20"
                        : "bg-success/10 text-success border-success/20",
                    )}>
                      {p.stock === 0 ? "Out of Stock" : `${p.stock} units`}
                    </span>
                  </td>
                  <td className="p-4 text-center text-xs font-semibold text-foreground">
                    <div>{p.weight} kg</div>
                    <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                      Vol: {p.volumetricWeight.toFixed(2)} kg
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-muted/40 border border-border/50 hover:bg-muted text-foreground hover:text-brand transition duration-150"
                        title="Edit Product"
                      >
                        <Edit3 size={14} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/5 border border-destructive/10 hover:bg-destructive/10 text-destructive transition duration-150"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-16 text-center">
            <AlertCircle size={28} className="mx-auto text-muted-foreground/60 mb-2" />
            <div className="text-sm font-semibold text-muted-foreground">No products match your search.</div>
          </div>
        )}
      </div>
    </div>
  );
}
