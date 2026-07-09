"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Mail, Calendar, Eye, FileText, Landmark, CreditCard, Truck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { type Order, type OrderStatus } from "@/data/products";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/CustomDropdown";
import { DataTablePagination } from "@/components/admin/DataTablePagination";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
];

const TABS = ["All", "Pending", "Shipped", "Delivered", "Cancelled"] as const;

export default function OrdersAdmin() {
  const { orders, updateOrderStatus } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = tab === "All" ? orders : orders.filter((o) => o.status === tab);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedOrders = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, orders.length]);

  // Status updates handler
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    // If the active modal is showing this order, update it in local state view
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status } : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Orders Management</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders from domestic & overseas markets</p>
        </div>
      </div>

      {/* Filter Tabs and Table */}
      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex flex-wrap gap-1.5 p-3.5 border-b border-border bg-muted/20">
          {TABS.map((t) => {
            const count = t === "All" ? orders.length : orders.filter((o) => o.status === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all duration-150 flex items-center gap-2 border",
                  tab === t
                    ? "bg-brand text-brand-foreground border-brand shadow-glow"
                    : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground",
                )}
              >
                {t}
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-extrabold tabular-nums",
                  tab === t ? "bg-white/20 text-brand-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground font-bold border-b border-border">
              <tr>
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer Details</th>
                <th className="p-4 font-bold">Destination</th>
                <th className="p-4 font-bold">Date Placed</th>
                <th className="p-4 font-bold text-center">Items</th>
                <th className="p-4 font-bold text-right">Total Amount (LKR / USD)</th>
                <th className="p-4 font-bold text-center">Payment Method</th>
                <th className="p-4 font-bold text-center">Order Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedOrders.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-muted/20 transition-all duration-150 cursor-pointer"
                  onClick={() => setSelectedOrder(o)}
                >
                  <td className="p-4 font-mono font-bold text-foreground text-xs">{o.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-foreground">{o.customer}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">{o.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground text-xs">
                      {o.country}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground font-semibold">{o.date}</td>
                  <td className="p-4 text-center font-bold tabular-nums text-foreground">{o.items.length}</td>
                  <td className="p-4 text-right">
                    <div className="font-bold text-foreground tabular-nums">
                      Rs. {(o.totalLKR || (o.total * 300)).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground font-semibold tabular-nums mt-0.5">
                      ${o.total.toFixed(2)} USD
                    </div>
                  </td>
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border",
                        o.paymentMethod === "Card" && "bg-success/5 text-success border-success/15",
                        o.paymentMethod === "COD" && "bg-slate-deep/5 text-slate-deep border-slate-deep/15",
                      )}>
                        {o.paymentMethod === "Card" && <CreditCard size={10} />}
                        {o.paymentMethod === "COD" && <Truck size={10} />}
                        {o.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="w-32 mx-auto">
                      <CustomDropdown
                        options={STATUS_OPTIONS}
                        selectedValue={o.status}
                        onChange={(val) => handleStatusChange(o.id, val as OrderStatus)}
                        className="py-0.5"
                      />
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold hover:bg-muted/40 transition"
                    >
                      <Eye size={12} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-16 text-center text-muted-foreground text-sm font-semibold">
            No orders found under this category filter.
          </div>
        )}
        {filtered.length > 0 && (
          <DataTablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 z-50 bg-slate-deep/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background border border-border shadow-2xl p-6"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border pb-4 mb-5">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Order ID: {selectedOrder.id}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Placed on {selectedOrder.date}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="grid h-9 w-9 place-items-center rounded-xl hover:bg-muted text-foreground transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Order Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                  I={Mail}
                  title="Customer Info"
                  content={`${selectedOrder.customer}\n${selectedOrder.email}`}
                />
                <InfoCard
                  I={MapPin}
                  title="International Destination"
                  content={`${selectedOrder.address}\nCountry: ${selectedOrder.country}`}
                />
                <InfoCard
                  I={Landmark}
                  title="Payment Method"
                  content={
                    <div>
                      <div className="font-semibold text-foreground">{selectedOrder.paymentMethod}</div>
                    </div>
                  }
                />
                <div className="rounded-2xl border border-border p-4 bg-muted/10">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Status Settings
                  </span>
                  <div className="mt-2.5">
                    <CustomDropdown
                      options={STATUS_OPTIONS}
                      selectedValue={selectedOrder.status}
                      onChange={(val) => handleStatusChange(selectedOrder.id, val as OrderStatus)}
                    />
                  </div>

                </div>
              </div>

              {/* Items List */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Items Ordered ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-muted/10">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 p-3.5">
                      <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover border border-border/50 bg-white" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-foreground truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 font-semibold">
                          Qty: {item.qty} · ${item.price} USD
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-foreground tabular-nums">
                          Rs. {(item.price * item.qty * 300).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground font-semibold tabular-nums mt-0.5">
                          ${(item.price * item.qty).toFixed(2)} USD
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Section */}
              <div className="mt-6 border-t border-border pt-4 flex justify-between items-center bg-muted/10 p-4 rounded-2xl">
                <div>
                  <div className="text-xs text-muted-foreground font-bold uppercase">Estimated Gross Value</div>
                  <div className="text-2xl font-extrabold text-brand tabular-nums mt-0.5">
                    Rs. {(selectedOrder.totalLKR || (selectedOrder.total * 300)).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground font-bold uppercase">Invoice Base</div>
                  <div className="text-lg font-bold text-foreground tabular-nums mt-0.5">
                    ${selectedOrder.total.toFixed(2)} USD
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 rounded-xl border border-border bg-card py-3 text-xs font-bold hover:bg-muted transition"
                >
                  Close Window
                </button>
                {selectedOrder.status === "Pending" && (
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, "Shipped")}
                    className="flex-1 rounded-xl bg-brand text-brand-foreground py-3 text-xs font-extrabold hover:bg-brand-dark shadow-glow transition-all"
                  >
                    Approve & Mark as Shipped
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCard({ I, title, content }: { I: React.ComponentType<{ size?: number; className?: string }>; title: string; content: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border p-4 bg-muted/5">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <I size={12} className="text-brand" /> {title}
      </div>
      <div className="mt-2 text-xs font-semibold text-foreground whitespace-pre-line leading-relaxed">
        {content}
      </div>
    </div>
  );
}
