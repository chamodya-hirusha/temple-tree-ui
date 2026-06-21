"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Tag, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, subtotal, discount, shipping, total, voucher, applyVoucher, removeVoucher, formatPrice, products } = useStore();
  const [code, setCode] = useState("");

  return (
    <div className="bg-muted/40 pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-muted-foreground">{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>

        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.length === 0 && (
              <div className="rounded-2xl bg-card border border-border p-16 text-center">
                <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={48} />
                <h3 className="text-lg font-bold">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mt-1">Start shopping to fill it up.</p>
                <Link href="/" className="mt-5 inline-block rounded-xl bg-brand text-brand-foreground px-5 py-2.5 text-sm font-bold">Continue shopping</Link>
              </div>
            )}
            {cart.map((item) => {
              const activeProd = products.find((p) => p.id === item.product.id) || item.product;
              const activePrice = activeProd.flashSale && activeProd.flashSalePrice ? activeProd.flashSalePrice : activeProd.price;
              return (
                <div key={item.product.id} className="flex gap-4 rounded-2xl bg-card border border-border p-4 shadow-card">
                  <img src={item.product.images[0]} alt={item.product.title} className="h-24 w-24 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/product/${item.product.id}`} className="text-sm font-semibold hover:text-brand line-clamp-2">{item.product.title}</Link>
                        <div className="mt-1 text-xs text-muted-foreground">SKU: {item.product.sku}</div>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-destructive/10 text-destructive shrink-0">
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-xl border-2 border-border">
                        <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="grid h-9 w-9 place-items-center hover:bg-muted"><Minus size={13} /></button>
                        <span className="w-10 text-center font-bold tabular-nums">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="grid h-9 w-9 place-items-center hover:bg-muted"><Plus size={13} /></button>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-brand">{formatPrice(activePrice * item.qty)}</div>
                        <div className="text-xs text-muted-foreground">{formatPrice(activePrice)} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-32 rounded-2xl bg-card border border-border p-5 shadow-card space-y-4">
              <h3 className="text-lg font-bold">Order Summary</h3>

              <div className="rounded-xl border border-dashed border-brand/40 bg-accent/40 p-3">
                <label className="text-xs font-semibold flex items-center gap-1.5 mb-2"><Tag size={12} /> Promo Code</label>
                {voucher ? (
                  <div className="flex items-center justify-between rounded-lg bg-success/10 text-success p-2 text-xs font-bold">
                    <span className="flex items-center gap-1.5"><Check size={12} /> {voucher} applied</span>
                    <button onClick={removeVoucher} className="text-xs underline">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="DISCOUNT10" className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-brand" />
                    <button onClick={() => { if (applyVoucher(code)) setCode(""); }} className="rounded-lg bg-foreground text-background px-4 text-xs font-bold hover:bg-brand transition">Apply</button>
                  </div>
                )}
                <div className="mt-2 text-[10px] text-muted-foreground">Try: DISCOUNT10 · BRAND25 · FREESHIP</div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-semibold text-success">-{formatPrice(discount)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
                <div className="border-t border-border pt-2 flex justify-between text-lg font-extrabold">
                  <span>Total</span>
                  <span className="text-brand">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand text-brand-foreground py-3 font-bold hover:bg-brand-dark transition shadow-glow">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
              <Link href="/" className="block text-center text-xs text-muted-foreground hover:text-brand">Continue shopping</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
