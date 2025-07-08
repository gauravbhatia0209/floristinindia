import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AboutSimple() {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutPage();
  }, []);

  async function fetchAboutPage() {
    try {
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", "about")
        .eq("is_active", true)
        .single();

      if (error) {
        setError(`Database error: ${error.message}`);
        console.error("Database error:", error);
      } else if (data) {
        console.log("About page data loaded:", data);
        setPageData(data);
      }
    } catch (error: any) {
      setError(`Failed to fetch: ${error.message}`);
      console.error("Failed to fetch about page:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">About Us</h1>
          <div className="bg-red-50 border border-red-200 p-4 rounded mb-8">
            <p className="text-red-800">Database Error: {error}</p>
          </div>
          <p className="text-lg text-gray-600">
            Please set up the database tables using Admin → Database Setup
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Florist in India</h1>

        {/* Debug Info */}
        <div className="bg-gray-100 p-4 rounded mb-8 text-sm">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>Page Data: {pageData ? "Found" : "Not Found"}</p>
          <p>Content Type: {typeof pageData?.content}</p>
          <p>
            Content Preview:{" "}
            {JSON.stringify(pageData?.content).substring(0, 100)}...
          </p>
        </div>

        {/* Content */}
        {pageData?.content ? (
          <div className="prose prose-lg max-w-none">
            {typeof pageData.content === "string" ? (
              <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            ) : (
              <div>
                <p>Content is an object, not a string. Raw content:</p>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(pageData.content, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <h2>Welcome to Florist in India</h2>
            <p>
              We are your trusted destination for premium flower, cake, and gift
              delivery services across India. With a strong presence in over
              100+ cities including Delhi NCR, Mumbai, Bangalore, and Jalandhar,
              we ensure every celebration feels special—no matter the distance.
            </p>

            <h3>Why Choose Us</h3>
            <ul>
              <li>🌸 Same Day Flower Delivery</li>
              <li>📍 100+ Cities Covered</li>
              <li>💬 24/7 Customer Support</li>
              <li>💝 Custom Gift Combos</li>
              <li>💳 Secure Payments</li>
            </ul>

            <h3>Our Mission</h3>
            <p>
              We aim to connect emotions through fresh blooms. Whether it's a
              birthday, anniversary, wedding, or a simple "thinking of you"—we
              help you say it beautifully.
            </p>

            <div className="bg-blue-50 p-4 rounded mt-8">
              <p>
                <strong>Note:</strong> This is the default content. To customize
                this page, create an "About" page with slug "about" in the Admin
                Panel → Pages section.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
