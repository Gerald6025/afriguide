import { createClient } from "@/lib/supabase/client";
import { Guide, Tour } from "@/types/database";

// Fallback verified local guides from Zimbabwe and Southern Africa
export const FALLBACK_GUIDES: Guide[] = [
  {
    id: "g-1",
    name: "Tendai Moyo",
    bio: "Certified Safari Guide with 12+ years of experience across Victoria Falls, Zambezi National Park, and Mana Pools. Passionate birder and wildlife photographer.",
    country: "Zimbabwe",
    location: "Victoria Falls, Zimbabwe",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    cover_image_url:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    rating: 4.95,
    reviews_count: 142,
    years_experience: 12,
    languages: ["English", "Shona", "Ndebele"],
    specialties: ["Big 5 Walking Safaris", "Victoria Falls Rainforest", "Birdwatching"],
    verified: true,
    phone: "+263 77 123 4567",
    created_at: new Date().toISOString(),
  },
  {
    id: "g-2",
    name: "Farai Chitepo",
    bio: "Hwange National Park native tracker and cultural storyteller. Specialist in elephant behavior and night game drives.",
    country: "Zimbabwe",
    location: "Hwange, Zimbabwe",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    cover_image_url:
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviews_count: 98,
    years_experience: 15,
    languages: ["English", "Ndebele", "Tonga"],
    specialties: ["Hwange Wildlife Drives", "Bush Tracking", "Star Gazing"],
    verified: true,
    phone: "+263 71 987 6543",
    created_at: new Date().toISOString(),
  },
  {
    id: "g-3",
    name: "Blessing Ndlovu",
    bio: "Historian and wilderness explorer specializing in Great Zimbabwe ruins, Matobo Hills granite formations, and ancient San rock art.",
    country: "Zimbabwe",
    location: "Bulawayo & Matobo, Zimbabwe",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    cover_image_url:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviews_count: 76,
    years_experience: 9,
    languages: ["English", "Ndebele"],
    specialties: ["Matobo Rhino Tracking", "San Rock Art", "Great Zimbabwe"],
    verified: true,
    phone: "+263 78 456 7890",
    created_at: new Date().toISOString(),
  },
];

/**
 * Fetch verified guides from Supabase with graceful fallback
 */
export async function getVerifiedGuides(country = "Zimbabwe"): Promise<Guide[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("verified", true)
      .order("rating", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_GUIDES;
    }

    return data as Guide[];
  } catch (err) {
    console.warn("Supabase fetch failed, using fallback guides:", err);
    return FALLBACK_GUIDES;
  }
}

/**
 * Fetch tours for a specific guide
 */
export async function getToursForGuide(guideId: string): Promise<Tour[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .eq("guide_id", guideId);

    if (error || !data) {
      return [];
    }

    return data as Tour[];
  } catch {
    return [];
  }
}
