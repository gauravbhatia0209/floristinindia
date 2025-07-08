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

  const renderContentBlocks = (content: any) => {
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
      return (
        <div className="max-w-3xl mx-auto p-4 text-center">
          <p className="text-base text-gray-700 mb-2">
            About Us content is being updated. Please check back soon.
          </p>
        </div>
      );
    }

    return content.blocks.map((block: any, index: number) => {
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
            <p key={index} className="text-base text-gray-700 mb-2">
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
              className="inline-block bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors mb-4"
            >
              {block.content || block.text}
            </a>
          );
        case "list":
          return (
            <ul key={index} className="list-disc list-inside mb-4">
              {(block.items || []).map((item: string, itemIndex: number) => (
                <li key={itemIndex} className="text-base text-gray-700 mb-1">
                  {item}
                </li>
              ))}
            </ul>
          );
        default:
          return (
            <div key={index} className="text-base text-gray-700 mb-2">
              {block.content || ""}
            </div>
          );
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto p-4">
        {pageData?.content ? (
          renderContentBlocks(pageData.content)
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">About Florist in India</h1>
            <p className="text-base text-gray-700 mb-2">
              We are your trusted destination for premium flower, cake, and gift
              delivery services across India. With a strong presence in over
              100+ cities including Delhi NCR, Mumbai, Bangalore, and Jalandhar,
              we ensure every celebration feels special—no matter the distance.
            </p>

            <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
            <ul className="list-disc list-inside mb-4">
              <li className="text-base text-gray-700 mb-1">
                🌸 Same Day Flower Delivery
              </li>
              <li className="text-base text-gray-700 mb-1">
                📍 100+ Cities Covered
              </li>
              <li className="text-base text-gray-700 mb-1">
                💬 24/7 Customer Support
              </li>
              <li className="text-base text-gray-700 mb-1">
                💝 Custom Gift Combos
              </li>
              <li className="text-base text-gray-700 mb-1">
                💳 Secure Payments
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-base text-gray-700 mb-2">
              We aim to connect emotions through fresh blooms. Whether it's a
              birthday, anniversary, wedding, or a simple "thinking of you"—we
              help you say it beautifully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
