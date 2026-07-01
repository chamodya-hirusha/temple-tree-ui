"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

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

const DEFAULT_PRIVACY: PolicyData = {
  title: "Privacy Policy",
  lastUpdated: "June 21, 2026",
  badge: "Compliance & Trust",
  icon: "Shield",
  intro: "At Slmalkoha Inc., we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, process, share, and protect your information when you visit or make a purchase from our international single-vendor e-commerce platform.",
  sections: [
    {
      title: "1. Information We Collect",
      content: "To facilitate global deliveries and customize your shopping experience, we collect various types of information, including:\n\n• Identity & Contact Details: Your name, billing address, international shipping address, email address, and phone number.\n• Financial Information: Payment details processed securely via our encrypted payment gateways. We do not directly store credit card details on our servers.\n• Technical & Usage Data: IP address, browser type, location data (used for LKR/USD currency switching), and browsing behavior on our platform.",
    },
    {
      title: "2. How We Use Your Data",
      content: "We process your information to fulfill contracts (such as delivering Ceylon tea, handicrafts, or spices to your door) and to comply with legal obligations. Specifically, your data is used to:\n\n• Process and fulfill orders, including international shipping, customs documentation, and logistics tracking.\n• Screen orders for potential risk or fraud.\n• Maintain customer accounts and loyalty profiles (such as Slmalkoha+ benefits).\n• Send order updates, tracking details, and promotional communications (where consented).",
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
      content: "For questions about our privacy standards, or to file a data removal request, please reach out to our Compliance Office at privacy@Slmalkohacom.",
    },
  ],
};

export default function PrivacyPolicyPage() {
  const [data, setData] = useState<PolicyData>(DEFAULT_PRIVACY);

  useEffect(() => {
    const saved = localStorage.getItem("Slmalkoha_policy_privacy");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse privacy policy from localStorage", e);
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
            <Shield size={12} /> {data.badge}
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

