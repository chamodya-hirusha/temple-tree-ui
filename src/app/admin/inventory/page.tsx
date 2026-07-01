"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { 
  PackageSearch, Download, Upload, AlertTriangle, 
  Settings2, Edit3, X, Calculator, Truck, CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/CustomDropdown";

interface ProductInventory {
  sku: string;
  name: string;
  category: string;
  stock: number;
  weight: number;
  l: number;
  w: number;
  h: number;
}

const defaultInventory: ProductInventory[] = [
  { sku: "TEA-001", name: "Premium Ceylon Black Tea", category: "Beverages", stock: 120, weight: 0.5, l: 10, w: 10, h: 15 },
  { sku: "TEA-002", name: "Organic Green Tea Leaves", category: "Beverages", stock: 8, weight: 0.25, l: 8, w: 8, h: 12 },
  { sku: "SPC-001", name: "Ceylon Cinnamon Sticks", category: "Spices", stock: 45, weight: 0.1, l: 2, w: 2, h: 15 },
  { sku: "SPC-002", name: "Whole Black Peppercorns", category: "Spices", stock: 5, weight: 0.2, l: 5, w: 5, h: 8 },
  { sku: "ART-001", name: "Handcrafted Wooden Mask", category: "Handicrafts", stock: 15, weight: 1.2, l: 20, w: 15, h: 30 },
  { sku: "ART-002", name: "Woven Reed Basket", category: "Handicrafts", stock: 3, weight: 0.8, l: 30, w: 30, h: 20 },
];

export default function InventoryAdminPage() {
  const [inventory, setInventory] = useState<ProductInventory[]>(defaultInventory);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductInventory | null>(null);
  const [adjustStockValue, setAdjustStockValue] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const lowStockItems = inventory.filter(p => p.stock < 10);

  // CSV Export/Import
  const exportCSV = () => {
    const header = "Name,SKU,Category,Stock,Weight,L,W,H\n";
    const rows = inventory.map(p => 
      `${p.name},${p.sku},${p.category},${p.stock},${p.weight},${p.l},${p.w},${p.h}`
    ).join("\n");
    
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'inventory_export.csv');
    a.click();
    toast.success("Inventory exported!");
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Importing CSV...");
      const text = await file.text();
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length < 2) {
        toast.dismiss();
        return toast.error("CSV file is empty or missing data");
      }

      const dataLines = lines.slice(1);
      const newInventory: ProductInventory[] = [];

      for (const line of dataLines) {
        const columns = line.split(',');
        if (columns.length >= 8) {
          newInventory.push({
            name: columns[0].trim(),
            sku: columns[1].trim(),
            category: columns[2].trim(),
            stock: parseInt(columns[3].trim(), 10) || 0,
            weight: parseFloat(columns[4].trim()) || 0,
            l: parseFloat(columns[5].trim()) || 0,
            w: parseFloat(columns[6].trim()) || 0,
            h: parseFloat(columns[7].trim()) || 0,
          });
        }
      }

      if (newInventory.length > 0) {
        setInventory(newInventory);
        toast.dismiss();
        toast.success("CSV Imported successfully!");
      } else {
        toast.dismiss();
        toast.error("No valid data found in CSV");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred during import");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Adjust Stock
  const openAdjustModal = (product: ProductInventory) => {
    setSelectedProduct(product);
    setAdjustStockValue(product.stock);
    setIsAdjustModalOpen(true);
  };

  const saveStockAdjustment = () => {
    if (!selectedProduct) return;
    setInventory(prev => prev.map(p => p.sku === selectedProduct.sku ? { ...p, stock: adjustStockValue } : p));
    setIsAdjustModalOpen(false);
    toast.success(`Stock updated for ${selectedProduct.sku}`);
  };

  const getStatusBadge = (stock: number) => {
    if (stock === 0) return <span className="px-2 py-0.5 bg-destructive/15 text-destructive rounded-full text-[10px] font-bold">Out of Stock</span>;
    if (stock < 10) return <span className="px-2 py-0.5 bg-amber-500/15 text-amber-500 rounded-full text-[10px] font-bold">Low Stock</span>;
    return <span className="px-2 py-0.5 bg-success/15 text-success rounded-full text-[10px] font-bold">In Stock</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <PackageSearch className="text-brand" size={28} /> Inventory Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Track product stock, update quantities, and simulate global logistics costs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 rounded-xl bg-card border border-border text-foreground px-4 py-2 text-xs font-bold hover:bg-muted transition-all">
            <Upload size={14} /> Import CSV
          </button>
          <button onClick={exportCSV} className="flex items-center gap-1.5 rounded-xl bg-card border border-border text-foreground px-4 py-2 text-xs font-bold hover:bg-muted transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
          <AlertTriangle className="shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-sm font-bold">Low Stock Alert</h4>
            <p className="text-xs opacity-90 mt-1">
              You have {lowStockItems.length} product(s) with less than 10 units in stock. Consider restocking soon.
            </p>
          </div>
        </div>
      )}

      {/* Main Inventory Table */}
      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-foreground">Product Catalog</h3>
            <span className="rounded bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 size={11} /> {inventory.length} active SKUs
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider bg-muted/10">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4">Logistics (W / Vol)</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading inventory...</td></tr>
                ) : inventory.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No inventory found.</td></tr>
                ) : (
                  inventory.map((p) => (
                    <tr key={p.sku} className="hover:bg-muted/10 transition-all">
                      <td className="p-4">
                        <div className="font-bold text-foreground">{p.name}</div>
                        <div className="font-mono text-[10px] text-muted-foreground uppercase">{p.sku}</div>
                      </td>
                      <td className="p-4 text-muted-foreground">{p.category}</td>
                      <td className="p-4 text-center">{getStatusBadge(p.stock)}</td>
                      <td className="p-4 text-center font-bold text-lg">{p.stock}</td>
                      <td className="p-4">
                        <div className="text-muted-foreground">{p.weight} kg</div>
                        <div className="text-[9px] text-muted-foreground opacity-70">{p.l}x{p.w}x{p.h} cm</div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openAdjustModal(p)}
                          className="p-1.5 bg-muted text-foreground rounded-lg hover:text-brand hover:bg-brand/10 transition"
                          title="Adjust Stock"
                        >
                          <Edit3 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <h3 className="font-bold text-sm">Adjust Stock</h3>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-xs font-bold">{selectedProduct.name}</div>
                <div className="text-[10px] text-muted-foreground font-mono">{selectedProduct.sku}</div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">New Stock Quantity</label>
                <input 
                  type="number" 
                  value={adjustStockValue} 
                  onChange={(e) => setAdjustStockValue(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold outline-none focus:border-brand"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="flex-1 bg-muted text-foreground rounded-xl py-2 text-xs font-bold hover:bg-muted/80 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveStockAdjustment}
                  className="flex-1 bg-brand text-brand-foreground rounded-xl py-2 text-xs font-bold shadow-glow hover:bg-brand-dark transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
