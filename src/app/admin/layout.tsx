"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings, Sparkles, Bell, Search, ArrowLeft, LogOut, Flame, BarChart3, Truck, Landmark, FileText, Ticket, ChevronDown, PackageSearch
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SECTIONS = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Catalog & Sales",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/inventory", label: "Inventory", icon: PackageSearch },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/bank-transfers", label: "Bank Transfers", icon: Landmark },
      { href: "/admin/customers", label: "Customers", icon: Users },
    ],
  },
  {
    title: "Marketing & Campaigns",
    items: [
      { href: "/admin/flash-sales", label: "Flash Sales", icon: Flame },
      { href: "/admin/coupons", label: "Coupons", icon: Ticket },
    ],
  },
  {
    title: "Configuration",
    items: [
      { href: "/admin/shipping", label: "Shipping & Logistics", icon: Truck },
      { href: "/admin/cms", label: "Content (CMS)", icon: FileText },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40 flex">
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-sidebar-border flex items-center gap-2">

          <div>
            <div className="text-lg font-extrabold leading-none">Slmalkoha<span className="text-brand">.</span></div>
            <div className="text-[10px] uppercase tracking-[0.18em] opacity-60 mt-1">brand hub</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto scrollbar-hide">
          {SECTIONS.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 text-[9px] font-bold uppercase tracking-wider text-sidebar-foreground/45 mt-2 mb-1">
                {sec.title}
              </div>
              {sec.items.map((n) => {
                const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition",
                      active ? "bg-brand text-brand-foreground shadow-glow" : "hover:bg-sidebar-accent text-sidebar-foreground/80",
                    )}
                  >
                    <n.icon size={14} /> {n.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-sidebar-accent transition">
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-sidebar-accent transition">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-background/90 backdrop-blur border-b border-border flex items-center px-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search products, orders, customers…" className="w-full rounded-lg bg-muted pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 ring-brand" />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button className="relative grid h-9 w-9 place-items-center rounded-lg hover:bg-muted">
              <Bell size={16} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand" />
            </button>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition text-left cursor-pointer select-none"
              >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-brand-foreground text-xs font-bold shadow-soft">AM</div>
                <div className="hidden sm:block text-xs">
                  <div className="font-bold text-foreground leading-tight">Alex Morgan</div>
                  <div className="text-[10px] text-muted-foreground">Owner</div>
                </div>
                <ChevronDown size={12} className={cn("text-muted-foreground transition-transform ml-1", userMenuOpen && "rotate-180")} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-card border border-border p-1.5 shadow-card z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2.5 py-1.5 border-b border-border/60 mb-1">
                      <div className="text-xs font-bold text-foreground">Alex Morgan</div>
                      <div className="text-[9px] text-muted-foreground">alex.morgan@Slmalkohacom</div>
                    </div>
                    <Link
                      href="/admin/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition text-left"
                    >
                      <Settings size={12} /> Settings
                    </Link>
                    <Link
                      href="/admin/cms"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition text-left"
                    >
                      <FileText size={12} /> Content CMS
                    </Link>
                    <div className="border-t border-border/60 my-1" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        toast.success("Signed out successfully");
                      }}
                      className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition text-left cursor-pointer"
                    >
                      <LogOut size={12} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
