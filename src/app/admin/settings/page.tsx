import { Store, Bell, CreditCard, Shield, Globe } from "lucide-react";

const SECTIONS = [
  { I: Store, t: "Store Profile", s: "Name, logo, contact and brand info", fields: [["Store name", "Aura"], ["Support email", "support@aura.com"], ["Currency", "USD ($)"]] },
  { I: Bell, t: "Notifications", s: "Email and push alerts for orders" },
  { I: CreditCard, t: "Payments", s: "Stripe · PayPal · Cash on Delivery" },
  { I: Shield, t: "Security", s: "2FA, sessions and admin access" },
  { I: Globe, t: "Localization", s: "Languages, regions and tax rules" },
];

export default function SettingsAdmin() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your store</p>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((sec) => (
          <div key={sec.t} className="rounded-2xl bg-card border border-border p-5 shadow-card">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-brand"><sec.I size={18} /></span>
              <div className="flex-1">
                <h3 className="font-bold">{sec.t}</h3>
                <p className="text-xs text-muted-foreground">{sec.s}</p>
                {sec.fields && (
                  <div className="mt-4 grid sm:grid-cols-3 gap-3">
                    {sec.fields.map(([l, v]) => (
                      <label key={l} className="block">
                        <span className="text-xs font-semibold text-muted-foreground">{l}</span>
                        <input defaultValue={v} className="mt-1 w-full rounded-lg border-2 border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand" />
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
