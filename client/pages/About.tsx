import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AboutPageData {
  id: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
}

export default function About() {
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutPage();
  }, []);

  async function fetchAboutPage() {
    try {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "about")
        .eq("is_published", true)
        .single();

      if (data) {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch about page:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (pageData) {
      // Update page title and meta tags
      document.title = pageData.meta_title || pageData.title || "About Us";

      if (pageData.meta_description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", pageData.meta_description);
        }
      }
    }
  }, [pageData]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Welcome to our flower shop! We are passionate about bringing beauty
            and joy to your life through our carefully curated selection of
            fresh flowers.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h2 className="text-xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded with love and dedication, our florist shop has been
                serving the community with the freshest and most beautiful
                flowers. We believe every moment deserves to be celebrated with
                nature's finest creations.
              </p>
              <p className="text-muted-foreground">
                From birthday celebrations to wedding arrangements, from
                sympathy flowers to just-because bouquets, we are here to help
                you express your feelings through the language of flowers.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Our Promise</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Fresh flowers sourced daily</li>
                <li>• Expert floral arrangements</li>
                <li>• Same-day delivery available</li>
                <li>• Customer satisfaction guaranteed</li>
                <li>• Competitive pricing</li>
                <li>• Personalized service</li>
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              Visit our shop or get in touch to learn more about our services
              and how we can help make your special moments even more beautiful.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{pageData.title}</h1>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </div>
    </div>
  );
}
