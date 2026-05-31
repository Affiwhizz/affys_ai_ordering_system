import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import MobileDock from "@/components/landing/MobileDock";
import PortimaoHero from "@/components/portimao/Hero";
import PortimaoPaths from "@/components/portimao/Paths";
import PortimaoMenu from "@/components/portimao/Menu";
import PortimaoFormPreview from "@/components/portimao/FormPreview";
import PortimaoRules from "@/components/portimao/Rules";
import PortimaoFAQ from "@/components/portimao/FAQ";
import PortimaoSoldOut from "@/components/portimao/SoldOut";
import PortimaoOffSeason from "@/components/portimao/OffSeason";
import { PORTIMAO } from "@/components/portimao/config";
import { getStoreFlags } from "@/lib/store/get-store-flags";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portimão preorder",
  description: `Affy's pop-up in Portimão, ${PORTIMAO.campaignName}. Preorder Nigerian bowls, suya, sides, and small chops for pickup at Praia da Rocha, or order via Uber Eats during festival hours.`,
  openGraph: {
    title: "Affy's in Portimão, preorder for the festival weekend",
    description: `${PORTIMAO.campaignWindow} · Praia da Rocha. Bowls from ${PORTIMAO.bowlPriceFrom}. Pickup or Uber Eats.`,
    url: "https://atasteofaffys.com/portimao",
    type: "website",
  },
};

export default async function PortimaoPage() {
  const { portimaoStatus } = await getStoreFlags();

  if (portimaoStatus === "off-season") {
    return (
      <div className="flex min-h-screen flex-1 flex-col bg-background">
        <Header />
        <PortimaoOffSeason />
        <Footer />
      </div>
    );
  }

  if (portimaoStatus === "sold-out") {
    return (
      <div className="flex min-h-screen flex-1 flex-col bg-background">
        <Header />
        <PortimaoSoldOut />
        <Footer />
        <MobileDock />
      </div>
    );
  }

  // LIVE, full campaign page
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Header />
      <main className="flex-1 pb-24 lg:pb-0">
        <PortimaoHero />
        <PortimaoPaths />
        <PortimaoMenu />
        <PortimaoFormPreview />
        <PortimaoRules />
        <PortimaoFAQ />
      </main>
      <Footer />
      <MobileDock />
    </div>
  );
}
