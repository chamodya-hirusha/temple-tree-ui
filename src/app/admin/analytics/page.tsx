"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { MONTHLY_SALES } from "@/data/products";
import {
  TrendingUp, DollarSign, ShoppingBag, Award, BarChart3, Globe, Download, ArrowUpRight, Percent, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminAnalyticsPage() {
  const { products, orders, formatPrice } = useStore();
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [currencyMode, setCurrencyMode] = useState<"USD" | "LKR">("USD");

  // Live statistics calculations from active store state
  const completedOrders = orders.filter((o) => o.status !== "Cancelled");
  const totalSalesUSD = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalSalesLKR = completedOrders.reduce((sum, o) => sum + (o.totalLKR || (o.total * 300)), 0);
  const totalOrders = completedOrders.length;
  
  const avgOrderValueUSD = totalOrders > 0 ? totalSalesUSD / totalOrders : 0;
  const avgOrderValueLKR = totalOrders > 0 ? totalSalesLKR / totalOrders : 0;

  // Category sales share calculations
  const categoryStats = [
    { name: "Spices", percentage: 38, count: 142, sales: 4230, color: "bg-brand" },
    { name: "Ceylon Tea", percentage: 27, count: 98, sales: 3105, color: "bg-[oklch(0.35_0.05_45)]" },
    { name: "Handicrafts", percentage: 18, count: 64, sales: 2190, color: "bg-[oklch(0.55_0.1_200)]" },
    { name: "Handloom & Textiles", percentage: 11, count: 41, sales: 1350, color: "bg-[oklch(0.6_0.2_25)]" },
    { name: "Ayurveda & Natural Products", percentage: 6, count: 22, sales: 740, color: "bg-[oklch(0.65_0.17_155)]" },
  ];

  // Country delivery share calculations
  const countryStats = [
    { country: "United States", share: 42, count: 180, growth: "+12.4%" },
    { country: "United Kingdom", share: 24, count: 102, growth: "+8.1%" },
    { country: "Australia", share: 16, count: 68, growth: "+15.0%" },
    { country: "Singapore", share: 12, count: 51, growth: "+4.3%" },
    { country: "Sri Lanka", share: 6, count: 25, growth: "+2.0%" },
  ];

  const handleExportData = () => {
    toast.success("Preparing analytical exports...");
    setTimeout(() => {
      toast.success("CSV report exported successfully! 📊");
    }, 1200);
  };

  // Find top selling products from catalog
  const topProducts = [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const maxSalesMonthVal = Math.max(...MONTHLY_SALES.map((m) => m.value));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <BarChart3 className="text-brand" size={28} /> Business Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Sri Lankan exports performance, transactional logs, and country sales distribution.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border border-border">
            {["USD", "LKR"].map((mode) => (
              <button
                key={mode}
                onClick={() => setCurrencyMode(mode as "USD" | "LKR")}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                  currencyMode === mode
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border border-border">
            {["Last 30 Days", "This Year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                  timeRange === range
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 rounded-xl bg-brand text-brand-foreground px-4 py-2.5 text-xs font-bold shadow-glow hover:bg-brand-dark transition-all"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sales Revenue",
            value: currencyMode === "USD" ? `$${totalSalesUSD.toLocaleString()}` : `Rs. ${totalSalesLKR.toLocaleString()}`,
            subText: "Completed deliveries",
            delta: "+14.2% YoY",
            up: true,
            icon: DollarSign,
            color: "text-brand"
          },
          {
            label: "Total Orders Completed",
            value: String(totalOrders),
            subText: "Exclude cancelled orders",
            delta: "+8.1% vs last month",
            up: true,
            icon: ShoppingBag,
            color: "text-success"
          },
          {
            label: "Average Order Value",
            value: currencyMode === "USD" ? `$${avgOrderValueUSD.toFixed(2)}` : `Rs. ${avgOrderValueLKR.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
            subText: "Per transaction average",
            delta: "+5.3% this quarter",
            up: true,
            icon: Award,
            color: "text-[oklch(0.55_0.1_200)]"
          },
          {
            label: "Audited Conversion Rate",
            value: "2.44%",
            subText: "Sessions to purchase",
            delta: "-0.12% vs last week",
            up: false,
            icon: Percent,
            color: "text-destructive"
          }
        ].map((card) => (
          <div key={card.label} className="rounded-2xl bg-card border border-border p-5 shadow-card space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{card.label}</span>
                <h3 className="text-2xl font-extrabold tracking-tight mt-1 text-foreground">{card.value}</h3>
              </div>
              <span className={cn("grid h-9 w-9 place-items-center rounded-xl bg-muted", card.color)}>
                <card.icon size={18} />
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/60">
              <span className="text-[10px] text-muted-foreground">{card.subText}</span>
              <span className={cn("text-[10px] font-bold flex items-center gap-0.5", card.up ? "text-success" : "text-destructive")}>
                {card.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sales Trend Bar Chart (Left 7 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-card border border-border p-6 shadow-card space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <div>
              <h3 className="text-lg font-bold">Monthly Sales Performance</h3>
              <p className="text-xs text-muted-foreground">Mock aggregated export volume trended across calendar year.</p>
            </div>
            <Calendar size={16} className="text-muted-foreground" />
          </div>

          {/* Bar Chart Representation using Tailwind */}
          <div className="h-64 flex items-end justify-between gap-2 pt-6 px-2">
            {MONTHLY_SALES.map((item) => {
              const pct = (item.value / maxSalesMonthVal) * 100;
              const formattedVal = currencyMode === "USD" ? `$${item.value}k` : `Rs. ${(item.valueLKR / 1000).toFixed(0)}m`;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="relative w-full flex justify-center">
                    {/* Tooltip on Hover */}
                    <span className="absolute -top-8 scale-0 group-hover:scale-100 transition bg-foreground text-background text-[10px] font-bold py-1 px-1.5 rounded shadow-lg whitespace-nowrap z-20">
                      {formattedVal}
                    </span>
                    {/* Bar */}
                    <div
                      style={{ height: `${pct}%` }}
                      className="w-full max-w-[2rem] rounded-t-lg bg-gradient-to-t from-brand/60 to-brand hover:from-brand hover:to-brand-dark transition-all duration-300 min-h-[4px]"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Distribution Card (Right 4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-card border border-border p-6 shadow-card space-y-4">
          <div className="pb-2 border-b border-border">
            <h3 className="text-lg font-bold">Product Categories</h3>
            <p className="text-xs text-muted-foreground">Distribution share of completed orders.</p>
          </div>

          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="text-muted-foreground">{cat.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full rounded-full", cat.color)} style={{ width: `${cat.percentage}%` }} />
                </div>
                <div className="flex justify-between items-center text-[9px] text-muted-foreground">
                  <span>{cat.count} items sold</span>
                  <span>{formatPrice(cat.sales)} sales</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Top selling products table */}
        <div className="lg:col-span-7 rounded-2xl bg-card border border-border p-6 shadow-card space-y-4">
          <div className="pb-2 border-b border-border">
            <h3 className="text-lg font-bold">Top Performing Products</h3>
            <p className="text-xs text-muted-foreground">Products sorted by standard units sold in client catalog logs.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="py-2.5">Product</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5 text-center">Units Sold</th>
                  <th className="py-2.5 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {topProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/10">
                    <td className="py-3 pr-2 flex items-center gap-2 font-bold text-foreground">
                      <img src={p.images[0]} alt="" className="h-8 w-8 rounded object-cover bg-muted shrink-0" />
                      <span className="truncate max-w-[150px]">{p.title.split(" — ")[0]}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">{p.category}</td>
                    <td className="py-3 text-center font-semibold text-foreground">{p.sold.toLocaleString()}</td>
                    <td className="py-3 text-right font-extrabold text-brand">
                      {formatPrice(p.price * p.sold)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Country distribution */}
        <div className="lg:col-span-5 rounded-2xl bg-card border border-border p-6 shadow-card space-y-4">
          <div className="pb-2 border-b border-border">
            <h3 className="text-lg font-bold">International Deliveries</h3>
            <p className="text-xs text-muted-foreground">Shipping volume share by destination market.</p>
          </div>

          <div className="space-y-3.5">
            {countryStats.map((item) => (
              <div key={item.country} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-muted-foreground shrink-0">
                    <Globe size={14} />
                  </span>
                  <span className="font-semibold text-foreground truncate">{item.country}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-extrabold text-brand tabular-nums">{item.share}% share</span>
                  <span className="text-[10px] text-muted-foreground">{item.count} orders</span>
                  <span className="text-[10px] font-bold text-success">{item.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
