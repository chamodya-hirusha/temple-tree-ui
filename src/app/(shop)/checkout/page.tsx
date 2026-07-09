"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Truck, Lock, Check, ShieldCheck, AlertTriangle, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CustomDropdown } from "@/components/CustomDropdown";

const COUNTRIES = [
  { name: "United States", shippingUSD: 25 },
  { name: "United Kingdom", shippingUSD: 15 },
  { name: "Australia", shippingUSD: 25 },
  { name: "Singapore", shippingUSD: 15 },
  { name: "Sri Lanka", shippingUSD: 0 },
] as const;

export default function Checkout() {
  const { cart, subtotal, discount, total, clearCart, formatPrice, addOrder, products, voucher, applyVoucher, removeVoucher, coupons } = useStore();
  const router = useRouter();

  // Coupon apply states
  const [couponInput, setCouponInput] = useState("");
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);

  // Form State
  const [email, setEmail] = useState("customer@example.com");
  const [phone, setPhone] = useState("+1 (555) 234 5678");
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Morgan");
  const [address, setAddress] = useState("221B Baker Street");
  const [city, setCity] = useState("London");
  const [postalCode, setPostalCode] = useState("NW1 6XE");
  const [country, setCountry] = useState<string>("United States");

  const [paymentMethod, setPaymentMethod] = useState<"Card" | "COD">("Card");

  // Reset payment method if COD was selected and country changes to non-Sri Lanka
  useEffect(() => {
    if (country !== "Sri Lanka" && paymentMethod === "COD") {
      setPaymentMethod("Card");
    }
  }, [country, paymentMethod]);

  const selectedCountryObj = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0];

  // Check if applied voucher is a free shipping voucher
  const activeCouponObj = coupons?.find((c) => c.code.toUpperCase() === voucher?.toUpperCase());
  const isFreeShipApplied = activeCouponObj?.type === "freeship" && (
    activeCouponObj.applicableTo === "all" ||
    cart.some((item) => activeCouponObj.productIds?.includes(item.product.id))
  );

  const shippingCostUSD = isFreeShipApplied ? 0 : selectedCountryObj.shippingUSD;

  // Calculate final totals
  const finalTotalUSD = Math.max(0, subtotal - discount + shippingCostUSD);
  const finalTotalLKR = finalTotalUSD * 300;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      customer: `${firstName} ${lastName}`,
      email,
      address: `${address}, ${city}, ${postalCode}`,
      date: new Date().toISOString().split("T")[0],
      total: finalTotalUSD,
      totalLKR: finalTotalLKR,
      status: "Pending" as const,
      country,
      paymentMethod,
      items: cart.map((item) => {
        const activeProd = products.find((p) => p.id === item.product.id) || item.product;
        const activePrice = activeProd.flashSale && activeProd.flashSalePrice ? activeProd.flashSalePrice : activeProd.price;
        return {
          productId: item.product.id,
          title: item.product.title,
          qty: item.qty,
          price: activePrice,
          image: item.product.images[0],
        };
      }),
    };

    addOrder(newOrder);
    toast.success(`Order ${orderId} placed successfully! 🎉`);
    clearCart();

    // Redirect to order success page
    setTimeout(() => {
      router.push(`/order-success?orderId=${orderId}`);
    }, 1500);
  };

  return (
    <div className="bg-muted/40 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight">Secure Checkout</h1>
          <span className="text-xs text-muted-foreground flex items-center gap-1 bg-card px-2.5 py-1 rounded-full border border-border mt-1">
            <Lock size={11} className="text-success" /> SSL Encrypted
          </span>
        </div>

        <form onSubmit={handlePlaceOrder} className="mt-8 grid lg:grid-cols-12 gap-8">
          {/* Column 1: Billing & Payment */}
          <div className="lg:col-span-8 space-y-6">
            {/* Contact Details */}
            <section className="rounded-2xl bg-card border border-border p-6 shadow-card">
              <h2 className="text-lg font-bold text-foreground mb-4">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                  />
                </label>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="rounded-2xl bg-card border border-border p-6 shadow-card">
              <h2 className="text-lg font-bold text-foreground mb-4">Shipping Destination</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</span>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</span>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Street Address</span>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Suite, Apartment, Building, Street"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</span>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Postal Code</span>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Country / Region</span>
                  <div className="mt-1.5 w-full">
                    <CustomDropdown
                      options={COUNTRIES.map((c) => ({ value: c.name, label: c.name }))}
                      selectedValue={country}
                      onChange={setCountry}
                      className="py-0.5"
                    />
                  </div>
                </label>

              </div>
            </section>

            {/* Payment Methods */}
            <section className="rounded-2xl bg-card border border-border p-6 shadow-card">
              <h2 className="text-lg font-bold text-foreground mb-4">Payment Selection</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {/* Option 1: Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Card")}
                  className={cn(
                    "relative text-left rounded-xl border p-4 transition-all duration-200",
                    paymentMethod === "Card"
                      ? "border-brand bg-brand/5 shadow-glow"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  <CreditCard size={20} className="text-brand" />
                  <div className="mt-3 font-extrabold text-sm text-foreground">Card Payment</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Visa · Mastercard · Amex</div>
                  {paymentMethod === "Card" && (
                    <span className="absolute top-3 right-3 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground">
                      <Check size={11} />
                    </span>
                  )}
                </button>


                {/* Option 3: COD (Sri Lanka Only) */}
                {country === "Sri Lanka" && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={cn(
                      "relative text-left rounded-xl border p-4 transition-all duration-200",
                      paymentMethod === "COD"
                        ? "border-brand bg-brand/5 shadow-glow"
                        : "border-border hover:border-foreground/30"
                    )}
                  >
                    <Truck size={20} className="text-brand" />
                    <div className="mt-3 font-extrabold text-sm text-foreground">Cash on Delivery</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Pay at your doorstep</div>
                    {paymentMethod === "COD" && (
                      <span className="absolute top-3 right-3 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground">
                        <Check size={11} />
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Dynamic Overlay Fields based on selection */}
              {paymentMethod === "Card" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 grid sm:grid-cols-3 gap-4 border-t border-border pt-4"
                >
                  <label className="block sm:col-span-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cardholder Name</span>
                    <input
                      type="text"
                      defaultValue="Alex Morgan"
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Card Number</span>
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      defaultValue="4242 4242 4242 4242"
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expiry</span>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all text-center"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CVC</span>
                      <input
                        type="password"
                        placeholder="•••"
                        defaultValue="123"
                        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:ring-2 ring-brand transition-all text-center"
                      />
                    </label>
                  </div>
                </motion.div>
              )}

            </section>
          </div>

          {/* Column 2: Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-2xl bg-card border border-border p-6 shadow-card space-y-5">
              <h3 className="text-lg font-bold text-foreground">Order Summary</h3>

              {/* Items List */}
              <div className="max-h-56 overflow-y-auto space-y-3 pr-1 divide-y divide-border/60">
                {cart.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-4 text-center">No products in checkout</div>
                ) : (
                  cart.map((item, idx) => {
                    const activeProd = products.find((p) => p.id === item.product.id) || item.product;
                    const activePrice = activeProd.flashSale && activeProd.flashSalePrice ? activeProd.flashSalePrice : activeProd.price;
                    return (
                      <div key={item.product.id} className={cn("flex gap-3", idx > 0 && "pt-3")}>
                        <div className="relative shrink-0">
                          <img src={item.product.images[0]} alt="" className="h-14 w-14 rounded-xl object-cover border border-border/50 bg-muted" />
                          <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-foreground text-background text-[10px] font-bold">
                            {item.qty}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-foreground line-clamp-2 leading-snug">{item.product.title}</div>
                          <div className="text-[10px] text-brand font-extrabold mt-1">
                            {formatPrice(activePrice)} each
                          </div>
                        </div>
                        <div className="text-right shrink-0 text-xs font-bold text-foreground tabular-nums">
                          {formatPrice(activePrice * item.qty)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Promo Coupon Input Section */}
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Promo Coupon</span>
                  <button
                    type="button"
                    onClick={() => setIsCouponDrawerOpen(true)}
                    className="text-xs font-bold text-brand hover:underline transition-all"
                  >
                    View Available Coupons
                  </button>
                </div>

                {!voucher ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold outline-none focus:border-brand"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const success = applyVoucher(couponInput);
                        if (success) {
                          setCouponInput("");
                        }
                      }}
                      className="rounded-xl bg-brand text-brand-foreground px-4 py-2 text-xs font-bold hover:bg-brand-dark transition-all"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/5 px-3 py-2 text-xs font-bold animate-fade-in">
                    <div className="flex items-center gap-1.5 text-success">
                      <span>🎟️ Applied:</span>
                      <span className="font-mono bg-success/10 px-2 py-0.5 rounded tracking-wider uppercase">{voucher}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVoucher()}
                      className="text-muted-foreground hover:text-destructive transition-colors font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Rows */}
              <div className="border-t border-border pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Subtotal</span>
                  <span className="font-bold text-foreground tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Discount Code</span>
                  <span className="font-bold text-success tabular-nums">-{formatPrice(discount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">International Shipping</span>
                  <span className="font-bold text-foreground tabular-nums">
                    {shippingCostUSD === 0 ? "FREE" : formatPrice(shippingCostUSD)}
                  </span>
                </div>

                {/* Conversions View */}
                <div className="bg-muted/15 rounded-xl border border-border p-3.5 mt-2 space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                    <span>Base Amount (USD)</span>
                    <span className="tabular-nums">${finalTotalUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                    <span>Local conversion (LKR)</span>
                    <span className="tabular-nums">Rs. {finalTotalLKR.toLocaleString()}</span>
                  </div>
                  <div className="text-[9px] text-muted-foreground font-semibold pt-1 border-t border-border/40 mt-1">
                    Fixed conversion rate: 1 USD = 300 LKR
                  </div>
                </div>

                <div className="border-t border-border pt-3.5 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-foreground">Grand Total</span>
                  <span className="text-2xl font-extrabold text-brand tabular-nums">
                    {formatPrice(finalTotalUSD)}
                  </span>
                </div>
              </div>

              {/* Place Order Trigger */}
              <button
                type="submit"
                className="w-full rounded-xl bg-brand text-brand-foreground py-3.5 text-sm font-extrabold hover:bg-brand-dark transition-all shadow-glow flex items-center justify-center gap-1.5"
              >
                Place Order · {formatPrice(finalTotalUSD)}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-muted-foreground text-center">
                <ShieldCheck size={13} className="text-success" /> Guaranteed Buyer Protection & Tracking
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sliding Coupon Drawer */}
      <AnimatePresence>
        {isCouponDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsCouponDrawerOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              {/* Drawer Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-screen max-w-sm bg-card border-l border-border shadow-2xl flex flex-col justify-between relative"
              >
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      🎟️ Available Coupons
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCouponDrawerOpen(false)}
                      className="p-1 rounded-full hover:bg-muted text-muted-foreground transition"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Coupons List */}
                  <div className="space-y-4 pt-2">
                    {coupons.filter(c => c.status === "active" && new Date(c.expiresAt).getTime() > Date.now()).length === 0 ? (
                      <div className="text-center text-xs text-muted-foreground py-8">
                        No active coupons available at this time.
                      </div>
                    ) : (
                      coupons
                        .filter(c => c.status === "active" && new Date(c.expiresAt).getTime() > Date.now())
                        .map((c) => {
                          const isApplicable = c.applicableTo === "all" || cart.some(item => c.productIds?.includes(item.product.id));
                          const isMinSpendMet = subtotal >= c.minSpend;
                          const isReady = isApplicable && isMinSpendMet;

                          let valText = "";
                          if (c.type === "percentage") valText = `${c.value}% OFF`;
                          else if (c.type === "fixed") valText = `$${c.value} OFF`;
                          else valText = "FREE SHIPPING";

                          return (
                            <div
                              key={c.id}
                              className={cn(
                                "rounded-2xl border p-4 space-y-3 transition-all",
                                voucher === c.code
                                  ? "border-success bg-success/5"
                                  : isReady
                                    ? "border-brand/30 bg-brand/5"
                                    : "border-border/60 bg-muted/20 opacity-60"
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="font-mono text-xs font-black tracking-wider uppercase bg-foreground/5 px-2.5 py-1 rounded">
                                    {c.code}
                                  </span>
                                  <div className="text-xs font-extrabold text-foreground mt-2">{valText}</div>
                                  <div className="text-[10px] text-muted-foreground mt-1 font-semibold leading-relaxed">
                                    {c.applicableTo === "all" ? "Applies to all products" : "Applies to specific items"}
                                    {c.minSpend > 0 && ` on orders over $${c.minSpend}`}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  disabled={voucher === c.code || !isReady}
                                  onClick={() => {
                                    applyVoucher(c.code);
                                    setIsCouponDrawerOpen(false);
                                  }}
                                  className={cn(
                                    "rounded-lg px-3.5 py-1.5 text-[10px] font-black uppercase transition-all shrink-0",
                                    voucher === c.code
                                      ? "bg-success/20 text-success cursor-default"
                                      : isReady
                                        ? "bg-brand text-brand-foreground hover:bg-brand-dark"
                                        : "bg-muted text-muted-foreground cursor-not-allowed"
                                  )}
                                >
                                  {voucher === c.code ? "Applied" : "Apply"}
                                </button>
                              </div>

                              {/* Warnings/Checks */}
                              {!isMinSpendMet && (
                                <div className="text-[9px] text-destructive font-bold">
                                  ⚠️ Requires min. spend of ${c.minSpend} (Current: ${subtotal})
                                </div>
                              )}
                              {!isApplicable && (
                                <div className="text-[9px] text-destructive font-bold">
                                  ⚠️ No qualifying items in your cart
                                </div>
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-border bg-muted/10 text-center text-[10px] text-muted-foreground">
                  Apply coupon code to instantly deduct savings from your total order value.
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
