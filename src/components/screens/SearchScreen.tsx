"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Search,
  Mic,
  Binoculars,
  Navigation,
  Heart,
  MapPin,
  X,
} from "lucide-react";
import { IosHomeIndicator } from "../IosStatusBar";
import { getToursFromDb } from "@/services/dbService";

interface SearchScreenProps {
  onBack: () => void;
  initialQuery?: string;
  onSelectTour?: (tour: SuggestedItem) => void;
}

export interface SuggestedItem {
  id: string;
  title: string;
  pricePerPerson: number;
  location: string;
  imageUrl: string;
  category: string;
}

const CATEGORY_ROWS = [
  [
    { id: "safari", label: "Safari", hasIcon: true },
    { id: "culture", label: "Culture", hasIcon: false },
    { id: "historical", label: "Historical", hasIcon: false },
  ],
  [
    { id: "wildlife", label: "Wildlife", hasIcon: false },
    { id: "adventure", label: "Adventure", hasIcon: false },
    { id: "food", label: "Food and drink", hasIcon: false },
  ],
];

const INITIAL_SUGGESTIONS: SuggestedItem[] = [
  {
    id: "sug-1",
    title: "Victoria Falls Safari Tour",
    pricePerPerson: 90,
    location: "Victoria Falls, Zimbabwe",
    imageUrl: "/images/experience_male_lion.jpg",
    category: "safari",
  },
  {
    id: "sug-2",
    title: "Hwange Elephant Walk",
    pricePerPerson: 95,
    location: "Hwange National Park",
    imageUrl: "/images/experience_elephant.jpg",
    category: "wildlife",
  },
  {
    id: "sug-3",
    title: "Matobo Hills Rhino Expedition",
    pricePerPerson: 110,
    location: "Matobo Hills, Zimbabwe",
    imageUrl: "/images/experience_walking_guide.jpg",
    category: "historical",
  },
  {
    id: "sug-4",
    title: "Zambezi Sunset Boat Cruise",
    pricePerPerson: 75,
    location: "Zambezi River, Zimbabwe",
    imageUrl: "/images/zambezi_river_sunset.jpg",
    category: "adventure",
  },
  {
    id: "sug-5",
    title: "Great Zimbabwe Heritage Tour",
    pricePerPerson: 85,
    location: "Masvingo, Zimbabwe",
    imageUrl: "/images/camel_desert_sunset.jpg",
    category: "culture",
  },
  {
    id: "sug-6",
    title: "Boma African Dinner & Drums",
    pricePerPerson: 65,
    location: "Victoria Falls, Zimbabwe",
    imageUrl: "/images/hero_giraffe.jpg",
    category: "food",
  },
];

export function SearchScreen({
  onBack,
  initialQuery = "",
  onSelectTour,
}: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<SuggestedItem[]>(INITIAL_SUGGESTIONS);

  useEffect(() => {
    async function loadLiveTours() {
      try {
        const dbTours = await getToursFromDb();
        if (dbTours && dbTours.length > 0) {
          const liveItems: SuggestedItem[] = dbTours.map((t) => {
            const cat = (t.category || "").toLowerCase();
            let mapped = "safari";
            if (cat.includes("wildlife")) mapped = "wildlife";
            else if (cat.includes("cultur")) mapped = "culture";
            else if (cat.includes("histor")) mapped = "historical";
            else if (cat.includes("advent") || cat.includes("walk")) mapped = "adventure";
            else if (cat.includes("food") || cat.includes("drink")) mapped = "food";

            return {
              id: t.id,
              title: t.title,
              pricePerPerson: Number(t.price_per_person) || 85,
              location: t.location || "Victoria Falls, Zimbabwe",
              imageUrl: t.image_url || "/images/safari_guide_elephants.jpg",
              category: mapped,
            };
          });

          setItems((prev) => {
            const combined = [...liveItems];
            prev.forEach((p) => {
              if (!combined.some((c) => c.title.toLowerCase() === p.title.toLowerCase())) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
      } catch (err) {
        console.warn("Could not load db tours in search:", err);
      }
    }
    loadLiveTours();
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePillClick = (catId: string) => {
    setSelectedCategory((prev) => (prev === catId ? "" : catId));
  };

  const filteredItems = items.filter((item) => {
    // 1. Filter by category if selected
    if (selectedCategory && selectedCategory !== "all") {
      const itemCat = item.category.toLowerCase();
      const selCat = selectedCategory.toLowerCase();
      const matchesCategory =
        itemCat === selCat ||
        itemCat.includes(selCat) ||
        (selCat === "safari" && (itemCat.includes("safari") || itemCat.includes("wildlife"))) ||
        (selCat === "wildlife" && (itemCat.includes("wildlife") || itemCat.includes("safari"))) ||
        (selCat === "culture" && (itemCat.includes("culture") || itemCat.includes("histor")));
      if (!matchesCategory) return false;
    }

    // 2. Filter by search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative w-full h-full min-h-full bg-white flex flex-col justify-between overflow-x-hidden overflow-y-auto pb-10 select-none">
      {/* ── Top Header with Back Arrow and Centered Title ── */}
      <div className="w-full bg-white px-5 pt-4 pb-3 shrink-0">
        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-black hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          <h1 className="text-[20px] font-bold text-black tracking-tight">
            Search
          </h1>

          {/* Spacer to keep title centered */}
          <div className="w-8" />
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex-1 w-full px-5 flex flex-col gap-4">
        {/* 1. Search Bar */}
        <div className="relative w-full h-[52px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none">
            <Search className="w-5 h-5 stroke-[2.2]" />
          </div>

          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, experiences, places....."
            className="w-full h-full pl-12 pr-12 rounded-[26px] bg-[#F2F3F5] text-[14.5px] font-medium text-black placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#1E3F32] transition-all"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-black cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Voice search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-black cursor-pointer transition-colors"
            >
              <Mic className="w-5 h-5 stroke-[2]" />
            </button>
          )}
        </div>

        {/* 2. Category Filter Pills (2 Rows matching mockup) */}
        <div className="flex flex-col gap-2.5">
          {CATEGORY_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {row.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handlePillClick(cat.id)}
                    className={`h-[42px] px-4 rounded-[22px] flex items-center justify-center gap-1.5 shrink-0 text-[13.5px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1E3F32] text-white shadow-2xs"
                        : "bg-[#F0F2F4] text-stone-900 hover:bg-stone-200"
                    }`}
                  >
                    {cat.hasIcon && <Binoculars className="w-4 h-4 stroke-[2]" />}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* 3. Search Nearby Location Wide Button */}
        <button
          type="button"
          onClick={() => {
            setSearchQuery("Victoria Falls");
          }}
          className="w-full h-[52px] rounded-[26px] bg-[#EAF0EC] hover:bg-[#E1EAE3] text-black flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
        >
          <Image
            src="/images/nearby_location_icon.png"
            alt="Nearby location"
            width={22}
            height={22}
            className="w-[21px] h-[21px] object-contain"
            unoptimized
          />
          <span className="text-[15px] font-bold text-black tracking-tight">
            Search nearby location
          </span>
        </button>

        {/* 4. Suggested Section */}
        <div className="flex flex-col gap-3 pt-2 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[21px] font-bold text-black tracking-tight">
              Suggested
            </h2>
            <button
              type="button"
              className="text-[13.5px] font-semibold text-stone-800 underline hover:text-black cursor-pointer"
            >
              See all
            </button>
          </div>

          {/* 2-Column Grid matching mockup */}
          {filteredItems.length === 0 ? (
            <div className="py-12 px-4 text-center bg-stone-50 rounded-2xl border border-stone-100 flex flex-col items-center justify-center">
              <p className="text-[14px] font-bold text-black mb-1">No experiences found</p>
              <p className="text-[12px] text-stone-500 max-w-[260px] leading-relaxed mb-3">
                Try clearing your search query or selecting a different category pill.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#1E3F32] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-[#163325] transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectTour && onSelectTour(item)}
                  className="flex flex-col group cursor-pointer active:scale-[0.99] transition-transform"
                >
                  {/* Image Container with Heart Button */}
                  <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-stone-100 shadow-2xs">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="200px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(item.id, e)}
                      aria-label="Add to favorites"
                      className="absolute top-2.5 right-2.5 p-1 text-white hover:scale-110 transition-transform cursor-pointer drop-shadow-sm"
                    >
                      <Heart
                        className={`w-5 h-5 stroke-[2] transition-colors ${
                          favorites[item.id]
                            ? "fill-[#E8622A] text-[#E8622A] stroke-[#E8622A]"
                            : "fill-none text-white stroke-white"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Info */}
                  <div className="pt-2 px-0.5 flex flex-col gap-0.5">
                    <span className="text-[14.5px] font-bold text-black leading-snug">
                      {item.title}
                    </span>
                    <span className="text-[13px] font-medium text-stone-900">
                      ${item.pricePerPerson}/person
                    </span>
                    <div className="flex items-center gap-1 text-black text-[11.5px] mt-0.5 font-normal">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-black stroke-[2]" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* iOS Home Indicator */}
      <div className="w-full shrink-0 pointer-events-none">
        <IosHomeIndicator theme="dark" />
      </div>
    </div>
  );
}
