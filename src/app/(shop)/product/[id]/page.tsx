"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart, Minus, Plus, ShoppingCart, Truck, ShieldCheck, RotateCcw, Zap, ChevronRight, Check,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Stars } from "@/components/Stars";
import { REVIEWS } from "@/data/products";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/CustomDropdown";
import { toast } from "sonner";

const COUNTRY_OPTIONS = [
  { value: "US", label: "United States", icon: "🇺🇸" },
  { value: "GB", label: "United Kingdom", icon: "🇬🇧" },
  { value: "AU", label: "Australia", icon: "🇦🇺" },
  { value: "SG", label: "Singapore", icon: "🇸🇬" },
  { value: "LK", label: "Sri Lanka", icon: "🇱🇰" },
];

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { products, addToCart, toggleWishlist, wishlist, setCartOpen, formatPrice, coupons } = useStore();
  const product = products.find((p) => p.id === id);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"specs" | "desc" | "reviews">("desc");
  const [voucherClaimed, setVoucherClaimed] = useState(false);
  const [shipCountry, setShipCountry] = useState("US");

  if (!product) {
    notFound();
  }

  // Find active coupons applicable to this product
  const applicableCoupons = (coupons || []).filter((c) => {
    const isExpired = new Date(c.expiresAt).getTime() < Date.now();
    const isActive = c.status === "active" && !isExpired;
    if (!isActive) return false;

    if (c.applicableTo === "all") return true;
    return c.productIds?.includes(product.id);
  });

  const getDeliveryEstimate = (country: string) => {
    switch (country) {
      case "US":
        return "Ships within 24 hours. Estimated delivery to United States: 3-5 business days via DHL Express.";
      case "GB":
        return "Ships within 24 hours. Estimated delivery to United Kingdom: 3-5 business days via DHL Express.";
      case "AU":
        return "Ships within 24 hours. Estimated delivery to Australia: 4-6 business days via FedEx Global.";
      case "SG":
        return "Ships within 24 hours. Estimated delivery to Singapore: 2-3 business days via DHL Express.";
      case "LK":
        return "Ships within 24 hours. Estimated delivery inside Sri Lanka: 1-2 business days via Domex Local Courier.";
      default:
        return "Ships within 24 hours. Estimated delivery: 3-5 business days via DHL Express.";
    }
  };

  const onSale = product.flashSale && product.flashSalePrice;
  const activePrice = onSale ? product.flashSalePrice! : product.price;
  const comparePrice = onSale ? product.price : product.comparePrice;
  const off = Math.round(((comparePrice - activePrice) / comparePrice) * 100);
  const liked = wishlist.includes(product.id);
  const voucherSaving = Math.round(activePrice * 0.1);

  return (
    <div className="bg-muted/40 pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-5">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight size={12} />
          <span className="hover:text-brand">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-foreground line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 rounded-3xl bg-card border border-border p-6 shadow-card">
          {/* Gallery */}
          <div>
            <motion.div key={active} initial={{ opacity: 0.6, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <img src={product.images[active]} alt={product.title} className="h-full w-full object-cover" />
              {off > 0 && (
                <span className="absolute top-4 left-4 rounded-md bg-destructive px-3 py-1 text-sm font-bold text-destructive-foreground">-{off}%</span>
              )}
            </motion.div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden bg-muted border-2 transition",
                    i === active ? "border-brand shadow-glow" : "border-transparent hover:border-border",
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="text-xs font-semibold text-brand uppercase tracking-wider">{product.brand}</div>
            <h1 className="mt-1 text-2xl md:text-3xl font-extrabold leading-tight tracking-tight">{product.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <Stars rating={product.rating} />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{product.sold.toLocaleString()} sold</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-success/10 text-success px-2 py-0.5 text-xs font-semibold">
                <Check size={12} /> In Stock
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-accent/60 to-accent p-5 text-white">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold">{formatPrice(activePrice)}</span>
                <span className="text-lg opacity-80 line-through">{formatPrice(comparePrice)}</span>
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-bold">Save {formatPrice(comparePrice - activePrice)}</span>
              </div>
              <button
                onClick={() => setVoucherClaimed(true)}
                disabled={voucherClaimed}
                className={cn(
                  "mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-dashed px-3 py-2 text-xs font-bold transition",
                  voucherClaimed ? "border-white/50 bg-white/20" : "border-white/60 hover:bg-white hover:text-accent",
                )}
              >
                {voucherClaimed ? <><Check size={14} /> Voucher claimed · -{formatPrice(voucherSaving)}</> : <>🎟️ Claim voucher · save {formatPrice(voucherSaving)} more</>}
              </button>
            </div>

            {/* Dynamic copyable coupon alert cards */}
            {applicableCoupons.map((coupon) => {
              const handleCopy = () => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText(coupon.code);
                  toast.success(`Coupon code ${coupon.code} copied to clipboard!`);
                }
              };

              let offerDetail = "";
              if (coupon.type === "percentage") {
                offerDetail = `Save ${coupon.value}% on this item`;
              } else if (coupon.type === "fixed") {
                offerDetail = `Save $${coupon.value} on this item`;
              } else {
                offerDetail = "Free Shipping on this order";
              }

              if (coupon.minSpend > 0) {
                offerDetail += ` (Min. spend $${coupon.minSpend})`;
              }

              return (
                <div
                  key={coupon.id}
                  onClick={handleCopy}
                  className="mt-4 p-4 rounded-2xl border border-brand/30 bg-brand/5 hover:bg-brand/10 transition-all cursor-pointer flex items-center justify-between gap-4 group animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                      🎟️
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">Available Offer: <span className="font-mono text-brand font-extrabold uppercase">{coupon.code}</span></div>
                      <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">{offerDetail}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg bg-brand/15 text-brand px-3 py-1.5 text-[10px] font-bold tracking-wide uppercase group-hover:bg-brand group-hover:text-brand-foreground transition-all shadow-sm"
                  >
                    Copy Code
                  </button>
                </div>
              );
            })}

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold w-20">Quantity</span>
                <div className="flex items-center rounded-xl border-2 border-border">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center hover:bg-muted"><Minus size={14} /></button>
                  <span className="w-14 text-center font-bold tabular-nums">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center hover:bg-muted"><Plus size={14} /></button>
                </div>
                <span className="text-xs text-muted-foreground">{product.stock} pieces available</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => { addToCart(product, qty); setCartOpen(true); }}
                className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl border-2 border-brand text-brand py-3 font-bold hover:bg-brand hover:text-brand-foreground transition"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button
                onClick={() => { addToCart(product, qty); }}
                className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl bg-brand text-brand-foreground py-3 font-bold hover:bg-brand-dark transition shadow-glow"
              >
                <Zap size={16} /> Buy Now
              </button>
              <button onClick={() => toggleWishlist(product.id)} className="grid h-12 w-12 place-items-center rounded-xl border-2 border-border hover:border-destructive transition">
                <Heart size={18} className={liked ? "fill-destructive text-destructive" : ""} />
              </button>
            </div>

            {/* Delivery Estimator */}
            <div className="mt-5 rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Truck size={14} className="text-brand" /> Global Shipping Estimator
                </span>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Ready to Ship</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold uppercase text-muted-foreground whitespace-nowrap">Deliver to:</label>
                <CustomDropdown
                  options={COUNTRY_OPTIONS}
                  selectedValue={shipCountry}
                  onChange={setShipCountry}
                  className="max-w-[200px]"
                />
              </div>

              <p className="text-xs text-foreground/80 leading-relaxed font-semibold">
                {getDeliveryEstimate(shipCountry)}
              </p>
            </div>


            <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
              {[{ I: Truck, t: "Free Shipping" }, { I: ShieldCheck, t: "2-yr Warranty" }, { I: RotateCcw, t: "30-day Returns" }].map(({ I, t }) => (
                <div key={t} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                  <I size={14} className="text-brand" /> <span className="font-semibold">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 rounded-3xl bg-card border border-border p-6 shadow-card">
          <div className="flex gap-1 border-b border-border">
            {([
              ["desc", "Description"],
              ["specs", "Specifications"],
              ["reviews", `Reviews (${REVIEWS.length})`],
            ] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={cn(
                  "px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition",
                  tab === k ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="pt-6">
            {tab === "desc" && (
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-base leading-relaxed">{product.description}</p>
                <p className="mt-4 text-sm text-muted-foreground">Designed in California. Engineered with sustainable aluminum and recyclable packaging. Includes premium travel case, USB-C cable, and quick-start guide.</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {["Industry-leading active noise cancellation", "Adaptive transparency for natural conversations", "Spatial audio with dynamic head tracking", "Lossless codec support over USB-C"].map((x) => (
                    <li key={x} className="flex gap-2"><Check size={16} className="text-brand mt-0.5 shrink-0" /> {x}</li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "specs" && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex justify-between border-b border-border/60 py-2.5 text-sm">
                  <span className="text-muted-foreground font-medium">Shipping Weight</span>
                  <span className="font-bold text-foreground">{product.weight} kg</span>
                </div>
                <div className="flex justify-between border-b border-border/60 py-2.5 text-sm">
                  <span className="text-muted-foreground font-medium">Volumetric Weight</span>
                  <span className="font-bold text-brand">{product.volumetricWeight.toFixed(3)} kg</span>
                </div>
                <div className="flex justify-between border-b border-border/60 py-2.5 text-sm">
                  <span className="text-muted-foreground font-medium">Package Dimensions</span>
                  <span className="font-bold text-foreground">{`${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} cm`}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 py-2.5 text-sm">
                  <span className="text-muted-foreground font-medium">HS Customs Code</span>
                  <span className="font-mono font-bold text-foreground">{product.hsCode}</span>
                </div>
                {product.specs.map((s) => (
                  <div key={s.label} className="flex justify-between border-b border-border/60 py-2.5 text-sm">
                    <span className="text-muted-foreground font-medium">{s.label}</span>
                    <span className="font-bold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === "reviews" && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="text-5xl font-extrabold text-brand">{product.rating}</div>
                  <Stars rating={product.rating} size={18} />
                  <div className="text-sm text-muted-foreground mt-1">{product.reviews.toLocaleString()} ratings</div>
                  <div className="mt-4 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 78 : star === 4 ? 16 : star === 3 ? 4 : 1;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-3 font-semibold">{star}★</span>
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-[oklch(0.78_0.16_80)]" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-8 text-right text-muted-foreground tabular-nums">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-4">
                  {REVIEWS.map((r) => (
                    <div key={r.name} className="rounded-xl border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-brand-foreground text-xs font-bold">{r.avatar}</div>
                        <div>
                          <div className="font-semibold text-sm">{r.name}</div>
                          <div className="flex items-center gap-2"><Stars rating={r.rating} size={12} /><span className="text-xs text-muted-foreground">· {r.date}</span></div>
                        </div>
                      </div>
                      <div className="mt-3 font-semibold text-sm">{r.title}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
