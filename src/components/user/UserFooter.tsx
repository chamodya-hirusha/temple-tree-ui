import { Sparkles, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function UserFooter() {
  return (
    <footer className="mt-24 bg-slate-deep text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand"><Sparkles size={20} /></div>
            <div>
              <div className="text-lg font-extrabold tracking-tight">AURA<span className="text-brand">.</span></div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-background/60">single-vendor store</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-background/70 max-w-sm">
            Premium electronics, fashion and lifestyle — designed in California, shipped worldwide. 30-day free returns.
          </p>
          <div className="mt-4 flex gap-2">
            {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-background/10 hover:bg-brand transition">
                <I size={15} />
              </a>
            ))}
          </div>
        </div>
        {[
          { t: "Shop", l: ["New In", "Flash Sale", "Bestsellers", "Gift Cards"] },
          { t: "Support", l: ["Help Center", "Track Order", "Returns", "Warranty"] },
          { t: "Company", l: ["About Aura", "Sustainability", "Careers", "Press"] },
        ].map((c) => (
          <div key={c.t}>
            <h4 className="text-sm font-bold mb-3">{c.t}</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {c.l.map((x) => <li key={x}><a href="#" className="hover:text-brand transition">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-background/60 flex flex-wrap items-center justify-between gap-2">
          <div>© 2026 Aura Inc. All rights reserved.</div>
          <div>Visa · Mastercard · Amex · PayPal · Apple Pay</div>
        </div>
      </div>
    </footer>
  );
}
