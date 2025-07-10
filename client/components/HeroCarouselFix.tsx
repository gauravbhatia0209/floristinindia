import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function HeroCarouselFix() {
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState<string>("");

  const imageUrl =
    "https://cdn.builder.io/api/v1/image/assets%2F6386b40bf6104ad989c576dd2c4f7f26%2F780a5430107241139fcf7c7f71f44e5d?format=webp&width=800";

  async function fixHeroCarousel() {
    setIsFixing(true);
    setResult("🔍 Looking for hero carousel sections...");

    try {
      // Find hero carousel sections or hero sections with carousel_mode
      const { data: sections, error: fetchError } = await supabase
        .from("homepage_sections")
        .select("*")
        .or(
          "type.eq.hero_carousel,and(type.eq.hero,content->>carousel_mode.eq.true)",
        );

      if (fetchError) {
        setResult(`❌ Error fetching sections: ${fetchError.message}`);
        return;
      }

      console.log("📋 Found sections:", sections);
      setResult(`📋 Found ${sections?.length || 0} hero carousel sections...`);

      if (!sections || sections.length === 0) {
        setResult("🆕 No hero carousel sections found. Creating one...");

        // Create a new hero carousel section
        const { data: newSection, error: createError } = await supabase
          .from("homepage_sections")
          .insert({
            type: "hero_carousel",
            title: "Hero Image Carousel",
            subtitle: "",
            content: {
              carousel_mode: true,
              images: [imageUrl],
              autoplay: true,
              autoplay_delay: 5000,
              show_navigation: true,
              show_dots: true,
              height: 500,
            },
            settings: {},
            is_active: true,
            sort_order: 0,
          })
          .select()
          .single();

        if (createError) {
          setResult(`❌ Error creating section: ${createError.message}`);
          return;
        }

        setResult(`✅ Created new hero carousel section: ${newSection.title}`);
      } else {
        // Update existing sections
        for (const section of sections) {
          console.log(
            `🔄 Updating section: ${section.title} (${section.type})`,
          );

          const updatedContent = {
            ...section.content,
            carousel_mode: true,
            images: [imageUrl],
            autoplay: section.content?.autoplay !== false,
            autoplay_delay: section.content?.autoplay_delay || 5000,
            show_navigation: section.content?.show_navigation !== false,
            show_dots: section.content?.show_dots !== false,
            height: section.content?.height || 500,
          };

          const { error: updateError } = await supabase
            .from("homepage_sections")
            .update({ content: updatedContent })
            .eq("id", section.id);

          if (updateError) {
            setResult(
              `❌ Error updating section ${section.id}: ${updateError.message}`,
            );
            return;
          }

          setResult(
            `✅ Updated section "${section.title}" with image. Refresh the page to see changes!`,
          );
        }
      }
    } catch (error) {
      setResult(`💥 Unexpected error: ${error}`);
    } finally {
      setIsFixing(false);
    }
  }

  return (
    <div className="fixed top-4 right-4 bg-white p-4 border rounded-lg shadow-lg z-50 max-w-md">
      <h3 className="font-bold mb-2">Hero Carousel Fix</h3>
      <p className="text-sm text-gray-600 mb-3">
        This will update the hero carousel with the provided image.
      </p>
      <Button
        onClick={fixHeroCarousel}
        disabled={isFixing}
        className="w-full mb-2"
      >
        {isFixing ? "Fixing..." : "Fix Hero Carousel"}
      </Button>
      {result && (
        <div className="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
