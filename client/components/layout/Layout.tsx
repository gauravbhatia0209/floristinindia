import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/toaster";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import DynamicMetaTags from "@/components/DynamicMetaTags";
import FaviconManager from "@/components/FaviconManager";
import SEOManager from "@/components/SEOManager";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global SEO and Meta Management */}
      <DynamicMetaTags />
      <FaviconManager />
      <SEOManager />

      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <WhatsAppFloat />
    </div>
  );
}
