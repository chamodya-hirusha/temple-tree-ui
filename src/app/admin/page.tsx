"use client";

import { motion } from "framer-motion";
import {
  DollarSign, ShoppingBag, AlertTriangle, Users, TrendingUp, TrendingDown, ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { MONTHLY_SALES } from "@/data/products";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { products, orders } = useStore();
  const lowStock = products.filter((p) => p.stock < 10).length;

  const stats = [
    { label: "Total Sales", value: "$45,230", delta: "+12.4%", up: true, I: DollarSign, accent: "from-brand to-brand-dark" },
    { label: "Total Orders", value: "1,240", delta: "+8.1%", up: true, I: ShoppingBag, accent: "from-[oklch(0.55_0.18_240)] to-[oklch(0.4_0.12_250)]" },
    { label: "Low Stock Alert", value: String(lowStock || 3), delta: "Needs attention", up: false, I: AlertTriangle, accent: "from-[oklch(0.7_0.18_30)] to-[oklch(0.55_0.2_25)]" },
    { label: "Active Customers", value: "8,420", delta: "+3.2%", up: true, I: Users, accent: "from-[oklch(0.55_0.15_155)] to-[oklch(0.4_0.12_160)]" },
  ];

  const max = Math.max(...MONTHLY_SALES.map((m) => m.value));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome back, Alex. Here's what's happening with Aura today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={cn("relative overflow-hidden rounded-2xl p-5 text-white shadow-card bg-gradient-to-br", s.accent)}
          >
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
                  <s.I size={18} />
                </div>
                <div className={cn("flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold backdrop-blur")}>
                  {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {s.delta}
                </div>
              </div>
              <div className="mt-4 text-3xl font-extrabold tracking-tight">{s.value}</div>
              <div className="text-xs opacity-80 mt-1">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sales chart */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Sales Performance</h3>
              <p className="text-xs text-muted-foreground">Monthly revenue · 2026 (in thousands)</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold rounded-full bg-success/10 text-success px-2.5 py-1">
              <ArrowUpRight size={12} /> +18.2% YoY
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-56">
            {MONTHLY_SALES.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[10px] font-bold tabular-nums text-muted-foreground">${m.value}k</div>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.value / max) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="w-full rounded-t-md bg-gradient-to-t from-brand to-brand/60 min-h-[4px] hover:opacity-80 transition cursor-pointer"
                />
                <div className="text-[10px] text-muted-foreground">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
          <h3 className="text-lg font-bold">Recent Orders</h3>
          <p className="text-xs text-muted-foreground mb-4">Latest activity from your store</p>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center gap-3 rounded-lg hover:bg-muted/60 p-2 transition">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-brand-foreground text-[10px] font-bold shrink-0">
                  {o.customer.split(" ").map((x) => x[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{o.customer}</div>
                  <div className="text-xs text-muted-foreground truncate">{o.id} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold tabular-nums">${o.total}</div>
                  <span className={cn(
                    "text-[10px] font-semibold rounded-full px-1.5 py-0.5",
                    o.status === "Delivered" && "bg-success/10 text-success",
                    o.status === "Pending" && "bg-warning/15 text-warning",
                    o.status === "Shipped" && "bg-[oklch(0.55_0.18_240)]/10 text-[oklch(0.5_0.2_240)]",
                    o.status === "Cancelled" && "bg-destructive/10 text-destructive",
                  )}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best sellers row */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Top Performing Products</h3>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <img src={p.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="min-w-0">
                <div className="text-xs font-semibold line-clamp-2">{p.title}</div>
                <div className="text-xs text-brand font-bold mt-0.5">{p.sold.toLocaleString()} sold</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
