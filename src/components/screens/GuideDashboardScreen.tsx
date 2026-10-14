"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Bell,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Star,
  MessageSquare,
  Users,
  ArrowRight,
  PlusCircle,
  LayoutGrid,
  Map,
  MessageCircle,
  User,
  X,
  Check,
  Clock,
  ChevronRight,
  LogOut,
  MapPin,
  DollarSign,
} from "lucide-react";
import { IosHomeIndicator } from "../IosStatusBar";
import { GuideBookingsScreen } from "./GuideBookingsScreen";
import { GuideToursScreen } from "./GuideToursScreen";
import { GuideMessagesScreen } from "./GuideMessagesScreen";
import { GuideProfileScreen } from "./GuideProfileScreen";
import { AddNewTourScreen } from "./AddNewTourScreen";
import {
  getBookingsFromDb,
  updateBookingStatusInDb,
  DbBooking,
} from "@/services/dbService";

interface GuideDashboardScreenProps {
  guideName?: string;
  guideEmail?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  onNavigateTourist?: () => void;
  onUpdateAvatar?: (avatar: string) => void;
}

interface PendingRequest {
  id: string;
  travelerName: string;
  tourName: string;
  date: string;
  travelers: number;
  price: number;
  avatar: string;
}

const FALLBACK_PENDING_REQUESTS: PendingRequest[] = [
  {
    id: "req_1",
    travelerName: "Jessica & Marcus (USA)",
    tourName: "Sunset Safari & Wildlife Tracking",
    date: "April 24, 2026 • 08:30 AM",
    travelers: 2,
    price: 240,
    avatar: "/images/user_avatar.png",
  },
  {
    id: "req_2",
    travelerName: "Klaus Schmidt (Germany)",
    tourName: "Victoria Falls Gorge Explorer",
    date: "April 26, 2026 • 09:00 AM",
    travelers: 4,
    price: 480,
    avatar: "/images/user_avatar.png",
  },
  {
    id: "req_3",
    travelerName: "Tinashe & Friends (SA)",
    tourName: "Zambezi River Sunset Cruise Guide",
    date: "May 02, 2026 • 03:30 PM",
    travelers: 3,
    price: 360,
    avatar: "/images/user_avatar.png",
  },
];

export function GuideDashboardScreen({
  guideName = "Desire",
  guideEmail = "desire.safari@afriguide.com",
  avatarUrl = "/images/desire_avatar.jpg",
  onLogout,
  onNavigateTourist,
  onUpdateAvatar,
}: GuideDashboardScreenProps) {
  const [currentAvatar, setCurrentAvatar] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const emailSpecific = guideEmail
        ? localStorage.getItem(`afriguide_user_avatar_${guideEmail.trim().toLowerCase()}`)
        : null;
      if (emailSpecific && emailSpecific.trim()) return emailSpecific;
      const stored = localStorage.getItem("afriguide_user_avatar");
      if (stored && stored.trim()) return stored;
    }
    return avatarUrl;
  });

  React.useEffect(() => {
    if (avatarUrl) {
      setCurrentAvatar(avatarUrl);
    }
  }, [avatarUrl]);

  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar" | "tours" | "messages" | "profile">("dashboard");
  const [showReviewRequests, setShowReviewRequests] = useState<boolean>(false);
  const [showAddNewTour, setShowAddNewTour] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [allBookings, setAllBookings] = useState<DbBooking[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(FALLBACK_PENDING_REQUESTS);

  const loadDashboardData = useCallback(async () => {
    try {
      const dbBookings = await getBookingsFromDb();
      if (dbBookings && dbBookings.length > 0) {
        setAllBookings(dbBookings);
        const livePending = dbBookings
          .filter((b) => b.status === "Pending")
          .map((b) => ({
            id: b.id,
            travelerName: b.tourist_name || "Traveler",
            tourName: b.tour_title,
            date: b.date + (b.time_slot ? ` • ${b.time_slot}` : ""),
            travelers: b.party_size || 1,
            price: Number(b.total_price || b.price_per_person * (b.party_size || 1) || 120),
            avatar: "/images/user_avatar.png",
          }));

        if (livePending.length > 0) {
          setPendingRequests(livePending);
        }
      }
    } catch (err) {
      console.warn("Failed to load dashboard bookings:", err);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle request decision
  const handleAcceptRequest = async (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    if (!id.startsWith("req_")) {
      await updateBookingStatusInDb(id, "Confirmed");
      await loadDashboardData();
    }
    alert("Booking accepted! The traveler has been notified.");
  };

  const handleDeclineRequest = async (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    if (!id.startsWith("req_")) {
      await updateBookingStatusInDb(id, "Cancelled");
      await loadDashboardData();
    }
  };

  // Render Full 4-Step Add New Tour Wizard when triggered
  if (showAddNewTour) {
    return (
      <AddNewTourScreen
        guideName={guideName}
        guideAvatar={avatarUrl}
        onBack={() => setShowAddNewTour(false)}
        onPublish={() => {
          setShowAddNewTour(false);
          setActiveTab("tours");
          loadDashboardData();
        }}
      />
    );
  }

  // Render Bookings Screen when calendar tab is active
  if (activeTab === "calendar") {
    return (
      <div className="w-full h-full flex flex-col bg-[#F9FAF9] text-black relative select-none overflow-hidden">
        <GuideBookingsScreen onBack={() => setActiveTab("dashboard")} />

        {/* Floating Bottom Navigation Bar */}
        <div className="absolute bottom-5 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-[32px] py-2 px-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-stone-200/70 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[12px] transition-all cursor-pointer bg-[#E5ECE9] text-[#1E3F32] hover:bg-[#d8e2de]"
          >
            <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            aria-label="Calendar bookings"
            className="p-2 text-[#1E3F32] transition-colors cursor-pointer"
          >
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tours")}
            aria-label="Tours"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <Map className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            aria-label="Messages"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            aria-label="Profile"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        <IosHomeIndicator theme="dark" />
      </div>
    );
  }

  // Render Tours Screen when map/tours tab is active
  if (activeTab === "tours") {
    return (
      <div className="w-full h-full flex flex-col bg-[#F9FAF9] text-black relative select-none overflow-hidden">
        <GuideToursScreen
          onBack={() => setActiveTab("dashboard")}
          avatarUrl={avatarUrl}
          guideName={guideName}
          onAddNewTour={() => setShowAddNewTour(true)}
        />

        {/* Floating Bottom Navigation Bar */}
        <div className="absolute bottom-5 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-[32px] py-2 px-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-stone-200/70 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[12px] transition-all cursor-pointer bg-[#E5ECE9] text-[#1E3F32] hover:bg-[#d8e2de]"
          >
            <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            aria-label="Calendar bookings"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <Calendar className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tours")}
            aria-label="Tours"
            className="p-2 text-[#1E3F32] transition-colors cursor-pointer"
          >
            <Map className="w-5 h-5 stroke-[2.2]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            aria-label="Messages"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            aria-label="Profile"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        <IosHomeIndicator theme="dark" />
      </div>
    );
  }

  // Render Messages Screen when chat/messages tab is active
  if (activeTab === "messages") {
    return (
      <div className="w-full h-full flex flex-col bg-[#F9FAF9] text-black relative select-none overflow-hidden">
        <GuideMessagesScreen
          onBack={() => setActiveTab("dashboard")}
          avatarUrl={avatarUrl}
          guideName={guideName}
        />

        {/* Floating Bottom Navigation Bar */}
        <div className="absolute bottom-5 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-[32px] py-2 px-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-stone-200/70 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[12px] transition-all cursor-pointer bg-[#E5ECE9] text-[#1E3F32] hover:bg-[#d8e2de]"
          >
            <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            aria-label="Calendar bookings"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <Calendar className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tours")}
            aria-label="Tours"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <Map className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            aria-label="Messages"
            className="p-2 text-[#1E3F32] transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 stroke-[2.2]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            aria-label="Profile"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        <IosHomeIndicator theme="dark" />
      </div>
    );
  }

  // Render Profile Screen when profile tab is active
  if (activeTab === "profile") {
    return (
      <div className="w-full h-full flex flex-col bg-[#F9FAF9] text-black relative select-none overflow-hidden">
        <GuideProfileScreen
          onBack={() => setActiveTab("dashboard")}
          guideName={guideName}
          guideEmail={guideEmail}
          avatarUrl={currentAvatar}
          onLogout={onLogout}
          onSwitchToTourist={onNavigateTourist}
          onUpdateAvatar={(newUrl) => {
            setCurrentAvatar(newUrl);
            onUpdateAvatar?.(newUrl);
          }}
        />

        {/* Floating Bottom Navigation Bar */}
        <div className="absolute bottom-5 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-[32px] py-2 px-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-stone-200/70 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[12px] transition-all cursor-pointer bg-[#E5ECE9] text-[#1E3F32] hover:bg-[#d8e2de]"
          >
            <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            aria-label="Calendar bookings"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <Calendar className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tours")}
            aria-label="Tours"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <Map className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            aria-label="Messages"
            className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            aria-label="Profile"
            className="p-2 text-[#1E3F32] transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        <IosHomeIndicator theme="dark" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F9FAF9] text-black relative select-none overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-28 scrollbar-none">
        {/* Top Bar matching mockup */}
        <div className="flex items-center justify-between pt-1 pb-3">
          {/* Top Left: AfriGuide Logo */}
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/afriguide-logo.png"
              alt="AfriGuide Logo"
              className="w-9 h-9 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/Logo%20(1).png?updatedAt=1779444032373";
              }}
            />
          </div>

          {/* Top Right: Pill capsule with Notification Bell + Guide Avatar */}
          <div className="flex items-center bg-[#F1F3F2] rounded-full pl-3.5 pr-1.5 py-1 gap-3 border border-stone-200/60 shadow-xs">
            <button
              type="button"
              onClick={() => alert("No new notifications")}
              className="text-stone-700 hover:text-black transition-colors relative cursor-pointer"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#EA5A24] rounded-full" />
            </button>
            <div
              onClick={() => setActiveTab("profile")}
              className="w-8 h-8 rounded-full overflow-hidden bg-stone-200 border border-white shadow-xs cursor-pointer hover:ring-2 hover:ring-[#1E3F32] transition-all"
            >
              <Image
                src={currentAvatar || "/images/desire_avatar.jpg"}
                alt={guideName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Dashboard Title & Welcome back */}
        <div className="mb-4">
          <h1 className="text-[32px] font-black text-black tracking-tight leading-tight">
            Dashboard
          </h1>
          <p className="text-[15px] font-medium text-stone-800 mt-0.5">
            Welcome back, {guideName || "Desire"}
          </p>
        </div>

        {/* 3 Pending Requests Alert Card */}
        {pendingRequests.length > 0 && (
          <div className="w-full bg-white rounded-[22px] p-3.5 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FCE8E6] text-[#E04F43] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-black leading-snug">
                  {pendingRequests.length} pending requests
                </h4>
                <p className="text-[11.5px] text-stone-500 font-normal">
                  Respond within 24 hours
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowReviewRequests(true)}
              className="bg-[#1E3F32] hover:bg-[#163325] text-white text-[12.5px] font-bold px-4 py-2.5 rounded-full shrink-0 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              Review requests
            </button>
          </div>
        )}

        {/* April 2026 Earnings Big Card */}
        {(() => {
          const totalEarnings = allBookings
            .filter((b) => b.status === "Confirmed" || b.status === "Completed")
            .reduce(
              (sum, b) =>
                sum +
                (Number(b.total_price) ||
                  Number(b.price_per_person) * (b.party_size || 1) ||
                  0),
              0
            );
          const completedCount = allBookings.filter((b) => b.status === "Completed").length;
          const displayEarnings = totalEarnings > 0 ? totalEarnings : 340;
          const displayCompleted = completedCount > 0 ? completedCount : 8;

          return (
            <div className="w-full rounded-[24px] bg-gradient-to-br from-[#EAF8F1] via-[#E4F5EB] to-[#D7F2E4] p-5 border border-emerald-100/70 shadow-xs mb-3.5 relative overflow-hidden">
              <p className="text-[14px] text-stone-700 font-medium">April 2026 earnings</p>
              <h2 className="text-[44px] font-black text-black tracking-tight leading-none my-2">
                ${displayEarnings}
              </h2>
              <p className="text-[13.5px] text-stone-700 font-normal mb-3">{displayCompleted} tours completed</p>
              <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full text-[12px] font-semibold text-emerald-800 border border-emerald-200/60 shadow-2xs">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>$45 up last month</span>
              </div>
            </div>
          );
        })()}

        {/* Quick Stats Grid: Bookings / Ratings on Left, Reviews on Right */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Left Column (Bookings & Ratings stacked) */}
          <div className="flex flex-col gap-2.5">
            {/* Bookings Card */}
            <div
              onClick={() => setActiveTab("calendar")}
              className="bg-white rounded-[18px] p-3 border border-stone-100 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex items-center gap-3 cursor-pointer hover:border-emerald-200 transition-colors"
            >
              <div className="w-7 h-7 flex items-center justify-center text-stone-800 shrink-0">
                <Calendar className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-stone-800 leading-none">Bookings</p>
                <p className="text-[15px] font-black text-black mt-1 leading-none">{allBookings.length > 0 ? allBookings.length : 31}</p>
              </div>
            </div>

            {/* Ratings Card */}
            <div className="bg-white rounded-[18px] p-3 border border-stone-100 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex items-center gap-3">
              <div className="w-7 h-7 flex items-center justify-center text-stone-800 shrink-0">
                <Star className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-stone-800 leading-none">Ratings</p>
                <p className="text-[15px] font-black text-black mt-1 leading-none">4.6</p>
              </div>
            </div>
          </div>

          {/* Right Column: Reviews Card */}
          <div className="bg-white rounded-[18px] p-3.5 border border-stone-100 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex items-start gap-3">
            <div className="w-7 h-7 flex items-center justify-center text-stone-800 shrink-0 mt-0.5">
              <MessageSquare className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-stone-800 leading-none">Reviews</p>
            </div>
          </div>
        </div>

        {/* Section: Upcoming bookings */}
        <div className="mb-3">
          <h3 className="text-[18px] font-black text-black tracking-tight mb-3">
            Upcoming bookings
          </h3>

          {/* Booking Card 1 (Zebras Safari - exact mockup match) */}
          <div className="w-full bg-white rounded-[22px] border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden flex flex-row mb-3.5">
            {/* Left Safari Photo */}
            <div className="w-[45%] relative shrink-0 min-h-[148px]">
              <Image
                src="/images/zebras_safari.jpg"
                alt="Sunset Safari Guide"
                fill
                sizes="(max-width: 430px) 45vw, 190px"
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Right Booking Details */}
            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                {/* Confirmed Pill */}
                <div className="flex justify-end mb-1">
                  <span className="bg-[#D3EFE1] text-[#1E3F32] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>

                {/* Tour Title */}
                <h4 className="text-[14px] font-bold text-black leading-snug mb-1.5">
                  Sunset Safari Guide
                </h4>

                {/* Date & Time */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mb-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                  <span>April 18, 2026- 09:00am</span>
                </div>

                {/* Group size */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mb-1.5">
                  <Users className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                  <span>6 Travelers</span>
                </div>

                {/* Guide & Group Price */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-700 font-medium">
                  <div className="w-4 h-4 rounded-full overflow-hidden bg-stone-200 shrink-0">
                    <Image
                      src={avatarUrl || "/images/desire_avatar.jpg"}
                      alt="Guide"
                      width={16}
                      height={16}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <span className="truncate">Desire & group - $320</span>
                </div>
              </div>

              {/* View Details Link */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedBooking({
                      tourTitle: "Sunset Safari Guide",
                      date: "April 18, 2026 - 09:00am",
                      travelers: "6 Travelers",
                      group: "Desire & group",
                      price: "$320",
                      image: "https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/f8ae0d559de38c218f176ecbd3b846e66ded1d04.jpg",
                      pickup: "Victoria Falls Safari Lodge",
                    })
                  }
                  className="text-[11.5px] font-bold text-black flex items-center gap-1 hover:underline cursor-pointer"
                >
                  View details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Booking Card 2 (Victoria Falls Walking Tour) */}
          <div className="w-full bg-white rounded-[22px] border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden flex flex-row">
            <div className="w-[45%] relative shrink-0 min-h-[148px]">
              <Image
                src="/images/hero_giraffe.jpg"
                alt="Victoria Falls Walking Tour"
                fill
                sizes="(max-width: 430px) 45vw, 190px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-end mb-1">
                  <span className="bg-[#D3EFE1] text-[#1E3F32] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>

                <h4 className="text-[14px] font-bold text-black leading-snug mb-1.5">
                  Walking Safari Bush Trail
                </h4>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mb-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                  <span>April 21, 2026- 02:00pm</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mb-1.5">
                  <Users className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                  <span>2 Travelers</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-700 font-medium">
                  <div className="w-4 h-4 rounded-full overflow-hidden bg-stone-200 shrink-0">
                    <Image
                      src="/images/user_avatar.png"
                      alt="Traveler"
                      width={16}
                      height={16}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <span className="truncate">Sarah M. & guest - $180</span>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedBooking({
                      tourTitle: "Walking Safari Bush Trail",
                      date: "April 21, 2026 - 02:00pm",
                      travelers: "2 Travelers",
                      group: "Sarah M. & guest",
                      price: "$180",
                      image: "/images/hero_giraffe.jpg",
                      pickup: "Kingdom Hotel Lobby",
                    })
                  }
                  className="text-[11.5px] font-bold text-black flex items-center gap-1 hover:underline cursor-pointer"
                >
                  View details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Floating Bottom Navigation Bar (exact mockup match) */}
      <div className="absolute bottom-5 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-[32px] py-2 px-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-stone-200/70 flex items-center justify-between">
        {/* Dashboard (Active) */}
        <button
          type="button"
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[12px] transition-all cursor-pointer ${
            activeTab === "dashboard"
              ? "bg-[#E5ECE9] text-[#1E3F32]"
              : "text-stone-600 hover:text-black"
          }`}
        >
          <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
          <span>Dashboard</span>
        </button>

        {/* Calendar */}
        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          aria-label="View bookings calendar"
          className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
        >
          <Calendar className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Tours / Map */}
        <button
          type="button"
          onClick={() => setActiveTab("tours")}
          aria-label="My Tours"
          className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
        >
          <Map className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Messages */}
        <button
          type="button"
          onClick={() => setActiveTab("messages")}
          aria-label="Messages"
          className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          aria-label="Guide Profile"
          className="p-2 text-stone-600 hover:text-black transition-colors cursor-pointer"
        >
          <User className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>

      {/* Floating "+ New tour" Button on Dashboard */}
      <div className="absolute right-5 bottom-[88px] z-20">
        <button
          type="button"
          onClick={() => setShowAddNewTour(true)}
          className="bg-white border border-stone-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.12)] rounded-full px-4 py-2 flex items-center gap-2 text-xs font-black text-black hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.2]" />
          <span>New tour</span>
        </button>
      </div>

      {/* Review Requests Modal */}
      {showReviewRequests && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div>
                <h3 className="text-[18px] font-bold text-black">Pending Tour Requests</h3>
                <p className="text-[12px] text-stone-500">Travelers waiting for confirmation</p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewRequests(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[55vh]">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-stone-50 rounded-[18px] p-3.5 border border-stone-200/60 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#1E3F32] flex items-center justify-center font-bold text-xs">
                        {req.travelerName.charAt(0)}
                      </div>
                      <span className="font-bold text-sm text-black">{req.travelerName}</span>
                    </div>
                    <span className="text-sm font-black text-[#1E3F32]">${req.price}</span>
                  </div>

                  <p className="text-xs font-semibold text-stone-800">{req.tourName}</p>

                  <div className="flex items-center gap-3 text-[11.5px] text-stone-500">
                    <span>{req.date}</span>
                    <span>•</span>
                    <span>{req.travelers} Guests</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-stone-200/50">
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(req.id)}
                      className="flex-1 py-2 bg-[#1E3F32] hover:bg-[#163325] text-white text-xs font-bold rounded-full cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept Request
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-full cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Selected Booking Details Modal */}
      {selectedBooking && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div>
                <h3 className="text-[18px] font-bold text-black">{selectedBooking.tourTitle}</h3>
                <span className="text-[11px] font-bold bg-[#D3EFE1] text-[#1E3F32] px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Confirmed Booking
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-stone-700 mb-4">
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Date & Time</span>
                <span className="font-bold text-black">{selectedBooking.date}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Party Size</span>
                <span className="font-bold text-black">{selectedBooking.travelers}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Pickup Location</span>
                <span className="font-bold text-black">{selectedBooking.pickup}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Earnings Payout</span>
                <span className="font-bold text-[#1E3F32] text-sm">{selectedBooking.price}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="w-full py-3 bg-[#1E3F32] hover:bg-[#163325] text-white font-bold text-xs rounded-full cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />
    </div>
  );
}
