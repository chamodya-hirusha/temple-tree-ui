import { Mail, Calendar } from "lucide-react";
import { CUSTOMERS } from "@/data/products";

export default function CustomersAdmin() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">{CUSTOMERS.length} active customers</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CUSTOMERS.map((c) => (
          <div key={c.id} className="rounded-2xl bg-card border border-border p-5 shadow-card hover:shadow-glow hover:border-brand/40 transition">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-brand-foreground font-bold">{c.avatar}</div>
              <div className="min-w-0">
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-xs text-muted-foreground truncate flex items-center gap-1"><Mail size={10} /> {c.email}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted p-2.5">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Orders</div>
                <div className="text-lg font-extrabold">{c.orders}</div>
              </div>
              <div className="rounded-lg bg-muted p-2.5">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Spent</div>
                <div className="text-lg font-extrabold text-brand">${c.spent.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
              <Calendar size={11} /> Joined {c.joined}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
