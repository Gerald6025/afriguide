"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getBookingsFromDb } from "@/services/dbService";
import {
  ArrowLeft,
  SlidersHorizontal,
  Binoculars,
  MapPin,
  Clock,
  Calendar,
  Check,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";

export interface TouristBookingItem {
  id: string;
  title: string;
  status: "Confirmed" | "Pending" | "Completed";
  location: string;
  time: string;
  date: string;
  guideName: string;
  guideAvatar: string;
  price: number;
  imageUrl: string;
  tabCategory: "upcoming" | "past";
}

const DEFAULT_BOOKINGS: TouristBookingItem[] = [
  {
    id: "tb_1",
    title: "Sunset Safari Guide",
    status: "Confirmed",
    location: "Victoria Falls, Zimbabwe",
    time: "09:00am-17:00pm",
    date: "Oct 22, 2026",
    guideName: "Kristin Watson",
    guideAvatar: "/images/user_avatar.png",
    price: 182,
    imageUrl: "/images/safari_guide_elephants.jpg",
    tabCategory: "upcoming",
  },
  {
    id: "tb_2",
    title: "Hwange Elephant Walk",
    status: "Pending",
    location: "Victoria Falls, Zimbabwe",
    time: "09:00am-17:00pm",
    date: "Oct 22, 2026",
    guideName: "Kristin Watson",
    guideAvatar: "/images/user_avatar.png",
    price: 182,
    imageUrl: "/images/experience_elephant.jpg",
    tabCategory: "upcoming",
  },
  {
    id: "tb_3",
    title: "Sunset Safari Guide",
    status: "Pending",
    location: "Victoria Falls, Zimbabwe",
    time: "09:00am-17:00pm",
    date: "Oct 22, 2026",
    guideName: "Kristin Watson",
    guideAvatar: "/images/user_avatar.png",
    price: 182,
    imageUrl: "/images/experience_elephant.jpg",
    tabCategory: "upcoming",
  },
  {
    id: "tb_4",
    title: "Victoria Falls Helicopter Flight",
    status: "Completed",
    location: "Victoria Falls, Zimbabwe",
    time: "10:00am-11:30am",
    date: "Sep 14, 2026",
    guideName: "Desire Sibanda",
    guideAvatar: "/images/desire_avatar.jpg",
    price: 150,
    imageUrl: "/images/zambezi_river_sunset.jpg",
    tabCategory: "past",
  },
  {
    id: "tb_5",
    title: "Zambezi River Sunset Cruise",
    status: "Completed",
    location: "Livingstone, Zambia",
    time: "16:00pm-19:00pm",
    date: "Aug 02, 2026",
    guideName: "Kristin Watson",
    guideAvatar: "/images/user_avatar.png",
    price: 95,
    imageUrl: "/images/camel_desert_sunset.jpg",
    tabCategory: "past",
  },
  {
    id: "tb_6",
    title: "Chobe Day Trip Safari",
    status: "Completed",
    location: "Kasane, Botswana",
    time: "07:00am-18:00pm",
    date: "Jul 15, 2026",
    guideName: "Kristin Watson",
    guideAvatar: "/images/user_avatar.png",
    price: 170,
    imageUrl: "/images/experience_safari_jeep.jpg",
    tabCategory: "past",
  },
  {
    id: "tb_7",
    title: "Bungee Jump Victoria Falls Bridge",
    status: "Completed",
    location: "Victoria Falls, Zimbabwe",
    time: "11:00am-12:30pm",
    date: "Jun 20, 2026",
    guideName: "Desire Sibanda",
    guideAvatar: "/images/desire_avatar.jpg",
    price: 160,
    imageUrl: "/images/hero_giraffe.jpg",
    tabCategory: "past",
  },
];

interface TouristBookingsScreenProps {
  onBack: () => void;
  onMessageGuide?: (guideName: string) => void;
  onViewDetails?: (booking: TouristBookingItem) => void;
}

export function TouristBookingsScreen({
  onBack,
  onMessageGuide,
  onViewDetails,
}: TouristBookingsScreenProps) {
  const [bookings, setBookings] = useState<TouristBookingItem[]>(DEFAULT_BOOKINGS);
  const [activeFilter, setActiveFilter] = useState<"Upcoming" | "Confirmed" | "Past">("Upcoming");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "price">("date");

  useEffect(() => {
    async function loadBookings() {
      try {
        const dbBookings = await getBookingsFromDb();
        if (dbBookings && dbBookings.length > 0) {
          setBookings(
            dbBookings.map((b) => ({
              id: b.id,
              title: b.tour_title,
              status: (b.status === "Completed" ? "Completed" : b.status === "Confirmed" ? "Confirmed" : "Pending") as any,
              location: b.location,
              time: b.time_slot || "09:00am-17:00pm",
              date: b.date,
              guideName: b.guide_name,
              guideAvatar: b.guide_avatar || "/images/user_avatar.png",
              price: Number(b.total_price || b.price_per_person),
              imageUrl: b.tour_image_url || "/images/safari_guide_elephants.jpg",
              tabCategory: b.status === "Completed" ? "past" : "upcoming",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load bookings from Supabase:", err);
      }
    }
    loadBookings();
  }, []);

  const filteredBookings = bookings.filter((item) => {
    if (activeFilter === "Upcoming") {
      return item.tabCategory === "upcoming";
    }
    if (activeFilter === "Confirmed") {
      return item.status === "Confirmed" && item.tabCategory === "upcoming";
    }
    if (activeFilter === "Past") {
      return item.tabCategory === "past";
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "price") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="w-full h-full flex flex-col bg-white text-black relative select-none overflow-hidden">
      {/* iOS Status Bar */}
      <IosStatusBar theme="light" />

      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-stone-100">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to explore"
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-[20px] font-black text-black tracking-tight text-center absolute left-1/2 -translate-x-1/2">
          Bookings
        </h1>

        <div className="w-9 h-9" />
      </div>

      {/* Filter Options Row */}
      <div className="px-5 pt-3.5 pb-2 shrink-0 flex items-center gap-2 relative">
        {/* Sliders / Sort button */}
        <button
          type="button"
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          aria-label="Filter options"
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors cursor-pointer ${
            showFilterMenu
              ? "bg-black text-white border-black"
              : "border-stone-200 text-stone-700 hover:text-black hover:border-stone-300"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <button
            type="button"
            onClick={() => setActiveFilter("Upcoming")}
            className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === "Upcoming"
                ? "bg-[#F3F4F3] text-black border border-stone-200 shadow-2xs"
                : "bg-white text-stone-500 border border-stone-200 hover:border-stone-300 hover:text-black"
            }`}
          >
            Upcoming
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("Confirmed")}
            className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === "Confirmed"
                ? "bg-[#F3F4F3] text-black border border-stone-200 shadow-2xs"
                : "bg-white text-stone-500 border border-stone-200 hover:border-stone-300 hover:text-black"
            }`}
          >
            Confirmed
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("Past")}
            className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === "Past"
                ? "bg-[#F3F4F3] text-black border border-stone-200 shadow-2xs"
                : "bg-white text-stone-500 border border-stone-200 hover:border-stone-300 hover:text-black"
            }`}
          >
            Past(4)
          </button>
        </div>

        {/* Sort Popover Dropdown */}
        {showFilterMenu && (
          <div className="absolute top-14 left-5 z-30 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 min-w-[170px] animate-in fade-in zoom-in-95 duration-150">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1">
              Sort Bookings
            </p>
            <button
              type="button"
              onClick={() => {
                setSortBy("date");
                setShowFilterMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-stone-50 flex items-center justify-between cursor-pointer"
            >
              <span>By Date</span>
              {sortBy === "date" && <Check className="w-3.5 h-3.5 text-[#1E3F32]" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setSortBy("price");
                setShowFilterMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-stone-50 flex items-center justify-between cursor-pointer"
            >
              <span>Highest Price</span>
              {sortBy === "price" && <Check className="w-3.5 h-3.5 text-[#1E3F32]" />}
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-28 space-y-4 scrollbar-none">
        {/* Next confirmed adventure banner (Exact match to screenshot) */}
        {activeFilter !== "Past" && (
          <div className="w-full bg-[#F9F9F8] rounded-[20px] p-4 flex items-center gap-3.5 border border-stone-100 shadow-2xs">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <Binoculars className="w-6 h-6 stroke-[1.8] text-black" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-black text-black leading-snug">
                Next confirmed adventure
              </h2>
              <div className="flex items-center gap-1.5 text-[12.5px] mt-0.5">
                <span className="text-stone-700 font-semibold">Thursday 22 Oct</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" />
                <span className="text-[#E8622A] font-bold">8 days to go !</span>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Card List */}
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <p className="text-sm font-semibold">No bookings found in this category.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-[24px] p-4 border border-stone-100 shadow-[0_4px_18px_rgba(0,0,0,0.04)] flex flex-col gap-3"
            >
              {/* Top Row: Thumbnail + Info */}
              <div className="flex gap-3.5 items-start">
                {/* Tour Image */}
                <div className="w-[124px] h-[98px] rounded-[18px] overflow-hidden shrink-0 relative bg-stone-100">
                  <Image
                    src={booking.imageUrl}
                    alt={booking.title}
                    fill
                    sizes="130px"
                    className="object-cover"
                  />
                </div>

                {/* Details & Status Badge */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-[15.5px] font-black text-black leading-snug line-clamp-1">
                      {booking.title}
                    </h3>
                    <span
                      className={`text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                        booking.status === "Confirmed"
                          ? "bg-[#E6EEEA] text-[#1E3F32]"
                          : booking.status === "Pending"
                          ? "bg-[#FDEFE9] text-[#D0531E]"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Metadata Icons */}
                  <div className="space-y-0.5 text-[11.5px] text-stone-600 font-medium mt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 stroke-[2] text-stone-700 shrink-0" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 stroke-[2] text-stone-700 shrink-0" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 stroke-[2] text-stone-700 shrink-0" />
                      <span>{booking.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide & Price Row */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 relative bg-stone-200">
                    <Image
                      src={booking.guideAvatar}
                      alt={booking.guideName}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[12.5px] text-stone-500 font-medium">
                    Guide:{" "}
                    <strong className="text-black font-bold">{booking.guideName}</strong>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[18px] font-black text-black tracking-tight">
                    $ {booking.price}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row (Exact match to screenshot) */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onMessageGuide?.(booking.guideName)}
                  className="flex-1 py-2.5 text-center text-[14.5px] font-bold text-stone-800 hover:text-black cursor-pointer transition-colors"
                >
                  Message
                </button>

                <button
                  type="button"
                  onClick={() => onViewDetails?.(booking)}
                  className="flex-1 py-2.5 text-center text-[14.5px] font-bold bg-[#1E3F32] text-white rounded-full hover:bg-[#163026] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  View details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
