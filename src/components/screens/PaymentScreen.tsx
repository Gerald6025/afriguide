"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  Banknote,
  Check,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";
import { TourPreviewData } from "./TourPreviewScreen";
import { BookingDetails } from "./BookExperienceScreen";

interface PaymentScreenProps {
  bookingDetails?: BookingDetails;
  tour?: TourPreviewData;
  onBack: () => void;
  onPayNow: (paymentInfo: { method: string; totalAmount: number }) => void;
}

export function PaymentScreen({
  bookingDetails,
  tour: propTour,
  onBack,
  onPayNow,
}: PaymentScreenProps) {
  const activeTour = bookingDetails?.tour || propTour;

  const tourTitle = activeTour?.title || "Hwange Elephant Walk";
  const location = activeTour?.location || "Hwange National Park";
  const imageUrl = activeTour?.imageUrl || "/images/experience_elephant.jpg";
  const pricePerPerson = activeTour?.pricePerPerson || 85;
  const guestCount = bookingDetails?.peopleCount || 2;
  const bookingDate = bookingDetails?.date || "July 22, 2026";

  // Selected payment method: "ecocash" | "card" | "cash"
  const [paymentMethod, setPaymentMethod] = useState<string>("ecocash");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Pricing calculations
  const baseTotal = pricePerPerson * guestCount;
  const serviceFee = 12;
  const parkEntryFee = 15 * guestCount;
  const totalCharged = baseTotal + serviceFee + parkEntryFee;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPayNow({
        method: paymentMethod,
        totalAmount: totalCharged,
      });
    }, 600);
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
          Payment
        </h1>

        <div className="w-10" aria-hidden="true" />
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 w-full px-5 pb-28 overflow-y-auto max-w-[430px] mx-auto">
        {/* 1. Secure Payment Banner */}
        <div className="w-full bg-[#F8F9FA] rounded-[18px] p-3.5 border border-stone-200/70 flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-[14.5px] font-black text-black leading-tight">
              Secure payment
            </h2>
            <p className="text-stone-500 text-[12px] leading-relaxed mt-1">
              Your payment is secured with a 256-bit SSL encryption, free cancelation up to 48 hours before the tour.
            </p>
          </div>
        </div>

        {/* 2. Tour Summary Card */}
        <div className="w-full bg-white rounded-[20px] p-3.5 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] flex items-center gap-3.5 mb-5">
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
            <h3 className="text-[16px] font-black text-black tracking-tight leading-snug truncate">
              {tourTitle}
            </h3>

            <div className="flex items-center gap-1.5 text-stone-600 text-[12.5px] font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            <div className="flex items-center gap-1.5 text-stone-600 text-[12.5px] font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{bookingDate}</span>
            </div>

            <div className="flex items-center gap-1.5 text-stone-600 text-[12.5px] font-medium">
              <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{guestCount} Guests</span>
            </div>
          </div>
        </div>

        {/* 3. Payment Method Section */}
        <div className="w-full mb-5">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-3">
            Payment method
          </h3>

          <div className="flex flex-col gap-2.5">
            {/* EcoCash Option */}
            <div
              onClick={() => setPaymentMethod("ecocash")}
              className={`w-full rounded-[16px] p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === "ecocash"
                  ? "bg-white border-[#1E3F32] shadow-sm ring-1 ring-[#1E3F32]"
                  : "bg-white border-stone-200/90 hover:border-stone-300"
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-baseline font-black tracking-tight text-[18px]">
                  <span className="text-[#0284C7]">Eco</span>
                  <span className="text-[#E11D48]">Cash</span>
                </div>
                <span className="text-stone-500 text-[12px] font-medium mt-0.5">
                  Mobile money
                </span>
              </div>

              {/* Radio circle */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  paymentMethod === "ecocash"
                    ? "border-[#1E3F32] bg-[#1E3F32]"
                    : "border-stone-400 bg-white"
                }`}
              >
                {paymentMethod === "ecocash" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            {/* Credit Card Option (Visa / Mastercard) */}
            <div
              onClick={() => setPaymentMethod("card")}
              className={`w-full rounded-[16px] p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === "card"
                  ? "bg-white border-[#1E3F32] shadow-sm ring-1 ring-[#1E3F32]"
                  : "bg-white border-stone-200/90 hover:border-stone-300"
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  {/* VISA */}
                  <span className="font-black italic tracking-tighter text-[#1A1F71] text-[17px] leading-none">
                    VISA
                  </span>
                  {/* Mastercard interlocking circles */}
                  <div className="flex items-center -space-x-1.5 ml-1">
                    <div className="w-4 h-4 rounded-full bg-[#EB001B]" />
                    <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90" />
                  </div>
                </div>
                <span className="text-stone-500 text-[12px] font-medium mt-1">
                  Credit card
                </span>
              </div>

              {/* Radio circle */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  paymentMethod === "card"
                    ? "border-[#1E3F32] bg-[#1E3F32]"
                    : "border-stone-400 bg-white"
                }`}
              >
                {paymentMethod === "card" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            {/* Cash / Local currency Option */}
            <div
              onClick={() => setPaymentMethod("cash")}
              className={`w-full rounded-[16px] p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === "cash"
                  ? "bg-white border-[#1E3F32] shadow-sm ring-1 ring-[#1E3F32]"
                  : "bg-white border-stone-200/90 hover:border-stone-300"
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-5 rounded-[4px] border border-black flex items-center justify-center font-bold text-[10px] text-black">
                    $
                  </div>
                </div>
                <span className="text-stone-500 text-[12px] font-medium mt-1">
                  Cash/ local currency
                </span>
              </div>

              {/* Radio circle */}
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  paymentMethod === "cash"
                    ? "border-[#1E3F32] bg-[#1E3F32]"
                    : "border-stone-400 bg-white"
                }`}
              >
                {paymentMethod === "cash" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Pricing Details Section */}
        <div className="w-full">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-3">
            Pricing details
          </h3>

          <div className="w-full bg-[#F9FAFB] rounded-[18px] p-4 border border-stone-100 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[14.5px]">
              <span className="text-stone-700 font-medium">
                ${pricePerPerson} x {guestCount}
              </span>
              <span className="text-black font-bold">${baseTotal}</span>
            </div>

            <div className="flex items-center justify-between text-[14.5px]">
              <span className="text-stone-700 font-medium">Service fee</span>
              <span className="text-black font-bold">${serviceFee}</span>
            </div>

            <div className="flex items-center justify-between text-[14.5px]">
              <span className="text-stone-700 font-medium">Park entry fee</span>
              <span className="text-black font-bold">${parkEntryFee}</span>
            </div>

            <div className="w-full h-px bg-stone-200/80 my-1" />

            <div className="flex items-center justify-between">
              <span className="text-black font-black text-[15px]">
                Total charged:
              </span>
              <span className="text-[#E27D33] font-black text-[18px]">
                ${totalCharged}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom Pay Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-100 flex justify-center">
        <div className="w-full max-w-[430px] px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-medium text-stone-500">$</span>
            <span className="text-[24px] font-black text-black tracking-tight">
              {totalCharged}
            </span>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="flex-1 h-[52px] rounded-[28px] bg-[#1E3F32] hover:bg-[#163026] active:scale-[0.98] text-white font-bold text-[16px] tracking-tight transition-all shadow-md flex items-center justify-center cursor-pointer disabled:opacity-70"
          >
            {isProcessing ? "Processing..." : "Pay now"}
          </button>
        </div>
      </div>
    </div>
  );
}
