"use client";

import React, { useState } from "react";
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

interface SearchScreenProps {
  onBack: () => void;
  initialQuery?: string;
  onSelectTour?: (tour: SuggestedItem) => void;
}

interface SuggestedItem {
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

const SUGGESTED_ITEMS: SuggestedItem[] = [
  {
    id: "sug-1",
    title: "Game drive",
    pricePerPerson: 90,
    location: "Victoria Falls, Zimbabwe",
    imageUrl: "/images/experience_male_lion.jpg",
    category: "safari",
  },
  {
    id: "sug-2",
    title: "Game drive",
    pricePerPerson: 90,
    location: "Victoria Falls, Zimbabwe",
    imageUrl: "/images/experience_lion.jpg",
    category: "wildlife",
  },
  {
    id: "sug-3",
    title: "Game drive",
    pricePerPerson: 90,
    location: "Victoria Falls, Zimbabwe",
    imageUrl: "/images/experience_male_lion.jpg",
    category: "safari",
  },
  {
    id: "sug-4",
    title: "Game drive",
    pricePerPerson: 90,
    location: "Victoria Falls, Zimbabwe",
    imageUrl: "/images/experience_lion.jpg",
    category: "wildlife",
  },
];

export function SearchScreen({
  onBack,
  initialQuery = "",
  onSelectTour,
}: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("safari");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePillClick = (catId: string) => {
    setSelectedCategory((prev) => (prev === catId ? "" : catId));
  };

  const filteredItems = SUGGESTED_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden pb-10 select-none">
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
        </div>
      </div>

      {/* iOS Home Indicator */}
      <div className="w-full shrink-0 pointer-events-none">
        <IosHomeIndicator theme="dark" />
      </div>
    </div>
  );
}
