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
          <p className="text-lg text-muted-foreground">
            This page content is managed through the admin panel. Please create
            an "About" page with the slug "about" in the Pages section.
          </p>
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
