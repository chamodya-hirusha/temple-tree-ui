import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "./providers";
import "../styles.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Aura — Premium Single-Vendor Store",
  description: "Premium tech, fashion & lifestyle from Aura.",
  openGraph: {
    title: "Aura — Premium Single-Vendor Store",
    description: "Premium tech, fashion & lifestyle from Aura.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura — Premium Single-Vendor Store",
    description: "Premium tech, fashion & lifestyle from Aura.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
