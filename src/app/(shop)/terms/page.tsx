"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

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

const DEFAULT_TERMS: PolicyData = {
  title: "Terms & Conditions",
  lastUpdated: "June 21, 2026",
  badge: "Agreements & Terms",
  icon: "Scale",
  intro: "Welcome to the Slmalkoha Inc. e-commerce platform. By accessing or purchasing from our website, you agree to be bound by the following Terms & Conditions. Please read them carefully before finalizing your orders.",
  sections: [
    {
      title: "1. User Account & Security",
      content: "To complete purchases and utilize member discounts (such as Slmalkoha+ benefits), you may register an account. You are responsible for keeping your credential details private. We reserve the right to close accounts or restrict access if fraud or terms violation is suspected.",
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
      content: "Slmalkoha Inc. is not liable for any indirect, incidental, or punitive damages resulting from your use of the store, including transit delays caused by couriers, weather disruptions, or customs clearance holds. Our total liability for any purchase shall not exceed the price paid for the specific item in question.",
    },
    {
      title: "5. Intellectual Property Rights",
      content: "All content on this site—including text, graphics, logos, product descriptions, photography, and UI/UX design—is owned by Slmalkoha Inc. or our heritage suppliers. Copying, distributing, or reproducing any elements without explicit written consent is strictly prohibited.",
    },
    {
      title: "6. Governing Law",
      content: "These Terms & Conditions and any separate purchase agreements shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to conflict of law principles. Any legal disputes arising from your use of our platform shall be settled under the jurisdiction of courts in Colombo, Sri Lanka.",
    },
  ],
};

export default function TermsAndConditionsPage() {
  const [data, setData] = useState<PolicyData>(DEFAULT_TERMS);

  useEffect(() => {
    const saved = localStorage.getItem("Slmalkoha_policy_terms");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse terms & conditions from localStorage", e);
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
            <Scale size={12} /> {data.badge}
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

