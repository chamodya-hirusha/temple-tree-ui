"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Banknote, Smartphone, Lock, Check, ShieldCheck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Checkout() {
  const { cart, subtotal, discount, shipping, total, clearCart } = useStore();
  const [pay, setPay] = useState<"card" | "cod" | "install">("card");
  const router = useRouter();

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order placed successfully! 🎉");
    clearCart();
    setTimeout(() => router.push("/"), 1200);
  };

  return (
    <div className="bg-muted/40 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
          <Lock size={12} /> Secure 256-bit SSL encrypted checkout
        </p>

        <form onSubmit={placeOrder} className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Contact */}
            <section className="rounded-2xl bg-card border border-border p-5 shadow-card">
              <h2 className="text-lg font-bold mb-4">Contact Details</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Email" type="email" required defaultValue="you@example.com" />
                <Field label="Phone" type="tel" required defaultValue="+1 (555) 234 5678" />
              </div>
            </section>

            {/* Shipping */}
            <section className="rounded-2xl bg-card border border-border p-5 shadow-card">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="First name" required defaultValue="Alex" />
                <Field label="Last name" required defaultValue="Morgan" />
                <Field className="sm:col-span-2" label="Street address" required defaultValue="221B Baker Street, Apt 4" />
                <Field label="City" required defaultValue="London" />
                <Field label="Postal code" required defaultValue="NW1 6XE" />
                <Field className="sm:col-span-2" label="Country" required defaultValue="United Kingdom" />
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl bg-card border border-border p-5 shadow-card">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { k: "card" as const, I: CreditCard, t: "Card", s: "Visa · Mastercard · Amex" },
                  { k: "cod" as const, I: Banknote, t: "Cash on Delivery", s: "Pay when you receive" },
                  { k: "install" as const, I: Smartphone, t: "Installments", s: "0% APR · 3, 6, 12 mo" },
                ].map((opt) => (
                  <button
                    key={opt.k}
                    type="button"
                    onClick={() => setPay(opt.k)}
                    className={cn(
                      "relative text-left rounded-xl border-2 p-4 transition",
                      pay === opt.k ? "border-brand bg-accent/40 shadow-glow" : "border-border hover:border-foreground/30",
                    )}
                  >
                    <opt.I size={20} className="text-brand" />
                    <div className="mt-2 font-bold text-sm">{opt.t}</div>
                    <div className="text-xs text-muted-foreground">{opt.s}</div>
                    {pay === opt.k && (
                      <span className="absolute top-2 right-2 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-foreground">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {pay === "card" && (
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <Field className="sm:col-span-2" label="Card number" placeholder="1234 5678 9012 3456" defaultValue="4242 4242 4242 4242" />
                  <Field label="Expiry" placeholder="MM/YY" defaultValue="12/28" />
                  <Field label="CVC" placeholder="123" defaultValue="123" />
                </div>
              )}
              {pay === "install" && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[3, 6, 12].map((m) => (
                    <button type="button" key={m} className="rounded-lg border-2 border-border p-3 text-center hover:border-brand transition">
                      <div className="text-lg font-extrabold">${(total / m).toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">/mo × {m} months</div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 rounded-2xl bg-card border border-border p-5 shadow-card space-y-4">
              <h3 className="text-lg font-bold">Order Summary</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {cart.map((i) => (
                  <div key={i.product.id} className="flex gap-3">
                    <div className="relative">
                      <img src={i.product.images[0]} alt="" className="h-14 w-14 rounded-lg object-cover" />
                      <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-foreground text-background text-[10px] font-bold">{i.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium line-clamp-2">{i.product.title}</div>
                      <div className="text-xs font-bold text-brand mt-0.5">${(i.product.price * i.qty).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <Row k="Subtotal" v={`$${subtotal.toFixed(2)}`} />
                <Row k="Discount" v={`-$${discount.toFixed(2)}`} accent />
                <Row k="Shipping" v={shipping === 0 ? "FREE" : `$${shipping}`} />
                <div className="border-t border-border pt-2 flex justify-between text-lg font-extrabold">
                  <span>Total</span><span className="text-brand">${total.toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" className="w-full rounded-xl bg-brand text-brand-foreground py-3 font-bold hover:bg-brand-dark transition shadow-glow">
                Place Order · ${total.toFixed(2)}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck size={12} className="text-success" /> Protected by Aura Buyer Guarantee
              </div>
              <Link href="/cart" className="block text-center text-xs text-muted-foreground hover:text-brand">← Back to cart</Link>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function Field({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input {...props} className="mt-1 w-full rounded-lg border-2 border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand transition" />
    </label>
  );
}
function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className={cn("font-semibold", accent && "text-success")}>{v}</span></div>;
}
