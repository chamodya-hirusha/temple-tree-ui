"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Truck, Save, Server, HelpCircle, Settings2, Globe, Percent, Download, Upload, Zap, Calculator } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Tariff {
  country: string;
  code: string;
  baseline: number;
}

const defaultTariffs: Tariff[] = [
  { country: "Sri Lanka (Domestic)", baseline: 0, code: "LK" },
  { country: "United States", baseline: 25, code: "US" },
  { country: "United Kingdom", baseline: 15, code: "GB" },
  { country: "Australia", baseline: 25, code: "AU" },
  { country: "Singapore", baseline: 15, code: "SG" }
];

export default function ShippingLogisticsAdminPage() {
  const [dhlApiKey, setDhlApiKey] = useState("dhl_live_client_8492048f02930s9");
  const [fedexSecret, setFedexSecret] = useState("fedex_sec_9948203f");
  const [volumetricCalculation, setVolumetricCalculation] = useState(true);

  const [shippingMode, setShippingMode] = useState<"realtime" | "manual">("manual");
  const [shippingRates, setShippingRates] = useState<Tariff[]>(defaultTariffs);
  const [isLoading, setIsLoading] = useState(false);

  // Realtime simulation state
  const [simWeight, setSimWeight] = useState("2.5");
  const [simDest, setSimDest] = useState("US");
  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tax and VAT states
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [usTax, setUsTax] = useState(7.5);
  const [euVat, setEuVat] = useState(21.0);
  const [ukVat, setUkVat] = useState(20.0);
  const [lkVat, setLkVat] = useState(18.0);

  const handleRateChange = (idx: number, val: string) => {
    const num = Number(val);
    if (isNaN(num) || num < 0) return;
    setShippingRates((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, baseline: num } : r))
    );
  };

  const handleSaveShippingSettings = () => {
    toast.success("Logistics configurations saved successfully!");
    console.log("Logistics Configurations:", {
      shippingMode,
      dhlApiKey,
      fedexSecret,
      volumetricCalculation,
      shippingRates,
      taxEnabled,
      taxes: { US: usTax, EU: euVat, GB: ukVat, LK: lkVat }
    });
  };

  const exportCSV = () => {
    const header = "Destination country,Country Code,Shipping Type,Baseline Rate (USD)\n";
    const rows = shippingRates.map(r =>
      `${r.country},${r.code},${r.baseline === 0 ? 'Free Local Delivery' : 'DHL/FedEx Air Cargo'},${r.baseline}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'shipping_tariffs.csv');
    a.click();
    toast.success("CSV Exported!");
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading CSV...");
      const text = await file.text();
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      if (lines.length < 2) {
        toast.dismiss();
        return toast.error("CSV file is empty or missing data");
      }

      const dataLines = lines.slice(1);
      const newTariffs: Tariff[] = [];

      for (const line of dataLines) {
        // e.g. "Sri Lanka,LK,Free Local Delivery,0"
        const columns = line.split(',');
        if (columns.length >= 4) {
          const country = columns[0].trim();
          const code = columns[1].trim();
          const baseline = parseFloat(columns[3].trim()) || 0;
          newTariffs.push({ country, code, baseline });
        }
      }

      if (newTariffs.length > 0) {
        setShippingRates(newTariffs);
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

    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const simulateLiveRate = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const weightNum = parseFloat(simWeight);
      const destCode = simDest.toUpperCase();
      let rate = 25; // Default base

      if (destCode === 'LK') rate = 0;
      else if (destCode === 'GB' || destCode === 'SG') rate = 15;

      if (weightNum > 1 && rate > 0) {
        rate += (weightNum - 1) * 5;
      }

      setSimResult({
        destination: destCode,
        weight: weightNum,
        rate: parseFloat(rate.toFixed(2)),
        courier: Math.random() > 0.5 ? 'DHL Express' : 'FedEx Cargo'
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Truck className="text-brand" size={28} /> Shipping & Logistics
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure global shipping couriers, volumetric weight calculations, destination country rates, and Tax/VAT tiers.
          </p>
        </div>
        <button
          onClick={handleSaveShippingSettings}
          className="flex items-center gap-1.5 rounded-xl bg-brand text-brand-foreground px-5 py-2.5 text-xs font-bold shadow-glow hover:bg-brand-dark transition-all"
        >
          <Save size={14} /> Save Logistics Settings
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* API Credentials */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
            <Server size={16} className="text-brand" /> International API Integrations
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                DHL Express Client API Key
              </label>
              <input
                type="text"
                value={dhlApiKey}
                onChange={(e) => setDhlApiKey(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-mono outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                FedEx Cargo Client Secret
              </label>
              <input
                type="password"
                value={fedexSecret}
                onChange={(e) => setFedexSecret(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-mono outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>

        {/* Weight Options */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
            <Settings2 size={16} className="text-brand" /> Weight Calculation Rules
          </h3>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
            <div className="max-w-[200px]">
              <div className="font-bold text-xs">Volumetric Tiers (L x W x H / 5000)</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Automatically calculate logistics cost using dimensional size formulas instead of gross weight metrics.
              </p>
            </div>
            <button
              onClick={() => setVolumetricCalculation(!volumetricCalculation)}
              className={cn(
                "h-6 w-11 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center",
                volumetricCalculation ? "bg-brand justify-end" : "bg-muted border border-border justify-start"
              )}
            >
              <span className="h-4 w-4 rounded-full bg-background shadow" />
            </button>
          </div>
        </div>
      </div>

      {/* Tax & VAT Configuration */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
          <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
            <Percent size={16} className="text-brand" /> Global Tax & VAT Tiers
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Enable Tax Calculation:</span>
            <button
              onClick={() => setTaxEnabled(!taxEnabled)}
              className={cn(
                "h-6 w-11 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center",
                taxEnabled ? "bg-brand justify-end" : "bg-muted border border-border justify-start"
              )}
            >
              <span className="h-4 w-4 rounded-full bg-background shadow" />
            </button>
          </div>
        </div>

        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 transition-opacity", !taxEnabled && "opacity-40 pointer-events-none")}>
          {/* US Slider */}
          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/60">
            <div className="flex justify-between font-bold text-xs text-foreground">
              <span>United States</span>
              <span className="text-brand">{usTax.toFixed(1)}%</span>
            </div>
            <p className="text-[9px] text-muted-foreground">Standard Regional Sales Tax</p>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={usTax}
              onChange={(e) => setUsTax(Number(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
          </div>

          {/* EU Slider */}
          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/60">
            <div className="flex justify-between font-bold text-xs text-foreground">
              <span>European Union</span>
              <span className="text-brand">{euVat.toFixed(1)}%</span>
            </div>
            <p className="text-[9px] text-muted-foreground">Standard European VAT Tier</p>
            <input
              type="range"
              min="0"
              max="35"
              step="0.5"
              value={euVat}
              onChange={(e) => setEuVat(Number(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
          </div>

          {/* UK Slider */}
          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/60">
            <div className="flex justify-between font-bold text-xs text-foreground">
              <span>United Kingdom</span>
              <span className="text-brand">{ukVat.toFixed(1)}%</span>
            </div>
            <p className="text-[9px] text-muted-foreground">United Kingdom Standard VAT</p>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={ukVat}
              onChange={(e) => setUkVat(Number(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
          </div>

          {/* LK Slider */}
          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/60">
            <div className="flex justify-between font-bold text-xs text-foreground">
              <span>Sri Lanka (Local)</span>
              <span className="text-brand">{lkVat.toFixed(1)}%</span>
            </div>
            <p className="text-[9px] text-muted-foreground">Local VAT & SSCL Surcharges</p>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={lkVat}
              onChange={(e) => setLkVat(Number(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Shipping Rates Configuration Section */}
      <div className="rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        {/* Toggle Header */}
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-foreground">Shipping Tariffs Configuration</h3>
          <div className="flex bg-muted p-1 rounded-xl">
            <button
              onClick={() => setShippingMode("realtime")}
              className={cn(
                "px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2",
                shippingMode === "realtime" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Zap size={14} className={shippingMode === "realtime" ? "text-brand" : ""} /> Use Real-time Shipping APIs
            </button>
            <button
              onClick={() => setShippingMode("manual")}
              className={cn(
                "px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2",
                shippingMode === "manual" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Globe size={14} className={shippingMode === "manual" ? "text-brand" : ""} /> Use Manual Custom Tariffs
            </button>
          </div>
        </div>

        {shippingMode === "realtime" ? (
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-brand/10 grid place-items-center text-brand">
              <Zap size={28} />
            </div>
            <div className="max-w-md mx-auto">
              <h4 className="text-base font-bold text-foreground">Live Rates Enabled</h4>
              <p className="text-xs text-muted-foreground mt-2 mb-6">
                Shipping rates will be dynamically fetched from DHL and FedEx APIs at checkout based on cart volumetric weight and destination country.
              </p>

              {/* Live Rate Simulator */}
              <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-left">
                <h5 className="text-xs font-bold flex items-center gap-2 mb-4"><Calculator size={14} /> Test Live Rate Simulator</h5>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Weight (kg)</label>
                    <input type="number" value={simWeight} onChange={e => setSimWeight(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Destination Code</label>
                    <input type="text" value={simDest} onChange={e => setSimDest(e.target.value.toUpperCase())} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-brand" />
                  </div>
                </div>
                <button onClick={simulateLiveRate} disabled={isSimulating} className="w-full bg-brand text-brand-foreground rounded-lg py-2 text-xs font-bold hover:bg-brand-dark disabled:opacity-50">
                  {isSimulating ? "Simulating..." : "Calculate Mock Rate"}
                </button>

                {simResult && (
                  <div className="mt-4 p-3 bg-background border border-border rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-bold">Via {simResult.courier}</div>
                      <div className="text-xs font-bold">{simResult.destination} ({simResult.weight}kg)</div>
                    </div>
                    <div className="text-brand font-black text-lg">
                      ${simResult.rate.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="p-4 flex items-center justify-between border-b border-border">
              <span className="rounded bg-brand/10 text-brand px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                <Globe size={11} /> {shippingRates.length} countries configured
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition"
                >
                  <Upload size={14} /> Import CSV
                </button>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-semibold uppercase tracking-wider bg-muted/10">
                    <th className="p-4">Destination country</th>
                    <th className="p-4">Country Code</th>
                    <th className="p-4 text-center">Shipping Type</th>
                    <th className="p-4 text-right">Baseline Rate (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {isLoading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading tariffs...</td></tr>
                  ) : shippingRates.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No tariffs configured. Please import a CSV.</td></tr>
                  ) : (
                    shippingRates.map((r, idx) => (
                      <tr key={r.code} className="hover:bg-muted/10 transition-all">
                        <td className="p-4 font-bold text-foreground">{r.country}</td>
                        <td className="p-4 font-mono text-muted-foreground uppercase">{r.code}</td>
                        <td className="p-4 text-center">
                          <span
                            className={cn(
                              "inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border",
                              r.baseline === 0
                                ? "bg-success/15 text-success border-success/20"
                                : "bg-brand/10 text-brand border-brand/20"
                            )}
                          >
                            {r.baseline === 0 ? "Free Local Delivery" : "DHL/FedEx Air Cargo"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="relative inline-block text-left">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                            <input
                              type="number"
                              min="0"
                              value={r.baseline}
                              onChange={(e) => handleRateChange(idx, e.target.value)}
                              className="w-20 rounded-lg border border-border bg-background pl-6 pr-2 py-1.5 text-xs text-right font-bold outline-none focus:border-brand"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Support Helper */}
      <div className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1 pt-4">
        <HelpCircle size={10} /> Confused about customs duties or Volumetric ratios? Reach out to support at <a href="mailto:support@Slmalkohacom" className="text-brand font-semibold hover:underline">support@Slmalkohacom</a>
      </div>
    </div>
  );
}
