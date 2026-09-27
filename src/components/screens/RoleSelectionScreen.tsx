"use client";

import React, { useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { IosHomeIndicator } from "../IosStatusBar";
import { AfriGuideLogoBadge } from "../AfriGuideLogo";

interface RoleSelectionScreenProps {
  onBack?: () => void;
  onSelectRole?: (role: "tourist" | "guide") => void;
}

import Image from "next/image";

// ImageKit illustration for Tourist ("I'm a Tourist")
function TouristIllustration() {
  return (
    <Image
      src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/Frame%20553.png"
      alt="Tourist"
      width={64}
      height={64}
      unoptimized
      className="w-full h-full object-contain"
    />
  );
}

// ImageKit illustration for Guide ("I'm a Guide")
function GuideIllustration() {
  return (
    <Image
      src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/undraw_deliveries_qutl%201.png"
      alt="Guide"
      width={64}
      height={64}
      unoptimized
      className="w-full h-full object-contain"
    />
  );
}

export function RoleSelectionScreen({ onBack, onSelectRole }: RoleSelectionScreenProps) {
  const [selectedRole, setSelectedRole] = useState<"tourist" | "guide">("tourist");
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const handleSelectRoleCard = (role: "tourist" | "guide") => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmRole = () => {
    setShowConfirmModal(false);
    onSelectRole?.(selectedRole);
  };

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-hidden px-5 pt-3 pb-2 select-none">
      {/* Top Header Bar with Back Arrow & Centered Logo Pill */}
      <div className="relative flex items-center justify-between pt-1 pb-3 w-full">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="w-10 h-10 flex items-center justify-center -ml-2 text-black active:scale-95 transition-transform cursor-pointer z-10"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AfriGuideLogoBadge size="normal" />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center mt-2 mb-6">
        <h1 className="text-[32px] font-black text-black tracking-tight leading-tight mb-1.5">
          Who are you?
        </h1>
        <p className="text-stone-700 text-[15px] font-normal leading-snug max-w-[280px] mx-auto">
          Choose your role to get the right experience
        </p>
      </div>

      {/* Role Cards List */}
      <div className="flex flex-col gap-4 w-full flex-1">
        {/* Card 1: I'm a Tourist */}
        <div
          onClick={() => handleSelectRoleCard("tourist")}
          className={`relative rounded-[24px] p-5 cursor-pointer transition-all ${
            selectedRole === "tourist"
              ? "border-2 border-dashed border-[#E8622A] bg-white shadow-xs"
              : "border border-stone-200/90 bg-[#F9FAFB] hover:border-stone-300"
          }`}
        >
          {/* Top-Right Radio / Check Circle */}
          <div className="absolute top-4 right-4">
            {selectedRole === "tourist" ? (
              <div className="w-6 h-6 rounded-full bg-[#E8622A] flex items-center justify-center text-white shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3.5]" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-stone-700 bg-transparent" />
            )}
          </div>

          {/* Top Row: Illustration Badge + Title & Description */}
          <div className="flex items-start gap-4 mb-4 pr-7">
            <div className="w-[68px] h-[68px] rounded-[18px] bg-[#F7F8F9] border border-stone-100 p-1 flex items-center justify-center shrink-0">
              <TouristIllustration />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-[18px] font-bold text-black leading-tight mb-1">
                I&apos;m a Tourist
              </h3>
              <p className="text-stone-600 text-[13px] leading-snug">
                Discover and book Zimbabwe&apos;s best local guides
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-2.5 pl-1">
            <div className="flex items-center gap-2.5 text-stone-800 text-[13.5px] font-medium">
              <Check className="w-4 h-4 stroke-[2.5] text-stone-900 shrink-0" />
              <span>Book verified guides</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-800 text-[13.5px] font-medium">
              <Check className="w-4 h-4 stroke-[2.5] text-stone-900 shrink-0" />
              <span>Book tours instantly</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-800 text-[13.5px] font-medium">
              <Check className="w-4 h-4 stroke-[2.5] text-stone-900 shrink-0" />
              <span>Pay your way, Cash, Ecocash, card</span>
            </div>
          </div>
        </div>

        {/* Card 2: I'm a Guide */}
        <div
          onClick={() => handleSelectRoleCard("guide")}
          className={`relative rounded-[24px] p-5 cursor-pointer transition-all ${
            selectedRole === "guide"
              ? "border-2 border-dashed border-[#E8622A] bg-white shadow-xs"
              : "border border-stone-200/90 bg-[#F9FAFB] hover:border-stone-300"
          }`}
        >
          {/* Top-Right Radio / Check Circle */}
          <div className="absolute top-4 right-4">
            {selectedRole === "guide" ? (
              <div className="w-6 h-6 rounded-full bg-[#E8622A] flex items-center justify-center text-white shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3.5]" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-stone-700 bg-transparent" />
            )}
          </div>

          {/* Top Row: Illustration Badge + Title & Description */}
          <div className="flex items-start gap-4 mb-4 pr-7">
            <div className="w-[68px] h-[68px] rounded-[18px] bg-[#FFFFFF] border border-stone-200/80 p-1 flex items-center justify-center shrink-0">
              <GuideIllustration />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-[18px] font-bold text-black leading-tight mb-1">
                I&apos;m a Guide
              </h3>
              <p className="text-stone-600 text-[13px] leading-snug">
                List your tours and get discovered by tourists and earn from your local knowledge
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-2.5 pl-1">
            <div className="flex items-center gap-2.5 text-stone-800 text-[13.5px] font-medium">
              <Check className="w-4 h-4 stroke-[2.5] text-stone-900 shrink-0" />
              <span>Create your listings.</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-800 text-[13.5px] font-medium">
              <Check className="w-4 h-4 stroke-[2.5] text-stone-900 shrink-0" />
              <span>Manage bookings</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-800 text-[13.5px] font-medium">
              <Check className="w-4 h-4 stroke-[2.5] text-stone-900 shrink-0" />
              <span>Get paid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Continue Button */}
      <div className="w-full pt-4 pb-1 mt-auto">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-4 rounded-[20px] bg-[#F0F4F2] hover:bg-[#E5ECE7] active:scale-[0.98] text-[#1E3F32] font-bold text-[16.5px] tracking-normal transition-all cursor-pointer flex items-center justify-center shadow-2xs"
        >
          Select your role to continue
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />

      {/* Confirmation Modal Popup for Tourist */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowConfirmModal(false)}
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[360px] bg-white rounded-[28px] p-6 shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 duration-200"
          >
            {/* Top Close 'X' Button */}
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              aria-label="Close"
              className="absolute top-5 right-5 p-1 rounded-full text-stone-700 hover:text-black hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.4]" />
            </button>

            {/* Modal Title */}
            <h2
              id="confirm-modal-title"
              className="text-[22px] font-bold text-black tracking-tight mt-1 mb-2 text-center"
            >
              Confirm
            </h2>

            {/* Subtitle Description */}
            <p className="text-stone-700 text-[14px] leading-relaxed text-center max-w-[270px] mb-5 font-normal">
              Discover local experiences, book trusted guides, and explore Zimbabwe with confidence.
            </p>

            {/* Role Summary */}
            <div className="w-full flex items-center gap-4 mb-6 px-1">
              <div className="w-[68px] h-[68px] rounded-[18px] bg-[#F7F9F8] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                {selectedRole === "guide" ? <GuideIllustration /> : <TouristIllustration />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[18px] font-bold text-black leading-tight mb-1">
                  {selectedRole === "guide" ? "I\u2019m a Guide" : "I\u2019m a Tourist"}
                </h3>
                <p className="text-stone-600 text-[13px] leading-snug">
                  {selectedRole === "guide"
                    ? "List my experiences and allow bookings"
                    : "Discover and book Zimbabwe\u2019s best local guides"}
                </p>
              </div>
            </div>

            {/* Confirm CTA Button */}
            <button
              type="button"
              onClick={handleConfirmRole}
              className="w-full py-4 rounded-[18px] bg-[#1E3F32] hover:bg-[#163325] active:scale-[0.98] text-white font-bold text-[16px] transition-all cursor-pointer shadow-sm text-center"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
