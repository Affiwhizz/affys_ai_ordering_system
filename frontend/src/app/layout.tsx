import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import CookieBanner from "@/components/legal/CookieBanner";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import CheckoutModal from "@/components/cart/CheckoutModal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atasteofaffy.com"),
  title: {
    default: "Affy's — Modern Nigerian, made in Portugal",
    template: "%s · Affy's",
  },
  description:
    "Bold, comforting, home-style Nigerian food in Portugal. Order with Udia, our AI guide, or use the quick form. Preorder, delivery, catering, and pop-ups.",
  keywords: [
    "Affy's",
    "Modern Nigerian food",
    "Nigerian food Portugal",
    "Lisbon catering",
    "jollof rice Portugal",
    "Nigerian catering Lisbon",
    "AI food ordering",
    "Udia",
  ],
  openGraph: {
    title: "Affy's — Modern Nigerian, made in Portugal",
    description:
      "Bold, comforting, home-style Nigerian food in Portugal. Order with Udia or fill the quick form.",
    url: "https://atasteofaffy.com",
    siteName: "Affy's",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          {children}
          <CartDrawer />
          <CheckoutModal />
        </CartProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
