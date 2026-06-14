"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette, Clock, Shirt, Leaf, Coffee, Sofa, Gift, Gem, Flame, Sparkles,
  Zap, ChevronRight, ShieldCheck, Truck, RotateCcw,
} from "lucide-react";
import { CATEGORIES, FLASH_SALE, JUST_FOR_YOU } from "@/data/products";
import { ProductCard } from "@/components/user/ProductCard";
import { CountdownTimer } from "@/components/user/CountdownTimer";

const ICONS = { Palette, Clock, Shirt, Leaf, Coffee, Sofa, Gift, Gem, Flame, Sparkles } as const;

const SLIDES = [
  {
    eyebrow: "AuraSound Pro Max",
    title: "Hear every detail.\nFeel every beat.",
    sub: "Studio-grade ANC headphones with 40-hour battery.",
    cta: "Shop the drop",
    bg: "/assets/hero-1.png",
    accent: "from-[oklch(0.3_0.08_260)]",
  },
  {
    eyebrow: "New · AuraPhone 15 Ultra",
    title: "Titanium light.\nProMotion fast.",
    sub: "Trade in your old phone and save up to $500.",
    cta: "Discover Ultra",
    bg: "/assets/hero-2.png",
    accent: "from-[oklch(0.25_0.05_240)]",
  },
  {
    eyebrow: "AuraBook Pro 14",
    title: "Built for creators.\nWired for speed.",
    sub: "M3 Pro chip · 22-hour battery · 14\" XDR display.",
    cta: "Configure yours",
    bg: "/assets/hero-3.png",
    accent: "from-[oklch(0.28_0.07_30)]",
  },
];

function Hero() {
  const [i, setI] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  const slide = SLIDES[i];
  return (
    <section className="mx-auto max-w-7xl px-4 mt-5">
      <div className="grid grid-cols-12 gap-4" onMouseLeave={() => setHoveredCategory(null)}>
        {/* Vertical categories */}
        <aside className="hidden lg:block col-span-3 rounded-2xl bg-card border border-border shadow-card p-2 h-[440px] overflow-y-auto scrollbar-hide">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Categories</div>
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.icon as keyof typeof ICONS] ?? Sparkles;
            const isHovered = hoveredCategory === c.name;
            return (
              <a 
                key={c.name} 
                href="#" 
                onMouseEnter={() => setHoveredCategory(c.name)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition group ${isHovered ? 'bg-accent text-brand' : 'hover:bg-accent hover:text-brand'}`}
              >
                <Icon size={16} className={`group-hover:text-brand ${isHovered ? 'text-brand' : 'text-muted-foreground'}`} />
                <span className="text-sm flex-1">{c.name}</span>
                <ChevronRight size={14} className={`text-brand transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </a>
            );
          })}
        </aside>

        {/* Slider & Flyout */}
        <div className="col-span-12 lg:col-span-6 relative h-[440px] rounded-2xl overflow-hidden shadow-card border border-border/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 bg-gradient-to-br ${slide.accent} to-slate-deep`}
            >
              <img src={slide.bg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-deep/80 via-slate-deep/40 to-transparent" />
              <div className="relative h-full p-10 flex flex-col justify-center text-background max-w-xl">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/90 px-3 py-1 text-xs font-semibold mb-4">
                  <Zap size={12} /> {slide.eyebrow}
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.05] whitespace-pre-line tracking-tight">{slide.title}</h2>
                <p className="mt-4 text-base text-background/80 max-w-md">{slide.sub}</p>
                <div className="mt-6 flex gap-3">
                  <button className="rounded-xl bg-brand text-brand-foreground px-5 py-3 text-sm font-bold shadow-glow hover:bg-brand-dark transition">
                    {slide.cta}
                  </button>
                  <button className="rounded-xl border border-background/30 px-5 py-3 text-sm font-semibold hover:bg-background/10 transition">
                    Learn more
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-brand" : "w-1.5 bg-background/50"}`}
              />
            ))}
          </div>

          {/* Subcategories Flyout Overlay */}
          <AnimatePresence>
            {hoveredCategory && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-50 bg-card/98 backdrop-blur-2xl p-8 lg:p-10 border-l border-border flex flex-col"
              >
                <h3 className="text-3xl font-[family-name:var(--font-serif)] font-medium mb-8 text-foreground tracking-tight">{hoveredCategory}</h3>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-12 overflow-y-auto pr-4 pb-4 scrollbar-hide">
                  {CATEGORIES.find(c => c.name === hoveredCategory)?.subcategories?.map(sub => {
                    const isObj = typeof sub === "object";
                    const subName = isObj ? sub.name : sub;
                    const items = isObj ? sub.items : undefined;
                    
                    return (
                      <div key={subName} className="mb-8 break-inside-avoid">
                        <Link 
                          href={`/products`} 
                          className="group flex items-center justify-between text-base font-semibold text-foreground hover:text-brand transition-all duration-300 pb-2"
                        >
                           <span>{subName}</span>
                           <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out text-brand">
                             <ChevronRight size={16} />
                           </span>
                        </Link>
                        {items && items.length > 0 && (
                          <div className="flex flex-col pl-4 border-l border-border/80 ml-2 mt-2 space-y-2.5">
                            {items.map(item => (
                              <Link key={item} href={`/products`} className="text-[14px] text-foreground/70 hover:text-brand hover:translate-x-0.5 transition-all duration-300">
                                {item}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right rails */}
        <div className="hidden lg:flex col-span-3 flex-col gap-4" onMouseEnter={() => setHoveredCategory(null)}>
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-brand-foreground shadow-card relative overflow-hidden">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Members</div>
            <div className="mt-1 text-2xl font-extrabold leading-tight">Get 25% off your first order</div>
            <p className="mt-1 text-sm opacity-90">Use code BRAND25 at checkout</p>
            <button className="mt-4 rounded-lg bg-background text-foreground px-3 py-2 text-xs font-bold">Join Aura+</button>
            <Sparkles className="absolute -bottom-4 -right-4 opacity-20" size={120} />
          </div>
          <div className="flex-1 rounded-2xl bg-foreground text-background p-5 shadow-card relative overflow-hidden">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80">New drop</div>
            <div className="mt-1 text-2xl font-extrabold leading-tight">Wellness Kit</div>
            <p className="mt-1 text-sm opacity-80">Pure Ayurvedic Extracts.</p>
            <Link href="/product/p4" className="mt-4 inline-block rounded-lg bg-brand text-brand-foreground px-3 py-2 text-xs font-bold">Shop now</Link>
            <Leaf className="absolute -bottom-2 -right-2 opacity-20" size={100} />
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { I: Truck, t: "Free shipping", s: "On orders over $500" },
          { I: ShieldCheck, t: "2-year warranty", s: "Included on all products" },
          { I: RotateCcw, t: "30-day returns", s: "No questions asked" },
          { I: Zap, t: "Express delivery", s: "Same-day in major cities" },
        ].map(({ I, t, s }) => (
          <div key={t} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-brand"><I size={18} /></span>
            <div><div className="text-sm font-semibold">{t}</div><div className="text-xs text-muted-foreground">{s}</div></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FlashSale() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    
    const scroll = () => {
      if (!el) return;
      el.scrollLeft += 1;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    const pause = () => cancelAnimationFrame(animationId);
    const resume = () => {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(scroll);
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause);
    el.addEventListener("touchend", resume);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="rounded-3xl bg-gradient-to-br from-[oklch(0.97_0.04_50)] to-[oklch(0.93_0.06_30)] dark:from-slate-deep dark:to-background p-6 border border-border shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand shadow-glow">
              <Flame className="text-brand-foreground" size={22} />
            </div>
            <div>
              <div className="text-2xl font-extrabold tracking-tight">Flash Sale</div>
              <div className="text-xs text-muted-foreground">Ends in — Hurry, deals refresh hourly</div>
            </div>
            <div className="ml-2"><CountdownTimer /></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block w-48">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span>50% items sold</span>
                <span className="text-brand">Selling fast</span>
              </div>
              <div className="h-2 rounded-full bg-background overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "50%" }} transition={{ duration: 1.2 }} className="h-full bg-gradient-brand" />
              </div>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand hover:underline">Shop all →</Link>
          </div>
        </div>
        <div ref={scrollRef} className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 scroll-smooth-none">
          {[...FLASH_SALE, ...FLASH_SALE].map((p, i) => (
            <div key={`${p.id}-${i}`} className="shrink-0 w-[200px]">
              <ProductCard product={p} index={i % FLASH_SALE.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BannerAds() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-12 grid md:grid-cols-2 gap-4">
      {[
        {
          img: "/assets/product-5.png",
          tag: "Handicrafts",
          title: "Craftsmanship that lasts",
          sub: "Authentic Sri Lankan artistry",
        },
        {
          img: "/assets/product-10.png",
          tag: "Heritage",
          title: "Golden Hour Glow",
          sub: "Bring warmth to your home",
        },
      ].map((b) => (
        <motion.a
          key={b.title}
          href="#"
          whileHover={{ y: -4 }}
          className="group relative h-56 rounded-2xl overflow-hidden shadow-card"
        >
          <img src={b.img} alt={b.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-deep/85 via-slate-deep/30 to-transparent" />
          <div className="relative h-full p-6 flex flex-col justify-center text-background max-w-xs">
            <div className="text-xs uppercase tracking-wider opacity-80">{b.tag}</div>
            <div className="mt-1 text-2xl font-extrabold leading-tight">{b.title}</div>
            <div className="mt-1 text-sm opacity-90">{b.sub}</div>
            <div className="mt-3 inline-flex w-fit items-center gap-1 text-sm font-bold text-brand">
              Shop now <ChevronRight size={14} />
            </div>
          </div>
        </motion.a>
      ))}
    </section>
  );
}

function JustForYou() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Just For You</h2>
          <p className="text-sm text-muted-foreground">Hand-picked recommendations based on your taste</p>
        </div>
        <Link href="/products" className="text-sm font-semibold text-brand hover:underline">View all →</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {JUST_FOR_YOU.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="pb-12 bg-gradient-to-b from-muted/40 to-background">
      <Hero />
      <FlashSale />
      <BannerAds />
      <JustForYou />
    </div>
  );
}
