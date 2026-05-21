import type { Metadata } from "next";
import CookieBanner from "@/components/legal/CookieBanner";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import CheckoutModal from "@/components/cart/CheckoutModal";
import "./globals.css";

const geistSans = { variable: "--font-geist-sans" };

const geistMono = { variable: "--font-geist-mono" };

const fraunces = { variable: "--font-fraunces" };

export const metadata: Metadata = {
  metadataBase: new URL("https://atasteofaffys.com"),
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
    url: "https://atasteofaffys.com",
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
