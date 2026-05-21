import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import MobileDock from "@/components/landing/MobileDock";
import MenuView from "@/components/menu/MenuView";
import { getPublicMenu } from "@/lib/menu/get-menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Affy's full daily ordering menu — Nigerian rice dishes, stews, soups, peppersoups, traditional dishes, sides, protein, swallows, and pastries.",
};

// Re-generate the page at most once a minute; admin edits also trigger an
// on-demand refresh via revalidatePath("/menu").
export const revalidate = 60;

export default async function MenuPage() {
  const items = await getPublicMenu();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 lg:pb-0">
        <MenuView items={items} />
      </main>
      <Footer />
      <MobileDock />
    </div>
  );
}
