"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit3, Trash2, X, UploadCloud, Filter } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CATEGORIES, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

export default function ProductsAdmin() {
  const { products, deleteProduct, addProduct } = useStore();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = products.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products in catalog</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-4 py-2.5 text-sm font-bold shadow-glow hover:bg-brand-dark transition">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="w-full rounded-lg bg-muted pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 ring-brand" />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">
            <Filter size={12} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-4 font-semibold">Product</th>
                <th className="text-left p-4 font-semibold">SKU</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-right p-4 font-semibold">Price</th>
                <th className="text-center p-4 font-semibold">Stock</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition">
                  <td className="p-3">
                     <div className="flex items-center gap-3">
                       <img src={p.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                       <div className="min-w-0">
                         <div className="font-semibold line-clamp-1">{p.title}</div>
                         <div className="text-xs text-muted-foreground">★ {p.rating} · {p.sold.toLocaleString()} sold</div>
                       </div>
                     </div>
                  </td>
                  <td className="p-3 font-mono text-xs">{p.sku}</td>
                  <td className="p-3 text-xs">{p.category}</td>
                  <td className="p-3 text-right font-bold tabular-nums">${p.price}</td>
                  <td className="p-3 text-center">
                    <span className={cn(
                      "inline-block rounded-full px-2.5 py-1 text-xs font-bold tabular-nums",
                      p.stock < 10 ? "bg-destructive/10 text-destructive" : p.stock < 50 ? "bg-warning/15 text-warning" : "bg-success/10 text-success",
                    )}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent text-foreground transition">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-destructive/10 text-destructive transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">No products found.</div>
        )}
      </div>

      <AddProductDrawer open={open} onClose={() => setOpen(false)} onAdd={addProduct} />
    </div>
  );
}

function AddProductDrawer({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (p: Product) => void }) {
  const [form, setForm] = useState({
    title: "", sku: "", price: "", comparePrice: "", stock: "", category: CATEGORIES[0].name,
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `p${Date.now()}`,
      title: form.title || "New Aura Product",
      brand: "AuraSound",
      category: form.category,
      price: Number(form.price) || 99,
      comparePrice: Number(form.comparePrice) || 149,
      rating: 5,
      reviews: 0,
      sold: 0,
      stock: Number(form.stock) || 10,
      sku: form.sku || `AS-${Date.now()}`,
      badge: "New",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"],
      description: "Brand new addition to the Aura collection.",
      specs: [{ label: "Warranty", value: "2 years" }],
    });
    setForm({ title: "", sku: "", price: "", comparePrice: "", stock: "", category: CATEGORIES[0].name });
    onClose();
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-slate-deep/60 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-background shadow-2xl flex flex-col"
          >
            <header className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add New Product</h3>
                <p className="text-xs text-muted-foreground">Fill in details to add to catalog</p>
              </div>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-muted"><X size={18} /></button>
            </header>
            <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-4">
              <Input label="Product Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="AuraSound Pro Max" required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} placeholder="AS-PRO-MAX" />
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
                    {CATEGORIES.map((c) => <option key={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Price ($)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="249" />
                <Input label="Compare Price ($)" type="number" value={form.comparePrice} onChange={(v) => setForm({ ...form, comparePrice: v })} placeholder="399" />
                <Input label="Inventory" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} placeholder="50" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Product Images</label>
                <div className="mt-1 rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-brand transition cursor-pointer">
                  <UploadCloud className="mx-auto mb-2 text-muted-foreground" size={28} />
                  <div className="text-sm font-semibold">Drop images here or click to browse</div>
                  <div className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</div>
                </div>
              </div>
            </form>
            <footer className="p-5 border-t border-border flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 rounded-xl border-2 border-border py-2.5 text-sm font-semibold hover:bg-muted">Cancel</button>
              <button type="submit" onClick={submit} className="flex-1 rounded-xl bg-brand text-brand-foreground py-2.5 text-sm font-bold hover:bg-brand-dark shadow-glow">Add Product</button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Input({ label, value, onChange, ...props }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} {...props} className="mt-1 w-full rounded-lg border-2 border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand transition" />
    </label>
  );
}
