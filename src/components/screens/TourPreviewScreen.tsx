"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Camera,
  Star,
  DollarSign,
  Users,
  Car,
  Ticket,
  UserCheck,
  Utensils,
  MapPin,
} from "lucide-react";
import { IosHomeIndicator } from "../IosStatusBar";

export interface TourPreviewData {
  id?: string;
  title: string;
  location: string;
  rating: number;
  pricePerPerson: number;
  groupSize?: string;
  imageUrl: string;
  guideName?: string;
  about?: string;
  gallery?: string[];
}

interface TourPreviewScreenProps {
  tour?: TourPreviewData;
  onBack: () => void;
  onBook?: (tour: TourPreviewData) => void;
}

const DEFAULT_TOUR: TourPreviewData = {
  id: "tour-default",
  title: "Victoria Falls Safari tour",
  location: "Victoria Falls, Zimbabwe",
  rating: 5.9,
  pricePerPerson: 80,
  groupSize: "2-10 people",
  imageUrl: "/images/hero_giraffe.jpg",
  guideName: "Brian C",
  about:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est",
  gallery: [
    "/images/hero_giraffe.jpg",
    "/images/experience_lion.jpg",
    "/images/experience_male_lion.jpg",
    "/images/experience_elephant.jpg",
    "/images/experience_safari_jeep.jpg",
    "/images/experience_walking_guide.jpg",
  ],
};

const INCLUSIONS = [
  { id: "transport", label: "Transportation", icon: Car },
  { id: "park", label: "Park fees", icon: Ticket },
  { id: "guide", label: "Professional guide", icon: UserCheck },
  { id: "food", label: "Food & Water", icon: Utensils },
];

export function TourPreviewScreen({
  tour = DEFAULT_TOUR,
  onBack,
  onBook,
}: TourPreviewScreenProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  const images = tour.gallery && tour.gallery.length > 0
    ? tour.gallery
    : [tour.imageUrl, "/images/experience_lion.jpg", "/images/experience_elephant.jpg"];

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-x-hidden pb-28 select-none">
      {/* ── Top Header with Back Arrow and Centered Title (No Status Bar) ── */}
      <div className="w-full bg-white px-5 pt-4 pb-2.5 shrink-0 z-20">
        <div className="relative flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-black hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          <h1 className="text-[20px] font-bold text-black tracking-tight">
            Tour preview
          </h1>

          <div className="w-8" />
        </div>
      </div>

      {/* ── Scrollable Body Content ── */}
      <div className="flex-1 w-full px-5 flex flex-col gap-5 pt-1">
        {/* 1. Hero Image with Carousel Indicators & Count Badge */}
        <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-stone-100 shadow-sm">
          <Image
            src={images[activePhotoIdx] || tour.imageUrl}
            alt={tour.title}
            fill
            sizes="(max-width: 430px) 100vw, 420px"
            className="object-cover transition-opacity duration-300"
            priority
          />

          {/* Heart Button */}
          <button
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            aria-label="Save tour"
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/25 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/40 transition-all cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 stroke-[2] ${
                isFavorite
                  ? "fill-[#E8622A] text-[#E8622A] stroke-[#E8622A]"
                  : "fill-none text-white stroke-white"
              }`}
            />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {images.slice(0, 3).map((_, i) => (
              <span
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`transition-all duration-200 cursor-pointer rounded-full ${
                  activePhotoIdx === i
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>

          {/* Photo Count Badge (e.g. 2/10) */}
          <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-[12px] bg-black/40 backdrop-blur-xs flex items-center gap-1.5 text-white text-[12px] font-semibold">
            <Camera className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>
              {activePhotoIdx + 1}/{images.length > 3 ? 10 : images.length}
            </span>
          </div>
        </div>

        {/* 2. Tour Title, Location, and Rating Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-[21px] font-black text-black tracking-tight leading-tight">
              {tour.title}
            </h2>
            <div className="flex items-center gap-1 text-stone-600 text-[13px]">
              <MapPin className="w-4 h-4 text-stone-500 stroke-[2] shrink-0" />
              <span>{tour.location}</span>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="px-3 py-1.5 rounded-[16px] bg-[#F2F3F5] flex items-center gap-1.5 shrink-0 shadow-2xs">
            <Star className="w-4 h-4 stroke-[2] stroke-black fill-none text-black" />
            <span className="text-[14.5px] font-black text-black">
              {tour.rating}
            </span>
          </div>
        </div>

        {/* 3. Key Stats Cards (Price + Group Size) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="h-[62px] px-4 rounded-[18px] bg-[#F7F8F9] flex items-center gap-3 border border-stone-100/80 shadow-2xs">
            <DollarSign className="w-5 h-5 text-black stroke-[2.4]" />
            <span className="text-[16px] font-bold text-black tracking-tight">
              {tour.pricePerPerson}/person
            </span>
          </div>

          <div className="h-[62px] px-4 rounded-[18px] bg-[#F7F8F9] flex items-center gap-3 border border-stone-100/80 shadow-2xs">
            <Users className="w-5 h-5 text-black stroke-[2.2]" />
            <span className="text-[16px] font-bold text-black tracking-tight">
              {tour.groupSize || "2-10 people"}
            </span>
          </div>
        </div>

        {/* 4. About This Tour Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[18px] font-bold text-black tracking-tight">
            About this tour
          </h3>
          <div className="p-4 rounded-[20px] bg-[#F7F8F9] border border-stone-100/80">
            <p className="text-[13.5px] text-stone-800 leading-[1.6]">
              &ldquo;
              {isExpanded
                ? tour.about || DEFAULT_TOUR.about
                : `${(tour.about || DEFAULT_TOUR.about || "").slice(0, 310)}...`}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="font-bold text-black ml-1 hover:underline cursor-pointer"
              >
                {isExpanded ? "show less" : "see more."}
              </button>
              &rdquo;
            </p>
          </div>
        </div>

        {/* 5. What Is Included Section */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[18px] font-bold text-black tracking-tight">
            What is included
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {INCLUSIONS.map((inc) => {
              const IconComp = inc.icon;
              return (
                <div
                  key={inc.id}
                  className="h-[42px] px-3.5 rounded-[14px] bg-[#F4F6F8] flex items-center gap-2 text-[13.5px] font-semibold text-black border border-stone-100/60 shadow-2xs"
                >
                  <IconComp className="w-4 h-4 text-black stroke-[2]" />
                  <span>{inc.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Gallery Section */}
        <div className="flex flex-col gap-2.5 pt-1">
          <h3 className="text-[18px] font-bold text-black tracking-tight">
            Gallery
          </h3>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative w-[90px] h-[72px] rounded-[16px] overflow-hidden shrink-0 cursor-pointer transition-all ${
                  activePhotoIdx === idx
                    ? "ring-2 ring-[#1E3F32] scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Tour gallery ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom Booking Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-100 flex justify-center">
        <div className="w-full max-w-[430px] px-5 py-3.5 flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            {/* Price Per Person */}
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-black stroke-[2.4]" />
              <span className="text-[20px] font-black text-black tracking-tight">
                {tour.pricePerPerson}/person
              </span>
            </div>

            {/* Book This Tour CTA Button */}
            <button
              type="button"
              onClick={() => {
                if (onBook) onBook(tour);
                else alert(`Booking initiated for "${tour.title}" at $${tour.pricePerPerson}/person!`);
              }}
              className="flex-1 h-[54px] rounded-[28px] bg-[#1E3F32] hover:bg-[#163026] active:scale-[0.98] text-white font-bold text-[16px] tracking-tight transition-all shadow-md flex items-center justify-center cursor-pointer"
            >
              Book this tour
            </button>
          </div>

          {/* iOS Home Indicator */}
          <div className="w-full pointer-events-none -mb-1">
            <IosHomeIndicator theme="dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
