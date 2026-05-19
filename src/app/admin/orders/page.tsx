"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Mail, Calendar } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { type Order } from "@/data/products";
import { cn } from "@/lib/utils";

const TABS = ["All", "Pending", "Shipped", "Delivered", "Cancelled"] as const;

export default function OrdersAdmin() {
  const { orders } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = tab === "All" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="flex flex-wrap gap-1 p-3 border-b border-border">
          {TABS.map((t) => {
            const count = t === "All" ? orders.length : orders.filter((o) => o.status === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-2",
                  tab === t ? "bg-brand text-brand-foreground shadow-glow" : "hover:bg-muted text-muted-foreground",
                )}
              >
                {t} <span className={cn("rounded-full px-1.5 text-[10px]", tab === t ? "bg-white/20" : "bg-muted")}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-4 font-semibold">Order ID</th>
                <th className="text-left p-4 font-semibold">Customer</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-center p-4 font-semibold">Items</th>
                <th className="text-right p-4 font-semibold">Total</th>
                <th className="text-center p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} onClick={() => setSelected(o)} className="border-t border-border hover:bg-muted/30 cursor-pointer transition">
                  <td className="p-4 font-mono font-semibold">{o.id}</td>
                  <td className="p-4">
                    <div className="font-semibold">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </td>
                  <td className="p-4 text-xs">{o.date}</td>
                  <td className="p-4 text-center">{o.items.length}</td>
                  <td className="p-4 text-right font-bold tabular-nums">${o.total}</td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "inline-block rounded-full px-2.5 py-1 text-xs font-bold",
                      o.status === "Delivered" && "bg-success/10 text-success",
                      o.status === "Pending" && "bg-warning/15 text-warning",
                      o.status === "Shipped" && "bg-[oklch(0.55_0.18_240)]/10 text-[oklch(0.5_0.2_240)]",
                      o.status === "Cancelled" && "bg-destructive/10 text-destructive",
                    )}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-50 bg-slate-deep/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold">Order {selected.id}</h3>
                    <p className="text-sm text-muted-foreground">Placed on {selected.date}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted"><X size={18} /></button>
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                  <Info I={Mail} t="Customer" v={`${selected.customer}\n${selected.email}`} />
                  <Info I={MapPin} t="Shipping Address" v={selected.address} />
                  <Info I={Calendar} t="Status" v={selected.status} />
                  <Info I={Calendar} t="Total" v={`$${selected.total}`} />
                </div>
                <div className="mt-5">
                  <h4 className="text-sm font-bold mb-2">Items ({selected.items.length})</h4>
                  <div className="space-y-2 rounded-xl border border-border p-3">
                    {selected.items.map((i, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img src={i.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold line-clamp-1">{i.title}</div>
                          <div className="text-xs text-muted-foreground">Qty: {i.qty}</div>
                        </div>
                        <div className="font-bold text-brand tabular-nums">${(i.price * i.qty).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button className="flex-1 rounded-xl border-2 border-border py-2.5 text-sm font-semibold hover:bg-muted">Print Invoice</button>
                  <button className="flex-1 rounded-xl bg-brand text-brand-foreground py-2.5 text-sm font-bold hover:bg-brand-dark shadow-glow">Mark as Shipped</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info({ I, t, v }: { I: React.ComponentType<{ size?: number; className?: string }>; t: string; v: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><I size={12} /> {t}</div>
      <div className="mt-1 text-sm font-medium whitespace-pre-line">{v}</div>
    </div>
  );
}
