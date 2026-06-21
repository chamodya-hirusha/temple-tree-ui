"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, ShoppingBag, AlertTriangle, Users, TrendingUp, TrendingDown, ArrowUpRight, Globe,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { MONTHLY_SALES } from "@/data/products";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { products, orders } = useStore();
  const [currencyMode, setCurrencyMode] = useState<"USD" | "LKR">("USD");

  // Calculate live stats from store state
  const totalSalesUSD = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const totalSalesLKR = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalLKR || (o.total * 300)), 0);

  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalOrders = orders.length;

  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;

  const stats = [
    {
      label: "Total Sales",
      value: `LKR ${totalSalesLKR.toLocaleString()}`,
      subValue: `$${totalSalesUSD.toLocaleString()}`,
      delta: "+14.2% YoY",
      up: true,
      I: DollarSign,
      accent: "from-brand to-brand-dark"
    },
    {
      label: "Total Orders",
      value: String(totalOrders),
      subValue: "Domestic & Intl",
      delta: "+8.1% vs last month",
      up: true,
      I: ShoppingBag,
      accent: "from-[oklch(0.35_0.05_45)] to-[oklch(0.25_0.04_45)]"
    },
    {
      label: "Out of Stock Items",
      value: String(outOfStock),
      subValue: `${lowStock} low stock items`,
      delta: outOfStock > 0 ? "Requires attention" : "Perfect status",
      up: outOfStock === 0,
      I: AlertTriangle,
      accent: outOfStock > 0 ? "from-[oklch(0.6_0.2_25)] to-[oklch(0.5_0.18_20)]" : "from-[oklch(0.65_0.17_155)] to-[oklch(0.55_0.15_150)]"
    },
    {
      label: "Active Markets",
      value: "4 Countries",
      subValue: "USA, UK, AU, SG",
      delta: "+1 new this month",
      up: true,
      I: Globe,
      accent: "from-[oklch(0.55_0.1_200)] to-[oklch(0.4_0.08_210)]"
    },
  ];

  const maxUSD = Math.max(...MONTHLY_SALES.map((m) => m.value));
  const maxLKR = Math.max(...MONTHLY_SALES.map((m) => m.valueLKR));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">Sri Lankan Heritage & International Exports Hub Control Panel</p>
        </div>
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setCurrencyMode("USD")}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
              currencyMode === "USD" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            USD ($)
          </button>
          <button
            onClick={() => setCurrencyMode("LKR")}
            className={cn(
              "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
              currencyMode === "LKR" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            LKR (Rs.)
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn("relative overflow-hidden rounded-2xl p-5 text-white shadow-card bg-gradient-to-br", s.accent)}
          >
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-xl animate-pulse" />
            <div className="relative flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <s.I size={18} />
                </div>
                <div className={cn("flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold backdrop-blur")}>
                  {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {s.delta}
                </div>
              </div>
              <div className="mt-5">
                <div className="text-3xl font-extrabold tracking-tight">{s.value}</div>
                {s.subValue && <div className="text-xs opacity-75 mt-0.5 font-medium">{s.subValue}</div>}
              </div>
              <div className="text-[10px] uppercase tracking-[0.1em] opacity-60 mt-3">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales Chart Card */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Sales Performance</h3>
              <p className="text-xs text-muted-foreground">
                Monthly revenue · 2026 (in {currencyMode === "USD" ? "thousands USD" : "lakhs LKR"})
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold rounded-full bg-success/10 text-success px-2.5 py-1">
              <ArrowUpRight size={12} /> +18.2% YoY
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 h-64 pt-4 border-b border-border/50">
            {MONTHLY_SALES.map((m) => {
              const val = currencyMode === "USD" ? m.value : m.valueLKR / 100; // Convert to Lakhs LKR
              const max = currencyMode === "USD" ? maxUSD : maxLKR / 100;
              const formattedVal = currencyMode === "USD" ? `$${val}k` : `Rs. ${val.toFixed(1)}L`;

              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[9px] font-bold tabular-nums text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pb-1">
                    {formattedVal}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / max) * 80}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full rounded-t-md bg-gradient-to-t from-brand to-brand/60 min-h-[4px] hover:from-brand-dark hover:to-brand transition-all cursor-pointer shadow-sm"
                  />
                  <div className="text-[10px] text-muted-foreground font-semibold pt-1">{m.month}</div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-6 mt-4 text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-brand" /> Exports
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-slate-deep" /> Local Delivery
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="rounded-2xl bg-card border border-border p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Recent Orders</h3>
                <p className="text-xs text-muted-foreground">Latest client transactions</p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand px-2 py-0.5 rounded bg-brand/15">
                Live
              </span>
            </div>
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center gap-3 rounded-xl hover:bg-muted/50 p-2 transition">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted border border-border text-brand text-xs font-extrabold shrink-0">
                    {o.customer.split(" ").map((x) => x[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate text-foreground">{o.customer}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="truncate">{o.id}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/35" />
                      <span className="font-medium text-foreground">{o.country}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-foreground tabular-nums">
                      {currencyMode === "USD" ? `$${o.total}` : `Rs. ${(o.totalLKR || (o.total * 300)).toLocaleString()}`}
                    </div>
                    <span className={cn(
                      "text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full inline-block mt-0.5",
                      o.status === "Delivered" && "bg-success/10 text-success border border-success/20",
                      o.status === "Pending" && "bg-warning/10 text-warning border border-warning/20",
                      o.status === "Shipped" && "bg-[oklch(0.55_0.18_240)]/10 text-[oklch(0.5_0.2_240)] border border-[oklch(0.55_0.18_240)]/20",
                      o.status === "Cancelled" && "bg-destructive/10 text-destructive border border-destructive/20",
                    )}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-4 mt-4 text-center">
            <a href="/admin/orders" className="text-xs font-bold text-brand hover:text-brand-dark transition inline-flex items-center gap-1">
              View All Orders <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Top Performing Sri Lankan Products */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Top Performing Products</h3>
            <p className="text-xs text-muted-foreground">Most popular items in international shipments</p>
          </div>
          <span className="text-xs text-muted-foreground font-medium">Last 30 days</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border p-3 bg-muted/20 hover:bg-muted/40 transition">
              <img src={p.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover border border-border/55" />
              <div className="min-w-0">
                <div className="text-xs font-bold line-clamp-2 text-foreground">{p.title}</div>
                <div className="text-[11px] text-brand font-extrabold mt-1">
                  {p.sold.toLocaleString()} sold
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Stock: {p.stock > 0 ? `${p.stock} units` : <span className="text-destructive font-semibold">Out of Stock</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
