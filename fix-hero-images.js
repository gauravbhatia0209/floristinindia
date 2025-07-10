// Script to update hero carousel section with the provided image URL
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const imageUrl =
  "https://cdn.builder.io/o/assets%2F6386b40bf6104ad989c576dd2c4f7f26%2F7d2f512d7935414599a7e593857d9e8a?alt=media&token=c0ddf80b-475e-47bf-84cd-3972e123015a&apiKey=6386b40bf6104ad989c576dd2c4f7f26";

async function updateHeroCarousel() {
  try {
    console.log("🔍 Looking for hero carousel sections...");

    // Find hero carousel sections or hero sections with carousel_mode
    const { data: sections, error: fetchError } = await supabase
      .from("homepage_sections")
      .select("*")
      .or(
        "type.eq.hero_carousel,and(type.eq.hero,content->>carousel_mode.eq.true)",
      );

    if (fetchError) {
      console.error("❌ Error fetching sections:", fetchError);
      return;
    }

    console.log("📋 Found sections:", sections?.length || 0);

    if (!sections || sections.length === 0) {
      console.log("🆕 No hero carousel sections found. Creating one...");

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
        console.error("❌ Error creating section:", createError);
        return;
      }

      console.log("✅ Created new hero carousel section:", newSection);
    } else {
      // Update existing sections
      for (const section of sections) {
        console.log(`🔄 Updating section: ${section.title} (${section.type})`);

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
          console.error(
            `❌ Error updating section ${section.id}:`,
            updateError,
          );
        } else {
          console.log(`✅ Updated section ${section.id} with image`);
        }
      }
    }

    console.log("🎉 Hero carousel update complete!");
  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

updateHeroCarousel();
