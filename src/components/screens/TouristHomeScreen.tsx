"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bell,
  Search,
  Mic,
  Star,
  Heart,
  MapPin,
  Compass,
  Calendar,
  MessageCircle,
  User as UserIcon,
  Binoculars,
  Landmark,
  Mountain,
  TreePine,
} from "lucide-react";
import { IosHomeIndicator } from "../IosStatusBar";
import { SearchScreen } from "./SearchScreen";
import { TourPreviewScreen, TourPreviewData } from "./TourPreviewScreen";
import { BookingRequestedScreen, PaymentInfo } from "./BookingRequestedScreen";
import { BookExperienceScreen, BookingDetails } from "./BookExperienceScreen";
import { PaymentScreen } from "./PaymentScreen";
import { BookingDetailsScreen } from "./BookingDetailsScreen";
import { ProfileScreen } from "./ProfileScreen";

interface Experience {
  id: string;
  guideName: string;
  rating: number;
  title: string;
  pricePerPerson: number;
  location: string;
  imageUrl: string;
  badge?: string;
  category: string;
}

const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    guideName: "Brian C",
    rating: 4.5,
    title: "Game drive",
    pricePerPerson: 90,
    location: "Victoria Falls, Zimbabwe",
    imageUrl: "/images/experience_lion.jpg",
    badge: "Best Seller",
    category: "safari",
  },
  {
    id: "exp-2",
    guideName: "Michelle D",
    rating: 4.8,
    title: "Morning Nature Walk",
    pricePerPerson: 90,
    location: "Victoria Falls, Zimbabwe",
    imageUrl: "/images/experience_elephant.jpg",
    badge: "Best Seller",
    category: "nature",
  },
  {
    id: "exp-3",
    guideName: "Tendai M",
    rating: 4.95,
    title: "Big 5 Plains Safari",
    pricePerPerson: 110,
    location: "Hwange National Park",
    imageUrl: "/images/experience_safari_jeep.jpg",
    badge: "Popular",
    category: "safari",
  },
  {
    id: "exp-4",
    guideName: "Farai C",
    rating: 5.0,
    title: "Walking Safari with Zebras",
    pricePerPerson: 65,
    location: "Zambezi Valley, Zimbabwe",
    imageUrl: "/images/experience_walking_guide.jpg",
    badge: "Heritage",
    category: "culture",
  },
];

const TOP_GUIDES = [
  {
    id: "g-1",
    name: "Brian C",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 4.5,
  },
  {
    id: "g-2",
    name: "Michelle D",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    rating: 4.8,
  },
  {
    id: "g-3",
    name: "Tendai Moyo",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    rating: 4.95,
  },
  {
    id: "g-4",
    name: "Farai Chitepo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5.0,
  },
  {
    id: "g-5",
    name: "Blessing N",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
  },
];

interface TouristHomeScreenProps {
  userEmail?: string;
  userName?: string;
  avatarUrl?: string;
  createdAt?: string;
  role?: "tourist" | "guide";
  onLogout?: () => void;
  onUpdateName?: (newName: string) => void;
  onUpdateAvatar?: (newAvatar: string) => void;
}

export function TouristHomeScreen({
  userEmail = "geraldgchibanda6025@gmail.com",
  userName: propUserName,
  avatarUrl: propAvatarUrl,
  createdAt: propCreatedAt,
  role = "tourist",
  onLogout,
  onUpdateName,
  onUpdateAvatar,
}: TouristHomeScreenProps) {
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>(() => {
    if (propAvatarUrl && propAvatarUrl.trim()) return propAvatarUrl;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("afriguide_user_avatar");
      if (stored) return stored;
    }
    return "/images/user_avatar.png";
  });

  const [currentUserName, setCurrentUserName] = useState<string>(() => {
    if (propUserName && propUserName.trim()) return propUserName;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("afriguide_user_name");
      if (stored) return stored;
    }
    return "Gerald Chibanda";
  });
  const [activeTab, setActiveTab] = useState<"explore" | "search" | "calendar" | "messages" | "profile">("explore");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedTour, setSelectedTour] = useState<TourPreviewData | null>(null);
  const [bookingExperienceTour, setBookingExperienceTour] = useState<TourPreviewData | null>(null);
  const [paymentBookingDetails, setPaymentBookingDetails] = useState<BookingDetails | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [bookingTour, setBookingTour] = useState<TourPreviewData | null>(null);
  const [viewingBookingDetails, setViewingBookingDetails] = useState<boolean>(false);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredExperiences = EXPERIENCES.filter((exp) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "safari" && exp.category === "safari") ||
      (selectedCategory === "culture" && exp.category === "culture") ||
      (selectedCategory === "nature" && exp.category === "nature");

    const matchesSearch =
      !searchQuery.trim() ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.guideName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (viewingBookingDetails) {
    return (
      <BookingDetailsScreen
        tour={bookingTour || selectedTour || undefined}
        bookingDetails={paymentBookingDetails || undefined}
        paymentInfo={paymentInfo || undefined}
        onBack={() => {
          setViewingBookingDetails(false);
          setBookingTour(null);
          setPaymentBookingDetails(null);
          setPaymentInfo(null);
          setBookingExperienceTour(null);
          setSelectedTour(null);
          setActiveTab("explore");
        }}
        onMessageGuide={() => {
          setViewingBookingDetails(false);
          setBookingTour(null);
          setPaymentBookingDetails(null);
          setPaymentInfo(null);
          setActiveTab("messages");
        }}
      />
    );
  }

  if (bookingTour) {
    return (
      <BookingRequestedScreen
        tour={bookingTour}
        bookingDetails={paymentBookingDetails || undefined}
        paymentInfo={paymentInfo || undefined}
        onClose={() => {
          setBookingTour(null);
          setPaymentBookingDetails(null);
          setPaymentInfo(null);
          setBookingExperienceTour(null);
        }}
        onBackToExplore={() => {
          setBookingTour(null);
          setPaymentBookingDetails(null);
          setPaymentInfo(null);
          setBookingExperienceTour(null);
          setSelectedTour(null);
          setActiveTab("explore");
        }}
        onViewBookings={() => {
          setViewingBookingDetails(true);
        }}
      />
    );
  }

  if (paymentBookingDetails && !bookingTour) {
    return (
      <PaymentScreen
        bookingDetails={paymentBookingDetails}
        onBack={() => setPaymentBookingDetails(null)}
        onPayNow={(info) => {
          setPaymentInfo(info);
          setBookingTour(paymentBookingDetails.tour);
          setBookingExperienceTour(null);
        }}
      />
    );
  }

  if (bookingExperienceTour) {
    return (
      <BookExperienceScreen
        tour={bookingExperienceTour}
        onBack={() => setBookingExperienceTour(null)}
        onConfirmBooking={(details) => {
          setPaymentBookingDetails(details);
        }}
      />
    );
  }

  if (selectedTour) {
    return (
      <TourPreviewScreen
        tour={selectedTour}
        onBack={() => setSelectedTour(null)}
        onBook={(tour) => setBookingExperienceTour(tour)}
      />
    );
  }

  if (activeTab === "search") {
    return (
      <SearchScreen
        onBack={() => setActiveTab("explore")}
        initialQuery={searchQuery}
        onSelectTour={(item) =>
          setSelectedTour({
            id: item.id,
            title: item.title === "Game drive" ? "Victoria Falls Safari tour" : item.title,
            location: item.location,
            rating: 5.9,
            pricePerPerson: item.pricePerPerson,
            imageUrl: item.imageUrl,
            groupSize: "2-10 people",
          })
        }
      />
    );
  }

  if (activeTab === "profile") {
    return (
      <ProfileScreen
        userName={currentUserName}
        userEmail={userEmail}
        avatarUrl={currentUserAvatar}
        createdAt={propCreatedAt}
        role={role}
        onUpdateName={(newName) => {
          setCurrentUserName(newName);
          onUpdateName?.(newName);
        }}
        onUpdateAvatar={(newAvatar) => {
          setCurrentUserAvatar(newAvatar);
          onUpdateAvatar?.(newAvatar);
        }}
        onBack={() => setActiveTab("explore")}
        onLogout={onLogout}
        onBecomeGuide={() => alert("Apply to become an AfriGuide certified guide!")}
      />
    );
  }

  return (
    <div className="relative w-full h-full min-h-full bg-[#FAFAFA] flex flex-col justify-between overflow-x-hidden overflow-y-auto pb-24 select-none">
      {/* ── Top Header with User Profile & Notification ── */}
      <div className="w-full bg-white px-5 pt-4 pb-2.5 shrink-0">
        <div className="flex items-center justify-between">
          {/* Logo or Title */}
          <div>
            <span className="text-[20px] font-black tracking-tight text-[#1E3F32]">
              Afri<span className="text-[#E8622A]">Guide</span>
            </span>
          </div>

          {/* Right: Notification Bell & User Avatar */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Bell className="w-6 h-6 stroke-[2]" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#E8622A] rounded-full ring-2 ring-white" />
            </button>

            {/* Profile Avatar */}
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-stone-200/80 hover:ring-[#1E3F32] transition-all cursor-pointer block shrink-0"
              title={`Signed in as ${userEmail}`}
            >
              <img
                src={currentUserAvatar}
                alt={currentUserName || "User Avatar"}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable Body Content ── */}
      <div className="flex-1 w-full flex flex-col px-5 pt-3 gap-5">
        {/* 1. Search Bar */}
        <div
          onClick={() => setActiveTab("search")}
          className="relative w-full h-[52px] cursor-pointer"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none">
            <Search className="w-5 h-5 stroke-[2.2]" />
          </div>

          <input
            type="text"
            readOnly
            value={searchQuery}
            placeholder="Search guides, experiences, places....."
            className="w-full h-full pl-12 pr-12 rounded-[26px] bg-[#F2F3F5] text-[14.5px] font-medium text-black placeholder:text-stone-400 focus:outline-none transition-all shadow-2xs cursor-pointer"
          />

          <button
            type="button"
            aria-label="Voice search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-black cursor-pointer transition-colors"
          >
            <Mic className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 py-0.5">
          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === "safari" ? "all" : "safari")}
            className={`h-11 px-4 rounded-[22px] flex items-center gap-2 shrink-0 text-[14px] font-semibold transition-all cursor-pointer shadow-2xs ${
              selectedCategory === "safari"
                ? "bg-[#1E3F32] text-white"
                : "bg-[#F0F2F4] text-stone-800 hover:bg-stone-200"
            }`}
          >
            <Binoculars className="w-4 h-4 stroke-[2]" />
            <span>Wildlife Safari</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === "culture" ? "all" : "culture")}
            className={`h-11 px-4 rounded-[22px] flex items-center gap-2 shrink-0 text-[14px] font-semibold transition-all cursor-pointer shadow-2xs ${
              selectedCategory === "culture"
                ? "bg-[#1E3F32] text-white"
                : "bg-[#F0F2F4] text-stone-800 hover:bg-stone-200"
            }`}
          >
            <Landmark className="w-4 h-4 stroke-[2]" />
            <span>Culture and Heritage</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory(selectedCategory === "nature" ? "all" : "nature")}
            className={`h-11 px-4 rounded-[22px] flex items-center gap-2 shrink-0 text-[14px] font-semibold transition-all cursor-pointer shadow-2xs ${
              selectedCategory === "nature"
                ? "bg-[#1E3F32] text-white"
                : "bg-[#F0F2F4] text-stone-800 hover:bg-stone-200"
            }`}
          >
            <TreePine className="w-4 h-4 stroke-[2]" />
            <span>Nature & Walks</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`h-11 px-4 rounded-[22px] flex items-center gap-2 shrink-0 text-[14px] font-semibold transition-all cursor-pointer shadow-2xs ${
              selectedCategory === "all"
                ? "bg-[#1E3F32] text-white"
                : "bg-[#F0F2F4] text-stone-800 hover:bg-stone-200"
            }`}
          >
            <Mountain className="w-4 h-4 stroke-[2]" />
            <span>Adventure</span>
          </button>
        </div>

        {/* 3. Hero Promo Banner Card */}
        <div
          onClick={() =>
            setSelectedTour({
              id: "hero-tour",
              title: "Victoria Falls Safari tour",
              location: "Victoria Falls, Zimbabwe",
              rating: 5.9,
              pricePerPerson: 80,
              groupSize: "2-10 people",
              imageUrl: "/images/hero_giraffe.jpg",
              guideName: "Brian C",
            })
          }
          className="relative w-full h-[180px] sm:h-[195px] rounded-[24px] overflow-hidden bg-gradient-to-r from-[#D7E8DE] via-[#EAF2ED] to-[#EAF2ED] shadow-xs flex items-center justify-between border border-stone-200/40 cursor-pointer active:scale-[0.99] transition-transform"
        >
          {/* Left Text */}
          <div className="w-[56%] pl-5 sm:pl-6 py-4 z-10">
            <span className="text-[12.5px] font-semibold text-stone-600 block mb-1">
              100+ Authentic Experiences
            </span>
            <h2 className="text-[20px] sm:text-[22px] font-black text-black leading-[1.12] tracking-tight">
              Explore Zimbabwe Through Verified Local Guides
            </h2>
          </div>

          {/* Right Image with Exact Mockup Giraffe Photo and Organic Wavy Edge */}
          <div className="absolute right-0 top-0 bottom-0 w-[49%] overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src="/images/hero_giraffe.jpg"
                alt="Giraffe feeding at sanctuary tree"
                fill
                sizes="(max-width: 430px) 50vw, 250px"
                className="object-cover object-[center_28%]"
                priority
              />

              {/* Organic S-curve wave boundary blending with the left background */}
              <svg
                viewBox="0 0 50 200"
                preserveAspectRatio="none"
                className="absolute left-0 top-0 bottom-0 h-full w-10 text-[#EAF2ED] fill-current pointer-events-none -translate-x-[1px]"
              >
                <path d="M0,0 L18,0 C38,45 8,75 32,120 C50,155 16,180 28,200 L0,200 Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Featured Experiences Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-black text-black tracking-tight">
              Featured experiences
            </h3>
            <button
              type="button"
              className="text-[13px] font-semibold text-[#1E3F32] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          {/* Horizontal Experiences Carousel */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {filteredExperiences.map((exp) => (
              <div
                key={exp.id}
                onClick={() =>
                  setSelectedTour({
                    id: exp.id,
                    title: exp.title === "Game drive" ? "Victoria Falls Safari tour" : exp.title,
                    location: exp.location,
                    rating: exp.rating || 5.9,
                    pricePerPerson: exp.pricePerPerson,
                    imageUrl: exp.imageUrl,
                    guideName: exp.guideName,
                    groupSize: "2-10 people",
                  })
                }
                className="w-[245px] shrink-0 flex flex-col group cursor-pointer active:scale-[0.99] transition-transform"
              >
                {/* Image Container with Badges */}
                <div className="relative w-full h-[160px] rounded-[22px] overflow-hidden bg-stone-100 shadow-2xs">
                  <Image
                    src={exp.imageUrl}
                    alt={exp.title}
                    fill
                    sizes="250px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Best Seller Badge */}
                  {exp.badge && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-[8px] bg-[#233F31]/80 backdrop-blur-xs text-[#E1EFE6] text-[11px] font-semibold border border-white/20 tracking-tight">
                      {exp.badge}
                    </span>
                  )}

                  {/* Heart Button (Clean outline with no circular dark backdrop) */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(exp.id, e)}
                    aria-label="Add to favorites"
                    className="absolute top-2.5 right-2.5 p-1 text-white hover:scale-110 transition-transform cursor-pointer drop-shadow-sm"
                  >
                    <Heart
                      className={`w-5 h-5 stroke-[2] transition-colors ${
                        favorites[exp.id]
                          ? "fill-[#E8622A] text-[#E8622A] stroke-[#E8622A]"
                          : "fill-none text-white stroke-white"
                      }`}
                    />
                  </button>
                </div>

                {/* Info Content */}
                <div className="pt-2.5 pb-1 px-0.5 flex flex-col gap-0.5">
                  {/* Guide Name & Transparent Background Star Rating */}
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-bold text-black tracking-tight">
                      {exp.guideName}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Transparent background star with clean black outline */}
                      <Star className="w-4 h-4 stroke-[1.8] stroke-black fill-none text-black" />
                      <span className="text-[13.5px] font-bold text-black">{exp.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <span className="text-[13.5px] font-normal text-stone-800 leading-snug">
                    {exp.title}
                  </span>

                  {/* Price */}
                  <span className="text-[14px] font-bold text-black">
                    ${exp.pricePerPerson}/person
                  </span>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-black text-[12px] mt-0.5 font-normal">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-black stroke-[2]" />
                    <span className="truncate">{exp.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Top Guides Section */}
        <div className="flex flex-col gap-3 pb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-black text-black tracking-tight">
              Top Guides
            </h3>
            <button
              type="button"
              className="text-[13px] font-semibold text-[#1E3F32] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
            {TOP_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-stone-200 group-hover:ring-[#1E3F32] transition-all p-0.5 bg-white shadow-2xs">
                  <img
                    src={guide.avatar}
                    alt={guide.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="text-[12px] font-bold text-black max-w-[68px] text-center truncate">
                  {guide.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. Floating Bottom Navigation Bar (Matching exact design pill) ── */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-[390px] bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-2xl rounded-full py-2 px-3 flex items-center justify-between z-40">
        {/* Tab 1: Explore (Active pill) */}
        <button
          type="button"
          onClick={() => setActiveTab("explore")}
          className={`rounded-full py-2 px-4 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === "explore"
              ? "bg-[#E6EEEA] text-[#1E3F32]"
              : "text-stone-500 hover:text-black"
          }`}
        >
          <Compass className="w-5 h-5 stroke-[2.4]" />
          {activeTab === "explore" && (
            <span className="text-[13.5px] font-bold tracking-tight">Explore</span>
          )}
        </button>

        {/* Tab 2: Search */}
        <button
          type="button"
          onClick={() => setActiveTab("search")}
          aria-label="Search"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer text-stone-500 hover:text-black"
        >
          <Search className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Tab 3: Calendar */}
        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          aria-label="Bookings"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === "calendar" ? "text-[#1E3F32]" : "text-stone-500 hover:text-black"
          }`}
        >
          <Calendar className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Tab 4: Messages */}
        <button
          type="button"
          onClick={() => setActiveTab("messages")}
          aria-label="Messages"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === "messages" ? "text-[#1E3F32]" : "text-stone-500 hover:text-black"
          }`}
        >
          <MessageCircle className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Tab 5: Profile */}
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          aria-label="Profile"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer text-stone-500 hover:text-black"
        >
          <UserIcon className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* iOS Home Indicator */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50">
        <IosHomeIndicator theme="dark" />
      </div>
    </div>
  );
}
