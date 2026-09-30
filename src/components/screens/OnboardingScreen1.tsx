"use client";

import React from "react";
import Image from "next/image";
import { IosHomeIndicator } from "../IosStatusBar";
import { ScreenHeader } from "../ScreenHeader";
import { ScreenFooter } from "../ScreenFooter";

interface OnboardingScreenProps {
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  onStepChange?: (index: number) => void;
}

export function OnboardingScreen1({
  onNext,
  onBack,
  onSkip,
  onStepChange,
}: OnboardingScreenProps) {
  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] bg-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Bar */}
      <div className="shrink-0">
        <ScreenHeader onSkip={onSkip} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col justify-start px-4 pt-0.5 pb-1 overflow-y-auto no-scrollbar">
        {/* 2-Row Staggered Image Grid with Responsive Sizing */}
        <div className="flex flex-col gap-2 shrink-0">
          {/* Top Row: Left (Wide) + Right (Narrow) */}
          <div className="flex gap-2 items-start">
            {/* Top-Left */}
            <div className="w-[58%] relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs shrink-0 max-h-[198px] sm:max-h-[219px]" style={{ aspectRatio: "4/3.97" }}>
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/17db038150e7d0aa34234fa26833774a1c330deb.jpg?updatedAt=1779444092572"
                alt="African landscape exploration"
                fill
                sizes="55vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Top-Right */}
            <div className="flex-1 relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs max-h-[212px] sm:max-h-[232px]" style={{ aspectRatio: "1/1.65" }}>
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/65dac0d12eb46cc382ec4f687a25556b76239ad8.jpg?updatedAt=1779444110433"
                alt="African wildlife portrait"
                fill
                sizes="42vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Bottom Row: flex-reverse — Right (Wide) + Left (Narrow) */}
          <div className="flex flex-row-reverse gap-2 items-start">
            {/* Bottom-Right */}
            <div className="w-[58%] relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs shrink-0 max-h-[198px] sm:max-h-[219px]" style={{ aspectRatio: "4/3.97" }}>
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/d42d3fedcf8a05889bbab96a4bb5d920513661d5.jpg?updatedAt=1779444082986"
                alt="African safari elephants"
                fill
                sizes="55vw"
                className="object-cover"
              />
            </div>

            {/* Bottom-Left */}
            <div className="flex-1 relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs max-h-[212px] sm:max-h-[232px]" style={{ aspectRatio: "1/1.65" }}>
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/1d40521aebf4d6eee578919774fc6fab93ff6c4e.jpg?updatedAt=1779444109272"
                alt="Wildlife on savanna"
                fill
                sizes="42vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Text Section — closely paired below images */}
        <div className="w-[85%] mt-4 sm:mt-5 mb-1">
          <h1 className="text-[28px] sm:text-[32px] font-black text-black tracking-tight leading-[1.08] mb-1.5">
            Your story<br />starts here
          </h1>
          <p className="text-stone-700 text-[13px] sm:text-[14px] font-normal leading-[1.38]">
            Whether you&apos;re looking for adventure or culture, Afriguide brings the
            continent to your fingertips. Join a community of storytellers and explorers.
          </p>
        </div>
      </div>

      {/* Footer — stepIndex 2: [dot][dot][pill] */}
      <div className="shrink-0 mt-auto">
        <ScreenFooter
          hasBackButton={true}
          onBack={onBack}
          onNext={onNext}
          nextText="Next"
          stepIndex={2}
          totalSteps={3}
          onStepChange={onStepChange}
        />
        <IosHomeIndicator theme="dark" />
      </div>
    </div>
  );
}
