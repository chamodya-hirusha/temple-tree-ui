"use client";

import { useState } from "react";
import {
  Store,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Save,
  RefreshCw,
  Check,
  Server,
  Key,
  ShieldCheck,
  Languages,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CustomDropdown } from "@/components/CustomDropdown";

type SettingsTab = "profile" | "notifications" | "payments" | "security" | "localization";

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSaving, setIsSaving] = useState(false);

  // 1. Profile States
  const [storeName, setStoreName] = useState("AURA Luxury Inc.");
  const [supportEmail, setSupportEmail] = useState("support@aura.com");
  const [currency, setCurrency] = useState("USD");
  const [phone, setPhone] = useState("+94 11 234 5678");
  const [address, setAddress] = useState("100 Galle Road, Colombo 03, Sri Lanka");

  // 2. Notifications States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  // 3. Payments States
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [stripeKey, setStripeKey] = useState("pk_live_51Nv73uHS920...");
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [paypalId, setPaypalId] = useState("client_paypal_live_9wje...");
  const [bankEnabled, setBankEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(false);

  // 4. Security States
  const [twoFactor, setTwoFactor] = useState(false);
  const [passRotation, setPassRotation] = useState("90");
  const [sessionTimeout, setSessionTimeout] = useState("1h");
  const [restrictApi, setRestrictApi] = useState(true);

  // 5. Localization States
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Colombo");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [dimensionUnit, setDimensionUnit] = useState("cm");

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Store configurations updated successfully!");
      
      console.log("Updated Configurations:", {
        tab: activeTab,
        data: {
          profile: { storeName, supportEmail, currency, phone, address },
          notifications: { emailAlerts, pushAlerts, stockAlerts, weeklyReports },
          payments: { stripeEnabled, stripeKey, paypalEnabled, paypalId, bankEnabled, codEnabled },
          security: { twoFactor, passRotation, sessionTimeout, restrictApi },
          localization: { language, timezone, weightUnit, dimensionUnit },
        }
      });
    }, 700);
  };

  const tabsConfig = [
    {
      id: "profile" as const,
      label: "Store Profile",
      description: "Logo, contact email and physical address details",
      icon: Store,
    },
    {
      id: "notifications" as const,
      label: "Notifications",
      description: "Email alerts and inventory notification triggers",
      icon: Bell,
    },
    {
      id: "payments" as const,
      label: "Payments",
      description: "Configure Stripe, PayPal and manual wires",
      icon: CreditCard,
    },
    {
      id: "security" as const,
      label: "Security",
      description: "Two-factor verification and session limits",
      icon: Shield,
    },
    {
      id: "localization" as const,
      label: "Localization",
      description: "Languages, dimensions and regional weight units",
      icon: Globe,
    },
  ];

  const renderToggle = (value: boolean, onChange: (v: boolean) => void) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={cn(
          "h-6 w-11 rounded-full p-1 transition-colors duration-200 focus:outline-none flex items-center shrink-0 cursor-pointer",
          value ? "bg-brand justify-end" : "bg-muted border border-border justify-start"
        )}
      >
        <span className="h-4 w-4 rounded-full bg-background shadow" />
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure baseline details, API endpoints, payment networks, and notification rules.
        </p>
      </div>

      {/* Two-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Sidebar Tabs Selection (30% approx) */}
        <div className="lg:col-span-4 space-y-2">
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition duration-150 cursor-pointer select-none",
                  isActive
                    ? "bg-card border-brand shadow-glow text-foreground"
                    : "bg-card border-border hover:border-brand/40 text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl transition-colors shrink-0",
                    isActive ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"
                  )}
                >
                  <tab.icon size={18} />
                </span>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-foreground leading-normal">{tab.label}</h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{tab.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Dynamic Fields Pane (70% approx) */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card min-h-[480px] flex flex-col justify-between space-y-6">
            {/* Dynamic tab contents */}
            <div className="space-y-6 text-left">
              {activeTab === "profile" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-border pb-3 flex items-center gap-2">
                    <Store className="text-brand" size={16} />
                    <h2 className="text-sm font-bold text-foreground">Store Profile</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Store Name</label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 ring-brand"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Support Contact Email</label>
                      <input
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 ring-brand"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Base Invoice Currency</label>
                      <CustomDropdown
                        options={[
                          { value: "USD", label: "USD ($) - United States Dollar" },
                          { value: "LKR", label: "LKR (Rs.) - Sri Lankan Rupee" },
                          { value: "EUR", label: "EUR (€) - Euro Zone" },
                          { value: "GBP", label: "GBP (£) - British Pound Sterling" },
                        ]}
                        selectedValue={currency}
                        onChange={setCurrency}
                      />

                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Hotline Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs font-semibold outline-none focus:ring-2 ring-brand"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Physical Headquarters Address</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-border bg-muted/20 p-3.5 text-xs font-semibold outline-none focus:ring-2 ring-brand leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-border pb-3 flex items-center gap-2">
                    <Bell className="text-brand" size={16} />
                    <h2 className="text-sm font-bold text-foreground">Alert Triggers</h2>
                  </div>

                  <div className="space-y-3.5">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/80">
                      <div>
                        <div className="font-bold text-xs">New Order Email Alerts</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Receive immediate notifications on buyer checkouts.</p>
                      </div>
                      {renderToggle(emailAlerts, setEmailAlerts)}
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/80">
                      <div>
                        <div className="font-bold text-xs">Bank Wire Transfer Slips Upload Alerts</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Receive alerts when customers submit manual wire bank receipt slips.</p>
                      </div>
                      {renderToggle(pushAlerts, setPushAlerts)}
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/80">
                      <div>
                        <div className="font-bold text-xs">Low Stock Warning Thresholds</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Alert admin automatically when items stock values fall below 5 units.</p>
                      </div>
                      {renderToggle(stockAlerts, setStockAlerts)}
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/80">
                      <div>
                        <div className="font-bold text-xs">Weekly Business Analytics Report</div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Send a summary of sales performance trends directly to owner mailboxes.</p>
                      </div>
                      {renderToggle(weeklyReports, setWeeklyReports)}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "payments" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-border pb-3 flex items-center gap-2">
                    <CreditCard className="text-brand" size={16} />
                    <h2 className="text-sm font-bold text-foreground">Payment Gateways</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Stripe Options */}
                    <div className="p-4 rounded-2xl border border-border bg-muted/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 place-items-center bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 font-bold text-[10px]">ST</span>
                          <div>
                            <div className="font-bold text-xs">Stripe Payments integration</div>
                            <p className="text-[9px] text-muted-foreground">Support Visa, MasterCard, and Apple Pay globally</p>
                          </div>
                        </div>
                        {renderToggle(stripeEnabled, setStripeEnabled)}
                      </div>
                      {stripeEnabled && (
                        <div className="space-y-1.5 pt-1.5 border-t border-border animate-in slide-in-from-top-1.5 duration-150">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Key size={10} /> Stripe Live Publishable Key
                          </label>
                          <input
                            type="text"
                            value={stripeKey}
                            onChange={(e) => setStripeKey(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-brand"
                          />
                        </div>
                      )}
                    </div>

                    {/* PayPal Options */}
                    <div className="p-4 rounded-2xl border border-border bg-muted/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 place-items-center bg-blue-50 border border-blue-100 rounded-lg text-blue-600 font-bold text-[10px]">PP</span>
                          <div>
                            <div className="font-bold text-xs">PayPal Commerce Platform</div>
                            <p className="text-[9px] text-muted-foreground">Support express express checkout integrations</p>
                          </div>
                        </div>
                        {renderToggle(paypalEnabled, setPaypalEnabled)}
                      </div>
                      {paypalEnabled && (
                        <div className="space-y-1.5 pt-1.5 border-t border-border animate-in slide-in-from-top-1.5 duration-150">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Key size={10} /> PayPal Live Client ID
                          </label>
                          <input
                            type="text"
                            value={paypalId}
                            onChange={(e) => setPaypalId(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono outline-none focus:border-brand"
                          />
                        </div>
                      )}
                    </div>

                    {/* Local Bank Wire and COD Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border">
                        <div>
                          <div className="font-bold text-xs">Manual Bank Wire Deposit</div>
                          <p className="text-[9px] text-muted-foreground mt-0.5">Let users upload deposit slips</p>
                        </div>
                        {renderToggle(bankEnabled, setBankEnabled)}
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border">
                        <div>
                          <div className="font-bold text-xs">Cash on Delivery (COD)</div>
                          <p className="text-[9px] text-muted-foreground mt-0.5">Enable local cash orders</p>
                        </div>
                        {renderToggle(codEnabled, setCodEnabled)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-border pb-3 flex items-center gap-2">
                    <Shield className="text-brand" size={16} />
                    <h2 className="text-sm font-bold text-foreground">Security Controls</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center bg-brand/10 text-brand rounded-lg">
                          <ShieldCheck size={16} />
                        </span>
                        <div>
                          <div className="font-bold text-xs">Require Two-Factor Auth (2FA)</div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Mandatory security checks for all administrator profiles on log-in.</p>
                        </div>
                      </div>
                      {renderToggle(twoFactor, setTwoFactor)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Admin Password Rotation</label>
                        <CustomDropdown
                          options={[
                            { value: "30", label: "Force change every 30 days" },
                            { value: "90", label: "Force change every 90 days" },
                            { value: "0", label: "Never rotate passwords" },
                          ]}
                          selectedValue={passRotation}
                          onChange={setPassRotation}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Session Timeout Limit</label>
                        <CustomDropdown
                          options={[
                            { value: "15m", label: "15 minutes of inactivity" },
                            { value: "1h", label: "1 hour of inactivity" },
                            { value: "24h", label: "24 hours of inactivity" },
                          ]}
                          selectedValue={sessionTimeout}
                          onChange={setSessionTimeout}
                        />

                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center bg-brand/10 text-brand rounded-lg">
                          <Server size={16} />
                        </span>
                        <div>
                          <div className="font-bold text-xs">Restrict API Key Access</div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Restrict API usage tokens to white-listed system IP addresses.</p>
                        </div>
                      </div>
                      {renderToggle(restrictApi, setRestrictApi)}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "localization" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-border pb-3 flex items-center gap-2">
                    <Globe className="text-brand" size={16} />
                    <h2 className="text-sm font-bold text-foreground">Localization & Metrics</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Languages size={12} /> Primary Language
                      </label>
                      <CustomDropdown
                        options={[
                          { value: "en", label: "English (Global)" },
                          { value: "si", label: "Sinhala (සිංහල)" },
                          { value: "ta", label: "Tamil (தமிழ்)" },
                        ]}
                        selectedValue={language}
                        onChange={setLanguage}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        Default Timezone
                      </label>
                      <CustomDropdown
                        options={[
                          { value: "Colombo", label: "Colombo (GMT+5:30) - Sri Lanka Standard Time" },
                          { value: "NewYork", label: "New York (GMT-5) - Eastern Standard Time" },
                          { value: "London", label: "London (GMT) - Greenwich Mean Time" },
                        ]}
                        selectedValue={timezone}
                        onChange={setTimezone}
                      />

                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Logistics Weight Metrics</label>
                      <CustomDropdown
                        options={[
                          { value: "kg", label: "Kilograms (kg)" },
                          { value: "lbs", label: "Pounds (lbs)" },
                        ]}
                        selectedValue={weightUnit}
                        onChange={setWeightUnit}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dimensions Standards</label>
                      <CustomDropdown
                        options={[
                          { value: "cm", label: "Centimeters (cm)" },
                          { value: "in", label: "Inches (in)" },
                        ]}
                        selectedValue={dimensionUnit}
                        onChange={setDimensionUnit}
                      />

                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Action Footer */}
            <div className="pt-5 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-xl bg-brand text-brand-foreground px-5 py-2.5 text-xs font-bold shadow-glow hover:bg-brand-dark transition-all disabled:opacity-50 select-none cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save Configurations
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
