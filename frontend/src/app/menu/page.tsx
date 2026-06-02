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
// availability, photos) show up immediately. fetchCache=force-no-store +
// revalidate=0 also prevent browser HTML caching, which fixes the "Safari
// shows yesterday's menu" issue on mobile after a fresh photo upload.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function MenuPage() {
  const [items, categories] = await Promise.all([
    getPublicMenu(),
    getCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Header />
      {/* pt-[76px] / md:pt-[88px] reserves space for the now-fixed Header
          (Breakfast Alley style) which would otherwise overlap the menu hero. */}
      <main className="flex-1 pt-[76px] pb-24 md:pt-[88px] lg:pb-0">
        <MenuView items={items} categories={categories.map((c) => c.name)} />
      </main>
      <Footer />
      <MobileDock />
    </div>
  );
}
