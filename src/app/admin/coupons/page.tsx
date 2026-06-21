"use client";

import { useEffect, useState } from "react";
import { Ticket, Plus, Save, X, Clock, HelpCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/CustomDropdown";
import { useStore, type Coupon } from "@/context/StoreContext";

export default function CouponsAdminPage() {
  const { products, coupons, addCoupon, deleteCoupon } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeKey, setTimeKey] = useState(0);

  // Modal form states
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"percentage" | "fixed" | "freeship">("percentage");
  const [newValue, setNewValue] = useState(15);
  const [newMinSpend, setNewMinSpend] = useState(50);
  const [newDurationHours, setNewDurationHours] = useState(48);

  // Target restriction states
  const [newApplicableTo, setNewApplicableTo] = useState<"all" | "specific">("all");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);

  // Force re-render of countdowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeKey((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (expiresAt: string | Date) => {
    const expiresDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
    const diff = expiresDate.getTime() - Date.now();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const dStr = days > 0 ? `${days}d ` : "";
    const hStr = hours.toString().padStart(2, "0") + "h ";
    const mStr = minutes.toString().padStart(2, "0") + "m ";
    const sStr = seconds.toString().padStart(2, "0") + "s";
    return `${dStr}${hStr}${mStr}${sStr}`;
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const codeUpper = newCode.trim().toUpperCase().replace(/\s+/g, "");

    // Check duplicate
    if (coupons.some((c) => c.code === codeUpper)) {
      toast.error("Coupon code already exists");
      return;
    }

    if (newApplicableTo === "specific" && selectedProductIds.length === 0) {
      toast.error("Please select at least one applicable product");
      return;
    }

    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: codeUpper,
      type: newType,
      value: newType === "freeship" ? 0 : newValue,
      minSpend: newMinSpend,
      status: "active",
      expiresAt: new Date(Date.now() + newDurationHours * 60 * 60 * 1000).toISOString(),
      uses: 0,
      applicableTo: newApplicableTo,
      productIds: newApplicableTo === "specific" ? selectedProductIds : [],
    };

    addCoupon(newCoupon);
    setIsModalOpen(false);

    // Reset Form
    setNewCode("");
    setNewType("percentage");
    setNewValue(15);
    setNewMinSpend(50);
    setNewDurationHours(48);
    setNewApplicableTo("all");
    setSelectedProductIds([]);
    setSearchQuery("");

    toast.success(`Coupon code ${codeUpper} created successfully!`);
    console.log("Created Coupon Configuration:", newCoupon);
  };

  const handleDeleteCoupon = (id: string) => {
    if (confirm("Are you sure you want to remove this coupon code campaign?")) {
      deleteCoupon(id);
      toast.success("Coupon code deleted");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      !selectedProductIds.includes(p.id) &&
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Ticket className="text-brand" size={28} /> Promotional Coupons
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure discount codes, active percentage thresholds, and monitor expiration countdowns.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-brand text-brand-foreground px-5 py-2.5 text-xs font-bold shadow-glow hover:bg-brand-dark transition-all"
        >
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Active Promo Code Campaigns</h3>
          <span className="rounded bg-brand/10 text-brand px-2.5 py-0.5 text-[10px] font-bold">
            {coupons.filter((c) => c.status === "active").length} active campaign(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider bg-muted/10">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Type</th>
                <th className="p-4">Discount Value</th>
                <th className="p-4 text-center">Min. Spend</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Uses</th>
                <th className="p-4 text-right">Time Remaining</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {coupons.map((c) => {
                const countdown = getTimeRemaining(c.expiresAt);
                const isExpired = countdown === "Expired" || c.status === "expired";

                return (
                  <tr key={c.id} className="hover:bg-muted/10 transition-all">
                    <td className="p-4 font-mono font-bold text-foreground tracking-wider">
                      <div>{c.code}</div>
                      <div className="text-[9px] text-muted-foreground font-sans mt-0.5 font-normal">
                        {c.applicableTo === "all" ? (
                          <span className="text-emerald-600 font-medium">All Products</span>
                        ) : (
                          <span className="text-brand font-medium">
                            {c.productIds?.length || 0} Specific Product(s)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground capitalize">
                      {c.type === "percentage" ? "Percentage" : c.type === "fixed" ? "Fixed Price" : "Free Shipping"}
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      {c.type === "percentage" ? `${c.value}%` : c.type === "fixed" ? `$${c.value}` : "Free"}
                    </td>
                    <td className="p-4 text-center font-semibold text-foreground">${c.minSpend}</td>
                    <td className="p-4 text-center">
                      <span
                        className={cn(
                          "inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border",
                          isExpired
                            ? "bg-destructive/15 text-destructive border-destructive/20"
                            : "bg-success/15 text-success border-success/20"
                        )}
                      >
                        {isExpired ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold text-muted-foreground">{c.uses} uses</td>
                    <td className="p-4 text-right font-mono font-semibold">
                      {isExpired ? (
                        <span className="text-destructive font-bold uppercase text-[9px]">Ended</span>
                      ) : (
                        <span className="text-brand flex items-center justify-end gap-1.5 text-xs">
                          <Clock size={12} className="animate-pulse" /> {countdown}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition"
                        title="Delete Campaign"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-card space-y-4 text-left">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted text-muted-foreground transition"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Ticket className="text-brand" size={20} />
              <h2 className="text-lg font-bold text-foreground">Create New Promo Campaign</h2>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Promo Code Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 font-mono text-xs font-bold outline-none focus:border-brand"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Discount Type
                  </label>
                  <CustomDropdown
                    options={[
                      { value: "percentage", label: "Percentage (%)" },
                      { value: "fixed", label: "Fixed Price ($)" },
                      { value: "freeship", label: "Free Shipping" },
                    ]}
                    selectedValue={newType}
                    onChange={(val) => setNewType(val as any)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    min="1"
                    disabled={newType === "freeship"}
                    value={newType === "freeship" ? "" : newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-bold outline-none focus:border-brand disabled:opacity-40"
                    required={newType !== "freeship"}
                  />
                </div>
              </div>

              {/* Applicable To Selector */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Applicable To
                </label>
                <CustomDropdown
                  options={[
                    { value: "all", label: "All Products" },
                    { value: "specific", label: "Specific Products" },
                  ]}
                  selectedValue={newApplicableTo}
                  onChange={(val) => {
                    setNewApplicableTo(val as any);
                    setSelectedProductIds([]);
                  }}
                />
              </div>

              {/* Specific Products Searchable Multi-Select */}
              {newApplicableTo === "specific" && (
                <div className="space-y-1.5 animate-slide-down">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Select Products
                  </label>

                  {/* Rounded tags list */}
                  {selectedProductIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-2.5 bg-muted/20 border border-border rounded-xl max-h-24 overflow-y-auto">
                      {selectedProductIds.map((id) => {
                        const prod = products.find((p) => p.id === id);
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-1.5 bg-brand/10 text-brand-dark border border-brand/20 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all hover:bg-brand/25"
                          >
                            <span>{prod ? prod.title.split(" — ")[0] : id}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedProductIds((prev) => prev.filter((x) => x !== id))}
                              className="text-brand hover:text-brand-dark font-black"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Search and Dropdown trigger */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type to search products..."
                      value={searchQuery}
                      onFocus={() => setIsProductMenuOpen(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsProductMenuOpen(true);
                      }}
                      className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-bold outline-none focus:border-brand"
                    />

                    {/* Click-outside backdrop layer */}
                    {isProductMenuOpen && (
                      <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsProductMenuOpen(false)}
                      />
                    )}

                    {/* Search Results Dropdown Overlay */}
                    {isProductMenuOpen && (
                      <div className="absolute z-50 w-full mt-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-card shadow-lg divide-y divide-border">
                        {filteredProducts.length === 0 ? (
                          <div className="p-3 text-center text-muted-foreground text-[10px]">
                            No matching products found
                          </div>
                        ) : (
                          filteredProducts.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setSelectedProductIds((prev) => [...prev, p.id]);
                                setSearchQuery("");
                                setIsProductMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-muted text-xs font-medium text-foreground transition-colors flex items-center justify-between"
                            >
                              <span className="truncate">{p.title}</span>
                              <span className="text-[9px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded ml-2 shrink-0">
                                {p.id}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Min. Spend Requirement
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newMinSpend}
                    onChange={(e) => setNewMinSpend(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-bold outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Campaign Duration (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newDurationHours}
                    onChange={(e) => setNewDurationHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-bold outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2.5 hover:bg-muted font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 bg-brand text-brand-foreground px-5 py-2.5 rounded-xl font-bold shadow-glow hover:bg-brand-dark transition"
                >
                  <Save size={12} /> Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Help Note Footer */}
      <div className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1 pt-4">
        <HelpCircle size={10} /> Coupons created here save dynamically in frontend mock states. Copying coupon codes to checkout triggers automatic validation.
      </div>
    </div>
  );
}
