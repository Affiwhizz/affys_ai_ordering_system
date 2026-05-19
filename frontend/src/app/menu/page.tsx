import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import MobileDock from "@/components/landing/MobileDock";
import MenuView from "@/components/menu/MenuView";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Affy's full daily ordering menu — Nigerian rice dishes, stews, soups, peppersoups, traditional dishes, sides, protein, swallows, and pastries.",
};

export default function MenuPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 lg:pb-0">
        <MenuView />
      </main>
      <Footer />
      <MobileDock />
    </div>
  );
}
