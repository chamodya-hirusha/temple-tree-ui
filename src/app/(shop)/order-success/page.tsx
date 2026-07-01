"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
// Order Success Page Imports update
import { Check, Download, ShoppingBag, MapPin, CreditCard, ChevronRight, HelpCircle, Truck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock Fallback Order if accessed directly or no order exists
const MOCK_FALLBACK_ORDER = {
  id: "BRN-2026-9482",
  customer: "Chamodya Hirusha",
  email: "chamodya@example.com",
  address: "123 Galle Road, Colombo 03, Sri Lanka",
  date: "2026-06-21",
  total: 148.00,
  country: "Sri Lanka",
  paymentMethod: "Card" as const,
  items: [
    {
      productId: "p3",
      title: "Luxury Ceylon Silver Tips White Tea",
      qty: 1,
      price: 129.00,
      image: "/assets/product-5.png"
    },
    {
      productId: "p1",
      title: "Premium Organic Ceylon Cinnamon Quills",
      qty: 1,
      price: 19.00,
      image: "/assets/product-1.png"
    }
  ]
};

function OrderSuccessContent() {
  const { orders, formatPrice } = useStore();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // Find the order by ID, or grab the latest order from client context, or fallback to mock template
  const order = orders.find((o) => o.id === orderId) || orders[0] || MOCK_FALLBACK_ORDER;

  const customerFirstName = order.customer ? order.customer.split(" ")[0] : "Customer";

  // Calculate dynamic shipping cost based on country
  const getShippingCost = (c: string) => {
    const name = c.toLowerCase();
    if (name === "sri lanka" || name === "lk") return 0;
    if (name === "united kingdom" || name === "singapore" || name === "uk" || name === "sg") return 15;
    return 25;
  };

  const shippingUSD = getShippingCost(order.country);

  // Calculate items subtotal based on purchase price logs
  const subtotalUSD = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountUSD = Math.max(0, subtotalUSD + shippingUSD - order.total);

  const getPaymentText = (method: "Card" | "Bank Transfer" | "COD") => {
    switch (method) {
      case "Card":
        return "Paid via Credit/Debit Card (Secure Stripe Settlement)";
      case "Bank Transfer":
        return "Direct Bank Deposit — Slip uploaded & pending verification";
      case "COD":
        return "Cash on Delivery — Payable in cash upon arrival";
      default:
        return "Payment Completed";
    }
  };

  const handleDownloadInvoice = () => {
    toast.success("Generating invoice PDF...");
    setTimeout(() => {
      toast.success(`Invoice for ${order.id} downloaded successfully! 📄`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Success Header & Animation */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-brand shadow-glow"
          >
            <Check className="h-10 w-10 text-brand-foreground" strokeWidth={3} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Hi <span className="font-bold text-foreground">{customerFirstName}</span>, your order has been placed successfully and is currently being processed.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-4 py-1.5 text-xs font-bold text-muted-foreground shadow-sm">
              Order Ref: <span className="text-brand font-extrabold">#{order.id}</span>
            </div>
          </motion.div>
        </div>

        {/* Step-by-Step Logistics Tracker Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-card border border-border p-6 shadow-card"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Logistics Status Tracking
          </h3>
          <div className="relative">
            {/* Timeline connector bar */}
            <div className="absolute top-3 left-6 right-6 h-0.5 bg-muted hidden sm:block" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
              {[
                { label: "Order Placed", desc: "Order details recorded", active: true, done: true },
                { label: "Processing", desc: "Preparing export package", active: false, done: false },
                { label: "Shipped", desc: "DHL/FedEx Air Freight", active: false, done: false },
                { label: "Delivered", desc: "Arrived at destination", active: false, done: false },
              ].map((step, idx) => (
                <div key={step.label} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                  <div
                    className={cn(
                      "grid h-7.5 w-7.5 shrink-0 place-items-center rounded-full text-[10px] font-bold z-10 transition-all",
                      step.done
                        ? "bg-brand text-brand-foreground shadow-glow"
                        : "bg-muted text-muted-foreground border border-border"
                    )}
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
        </motion.div>

        {/* Summary Card divided into 2 Columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-12 gap-6"
        >
          {/* Column 1: Shipping & Payment Details (Left) */}
          <div className="md:col-span-5 rounded-3xl bg-card border border-border p-6 shadow-card space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-4">
                <MapPin size={12} /> Shipping Address
              </h3>
              <div className="rounded-2xl bg-muted/30 border border-border/80 p-4">
                <div className="text-xs font-bold text-foreground">{order.customer}</div>
                <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line">
                  {order.address}
                </div>
                <div className="text-xs font-semibold text-foreground mt-2">{order.country}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-4">
                <CreditCard size={12} /> Payment Terms
              </h3>
              <div className="rounded-2xl bg-muted/30 border border-border/80 p-4 space-y-1">
                <div className="text-xs font-bold text-foreground">
                  {order.paymentMethod === "COD" ? "Cash on Delivery (COD)" : order.paymentMethod === "Bank Transfer" ? "Bank Wire Transfer" : "Credit / Debit Card"}
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal mt-1">
                  {getPaymentText(order.paymentMethod)}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Order Items & Pricing Breakdown (Right) */}
          <div className="md:col-span-7 rounded-3xl bg-card border border-border p-6 shadow-card flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Purchased Items
              </h3>
              <div className="divide-y divide-border/60 max-h-56 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-3 py-3 first:pt-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-12 w-12 rounded-lg object-cover bg-muted border border-border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-foreground line-clamp-2 leading-tight">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Qty: {item.qty} · {formatPrice(item.price)} each
                      </div>
                    </div>
                    <div className="text-xs font-bold text-foreground shrink-0 tabular-nums">
                      {formatPrice(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-border pt-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground tabular-nums">{formatPrice(subtotalUSD)}</span>
              </div>
              {discountUSD > 0 && (
                <div className="flex justify-between items-center text-success">
                  <span>Discount</span>
                  <span className="font-bold tabular-nums">-{formatPrice(discountUSD)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-muted-foreground">
                <span>International Shipping</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {shippingUSD === 0 ? "FREE" : formatPrice(shippingUSD)}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center text-sm font-extrabold text-foreground">
                <span>Total Amount</span>
                <span className="text-brand tabular-nums text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Buttons & Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-border"
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-6 py-3 text-sm font-bold shadow-glow hover:bg-brand-dark transition-all w-full sm:w-auto justify-center"
          >
            <ShoppingBag size={15} /> Continue Shopping
          </Link>
          <Link
            href={`/track?orderId=${order.id}&email=${order.email}`}
            className="flex items-center gap-2 rounded-xl border border-brand/35 bg-brand/5 text-brand px-6 py-3 text-sm font-bold hover:bg-brand/10 transition-all w-full sm:w-auto justify-center"
          >
            <Truck size={15} /> Track Shipment
          </Link>
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 rounded-xl border border-border bg-card text-foreground px-6 py-3 text-sm font-bold hover:bg-muted transition-all w-full sm:w-auto justify-center"
          >
            <Download size={15} /> Download Invoice PDF
          </button>
        </motion.div>

        {/* Support Disclaimer Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-[11px] text-muted-foreground max-w-sm mx-auto space-y-1"
        >
          <p>
            An invoice confirmation email has been dispatched to{" "}
            <span className="font-semibold text-foreground">{order.email}</span>.
          </p>
          <p className="flex items-center justify-center gap-1">
            <HelpCircle size={10} /> Need help? Contact our Support Desk at{" "}
            <a href="mailto:support@Slmalkohacom" className="text-brand hover:underline font-semibold">
              support@Slmalkohacom
            </a>
          </p>
        </motion.div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-muted/20 flex items-center justify-center text-sm font-semibold text-muted-foreground">
          Loading order details...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
