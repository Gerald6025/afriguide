"use client";

import React from "react";
import Image from "next/image";
import { IosHomeIndicator } from "../IosStatusBar";
import { AfriGuideLogoBadge } from "../AfriGuideLogo";

interface StartAdventureScreenProps {
  onCreateAccount?: () => void;
  onAlreadyHaveAccount?: () => void;
  onBack?: () => void;
}

export function StartAdventureScreen({
  onCreateAccount,
  onAlreadyHaveAccount,
}: StartAdventureScreenProps) {
  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] bg-white flex flex-col justify-between overflow-hidden px-4 pt-1 pb-1 select-none">
      {/* Centered AfriGuide Logo Pill at Top */}
      <div className="flex justify-center pt-1 pb-1 shrink-0">
        <AfriGuideLogoBadge size="normal" />
      </div>

      {/* ── 4-Image Staggered Collage ── */}
      <div className="flex flex-col gap-2 w-full my-auto shrink min-h-0">
        {/* Top Row: Left (Wide) + Right (Narrow) */}
        <div className="flex flex-row gap-2 items-start">
          {/* Top-Left */}
          <div className="w-[58%] relative aspect-[4/2.8] max-h-[130px] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shrink-0 shadow-xs">
            <Image
              src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/6feb6e99f28c92cf4551d12f03635f8604794c28.jpg?updatedAt=1779444090488"
              alt="African landscape exploration"
              fill
              sizes="55vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Top-Right */}
          <div className="flex-1 relative aspect-[1/1.18] max-h-[140px] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 min-w-0 shadow-xs">
            <Image
              src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/53f0a641a7c3bc655317df8482a3119cfbd9850c.jpg?updatedAt=1779444104691"
              alt="African sunset and nature"
              fill
              sizes="45vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Bottom Row: flex-reverse — Right (Wide) + Left (Narrow) */}
        <div className="flex flex-row-reverse gap-2 items-start">
          {/* Bottom-Right */}
          <div className="w-[58%] relative aspect-[4/2.8] max-h-[130px] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shrink-0 shadow-xs">
            <Image
              src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/65dac0d12eb46cc382ec4f687a25556b76239ad8.jpg?updatedAt=1779444110433"
              alt="Wildlife encounter"
              fill
              sizes="55vw"
              className="object-cover"
            />
          </div>

          {/* Bottom-Left */}
          <div className="flex-1 relative aspect-[1/1.18] max-h-[140px] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 min-w-0 shadow-xs">
            <Image
              src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/9d9f4a7183e631aae25942805b8504df7b044b7a.jpg?updatedAt=1779444059036"
              alt="African safari nature"
              fill
              sizes="45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Content Area: Heading, Subtitle, Buttons, Legal ── */}
      <div className="w-full flex flex-col items-center mt-auto shrink-0 pb-1">
        {/* Headline */}
        <h1 className="text-[26px] sm:text-[30px] font-black text-black tracking-tight text-center leading-[1.08] mb-1.5">
          Start your adventure
        </h1>

        {/* Description */}
        <p className="text-stone-700 text-[13px] sm:text-[14px] text-center leading-[1.38] max-w-[320px] mb-3 sm:mb-4">
          Join thousands of travellers discovering the real Zimbabwe through authentic,
          local-led experiences. Your next unforgettable journey starts here.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mb-2 sm:mb-3">
          {/* Create Account Primary Button */}
          <button
            onClick={onCreateAccount}
            className="w-full py-3 sm:py-3.5 rounded-full bg-[#1E3F32] hover:bg-[#163026] active:scale-[0.98] text-white font-semibold text-[15.5px] sm:text-[16.5px] tracking-normal transition-all shadow-md cursor-pointer flex items-center justify-center"
          >
            Create account
          </button>

          {/* I Already Have an Account Secondary Button */}
          <button
            onClick={onAlreadyHaveAccount}
            className="w-full py-3 sm:py-3.5 rounded-full bg-[#F4F6F5] hover:bg-[#EAECEB] active:scale-[0.98] text-[#1E3F32] font-semibold text-[15.5px] sm:text-[16.5px] tracking-normal transition-all cursor-pointer flex items-center justify-center"
          >
            I Already have an account
          </button>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-center text-[11px] sm:text-[12px] text-stone-600 leading-normal mb-1">
          By continuing you agree to{" "}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="font-semibold text-black underline underline-offset-2"
          >
            Terms of service
          </a>{" "}
          and{" "}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="font-semibold text-black underline underline-offset-2"
          >
            Privacy policy
          </a>
        </p>
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />
    </div>
  );
}
