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
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-hidden px-4 pt-2 pb-2 select-none">
      {/* Centered AfriGuide Logo Pill at Top */}
      <div className="flex justify-center pt-1 pb-2">
        <AfriGuideLogoBadge size="normal" />
      </div>

      {/* ── 4-Image Staggered Collage ── */}
      <div className="flex flex-col gap-2.5 w-full my-auto">
        {/* Top Row: Left (Wide) + Right (Narrow) */}
        <div
          style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "flex-start" }}
        >
          {/* Top-Left */}
          <div
            style={{ position: "relative", width: 234, height: 165, borderRadius: 22, overflow: "hidden" }}
            className="bg-stone-100 shrink-0 shadow-xs"
          >
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
          <div
            style={{ position: "relative", flex: 1, height: 165, borderRadius: 22, overflow: "hidden" }}
            className="bg-stone-100 min-w-0 shadow-xs"
          >
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
        <div
          style={{ display: "flex", flexDirection: "row-reverse", gap: 10, alignItems: "flex-start" }}
        >
          {/* Bottom-Right */}
          <div
            style={{ position: "relative", width: 234, height: 165, borderRadius: 22, overflow: "hidden" }}
            className="bg-stone-100 shrink-0 shadow-xs"
          >
            <Image
              src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/65dac0d12eb46cc382ec4f687a25556b76239ad8.jpg?updatedAt=1779444110433"
              alt="Wildlife encounter"
              fill
              sizes="55vw"
              className="object-cover"
            />
          </div>

          {/* Bottom-Left */}
          <div
            style={{ position: "relative", flex: 1, height: 165, borderRadius: 22, overflow: "hidden" }}
            className="bg-stone-100 min-w-0 shadow-xs"
          >
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
      <div className="w-full flex flex-col items-center mt-4">
        {/* Headline */}
        <h1 className="text-[32px] font-black text-black tracking-tight text-center leading-[1.08] mb-2.5">
          Start your adventure
        </h1>

        {/* Description */}
        <p className="text-stone-700 text-[14px] text-center leading-[1.45] max-w-[320px] mb-5">
          Join thousands of travellers discovering the real Zimbabwe through authentic,
          local-led experiences. Your next unforgettable journey starts here.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mb-4">
          {/* Create Account Primary Button */}
          <button
            onClick={onCreateAccount}
            className="w-full py-3.5 rounded-full bg-[#1E3F32] hover:bg-[#163026] active:scale-[0.98] text-white font-semibold text-[17px] tracking-normal transition-all shadow-md cursor-pointer flex items-center justify-center"
          >
            Create account
          </button>

          {/* I Already Have an Account Secondary Button */}
          <button
            onClick={onAlreadyHaveAccount}
            className="w-full py-3.5 rounded-full bg-[#F4F6F5] hover:bg-[#EAECEB] active:scale-[0.98] text-[#1E3F32] font-semibold text-[17px] tracking-normal transition-all cursor-pointer flex items-center justify-center"
          >
            I Already have an account
          </button>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-center text-[12px] text-stone-600 leading-normal mb-1">
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
