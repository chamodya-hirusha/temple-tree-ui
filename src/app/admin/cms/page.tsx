"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  Scale,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  RefreshCw,
  Save,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { CustomDropdown } from "@/components/CustomDropdown";


interface PolicySection {
  title: string;
  content: string;
}

interface PolicyData {
  title: string;
  lastUpdated: string;
  badge: string;
  icon: "Shield" | "Scale" | "RotateCcw";
  intro: string;
  sections: PolicySection[];
}

const DEFAULT_PRIVACY: PolicyData = {
  title: "Privacy Policy",
  lastUpdated: "June 21, 2026",
  badge: "Compliance & Trust",
  icon: "Shield",
  intro: "At Aura Inc., we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, process, share, and protect your information when you visit or make a purchase from our international single-vendor e-commerce platform.",
  sections: [
    {
      title: "1. Information We Collect",
      content: "To facilitate global deliveries and customize your shopping experience, we collect various types of information, including:\n\n• Identity & Contact Details: Your name, billing address, international shipping address, email address, and phone number.\n• Financial Information: Payment details processed securely via our encrypted payment gateways. We do not directly store credit card details on our servers.\n• Technical & Usage Data: IP address, browser type, location data (used for LKR/USD currency switching), and browsing behavior on our platform.",
    },
    {
      title: "2. How We Use Your Data",
      content: "We process your information to fulfill contracts (such as delivering Ceylon tea, handicrafts, or spices to your door) and to comply with legal obligations. Specifically, your data is used to:\n\n• Process and fulfill orders, including international shipping, customs documentation, and logistics tracking.\n• Screen orders for potential risk or fraud.\n• Maintain customer accounts and loyalty profiles (such as Aura+ benefits).\n• Send order updates, tracking details, and promotional communications (where consented).",
    },
    {
      title: "3. International Data Transfers & Third Parties",
      content: "Because we operate globally, your information may be transferred and processed outside of your home country. We ensure all transfers are guarded by appropriate safeguards. We share your information with trusted partners necessary for operations:\n\n• Logistics Providers: Standard and express courier networks (e.g. DHL, FedEx) to manage export clearance and delivery.\n• Payment Gateways: Secure systems enabling card verification, bank deposits, and regional payments.",
    },
    {
      title: "4. GDPR & International Compliance",
      content: "If you are a resident of the European Economic Area (EEA), you have specific rights under the General Data Protection Regulation (GDPR), including the right to access, correct, delete, or limit the use of your personal data. To exercise these rights, please contact our support team.\n\nAdditionally, we align our data collection and processing methods with the Sri Lankan Personal Data Protection Act and other applicable consumer safety guidelines globally.",
    },
    {
      title: "5. Cookies and Analytics",
      content: "We use essential cookies to maintain your shopping cart state, keep you logged in to your account, and store your preferred currency (USD/LKR). Analytics cookies are used to assess platform performance and improve usability. You can adjust cookie configurations via your browser settings.",
    },
    {
      title: "6. Contact Us",
      content: "For questions about our privacy standards, or to file a data removal request, please reach out to our Compliance Office at privacy@aura.com.",
    },
  ],
};

const DEFAULT_TERMS: PolicyData = {
  title: "Terms & Conditions",
  lastUpdated: "June 21, 2026",
  badge: "Agreements & Terms",
  icon: "Scale",
  intro: "Welcome to the Aura Inc. e-commerce platform. By accessing or purchasing from our website, you agree to be bound by the following Terms & Conditions. Please read them carefully before finalizing your orders.",
  sections: [
    {
      title: "1. User Account & Security",
      content: "To complete purchases and utilize member discounts (such as Aura+ benefits), you may register an account. You are responsible for keeping your credential details private. We reserve the right to close accounts or restrict access if fraud or terms violation is suspected.",
    },
    {
      title: "2. Product Pricing & Currency Conversion",
      content: "All products are sourced directly from high-end Sri Lankan tea estates, handloom collectives, and heritage artisan groups.\n\n• Base Currency: Our base pricing is defined in United States Dollars (USD).\n• LKR Conversion: Local display and conversion to Sri Lankan Rupees (LKR) is calculated at a fixed mock exchange rate of 1 USD = 300 LKR. This is subject to display updates and does not necessarily reflect live interbank rates.\n• We reserve the right to correct pricing errors or update product details at any time without prior warning.",
    },
    {
      title: "3. Shipping, Import Duties, and Customs",
      content: "We ship products worldwide to locations including the United States, United Kingdom, Australia, Singapore, and Sri Lanka.\n\n• Shipping Rates: Shipping costs are dynamically calculated during checkout based on the destination country. Local delivery inside Sri Lanka is free of charge.\n• Customs Duties & Taxes: International shipments may be subject to customs clearance procedures, import duties, and taxes levied by the destination country. The buyer is solely responsible for paying all additional customs fees, taxes, and import clearance duties. We cannot predict these charges and are not liable for packages seized or delayed by border customs control.",
    },
    {
      title: "4. Limitation of Liability",
      content: "Aura Inc. is not liable for any indirect, incidental, or punitive damages resulting from your use of the store, including transit delays caused by couriers, weather disruptions, or customs clearance holds. Our total liability for any purchase shall not exceed the price paid for the specific item in question.",
    },
    {
      title: "5. Intellectual Property Rights",
      content: "All content on this site—including text, graphics, logos, product descriptions, photography, and UI/UX design—is owned by Aura Inc. or our heritage suppliers. Copying, distributing, or reproducing any elements without explicit written consent is strictly prohibited.",
    },
    {
      title: "6. Governing Law",
      content: "These Terms & Conditions and any separate purchase agreements shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to conflict of law principles. Any legal disputes arising from your use of our platform shall be settled under the jurisdiction of courts in Colombo, Sri Lanka.",
    },
  ],
};

const DEFAULT_REFUNDS: PolicyData = {
  title: "Refund Policy",
  lastUpdated: "June 21, 2026",
  badge: "Returns & Refunds",
  icon: "RotateCcw",
  intro: "At Aura Inc., we take pride in the quality and craftsmanship of our Sri Lankan heritage exports. If you are not entirely satisfied with your purchase, we are here to assist with our transparent global return guidelines.",
  sections: [
    {
      title: "1. 30-Day Return Window",
      content: "You have 30 calendar days from the date of delivery to request a return for eligible items. To qualify, the item must be unused, in the same condition that you received it, and in its original premium packaging.",
    },
    {
      title: "2. Policy Exclusions & Non-Returnable Goods",
      content: "Due to international export regulations, sanitary guidelines, and the nature of customized products, certain items are excluded from returns:\n\n• Perishable Goods: Open packets of Ceylon Tea, loose Spices (Cinnamon, Cardamom, Pepper), and organic Ayurvedic herbal products cannot be returned.\n• Artisan Handicrafts: Wooden statues, masks, and brassware that are custom-carved or personalized by local artisans are non-refundable unless damaged during transit.\n• Gift Cards and promotional voucher codes are non-refundable and cannot be exchanged for cash.",
    },
    {
      title: "3. Damages in Transit & Defective Items",
      content: "If your package is damaged during international shipment:\n\n• Please inspect your package immediately upon receipt.\n• Contact us within 48 hours of delivery with clear photographs of the damaged product and the shipping box.\n• Approved transit-damaged returns are eligible for a free replacement or a full refund, and we will cover the return courier costs.",
    },
    {
      title: "4. Return Shipping Fees",
      content: "For change-of-mind returns, you are responsible for paying the courier costs to return the package back to our logistics hub in Colombo, Sri Lanka. Shipping charges and import duties from your original order are non-refundable.",
    },
    {
      title: "5. Refund Processing Time",
      content: "Once your returned item is received at our hub and inspected by our quality assurance team:\n\n• We will send you an email notification confirming receipt.\n• Approved returns are processed immediately back to your original payment method.\n• Settlement Currency: Refunds are issued in the base purchase currency (USD). If you checked out in LKR, your bank will convert the returned USD back to LKR at your bank's current conversion rate.\n• Please allow 5 to 10 business days for the credit to appear on your bank or card statement depending on financial institutions.",
    },
    {
      title: "6. How to Initiate a Return",
      content: "To begin a return, please submit your request to our support desk at support@aura.com referencing your Order Number (e.g. ORD-12345). Please do not send items back without an authorized return merchandise authorization (RMA) label.",
    },
  ],
};

const LS_KEYS = {
  privacy: "aura_policy_privacy",
  terms: "aura_policy_terms",
  refund: "aura_policy_refund",
} as const;

type ActiveTab = "privacy" | "terms" | "refund";

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("privacy");
  const [editingData, setEditingData] = useState<PolicyData>(DEFAULT_PRIVACY);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load selected policy details from localStorage or fall back to default
  useEffect(() => {
    const key = LS_KEYS[activeTab];
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setEditingData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse policy data from localStorage", e);
        setEditingData(getDefaultData(activeTab));
      }
    } else {
      setEditingData(getDefaultData(activeTab));
    }
  }, [activeTab]);

  function getDefaultData(tab: ActiveTab): PolicyData {
    switch (tab) {
      case "privacy":
        return DEFAULT_PRIVACY;
      case "terms":
        return DEFAULT_TERMS;
      case "refund":
        return DEFAULT_REFUNDS;
    }
  }

  const handleMetaChange = (field: keyof PolicyData, value: string) => {
    setEditingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionChange = (index: number, field: keyof PolicySection, value: string) => {
    setEditingData((prev) => {
      const updated = [...prev.sections];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    setEditingData((prev) => {
      const sections = [...prev.sections];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= sections.length) return prev;

      const temp = sections[index];
      sections[index] = sections[targetIndex];
      sections[targetIndex] = temp;

      return { ...prev, sections };
    });
  };

  const deleteSection = (index: number) => {
    setEditingData((prev) => {
      const sections = prev.sections.filter((_, i) => i !== index);
      return { ...prev, sections };
    });
    toast.success("Section removed from preview");
  };

  const addSection = () => {
    setEditingData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: `New Section ${prev.sections.length + 1}`,
          content: "Enter section details here. Start lines with • to format bullet items.",
        },
      ],
    }));
    toast.success("Added new policy section");
  };

  const handleReset = () => {
    if (confirm(`Are you sure you want to reset the ${editingData.title} to default? This will clear any unsaved edits.`)) {
      const defaults = getDefaultData(activeTab);
      setEditingData(defaults);
      localStorage.removeItem(LS_KEYS[activeTab]);
      toast.success("Reset to original guidelines template");
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate API delay
    setTimeout(() => {
      localStorage.setItem(LS_KEYS[activeTab], JSON.stringify(editingData));
      setIsPublishing(false);
      toast.success(`${editingData.title} published and live!`);
    }, 850);
  };

  const renderIcon = (iconName: PolicyData["icon"], size = 16, className = "") => {
    switch (iconName) {
      case "Shield":
        return <Shield size={size} className={className} />;
      case "Scale":
        return <Scale size={size} className={className} />;
      case "RotateCcw":
        return <RotateCcw size={size} className={className} />;
    }
  };

  // Helper to parse newlines and bullet points for Live Preview simulation
  const parsePreviewText = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = (key: number) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-5 space-y-2 text-foreground/85 mt-2">
            {currentList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
        // Strip bullet indicator
        const content = trimmed.replace(/^[•\-\*]\s*/, "");
        currentList.push(content);
      } else {
        flushList(index);
        if (trimmed !== "") {
          elements.push(
            <p key={`p-${index}`} className="text-foreground/80 leading-relaxed">
              {trimmed}
            </p>
          );
        }
      }
    });
    flushList(lines.length);

    return elements;
  };

  // Map active tab to slug link
  const getLiveLink = () => {
    switch (activeTab) {
      case "privacy":
        return "/privacy-policy";
      case "terms":
        return "/terms";
      case "refund":
        return "/refund-policy";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Content (CMS)</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your store's legal guidelines, compliance texts, and policy pages dynamically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={getLiveLink()}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted transition text-foreground"
          >
            <Eye size={14} /> View Live Page
          </Link>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted transition text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
          >
            <RefreshCw size={14} /> Reset Default
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 rounded-xl bg-brand text-brand-foreground px-4 py-2.5 text-xs font-semibold hover:bg-brand-dark transition shadow-glow disabled:opacity-50"
          >
            {isPublishing ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Save size={14} /> Publish Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-border gap-1 overflow-x-auto scrollbar-hide">
        {(["privacy", "terms", "refund"] as const).map((tab) => {
          const isActive = activeTab === tab;
          let label = "";
          let IconComp = Shield;
          if (tab === "privacy") {
            label = "Privacy Policy";
            IconComp = Shield;
          } else if (tab === "terms") {
            label = "Terms & Conditions";
            IconComp = Scale;
          } else {
            label = "Refund Policy";
            IconComp = RotateCcw;
          }

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? "border-brand text-brand bg-brand/5"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconComp size={14} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Main layout container (Split Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor controls: 7 columns on large screens */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-card space-y-4">
            <h2 className="text-sm font-bold text-foreground pb-2 border-b border-border">Page Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Page Title
                </label>
                <input
                  type="text"
                  value={editingData.title}
                  onChange={(e) => handleMetaChange("title", e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-xs outline-none focus:ring-2 ring-brand font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Badge / Pill Label
                </label>
                <input
                  type="text"
                  value={editingData.badge}
                  onChange={(e) => handleMetaChange("badge", e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-xs outline-none focus:ring-2 ring-brand font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Last Updated Date
                </label>
                <input
                  type="text"
                  value={editingData.lastUpdated}
                  onChange={(e) => handleMetaChange("lastUpdated", e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-xs outline-none focus:ring-2 ring-brand font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Badge Icon
                </label>
                <CustomDropdown
                  options={[
                    { value: "Shield", label: "Shield (Privacy)", icon: <Shield size={12} className="text-brand" /> },
                    { value: "Scale", label: "Scale (Terms)", icon: <Scale size={12} className="text-brand" /> },
                    { value: "RotateCcw", label: "RotateCcw (Refunds)", icon: <RotateCcw size={12} className="text-brand" /> },
                  ]}
                  selectedValue={editingData.icon}
                  onChange={(val) => handleMetaChange("icon", val as any)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Introduction Paragraph
              </label>
              <textarea
                value={editingData.intro}
                onChange={(e) => handleMetaChange("intro", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-muted/20 p-3 text-xs outline-none focus:ring-2 ring-brand leading-relaxed"
                placeholder="Introductory text describing the policy context..."
              />
            </div>
          </div>

          {/* Policy Sections Manager */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Guidelines Sections ({editingData.sections.length})</h2>
              <button
                onClick={addSection}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 hover:bg-brand text-brand hover:text-brand-foreground px-3 py-1.5 text-xs font-bold transition"
              >
                <Plus size={12} /> Add Section
              </button>
            </div>

            {editingData.sections.map((section, index) => (
              <div
                key={index}
                className="rounded-2xl bg-card border border-border p-5 shadow-card space-y-3 transition hover:border-brand/40"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-foreground">Section Controller</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveSection(index, "down")}
                      disabled={index === editingData.sections.length - 1}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => deleteSection(index)}
                      className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                      title="Delete Section"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Section Title (e.g. 1. Terms of Use)"
                    value={section.title}
                    onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/10 px-3 py-2 text-xs outline-none focus:ring-2 ring-brand font-bold"
                  />
                  <textarea
                    placeholder="Section Content text body. Start lines with • or - to generate clean bullet items."
                    value={section.content}
                    onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border bg-muted/10 p-3 text-xs outline-none focus:ring-2 ring-brand leading-relaxed font-sans"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addSection}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-border hover:border-brand rounded-2xl p-4 text-xs font-bold text-muted-foreground hover:text-brand bg-card hover:bg-brand/5 transition"
            >
              <Plus size={14} /> Add New Policy Section
            </button>
          </div>
        </div>

        {/* Live Preview Pane: 5 columns on large screens */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Storefront Live Preview</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} /> Real-time active
            </span>
          </div>

          <div className="rounded-3xl border border-border bg-muted/20 overflow-hidden shadow-card p-1">
            {/* Embedded mockup of the policy template */}
            <div className="bg-card rounded-2xl p-6 sm:p-8 max-h-[70vh] overflow-y-auto scrollbar-hide text-left space-y-6">
              {/* Back button representation */}
              <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                <ArrowUp size={10} className="-rotate-90" /> Back to Store
              </div>

              <div className="border-b border-border pb-5 space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 text-brand px-2.5 py-0.5 text-[10px] font-bold">
                  {renderIcon(editingData.icon, 10)} {editingData.badge || "Legal Guidelines"}
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight">
                  {editingData.title || "Policy Title"}
                </h1>
                <p className="text-[10px] text-muted-foreground">Last updated: {editingData.lastUpdated}</p>
              </div>

              {/* Policy Body */}
              <div className="space-y-5 text-xs font-sans text-foreground/80 leading-relaxed">
                <p className="font-semibold text-foreground">{editingData.intro}</p>

                {editingData.sections.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h2 className="text-sm font-bold text-foreground border-l-2 border-brand pl-2 mt-4">
                      {section.title || `Section ${idx + 1}`}
                    </h2>
                    <div className="space-y-2 leading-relaxed">
                      {parsePreviewText(section.content || "")}
                    </div>
                  </div>
                ))}

                {editingData.sections.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-xs italic">
                    No sections added yet. Click &apos;Add Section&apos; in the controller to populate details.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-xs text-muted-foreground text-center">
            Changes made in this viewport update the in-memory layout instantly. Click <strong className="text-foreground">Publish Changes</strong> to write configurations to local storage client states.
          </div>
        </div>
      </div>
    </div>
  );
}
