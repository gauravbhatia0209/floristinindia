import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ContactUs from "@/components/pages/ContactUs";
import AboutUsPage from "@/components/pages/AboutUsPage";
import HelpCenterPage from "@/components/pages/HelpCenterPage";
import ReturnRefundPage from "@/components/pages/ReturnRefundPage";
import PrivacyPolicyPage from "@/components/pages/PrivacyPolicyPage";
import TermsConditionsPage from "@/components/pages/TermsConditionsPage";
import DeliveryInfoPage from "@/components/pages/DeliveryInfoPage";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotFound from "@/pages/NotFound";
import { SectionRenderer, Section } from "@/components/SectionRenderer";

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

  // Determine the actual slug - either from URL params or from current path
  const currentPath = window.location.pathname.replace(/^\//, "");
  const actualSlug = slug || currentPath;

  console.log("Page component: useParams slug =", slug);
  console.log("Page component: currentPath =", currentPath);
  console.log("Page component: actualSlug =", actualSlug);

  console.log(
    "Page component: URL slug =",
    slug,
    "Current path =",
    currentPath,
    "Actual slug =",
    actualSlug,
  );

  useEffect(() => {
    if (actualSlug) {
      console.log("Page component: Fetching page for slug:", actualSlug);
      // For 'about' slug, skip database fetch since AboutUsPage handles its own content
      if (actualSlug === "about") {
        setIsLoading(false);
        setPageData({
          id: "about",
          title: "About Florist in India",
          slug: "about",
          content: "",
          is_active: true,
          show_in_footer: true,
          sort_order: 1,
          created_at: "",
          updated_at: "",
        });
      } else {
        fetchPage(actualSlug);
      }
    }
  }, [actualSlug]);

  async function fetchPage(pageSlug: string) {
    try {
      setIsLoading(true);
      setNotFound(false);

      // Handle slug mappings for database lookup
      let actualSlug = pageSlug;
      if (pageSlug === "help") {
        actualSlug = "help-center";
      }
      if (pageSlug === "terms") {
        actualSlug = "terms-conditions";
      }

      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", actualSlug)
        .eq("is_active", true)
        .single();

      if (error || !data) {
        console.log(
          "Page component: No data found or error for slug:",
          pageSlug,
          error,
        );
        setNotFound(true);
      } else {
        console.log(
          "Page component: Setting page data for slug:",
          pageSlug,
          data,
        );
        // Set the original slug for routing logic
        setPageData({ ...data, slug: pageSlug });
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
    return <NotFound />;
  }

  // Handle specialized page types with professional UI
  console.log("Page component: Routing to component for slug:", pageData.slug);

  switch (pageData.slug) {
    case "about":
      console.log("Page component: Rendering AboutUsPage");
      return (
        <ErrorBoundary>
          <AboutUsPage />
        </ErrorBoundary>
      );
    case "help-center":
    case "help":
      console.log("Page component: Rendering HelpCenterPage");
      return <HelpCenterPage />;
    case "return-refunds":
      console.log("Page component: Rendering ReturnRefundPage");
      return <ReturnRefundPage />;
    case "privacy-policy":
      console.log("Page component: Rendering PrivacyPolicyPage");
      return <PrivacyPolicyPage />;
    case "terms-conditions":
    case "terms":
      console.log("Page component: Rendering TermsConditionsPage");
      return <TermsConditionsPage />;
    case "delivery-info":
      console.log("Page component: Rendering DeliveryInfoPage");
      return <DeliveryInfoPage />;
    case "contact-us":
    case "contact":
      console.log("Page component: Rendering ContactUs");
      return <ContactUs pageContent={pageData.content} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {pageData.title}
          </h1>
        </header>

        <main>
          {(() => {
            // Handle different content formats
            console.log("Page content type:", typeof pageData.content);
            console.log("Page content:", pageData.content);

            // Check if content is the new section format (array of Section objects)
            if (
              Array.isArray(pageData.content) &&
              pageData.content.length > 0 &&
              pageData.content[0].id &&
              pageData.content[0].type
            ) {
              console.log("Rendering with SectionRenderer");
              return (
                <SectionRenderer sections={pageData.content as Section[]} />
              );
            }
            // Handle legacy string HTML content
            else if (typeof pageData.content === "string") {
              console.log("Rendering legacy HTML content");
              return (
                <div className="prose prose-lg max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: pageData.content }}
                    className="break-words"
                  />
                </div>
              );
            }
            // Handle legacy structured content with blocks
            else if (
              typeof pageData.content === "object" &&
              pageData.content &&
              pageData.content.blocks
            ) {
              console.log("Rendering legacy blocks content");
              return (
                <div className="prose prose-lg max-w-none">
                  {pageData.content.blocks.map((block: any, index: number) => {
                    switch (block.type) {
                      case "heading":
                        return (
                          <h1 key={index} className="text-2xl font-bold mb-4">
                            {block.content}
                          </h1>
                        );
                      case "text":
                      case "paragraph":
                        return (
                          <p
                            key={index}
                            className="text-base text-gray-700 mb-2"
                          >
                            {block.content}
                          </p>
                        );
                      case "image":
                        return (
                          <img
                            key={index}
                            src={block.url || block.content}
                            alt={block.alt || ""}
                            className="w-full max-w-md mx-auto rounded-lg mb-4"
                          />
                        );
                      case "button":
                        return (
                          <a
                            key={index}
                            href={block.url || "#"}
                            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors mb-4"
                          >
                            {block.content || block.text}
                          </a>
                        );
                      case "list":
                        return (
                          <ul
                            key={index}
                            className="list-disc list-inside mb-4"
                          >
                            {(block.items || []).map(
                              (item: string, itemIndex: number) => (
                                <li
                                  key={itemIndex}
                                  className="text-base text-gray-700 mb-1"
                                >
                                  {item}
                                </li>
                              ),
                            )}
                          </ul>
                        );
                      default:
                        return (
                          <div
                            key={index}
                            className="text-base text-gray-700 mb-2"
                          >
                            {block.content || ""}
                          </div>
                        );
                    }
                  })}
                </div>
              );
            }
            // Fallback for empty or unrecognized content
            else {
              console.log("No valid content found");
              return (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Page content is being updated. Please check back soon.
                  </p>
                </div>
              );
            }
          })()}
        </main>
      </div>
    </div>
  );
}
