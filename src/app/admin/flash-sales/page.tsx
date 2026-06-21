"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Flame, Clock, Search, Plus, Trash2, Sparkles, Sliders, Play, Pause
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FlashSalesAdminPage() {
  const {
    products,
    updateProduct,
    flashSaleActive,
    setFlashSaleActive,
    flashSaleProgress,
    setFlashSaleProgress,
    flashSaleTime,
    setFlashSaleTime,
    formatPrice
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter products on and off sale
  const activeSaleProducts = products.filter((p) => p.flashSale);
  const catalogProducts = products.filter(
    (p) =>
      !p.flashSale &&
      (selectedCategory === "All" || p.category === selectedCategory) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  // Quick preset timers
  const setPresetTimer = (h: number, m: number, s: number) => {
    setFlashSaleTime({ h, m, s });
    toast.success(`Timer set to ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
  };

  const handleToggleActive = () => {
    setFlashSaleActive(!flashSaleActive);
    toast.success(
      `Flash sale ${!flashSaleActive ? "activated" : "deactivated"} globally.`
    );
  };

  const handlePriceChange = (id: string, val: string) => {
    const num = Number(val);
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid sale price");
      return;
    }
    if (num >= prod.price) {
      toast.error(`Flash sale price must be lower than original price ($${prod.price})`);
      return;
    }

    updateProduct(id, { flashSalePrice: num });
    toast.success(`Price updated for ${prod.title.split(" — ")[0]}`);
  };

  const handleAddToSale = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    // Default flash sale price is 20% discount of original price
    const defaultSalePrice = Math.round(prod.price * 0.8 * 100) / 100;
    updateProduct(id, { flashSale: true, flashSalePrice: defaultSalePrice });
    toast.success(`Added ${prod.title.split(" — ")[0]} to flash sale!`);
  };

  const handleRemoveFromSale = (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    updateProduct(id, { flashSale: false, flashSalePrice: undefined });
    toast.success(`Removed ${prod.title.split(" — ")[0]} from flash sale`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Flame className="text-brand fill-brand" size={28} /> Hourly Flash Sales
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time sync control panel for the storefront flash sale widget and campaign pricing.
        </p>
      </div>

      {/* Campaign Controllers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* campaign status & progress */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Sliders size={18} className="text-brand" /> Live campaign settings
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
            <div>
              <div className="font-bold text-sm">Campaign Active Status</div>
              <div className="text-xs text-muted-foreground">
                Toggle whether the flash sale block renders on the homepage
              </div>
            </div>
            <button
              onClick={handleToggleActive}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm",
                flashSaleActive
                  ? "bg-brand text-brand-foreground hover:bg-brand-dark"
                  : "bg-muted text-muted-foreground border border-border hover:bg-border"
              )}
            >
              {flashSaleActive ? (
                <>
                  <Pause size={14} /> Active (Running)
                </>
              ) : (
                <>
                  <Play size={14} /> Inactive (Hidden)
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground uppercase tracking-wider">Sold items progress bar</span>
              <span className="text-brand text-sm font-bold">{flashSaleProgress}% sold</span>
            </div>
            <div className="flex gap-4 items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={flashSaleProgress}
                onChange={(e) => setFlashSaleProgress(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-brand"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={flashSaleProgress}
                onChange={(e) => setFlashSaleProgress(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-xs text-center font-bold"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Adjusts the sold counter bar shown to the customer (e.g. {flashSaleProgress}% sold is{" "}
              {flashSaleProgress >= 80 ? '"Almost sold out!"' : flashSaleProgress >= 50 ? '"Selling fast"' : '"Trending"'}
              ).
            </p>
          </div>
        </div>

        {/* Campaign Countdown Timer */}
        <div className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Clock size={18} className="text-brand" /> Live countdown sync
          </h3>

          <div className="flex justify-center items-center gap-2 py-4 px-6 rounded-xl bg-slate-deep text-background">
            <div className="text-center">
              <input
                type="number"
                min="0"
                max="23"
                value={flashSaleTime.h}
                onChange={(e) => setFlashSaleTime({ ...flashSaleTime, h: Math.max(0, Math.min(23, Number(e.target.value))) })}
                className="w-14 bg-white/10 rounded-lg py-1.5 text-center text-xl font-bold border border-white/20 text-white outline-none"
              />
              <div className="text-[9px] uppercase tracking-wider text-background/60 mt-1">Hours</div>
            </div>
            <span className="text-2xl font-bold text-white/50 -mt-5">:</span>
            <div className="text-center">
              <input
                type="number"
                min="0"
                max="59"
                value={flashSaleTime.m}
                onChange={(e) => setFlashSaleTime({ ...flashSaleTime, m: Math.max(0, Math.min(59, Number(e.target.value))) })}
                className="w-14 bg-white/10 rounded-lg py-1.5 text-center text-xl font-bold border border-white/20 text-white outline-none"
              />
              <div className="text-[9px] uppercase tracking-wider text-background/60 mt-1">Mins</div>
            </div>
            <span className="text-2xl font-bold text-white/50 -mt-5">:</span>
            <div className="text-center">
              <input
                type="number"
                min="0"
                max="59"
                value={flashSaleTime.s}
                onChange={(e) => setFlashSaleTime({ ...flashSaleTime, s: Math.max(0, Math.min(59, Number(e.target.value))) })}
                className="w-14 bg-white/10 rounded-lg py-1.5 text-center text-xl font-bold border border-white/20 text-white outline-none"
              />
              <div className="text-[9px] uppercase tracking-wider text-background/60 mt-1">Secs</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Preset Quick actions</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPresetTimer(0, 45, 0)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent text-foreground transition"
              >
                45 mins
              </button>
              <button
                onClick={() => setPresetTimer(4, 0, 0)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent text-foreground transition"
              >
                4 hours
              </button>
              <button
                onClick={() => setPresetTimer(8, 24, 48)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent text-foreground transition"
              >
                8h 24m 48s (Default)
              </button>
              <button
                onClick={() => setPresetTimer(12, 0, 0)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent text-foreground transition"
              >
                12 hours
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Products Manager */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Active flash sale items */}
        <div className="lg:col-span-7 rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-brand" /> Active Flash Sale Products
              </h3>
              <p className="text-xs text-muted-foreground">Items currently displayed in the storefront widget slider.</p>
            </div>
            <span className="rounded-full bg-brand/10 text-brand px-3 py-1 text-xs font-bold">
              {activeSaleProducts.length} items
            </span>
          </div>

          {activeSaleProducts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
              <Flame size={48} className="mx-auto opacity-20 mb-3" />
              <div className="font-bold text-sm">No Active Items</div>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                Add items to the flash sale from the product catalog panel on the right.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {activeSaleProducts.map((p) => {
                const discountPct = Math.round(((p.price - (p.flashSalePrice || p.price)) / p.price) * 100);
                return (
                  <div
                    key={p.id}
                    className="flex gap-4 rounded-xl border border-border p-3 bg-muted/10 hover:border-brand/40 transition"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-16 w-16 rounded-lg object-cover bg-muted shrink-0 border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <Link href={`/admin/products/${p.id}/edit`} className="text-sm font-bold hover:underline hover:text-brand line-clamp-1">
                            {p.title}
                          </Link>
                          <div className="text-xs text-muted-foreground">SKU: {p.sku}</div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromSale(p.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-destructive/10 text-destructive shrink-0"
                          title="Remove from Flash Sale"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(p.price)}
                          </span>
                          <span className="rounded-md bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                            -{discountPct}%
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-muted-foreground font-semibold">Flash Price (USD):</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                              $
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              defaultValue={p.flashSalePrice}
                              onBlur={(e) => handlePriceChange(p.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handlePriceChange(p.id, e.currentTarget.value);
                                }
                              }}
                              className="w-24 rounded-lg border border-border bg-background pl-6 pr-2 py-1 text-xs font-bold outline-none focus:border-brand"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Catalog search */}
        <div className="lg:col-span-5 rounded-2xl bg-card border border-border shadow-card p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Plus size={18} className="text-brand" /> Add from Catalog
            </h3>
            <p className="text-xs text-muted-foreground">Select products to include in the active flash sale campaign.</p>
          </div>

          {/* Search filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search catalog products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-muted pl-9 pr-3 py-2 text-xs outline-none focus:ring-1 focus:ring-brand border border-border"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 text-[11px] font-bold rounded-lg border transition whitespace-nowrap",
                    selectedCategory === cat
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {catalogProducts.length === 0 ? (
            <div className="text-center py-12 border border-border rounded-xl bg-muted/10">
              <Search size={32} className="mx-auto opacity-20 mb-2" />
              <div className="text-xs font-bold">No catalog matches</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Try modifying your query or category filters.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {catalogProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-3 items-center justify-between rounded-xl border border-border/80 p-2.5 bg-background hover:bg-muted/10 transition"
                >
                  <div className="flex gap-2.5 min-w-0 items-center">
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover bg-muted shrink-0 border border-border"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate leading-tight">{p.title}</div>
                      <div className="text-[10px] text-muted-foreground">Original: {formatPrice(p.price)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToSale(p.id)}
                    className="flex items-center gap-1 rounded-lg bg-brand hover:bg-brand-dark px-2.5 py-1.5 text-[10px] font-bold text-brand-foreground transition shrink-0 shadow-sm"
                  >
                    <Plus size={10} /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
