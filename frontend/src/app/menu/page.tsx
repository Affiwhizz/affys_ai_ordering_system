import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import MobileDock from "@/components/landing/MobileDock";
import MenuView from "@/components/menu/MenuView";
import { getPublicMenu, getCategories } from "@/lib/menu/get-menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Affy's full daily ordering menu, Nigerian rice dishes, stews, soups, peppersoups, traditional dishes, sides, protein, swallows, and pastries.",
};

// Always render fresh from the database so admin edits (prices, names,
// availability) show up immediately. One small query per visit, fine for a
// menu, and removes any caching ambiguity.
export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [items, categories] = await Promise.all([
    getPublicMenu(),
    getCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 lg:pb-0">
        <MenuView items={items} categories={categories.map((c) => c.name)} />
      </main>
      <Footer />
      <MobileDock />
    </div>
  );
}
