"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, MapPin, Search, Calendar, ChevronRight, User, ShieldCheck, HelpCircle, LogOut } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AccountDashboard() {
  const { orders, formatPrice, currency, user, logout } = useStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "address">("orders");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Shipping Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    email: "",
    phone: "+1 (555) 234 5678",
    address: "221B Baker Street",
    city: "London",
    postalCode: "NW1 6XE",
    country: "United Kingdom",
  });

  // Prefill address form based on user details
  useEffect(() => {
    if (user) {
      setAddressForm(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  if (!user) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Default shipping address updated! 📦");
  };

  // Generate a mock tracking code based on order status
  const getTrackingInfo = (orderId: string, status: string) => {
    if (status === "Pending") return { carrier: "Processing", code: "Awaiting dispatch" };
    if (status === "Cancelled") return { carrier: "None", code: "Order Cancelled" };
    
    // Hash order ID to get consistent numbers
    let hash = 0;
    for (let i = 0; i < orderId.length; i++) hash = orderId.charCodeAt(i) + ((hash << 5) - hash);
    const trackingNum = Math.abs(hash % 9000000) + 1000000;
    const carrier = hash % 2 === 0 ? "DHL Express" : "FedEx International";

    return { carrier, code: `${carrier.split(" ")[0].toUpperCase()}-${trackingNum}` };
  };

  return (
    <div className="bg-muted/40 pb-20 min-h-[75vh]">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        {/* User Hero Greeting */}
        <div className="rounded-3xl bg-gradient-to-r from-[oklch(0.35_0.05_45)] to-[oklch(0.25_0.04_45)] p-8 text-white border border-border shadow-card mb-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/5 blur-2xl" />
          <div className="relative flex flex-wrap items-center gap-5 justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-brand text-2xl font-extrabold border border-white/10">
                {user.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">Ayubowan, {user.name.split(" ")[0]}!</h1>
                <p className="text-sm opacity-80 mt-0.5">Welcome back to your global Ceylon goods hub profile.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs font-semibold opacity-90 bg-white/10 px-4 py-2.5 rounded-xl border border-white/5">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold text-white/60">Preferred Currency</span>
                <span className="text-brand font-bold text-sm">{currency}</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold text-white/60">Total Orders</span>
                <span className="font-bold text-sm">{orders.length} placed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Split Sections */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Tab Navigation */}
          <aside className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("orders")}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold border transition-all duration-150",
                activeTab === "orders"
                  ? "bg-brand text-brand-foreground border-brand shadow-glow"
                  : "bg-card text-muted-foreground border-border hover:bg-muted"
              )}
            >
              <Package size={16} /> My Orders
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold border transition-all duration-150",
                activeTab === "address"
                  ? "bg-brand text-brand-foreground border-brand shadow-glow"
                  : "bg-card text-muted-foreground border-border hover:bg-muted"
              )}
            >
              <MapPin size={16} /> Shipping Address
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold border border-destructive/25 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all duration-155"
            >
              <LogOut size={16} /> Sign Out
            </button>

            <div className="rounded-2xl border border-border bg-card p-4 mt-6 text-xs text-muted-foreground space-y-2 leading-relaxed">
              <div className="font-bold text-foreground flex items-center gap-1.5"><ShieldCheck size={14} className="text-success" /> Customer Support</div>
              Need help with international shipping, custom duties or payment queries? 
              <a href="mailto:support@auracraft.com" className="text-brand font-bold hover:underline block mt-1">support@auracraft.com</a>
            </div>
          </aside>

          {/* Tab Content Display */}
          <div className="lg:col-span-3">
            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
              >
                <div className="p-5 border-b border-border bg-muted/10">
                  <h3 className="text-lg font-bold text-foreground">Order History</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Track your pending and dispatched packages</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground font-bold border-b border-border">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Amount ({currency})</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4">Tracking Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {orders.map((o) => {
                        const tracking = getTrackingInfo(o.id, o.status);
                        return (
                          <tr key={o.id} className="hover:bg-muted/20 transition-all duration-150">
                            <td className="p-4 font-mono font-bold text-xs text-foreground">{o.id}</td>
                            <td className="p-4 text-xs text-muted-foreground font-semibold">{o.date}</td>
                            <td className="p-4 text-right font-bold text-foreground tabular-nums">
                              {formatPrice(o.total)}
                            </td>
                            <td className="p-4 text-center">
                              <span className={cn(
                                "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border",
                                o.status === "Delivered" && "bg-success/5 text-success border-success/15",
                                o.status === "Pending" && "bg-warning/5 text-warning border-warning/20",
                                o.status === "Shipped" && "bg-[oklch(0.55_0.18_240)]/5 text-[oklch(0.5_0.2_240)] border border-[oklch(0.55_0.18_240)]/15",
                                o.status === "Cancelled" && "bg-destructive/5 text-destructive border-destructive/15",
                              )}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4">
                              {o.status === "Pending" ? (
                                <span className="text-xs text-muted-foreground font-medium italic">
                                  {tracking.code}
                                </span>
                              ) : o.status === "Cancelled" ? (
                                <span className="text-xs text-muted-foreground/50 font-medium">
                                  Not applicable
                                </span>
                              ) : (
                                <div className="text-xs">
                                  <div className="font-bold text-foreground">{tracking.carrier}</div>
                                  <Link
                                    href={`/track?orderId=${o.id}&email=${o.email}`}
                                    className="text-brand hover:underline font-semibold text-[10px] mt-0.5 block"
                                  >
                                    {tracking.code}
                                  </Link>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {orders.length === 0 && (
                  <div className="p-16 text-center text-muted-foreground text-sm font-semibold">
                    You have not placed any orders yet.
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "address" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl shadow-card p-6"
              >
                <div className="border-b border-border pb-4 mb-6">
                  <h3 className="text-lg font-bold text-foreground">Default Shipping Address</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage details for faster international checkout transactions</p>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</span>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</span>
                      <input
                        type="email"
                        required
                        value={addressForm.email}
                        onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                      />
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block sm:col-span-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Street Address</span>
                      <input
                        type="text"
                        required
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</span>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Postal Code</span>
                      <input
                        type="text"
                        required
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Country / Region</span>
                    <input
                      type="text"
                      required
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                    />
                  </label>

                  <div className="pt-4 border-t border-border mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-brand text-brand-foreground px-6 py-3 text-xs font-extrabold hover:bg-brand-dark shadow-glow transition-all"
                    >
                      Save Shipping Address
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
