"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Copy,
  Check,
  MapPin,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { TourPreviewData } from "./TourPreviewScreen";
import { BookingDetails } from "./BookExperienceScreen";

export interface PaymentInfo {
  method: string;
  totalAmount: number;
}

interface BookingRequestedScreenProps {
  tour?: TourPreviewData;
  bookingDetails?: BookingDetails;
  paymentInfo?: PaymentInfo;
  onClose: () => void;
  onViewBookings?: () => void;
  onBackToExplore: () => void;
}

export function BookingRequestedScreen({
  tour: propTour,
  bookingDetails,
  paymentInfo,
  onClose,
  onViewBookings,
  onBackToExplore,
}: BookingRequestedScreenProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Derive dynamic details from booking state passed from previous screens
  const activeTour = bookingDetails?.tour || propTour;
  const guideName = activeTour?.guideName || "Mthabisi M";
  const tourTitle = activeTour?.title || "Hwange Elephant Walk";
  const tourLocation = activeTour?.location || "Hwange National Park";
  const bookingId = "#VVF -7843957";

  const guestCount = bookingDetails?.peopleCount || 2;
  const tourDate = bookingDetails?.date || "Tuesday, 22 July, 2026";
  const timeSlot = bookingDetails?.time || "9:41 AM";

  // Exact total amount matching previous payment screen
  const totalCharged = paymentInfo?.totalAmount
    ? `$${paymentInfo.totalAmount}`
    : bookingDetails?.totalPrice
    ? `$${bookingDetails.totalPrice + 12 + 15 * guestCount}`
    : activeTour?.pricePerPerson
    ? `$${activeTour.pricePerPerson * guestCount + 12 + 15 * guestCount}`
    : "$182";

  const handleCopy = () => {
    navigator.clipboard?.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full min-h-full bg-white flex flex-col justify-between overflow-x-hidden overflow-y-auto pb-6 select-none">
      {/* ── Top Header with Close Icon ── */}
      <div className="w-full bg-white px-5 pt-4 pb-1 shrink-0 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-10 h-10 rounded-full flex items-center justify-center text-black hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6 stroke-[2]" />
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 w-full px-5 flex flex-col items-center">
        {/* 1. Illustration Card */}
        <div className="w-full max-w-[280px] aspect-[1.19] rounded-[24px] overflow-hidden bg-[#F7F8F9] flex items-center justify-center shadow-2xs">
          <Image
            src="/images/booking_requested_illustration.png"
            alt="Booking requested confirmation illustration"
            width={272}
            height={228}
            className="w-full h-full object-contain"
            priority
            unoptimized
          />
        </div>

        {/* 2. Heading & Subtitle */}
        <h1 className="text-[25px] font-black text-black tracking-tight text-center mt-4">
          Booking requested
        </h1>
        <p className="text-[13px] text-stone-600 text-center max-w-[320px] mx-auto mt-1 leading-snug">
          Your request has been sent to {guideName}, you&apos;ll receive a confirmation within 24 hours
        </p>

        {/* 3. Booking ID Row */}
        <div className="flex items-center justify-between w-full mt-4 pb-1">
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-black tracking-tight">
              Booking ID
            </span>
            <span className="text-[14px] font-bold text-[#E8622A]">
              {bookingId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy booking ID"
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-700 hover:text-black hover:bg-stone-100 transition-colors cursor-pointer"
            title={copied ? "Copied!" : "Copy Booking ID"}
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-600 stroke-[2.4]" />
            ) : (
              <Copy className="w-5 h-5 stroke-[2]" />
            )}
          </button>
        </div>

        {/* 4. Details List Cards (Dynamically matched with previous page) */}
        <div className="flex flex-col gap-2.5 w-full mt-2">
          {/* Item 1: Location */}
          <div className="w-full p-3.5 rounded-[16px] bg-[#FAFAFA] border border-stone-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-stone-800 shrink-0">
              <MapPin className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[14.5px] font-bold text-black">
                {tourTitle}
              </span>
              <span className="text-[12px] font-normal text-stone-500 mt-0.5">
                {tourLocation}
              </span>
            </div>
          </div>

          {/* Item 2: Tour Date */}
          <div className="w-full p-3.5 rounded-[16px] bg-[#FAFAFA] border border-stone-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-stone-800 shrink-0">
              <Calendar className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[14.5px] font-bold text-black">
                {tourDate}
              </span>
              <span className="text-[12px] font-normal text-stone-500 mt-0.5">
                Tour date
              </span>
            </div>
          </div>

          {/* Item 3: Time Slot */}
          <div className="w-full p-3.5 rounded-[16px] bg-[#FAFAFA] border border-stone-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-stone-800 shrink-0">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[14.5px] font-bold text-black">
                {timeSlot}
              </span>
              <span className="text-[12px] font-normal text-stone-500 mt-0.5">
                Selected time slot
              </span>
            </div>
          </div>

          {/* Item 4: Guests */}
          <div className="w-full p-3.5 rounded-[16px] bg-[#FAFAFA] border border-stone-100 shadow-2xs flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-stone-800 shrink-0">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[14.5px] font-bold text-black">
                {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
              </span>
              <span className="text-[12px] font-normal text-stone-500 mt-0.5">
                Group reservation
              </span>
            </div>
          </div>
        </div>

        {/* 5. Total Charged Row */}
        <div className="flex items-center justify-between w-full mt-4 mb-4">
          <span className="text-[16px] font-bold text-black">
            Total charged:
          </span>
          <span className="text-[24px] font-black text-[#E8622A] tracking-tight">
            {totalCharged}
          </span>
        </div>

        {/* 6. Action Buttons */}
        <div className="flex flex-col gap-2 w-full">
          <button
            type="button"
            onClick={() => {
              if (onViewBookings) onViewBookings();
              else alert("Navigating to My Bookings...");
            }}
            className="w-full h-[54px] rounded-[28px] bg-[#1E3F32] hover:bg-[#163026] active:scale-[0.98] text-white font-bold text-[16px] tracking-tight transition-all shadow-sm flex items-center justify-center cursor-pointer"
          >
            View my bookings
          </button>

          <button
            type="button"
            onClick={onBackToExplore}
            className="w-full h-[44px] text-center font-bold text-[15px] text-black hover:underline transition-colors cursor-pointer"
          >
            Back to explore
          </button>
        </div>
      </div>
    </div>
  );
}
