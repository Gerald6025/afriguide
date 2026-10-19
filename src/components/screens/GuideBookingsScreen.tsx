"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getBookingsFromDb, updateBookingStatusInDb } from "@/services/dbService";
import {
  ArrowLeft,
  SlidersHorizontal,
  Award,
  Users,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
  MessageCircle,
  CheckCircle2,
  Send,
  Phone,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";

export interface GuideBookingItem {
  id: string;
  travelerName: string;
  avatar: string;
  partySize: number;
  country: string;
  countryFlag: string;
  status: "Confirmed" | "Pending" | "Completed";
  tourCategory: string;
  tourTitle: string;
  date: string;
  timeSlot: string;
  location: string;
  pricePerPerson: number;
  totalPayout: number;
}

interface GuideBookingsScreenProps {
  onBack: () => void;
  avatarUrl?: string;
  guideName?: string;
  onOpenMessage?: (booking: GuideBookingItem) => void;
  onViewDetails?: (booking: GuideBookingItem) => void;
}

function checkDateMatchesDay(dateString: string, targetDay: number): boolean {
  if (!dateString) return false;
  const regex = new RegExp(`(^|[^0-9])0?${targetDay}([^0-9]|$)`);
  if (regex.test(dateString)) {
    return true;
  }
  try {
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      return parsed.getDate() === targetDay;
    }
  } catch {
    // ignore
  }
  return false;
}

const INITIAL_BOOKINGS: GuideBookingItem[] = [
  {
    id: "booking_1",
    travelerName: "Cody Fisher",
    avatar: "/images/user_avatar.png",
    partySize: 4,
    country: "Hong Kong, China",
    countryFlag: "🇨🇳",
    status: "Confirmed",
    tourCategory: "Tour Experience",
    tourTitle: "Sunset Safari Guide",
    date: "April 18, 2026",
    timeSlot: "09:00am-17:00pm",
    location: "Victoria Falls, Zimbabwe",
    pricePerPerson: 85,
    totalPayout: 340,
  },
  {
    id: "booking_2",
    travelerName: "Annette Black",
    avatar: "/images/user_avatar.png",
    partySize: 4,
    country: "Hong Kong, China",
    countryFlag: "🇨🇳",
    status: "Pending",
    tourCategory: "Tour Experience",
    tourTitle: "Sunset Safari Guide",
    date: "April 18, 2026",
    timeSlot: "09:00am-17:00pm",
    location: "Victoria Falls, Zimbabwe",
    pricePerPerson: 85,
    totalPayout: 340,
  },
  {
    id: "booking_3",
    travelerName: "Guy Hawkins",
    avatar: "/images/user_avatar.png",
    partySize: 4,
    country: "Hong Kong, China",
    countryFlag: "🇨🇳",
    status: "Confirmed",
    tourCategory: "Tour Experience",
    tourTitle: "Sunset Safari Guide",
    date: "April 20, 2026",
    timeSlot: "10:00am-16:00pm",
    location: "Victoria Falls, Zimbabwe",
    pricePerPerson: 90,
    totalPayout: 360,
  },
  {
    id: "booking_4",
    travelerName: "Eleanor Pena",
    avatar: "/images/user_avatar.png",
    partySize: 2,
    country: "London, UK",
    countryFlag: "🇬🇧",
    status: "Pending",
    tourCategory: "Tour Experience",
    tourTitle: "Zambezi River Canoe Tour",
    date: "April 22, 2026",
    timeSlot: "08:00am-13:00pm",
    location: "Zambezi National Park",
    pricePerPerson: 110,
    totalPayout: 220,
  },
];

export function GuideBookingsScreen({
  onBack,
  avatarUrl = "/images/desire_avatar.jpg",
  guideName = "Desire",
  onOpenMessage,
  onViewDetails,
}: GuideBookingsScreenProps) {
  const [bookings, setBookings] = useState<GuideBookingItem[]>(INITIAL_BOOKINGS);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "requests" | "upcoming" | "confirmed">("all");
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<GuideBookingItem | null>(null);
  const [chatTarget, setChatTarget] = useState<GuideBookingItem | null>(null);
  const [chatMessage, setChatMessage] = useState<string>("");

  useEffect(() => {
    async function loadBookings() {
      try {
        const dbBookings = await getBookingsFromDb();
        if (dbBookings && dbBookings.length > 0) {
          setBookings(
            dbBookings.map((b) => ({
              id: b.id,
              travelerName: b.tourist_name,
              avatar: "/images/user_avatar.png",
              partySize: b.party_size || 1,
              country: "International Guest",
              countryFlag: "🌍",
              status: (b.status === "Completed" ? "Completed" : b.status === "Confirmed" ? "Confirmed" : "Pending") as any,
              tourCategory: "Tour Experience",
              tourTitle: b.tour_title,
              date: b.date,
              timeSlot: b.time_slot || "09:00am-17:00pm",
              location: b.location,
              pricePerPerson: Number(b.price_per_person),
              totalPayout: Number(b.total_price),
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load bookings from Supabase:", err);
      }
    }
    loadBookings();
  }, []);

  const [messagesList, setMessagesList] = useState<Record<string, Array<{ text: string; sender: "guide" | "traveler"; time: string }>>>({
    booking_1: [
      { text: "Hi Desire! We're excited for the Sunset Safari tour this Saturday.", sender: "traveler", time: "10:14 AM" },
      { text: "Welcome Cody! Looking forward to hosting you and your group. Remember to bring warm jackets for the evening breeze.", sender: "guide", time: "10:20 AM" },
    ],
    booking_2: [
      { text: "Hello! We requested 4 spots for the Sunset Safari. Can we arrange hotel pickup?", sender: "traveler", time: "09:30 AM" },
    ],
  });

  // Calculate pending requests count
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  // Filter bookings based on selected tab and selected calendar day
  const filteredBookings = bookings.filter((item) => {
    if (selectedCalendarDay !== null) {
      const matchDay = checkDateMatchesDay(item.date, selectedCalendarDay);
      if (!matchDay) return false;
    }
    if (selectedFilter === "requests") return item.status === "Pending";
    if (selectedFilter === "confirmed") return item.status === "Confirmed";
    if (selectedFilter === "upcoming") return true; // all future
    return true;
  });

  const handleSendMessage = (bookingId: string) => {
    if (!chatMessage.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessagesList((prev) => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] || []), { text: chatMessage.trim(), sender: "guide", time: now }],
    }));
    setChatMessage("");
  };

  const handleConfirmPending = async (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Confirmed" } : b))
    );
    if (selectedBookingDetails && selectedBookingDetails.id === id) {
      setSelectedBookingDetails((prev) => (prev ? { ...prev, status: "Confirmed" } : null));
    }
    await updateBookingStatusInDb(id, "Confirmed");
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F9FAF9] text-black relative select-none overflow-hidden">
      {/* iOS Status Bar */}
      <div className="px-5 pt-3 pb-1 shrink-0">
        <IosStatusBar />
      </div>

      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-2 shrink-0 relative">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to dashboard"
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-[20px] font-black text-black tracking-tight text-center absolute left-1/2 -translate-x-1/2">
          Bookings
        </h1>

        <div className="w-9 h-9" />
      </div>

      {/* Filter Tabs Row */}
      <div className="px-5 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
        {/* Filter Sliders Button */}
        <button
          type="button"
          onClick={() => setSelectedFilter((prev) => (prev === "all" ? "requests" : "all"))}
          aria-label="Filter toggle"
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            selectedFilter === "all"
              ? "bg-[#F1F3F2] text-stone-700 hover:bg-stone-200"
              : "bg-[#1E3F32] text-white"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Requests Tab */}
        <button
          type="button"
          onClick={() => setSelectedFilter("requests")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            selectedFilter === "requests"
              ? "bg-[#1E3F32] text-white shadow-xs"
              : "bg-[#F1F3F2] text-stone-800 hover:bg-stone-200"
          }`}
        >
          Requests({pendingCount})
        </button>

        {/* Upcoming Tab */}
        <button
          type="button"
          onClick={() => setSelectedFilter("upcoming")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            selectedFilter === "upcoming"
              ? "bg-[#1E3F32] text-white shadow-xs"
              : "bg-[#F1F3F2] text-stone-800 hover:bg-stone-200"
          }`}
        >
          Upcoming
        </button>

        {/* Confirmed Tab */}
        <button
          type="button"
          onClick={() => setSelectedFilter("confirmed")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            selectedFilter === "confirmed"
              ? "bg-[#1E3F32] text-white shadow-xs"
              : "bg-[#F1F3F2] text-stone-800 hover:bg-stone-200"
          }`}
        >
          Confirmed
        </button>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-32 space-y-4 scrollbar-none">
        {/* Interactive Guide Bookings Calendar Bar */}
        <div className="w-full bg-white rounded-[22px] p-3.5 border border-stone-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#1E3F32] stroke-[2.2]" />
              <span className="text-[13.5px] font-bold text-black">April Guide Schedule</span>
            </div>
            {selectedCalendarDay !== null && (
              <button
                type="button"
                onClick={() => setSelectedCalendarDay(null)}
                className="text-xs text-[#1E3F32] font-bold hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Days Strip */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { day: 16, weekday: "Thu" },
              { day: 17, weekday: "Fri" },
              { day: 18, weekday: "Sat" },
              { day: 19, weekday: "Sun" },
              { day: 20, weekday: "Mon" },
              { day: 21, weekday: "Tue" },
              { day: 22, weekday: "Wed" },
              { day: 23, weekday: "Thu" },
            ].map((d) => {
              const hasBooking = bookings.some((b) => checkDateMatchesDay(b.date, d.day));
              const isSelected = selectedCalendarDay === d.day;
              return (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setSelectedCalendarDay(isSelected ? null : d.day)}
                  className={`flex flex-col items-center justify-center min-w-[42px] h-[54px] rounded-[16px] transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1E3F32] text-white font-bold shadow-xs scale-102"
                      : hasBooking
                      ? "bg-[#E5ECE9] text-[#1E3F32] font-bold border border-[#1E3F32]/20"
                      : "bg-[#F5F5F5] text-stone-700 hover:bg-stone-200 font-medium"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-tight opacity-75">{d.weekday}</span>
                  <span className="text-[15px] font-black">{d.day}</span>
                  {hasBooking && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E3F32] mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedCalendarDay !== null && (
            <div className="flex items-center justify-between pt-1 px-1 border-t border-stone-100 text-[12px]">
              <span className="text-stone-600 font-medium">Filtering April {selectedCalendarDay}</span>
            </div>
          )}
        </div>

        {/* 12 Bookings Completed Banner Card */}
        <div className="w-full bg-white rounded-[22px] p-4 border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-start justify-between gap-3">
          <div className="flex-1 pr-1">
            <h2 className="text-[16px] font-black text-black tracking-tight leading-snug">
              12 bookings completed
            </h2>
            <p className="text-[12.5px] font-normal text-stone-500 mt-1 leading-snug">
              You&apos;re getting more requests this week,update your availability to get more bookings
            </p>
          </div>

          <div className="w-8 h-8 flex items-center justify-center shrink-0 text-[#1B3D2F] mt-0.5">
            <Award className="w-7 h-7 stroke-[1.8]" />
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center text-stone-500">
            <p className="text-sm font-semibold">No bookings found for this filter.</p>
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className="mt-2 text-xs font-bold text-[#1E3F32] underline cursor-pointer"
            >
              Show all bookings
            </button>
          </div>
        ) : (
          filteredBookings.map((item) => (
            <div
              key={item.id}
              className="w-full bg-white rounded-[24px] p-4 border border-stone-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-3"
            >
              {/* Header: Avatar, Name, Party Size & Flag, Status Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar Container with image fallback */}
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shrink-0 flex items-center justify-center relative">
                    <Image
                      src={item.avatar}
                      alt={item.travelerName}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>

                  <div>
                    <h3 className="text-[16px] font-black text-black leading-tight">
                      {item.travelerName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[12px] font-medium text-stone-700">
                      <Users className="w-3.5 h-3.5 text-stone-600 stroke-[2.2]" />
                      <span>{item.partySize}</span>
                      <span className="text-sm leading-none ml-0.5">{item.countryFlag}</span>
                      <span className="text-stone-600">{item.country}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {item.status === "Confirmed" ? (
                    <span className="text-[11.5px] font-bold text-stone-700 bg-[#E8EDE9] px-3 py-1 rounded-full inline-block">
                      Confirmed
                    </span>
                  ) : item.status === "Pending" ? (
                    <span className="text-[11.5px] font-bold text-[#C25E1A] bg-[#FEE9D9] px-3 py-1 rounded-full inline-block">
                      Pending
                    </span>
                  ) : (
                    <span className="text-[11.5px] font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full inline-block">
                      Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Inner Gray Card: Tour Experience Details */}
              <div className="w-full bg-[#F8F9F8] rounded-[20px] p-3.5 flex flex-col gap-1.5 border border-stone-100/60">
                <span className="text-[11.5px] font-semibold text-stone-500">
                  {item.tourCategory}
                </span>

                <h4 className="text-[16.5px] font-black text-black tracking-tight leading-tight">
                  {item.tourTitle}
                </h4>

                {/* Date & Time Row */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full text-[12px] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-stone-600 stroke-[2.2]" />
                    <span>{item.timeSlot}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full text-[12px] font-semibold">
                    <CalendarIcon className="w-3.5 h-3.5 text-stone-600 stroke-[2.2]" />
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Location Row */}
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-stone-700 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-800 stroke-[2.2] shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>

              {/* Action Buttons: Message & View details */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setChatTarget(item);
                    if (onOpenMessage) onOpenMessage(item);
                  }}
                  className="flex-1 py-2.5 text-center text-[#1B3D2F] font-black text-[14px] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  Message
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedBookingDetails(item);
                    if (onViewDetails) onViewDetails(item);
                  }}
                  className="flex-[1.2] py-2.5 px-5 bg-[#1B3D2F] hover:bg-[#143226] text-white font-bold text-[13.5px] rounded-full text-center shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  View details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBookingDetails && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div>
                <h3 className="text-[18px] font-black text-black">
                  {selectedBookingDetails.tourTitle}
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    selectedBookingDetails.status === "Confirmed"
                      ? "bg-[#E8EDE9] text-[#1B3D2F]"
                      : "bg-[#FEE9D9] text-[#C25E1A]"
                  }`}
                >
                  {selectedBookingDetails.status} Booking
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingDetails(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Info */}
            <div className="space-y-2.5 text-xs text-stone-700 mb-4 overflow-y-auto">
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Lead Traveler</span>
                <span className="font-bold text-black">{selectedBookingDetails.travelerName}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Party Size</span>
                <span className="font-bold text-black">{selectedBookingDetails.partySize} Guests</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Date</span>
                <span className="font-bold text-black">{selectedBookingDetails.date}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Time Window</span>
                <span className="font-bold text-black">{selectedBookingDetails.timeSlot}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Location</span>
                <span className="font-bold text-black">{selectedBookingDetails.location}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="font-semibold text-stone-500">Guide Payout</span>
                <span className="font-black text-[#1B3D2F] text-sm">
                  ${selectedBookingDetails.totalPayout} USD
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col gap-2">
              {selectedBookingDetails.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => handleConfirmPending(selectedBookingDetails.id)}
                  className="w-full py-3 bg-[#1B3D2F] hover:bg-[#143226] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Accept & Confirm Booking
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const b = selectedBookingDetails;
                    setSelectedBookingDetails(null);
                    setChatTarget(b);
                  }}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-full flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Message Traveler
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBookingDetails(null)}
                  className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-full cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Chat Modal */}
      {chatTarget && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-6 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-stone-200">
                  <Image
                    src={chatTarget.avatar}
                    alt={chatTarget.travelerName}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-black">{chatTarget.travelerName}</h3>
                  <p className="text-[11px] text-stone-500 font-medium">{chatTarget.tourTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Calling ${chatTarget.travelerName}...`)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setChatTarget(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-2.5 py-2 max-h-[40vh] pr-1">
              {(messagesList[chatTarget.id] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "guide" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "guide"
                        ? "bg-[#1B3D2F] text-white rounded-br-none"
                        : "bg-stone-100 text-stone-900 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage(chatTarget.id);
                }}
                placeholder={`Message ${chatTarget.travelerName}...`}
                className="flex-1 bg-stone-100 px-4 py-2.5 rounded-full text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-[#1B3D2F]"
              />
              <button
                type="button"
                onClick={() => handleSendMessage(chatTarget.id)}
                className="w-9 h-9 rounded-full bg-[#1B3D2F] text-white flex items-center justify-center hover:bg-[#143226] transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
