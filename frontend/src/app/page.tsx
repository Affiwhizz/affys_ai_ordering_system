import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Portimao from "@/components/landing/Portimao";
import ThisWeek from "@/components/landing/ThisWeek";
import SignatureDishes from "@/components/landing/SignatureDishes";
import OrderOptions from "@/components/landing/OrderOptions";
import Catering from "@/components/landing/Catering";
import MeetUdia from "@/components/landing/MeetUdia";
import Story from "@/components/landing/Story";
import SocialProof from "@/components/landing/SocialProof";
import BlogTeaser from "@/components/landing/BlogTeaser";
import Footer from "@/components/landing/Footer";
import MobileDock from "@/components/landing/MobileDock";
import { getWeeklySpecials, getFeaturedDishes } from "@/lib/menu/get-menu";
import { getStoreFlags } from "@/lib/store/get-store-flags";

// Render fresh so weekly/featured changes from admin show right away (the
// readers use the cookie-based Supabase client, so the page is dynamic anyway).
export const dynamic = "force-dynamic";

export default async function Home() {
  const [weeklySpecials, featuredDishes, flags] = await Promise.all([
    getWeeklySpecials(),
    getFeaturedDishes(6),
    getStoreFlags(),
  ]);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Header />
      {/* pb-24 on mobile gives breathing room above the fixed MobileDock */}
      <main className="flex-1 pb-24 lg:pb-0">
        <Hero />
        <Portimao status={flags.portimaoStatus} />
        <ThisWeek specials={weeklySpecials} />
        <SignatureDishes dishes={featuredDishes} />
        <OrderOptions />
        <Catering />
        <MeetUdia />
        <Story />
        <SocialProof />
        <BlogTeaser />
      </main>
      <Footer />
      <MobileDock />
    </div>
  );
}
