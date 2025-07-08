import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  show_in_footer: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPage(slug);
    }
  }, [slug]);

  async function fetchPage(pageSlug: string) {
    try {
      setIsLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", pageSlug)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPageData(data);
      }
    } catch (error) {
      console.error("Failed to fetch page:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (pageData) {
      // Update page title and meta tags
      document.title = pageData.meta_title || pageData.title;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      if (pageData.meta_description) {
        metaDesc.setAttribute("content", pageData.meta_description);
      }
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "Florist in India";
    };
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
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !pageData) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {pageData.title}
          </h1>
        </header>

        <main className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: pageData.content }}
            className="break-words"
          />
        </main>
      </div>
    </div>
  );
}
