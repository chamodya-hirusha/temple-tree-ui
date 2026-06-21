"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import {
  Search, ShieldAlert, ArrowLeft, Check, HelpCircle, Truck, Package, Calendar, MapPin, CreditCard
} from "lucide-react";
import Link from "next/link";

export default function OrderTrackingPage() {
  const { orders, formatPrice } = useStore();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const qOrderId = params.get("orderId");
      const qEmail = params.get("email");

      if (qOrderId && qEmail) {
        setOrderId(qOrderId);
        setEmail(qEmail);
        setSearched(true);

        const idClean = qOrderId.trim().toUpperCase();
        const emailClean = qEmail.trim().toLowerCase();

        const match = orders.find(
          (o) => o.id.toUpperCase() === idClean && o.email.toLowerCase() === emailClean
        );
        setFoundOrder(match || null);
      }
    }
  }, [orders]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    const idClean = orderId.trim().toUpperCase();
    const emailClean = email.trim().toLowerCase();

    // Look up the order in StoreContext state
    const match = orders.find(
      (o) => o.id.toUpperCase() === idClean && o.email.toLowerCase() === emailClean
    );

    setFoundOrder(match || null);
  };

  const subtotalUSD = foundOrder
    ? foundOrder.items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0)
    : 0;

  const getShippingCost = (c: string) => {
    const name = c.toLowerCase();
    if (name === "sri lanka" || name === "lk") return 0;
    if (name === "united kingdom" || name === "singapore" || name === "uk" || name === "sg") return 15;
    return 25;
  };

  const getCourierText = (c: string) => {
    if (c === "Sri Lanka") return "Domex Local Express Courier";
    if (["United Kingdom", "Singapore", "UK", "SG"].includes(c)) return "FedEx Priority International";
    return "DHL Express Worldwide Cargo";
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-24 pt-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-brand transition mb-2"
        >
          <ArrowLeft size={14} /> Back to Store
        </Link>

        {/* Search Panel Card */}
        <div className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Track Your Order</h1>
            <p className="text-xs text-muted-foreground">
              Enter your invoice details to query shipping tracking details and courier timelines.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="grid sm:grid-cols-2 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Order Reference ID
              </label>
              <input
                required
                type="text"
                placeholder="ORD-10245"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="buyer@aura.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-brand"
              />
            </div>
            <button
              type="submit"
              className="sm:col-span-2 w-full flex items-center justify-center gap-2 rounded-xl bg-brand text-brand-foreground py-3 text-xs font-bold shadow-glow hover:bg-brand-dark transition-all"
            >
              <Search size={14} /> Retrieve Shipment Status
            </button>
          </form>
          <p className="text-[10px] text-muted-foreground">
            *Try: Order ID <span className="font-semibold text-foreground">ORD-10245</span> and email{" "}
            <span className="font-semibold text-foreground">emily.c@example.com</span> to test sample logs.
          </p>
        </div>

        {/* Tracking Details Display */}
        {searched && (
          foundOrder ? (
            <div className="space-y-6">
              
              {/* Tracker Card */}
              <div className="rounded-3xl bg-card border border-border p-6 shadow-card space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Order Status</span>
                    <h3 className="text-lg font-bold text-foreground">Reference: #{foundOrder.id}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Courier:</span>
                    <span className="rounded-lg bg-brand/10 text-brand px-2.5 py-1 text-xs font-extrabold">
                      {getCourierText(foundOrder.country)}
                    </span>
                  </div>
                </div>

                {/* Timeline Grid */}
                <div className="relative pt-2">
                  <div className="absolute top-4.5 left-6 right-6 h-0.5 bg-muted hidden sm:block" />
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                    {[
                      {
                        label: "Order Placed",
                        desc: foundOrder.date,
                        done: true
                      },
                      {
                        label: "Processing",
                        desc: "Ready at Colombo hub",
                        done: foundOrder.status === "Shipped" || foundOrder.status === "Delivered"
                      },
                      {
                        label: "Shipped",
                        desc: "Outbound air transit",
                        done: foundOrder.status === "Shipped" || foundOrder.status === "Delivered"
                      },
                      {
                        label: "Delivered",
                        desc: "Signature recorded",
                        done: foundOrder.status === "Delivered"
                      }
                    ].map((step, idx) => (
                      <div key={step.label} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold z-10 border transition-all ${
                            step.done
                              ? "bg-brand text-brand-foreground shadow-glow border-brand"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {step.done ? <Check size={12} strokeWidth={2.5} /> : idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground">{step.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logistics details row */}
                {foundOrder.status !== "Cancelled" ? (
                  <div className="grid sm:grid-cols-2 gap-4 bg-muted/40 rounded-2xl p-4 text-xs border border-border/80">
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-semibold flex items-center gap-1.5"><Truck size={12} /> Air Waybill (AWB) Code</div>
                      <div className="font-extrabold text-foreground tracking-wide uppercase">
                        {foundOrder.paymentMethod === "COD" ? "DOMEX-" : "DHL-"}{foundOrder.id}-SL
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground font-semibold flex items-center gap-1.5"><Calendar size={12} /> Estimated Delivery</div>
                      <div className="font-bold text-foreground">
                        Within 3-5 Business Days
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2.5 rounded-2xl bg-destructive/10 text-destructive p-4 text-xs border border-destructive/20">
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">This campaign order has been cancelled.</div>
                      <p className="mt-0.5 text-destructive/80">Refunds have been processed back to your card. Please contact customer support for further information.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items & Breakdown */}
              <div className="grid md:grid-cols-12 gap-6 items-start">
                {/* Shipping & Payment Column */}
                <div className="md:col-span-5 rounded-3xl bg-card border border-border p-6 shadow-card space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3"><MapPin size={12} /> Shipping Destination</h3>
                    <div className="rounded-2xl border border-border bg-muted/20 p-4 text-xs space-y-1">
                      <div className="font-bold text-foreground">{foundOrder.customer}</div>
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{foundOrder.address}</div>
                      <div className="font-semibold text-foreground mt-1.5">{foundOrder.country}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3"><CreditCard size={12} /> Payment Summary</h3>
                    <div className="rounded-2xl border border-border bg-muted/20 p-4 text-xs space-y-1">
                      <div className="font-bold text-foreground">
                        {foundOrder.paymentMethod === "Card" ? "Credit / Debit Card" : foundOrder.paymentMethod === "Bank Transfer" ? "Bank Wire Transfer" : "Cash on Delivery (COD)"}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {foundOrder.paymentMethod === "Card" ? "Payment cleared and processed securely." : foundOrder.paymentMethod === "Bank Transfer" ? "Deposit verification complete." : "Cash collection pending delivery."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Summary Column */}
                <div className="md:col-span-7 rounded-3xl bg-card border border-border p-6 shadow-card space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Items</h3>
                  
                  <div className="divide-y divide-border/60 max-h-56 overflow-y-auto pr-1">
                    {foundOrder.items.map((item: any) => (
                      <div key={item.productId} className="flex gap-3 py-3 first:pt-0">
                        <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-muted border border-border shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-foreground truncate">{item.title}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">Qty: {item.qty} · {formatPrice(item.price)} each</div>
                        </div>
                        <div className="text-xs font-bold text-foreground shrink-0 tabular-nums">
                          {formatPrice(item.price * item.qty)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calculations breakdown */}
                  <div className="border-t border-border pt-4 text-xs space-y-2">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground tabular-nums">{formatPrice(subtotalUSD)}</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Shipping Fee</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {getShippingCost(foundOrder.country) === 0 ? "FREE" : formatPrice(getShippingCost(foundOrder.country))}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between items-center text-sm font-extrabold text-foreground">
                      <span>Grand Total</span>
                      <span className="text-brand tabular-nums">{formatPrice(foundOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-border bg-card p-12 text-center shadow-card space-y-2">
              <ShieldAlert className="mx-auto text-destructive" size={36} />
              <h3 className="text-sm font-bold">Order Not Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                We couldn't locate any order matches for reference <span className="font-semibold text-foreground">#{orderId}</span> and email <span className="font-semibold text-foreground">{email}</span>. Please verify your invoice logs and try again.
              </p>
            </div>
          )
        )}

        {/* Helpful Support guidelines */}
        <div className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
          <HelpCircle size={10} /> Need help resolving shipment issues? Email our support desk at <a href="mailto:support@aura.com" className="text-brand font-semibold hover:underline">support@aura.com</a>
        </div>

      </div>
    </div>
  );
}
