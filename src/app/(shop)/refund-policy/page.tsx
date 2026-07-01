"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

interface PolicySection {
  title: string;
  content: string;
}

interface PolicyData {
  title: string;
  lastUpdated: string;
  badge: string;
  icon: string;
  intro: string;
  sections: PolicySection[];
}

const DEFAULT_REFUNDS: PolicyData = {
  title: "Refund Policy",
  lastUpdated: "June 21, 2026",
  badge: "Returns & Refunds",
  icon: "RotateCcw",
  intro: "At Slmalkoha Inc., we take pride in the quality and craftsmanship of our Sri Lankan heritage exports. If you are not entirely satisfied with your purchase, we are here to assist with our transparent global return guidelines.",
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
      content: "To begin a return, please submit your request to our support desk at support@Slmalkohacom referencing your Order Number (e.g. ORD-12345). Please do not send items back without an authorized return merchandise authorization (RMA) label.",
    },
  ],
};

export default function RefundPolicyPage() {
  const [data, setData] = useState<PolicyData>(DEFAULT_REFUNDS);

  useEffect(() => {
    const saved = localStorage.getItem("Slmalkoha_policy_refund");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse refund policy from localStorage", e);
      }
    }
  }, []);

  const parseContentText = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = (key: number) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-5 space-y-2">
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
        const content = trimmed.replace(/^[•\-\*]\s*/, "");
        currentList.push(content);
      } else {
        flushList(index);
        if (trimmed !== "") {
          elements.push(<p key={`p-${index}`}>{trimmed}</p>);
        }
      }
    });
    flushList(lines.length);

    return elements;
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-3xl p-8 sm:p-12 shadow-card">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-brand transition mb-8"
        >
          <ArrowLeft size={14} /> Back to Store
        </Link>

        {/* Heading Header */}
        <header className="border-b border-border pb-8 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 text-brand px-3 py-1 text-xs font-bold mb-4">
            <RotateCcw size={12} /> {data.badge}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {data.title}
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">Last updated: {data.lastUpdated}</p>
        </header>

        {/* Legal Text */}
        <article className="prose prose-brand max-w-none text-foreground/80 space-y-6 text-sm leading-relaxed">
          <p className="font-semibold text-foreground">{data.intro}</p>

          {data.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h2 className="text-xl font-bold text-foreground mt-8 border-l-2 border-brand pl-3">
                {section.title}
              </h2>
              <div className="space-y-4 leading-relaxed">
                {parseContentText(section.content)}
              </div>
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}

