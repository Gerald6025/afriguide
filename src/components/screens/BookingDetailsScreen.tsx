"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CreditCard,
  Car,
  Ticket,
  User,
  Coffee,
  CalendarCheck,
  MessageSquare,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";
import { TourPreviewData } from "./TourPreviewScreen";
import { BookingDetails } from "./BookExperienceScreen";
import { PaymentInfo } from "./BookingRequestedScreen";

interface BookingDetailsScreenProps {
  tour?: TourPreviewData;
  bookingDetails?: BookingDetails;
  paymentInfo?: PaymentInfo;
  onBack: () => void;
  onMessageGuide?: () => void;
}

export function BookingDetailsScreen({
  tour: propTour,
  bookingDetails,
  paymentInfo,
  onBack,
  onMessageGuide,
}: BookingDetailsScreenProps) {
  const activeTour = bookingDetails?.tour || propTour;

  const tourTitle = activeTour?.title || "Hwange Elephant Walk";
  const location = activeTour?.location || "Hwange National Park";
  const imageUrl = activeTour?.imageUrl || "/images/experience_elephant.jpg";
  const pricePerPerson = activeTour?.pricePerPerson || 80;
  const guestCount = bookingDetails?.peopleCount || 4;
  const tourDate = bookingDetails?.date || "Tuesday, 22 July, 2026";
  const bookingId = "#VVF -7843957";

  const totalCharged = paymentInfo?.totalAmount
    ? `$${paymentInfo.totalAmount}`
    : bookingDetails?.totalPrice
    ? `$${bookingDetails.totalPrice + 12 + 15 * guestCount}`
    : `$${pricePerPerson * guestCount + 12 + 15 * guestCount}`;

  const [calendarAdded, setCalendarAdded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddToCalendar = () => {
    setCalendarAdded(true);
    setToastMessage("Added to your device calendar!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMessage = () => {
    if (onMessageGuide) {
      onMessageGuide();
    } else {
      setToastMessage(`Opening chat with guide ${activeTour?.guideName || "Mthabisi M"}...`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FDFDFD] flex flex-col justify-between overflow-x-hidden select-none">
      {/* ── Top iOS Status Bar (Null-safe) ── */}
      <IosStatusBar theme="dark" />

      {/* ── Header Bar ── */}
      <div className="relative w-full px-5 pt-3 pb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-black hover:bg-stone-100 active:scale-95 transition-transform cursor-pointer z-10"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="absolute inset-0 flex items-center justify-center pointer-events-none text-[20px] font-black text-black tracking-tight">
          Booking details
        </h1>

        <div className="w-10" aria-hidden="true" />
      </div>

      {/* ── Main Scrollable Body ── */}
      <div className="flex-1 w-full px-5 pb-24 overflow-y-auto max-w-[430px] mx-auto">
        {/* 1. Status & Booking ID Card */}
        <div className="w-full bg-[#F8F9FA] rounded-[18px] p-3.5 border border-stone-200/70 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#1E3F32] flex items-center justify-center text-white shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-black leading-tight">
                Confirmed
              </h2>
              <p className="text-stone-500 text-[12px] leading-tight mt-0.5">
                This booking was confirmed
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[12.5px] font-bold text-black leading-tight">
              Booking ID
            </div>
            <div className="text-[#E27D33] font-bold text-[13.5px] tracking-tight leading-tight mt-0.5">
              {bookingId}
            </div>
          </div>
        </div>

        {/* 2. Tour Experience Section */}
        <div className="w-full mb-5">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-3">
            Tour experience
          </h3>

          <div className="w-full bg-white rounded-[20px] p-3.5 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] flex items-center gap-3.5">
            <div className="relative w-[110px] h-[85px] rounded-[16px] overflow-hidden shrink-0 bg-stone-100">
              <Image
                src={imageUrl}
                alt={tourTitle}
                fill
                className="object-cover"
                sizes="110px"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
              <h4 className="text-[16px] font-black text-black tracking-tight leading-snug truncate">
                {tourTitle}
              </h4>

              <div className="flex items-center gap-1.5 text-stone-600 text-[12.5px] font-medium truncate">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span className="truncate">{location}</span>
              </div>

              <div className="flex items-center gap-1.5 text-stone-600 text-[12.5px] font-medium">
                <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>July 22, 2026</span>
              </div>

              <div className="flex items-center gap-1.5 text-stone-600 text-[12.5px] font-medium">
                <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{guestCount} Guests</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Booking Information Section */}
        <div className="w-full mb-5">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-3">
            Booking information
          </h3>

          <div className="w-full bg-[#F9FAFB] rounded-[20px] p-2 border border-stone-100 divide-y divide-stone-200/60">
            {/* Row 1: Tour Date */}
            <div className="flex items-center gap-3.5 p-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                <Calendar className="w-4 h-4 text-stone-800 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-bold text-black leading-tight">
                  {tourDate}
                </div>
                <div className="text-stone-500 text-[12px] leading-tight mt-0.5">
                  Tour date
                </div>
              </div>
            </div>

            {/* Row 2: Guests */}
            <div className="flex items-center gap-3.5 p-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                <Users className="w-4 h-4 text-stone-800 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-bold text-black leading-tight">
                  {guestCount} Guests
                </div>
              </div>
            </div>

            {/* Row 3: Tour Title & Park */}
            <div className="flex items-center gap-3.5 p-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                <MapPin className="w-4 h-4 text-stone-800 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-bold text-black leading-tight truncate">
                  {tourTitle}
                </div>
                <div className="text-stone-500 text-[12px] leading-tight mt-0.5 truncate">
                  {location}
                </div>
              </div>
            </div>

            {/* Row 4: Total Amount */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                  <DollarSign className="w-4 h-4 text-stone-800 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-bold text-black leading-tight">
                    Total amount
                  </div>
                  <div className="text-stone-500 text-[12px] leading-tight mt-0.5">
                    ${pricePerPerson}/person ({guestCount} {guestCount === 1 ? "guest" : "guests"})
                  </div>
                </div>
              </div>

              <span className="text-[17px] font-black text-black tracking-tight">
                {totalCharged}
              </span>
            </div>

            {/* Row 5: Payment Method */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                  <CreditCard className="w-4 h-4 text-stone-800 stroke-[2.2]" />
                </div>
                <div className="text-[14.5px] font-bold text-black leading-tight">
                  Payment Method
                </div>
              </div>

              {paymentInfo?.method === "ecocash" ? (
                <div className="flex items-center gap-1.5 font-bold text-[14px]">
                  <span className="text-[#0284C7] font-black">Eco</span>
                  <span className="text-[#E11D48] font-black">Cash</span>
                  <span className="text-[12px] text-stone-500 font-medium">(Mobile)</span>
                </div>
              ) : paymentInfo?.method === "cash" ? (
                <span className="text-[13px] font-bold text-black">
                  Cash / Local
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-black italic tracking-tighter text-[#1A1F71] text-[15px] leading-none">
                    VISA
                  </span>
                  <span className="text-[13px] font-bold text-black">
                    •••• 4346
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. What's Included Section */}
        <div className="w-full mb-3">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-3">
            What’s included
          </h3>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {/* Transportation */}
            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4 text-stone-800 stroke-[2.2] shrink-0" />
              <span className="text-[14px] font-bold text-black">
                Transportation
              </span>
            </div>

            {/* Park fees */}
            <div className="flex items-center gap-2.5">
              <Ticket className="w-4 h-4 text-stone-800 stroke-[2.2] shrink-0" />
              <span className="text-[14px] font-bold text-black">
                Park fees
              </span>
            </div>

            {/* Professional guide */}
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-stone-800 stroke-[2.2] shrink-0" />
              <span className="text-[14px] font-bold text-black">
                Professional guide
              </span>
            </div>

            {/* Food & Water */}
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-stone-800 stroke-[2.2] shrink-0" />
              <span className="text-[14px] font-bold text-black">
                Food & Water
              </span>
            </div>
          </div>
        </div>

        {/* Optional Toast Notice */}
        {toastMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-[14px] text-center text-[13px] font-bold text-emerald-800 animate-in fade-in duration-200">
            {toastMessage}
          </div>
        )}
      </div>

      {/* ── Fixed Bottom Actions Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-100 flex justify-center">
        <div className="w-full max-w-[430px] px-5 py-3.5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleMessage}
            className="flex-1 h-[52px] rounded-[28px] border-[1.5px] border-[#1E3F32] bg-white hover:bg-stone-50 active:scale-95 text-[#1E3F32] font-bold text-[15px] tracking-tight transition-all flex items-center justify-center cursor-pointer"
          >
            Message Guide
          </button>

          <button
            type="button"
            onClick={handleAddToCalendar}
            className="flex-1 h-[52px] rounded-[28px] bg-[#1E3F32] hover:bg-[#163026] active:scale-95 text-white font-bold text-[15px] tracking-tight transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {calendarAdded ? (
              <>
                <CalendarCheck className="w-4 h-4 stroke-[2.4]" />
                <span>Added</span>
              </>
            ) : (
              <span>Add to calendar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
