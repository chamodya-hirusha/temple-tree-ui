"use client";

import { useState } from "react";
import { CUSTOMERS } from "@/data/products";
import { Users, Search, ShoppingBag, DollarSign, Calendar, Mail, Compass, HelpCircle } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

export default function CustomersAdminPage() {
  const { formatPrice } = useStore();
  const [query, setQuery] = useState("");

  const filteredCustomers = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  // Compute total spent across mock buyers list
  const totalSpentUSD = CUSTOMERS.reduce((sum, c) => sum + c.spent, 0);
  const totalOrders = CUSTOMERS.reduce((sum, c) => sum + c.orders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Users className="text-brand" size={28} /> Customer Registry
        </h1>
        <p className="text-sm text-muted-foreground">
          View registered buyers profiles, checkout count frequencies, and total revenue contributions.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: String(CUSTOMERS.length), sub: "Registered accounts", icon: Users },
          { label: "Cumulative Purchases", value: `${totalOrders} orders`, sub: "Placed globally", icon: ShoppingBag },
          { label: "Revenue Contribution", value: formatPrice(totalSpentUSD), sub: "Life-time values", icon: DollarSign }
        ].map((card) => (
          <div key={card.label} className="rounded-2xl bg-card border border-border p-5 shadow-card space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{card.label}</span>
                <h3 className="text-xl font-extrabold tracking-tight mt-1 text-foreground">{card.value}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">{card.sub}</p>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-muted text-brand">
                <card.icon size={15} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Customers List */}
      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-muted/20">
          <h3 className="text-sm font-bold text-foreground">Registered Accounts</h3>
          <div className="relative w-full max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl bg-background border border-border pl-9 pr-3 py-2 text-xs outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search size={32} className="mx-auto opacity-20 mb-2" />
              <div className="text-xs font-bold">No customers match</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Try modifying your search query.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider bg-muted/10">
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Orders</th>
                  <th className="p-4 text-right">Total Spent</th>
                  <th className="p-4 text-center">Customer Since</th>
                  <th className="p-4 text-center">User Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCustomers.map((c) => {
                  const isLocal = c.email.endsWith(".lk");
                  return (
                    <tr key={c.id} className="hover:bg-muted/10 transition-all">
                      <td className="p-4 flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brand text-brand-foreground text-xs font-bold shadow-sm">
                          {c.avatar}
                        </div>
                        <span className="font-bold text-foreground">{c.name}</span>
                      </td>
                      <td className="p-4 font-mono text-muted-foreground">{c.email}</td>
                      <td className="p-4 text-center font-semibold text-foreground">{c.orders}</td>
                      <td className="p-4 text-right font-extrabold text-brand tabular-nums">
                        {formatPrice(c.spent)}
                      </td>
                      <td className="p-4 text-center text-muted-foreground">{c.joined}</td>
                      <td className="p-4 text-center">
                        <span
                          className={cn(
                            "inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border",
                            isLocal
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-[oklch(0.55_0.1_200)]/15 text-[oklch(0.55_0.1_200)] border-[oklch(0.55_0.1_200)]/20"
                          )}
                        >
                          {isLocal ? "Local (LK)" : "International"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Support Helper */}
      <div className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1 pt-4">
        <HelpCircle size={10} /> Need to batch modify user privileges? Reach out to support at <a href="mailto:support@aura.com" className="text-brand font-semibold hover:underline">support@aura.com</a>
      </div>
    </div>
  );
}
