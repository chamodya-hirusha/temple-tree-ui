"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings, Sparkles, Bell, Search, ArrowLeft, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/40 flex">
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-sidebar-border flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand shadow-glow">
            <Sparkles size={20} className="text-brand-foreground" />
          </div>
          <div>
            <div className="text-lg font-extrabold leading-none">AURA<span className="text-brand">.</span></div>
            <div className="text-[10px] uppercase tracking-[0.18em] opacity-60 mt-1">brand hub</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active ? "bg-brand text-brand-foreground shadow-glow" : "hover:bg-sidebar-accent",
                )}
              >
                <n.icon size={16} /> {n.label}
              </Link>
            );
          })}
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
          <button className="relative grid h-9 w-9 place-items-center rounded-lg hover:bg-muted">
            <Bell size={16} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-brand-foreground text-xs font-bold">AM</div>
            <div className="hidden sm:block text-xs">
              <div className="font-bold">Alex Morgan</div>
              <div className="text-muted-foreground">Owner</div>
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
