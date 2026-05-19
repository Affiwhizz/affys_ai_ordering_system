import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Admin · Affy's",
  },
  description: "Affy's admin dashboard — orders, catering, Portimão, menu, customers.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-foreground">
      <Sidebar />
      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
