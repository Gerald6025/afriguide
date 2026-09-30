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

export function OnboardingScreen2({
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

      {/* Main Content Section */}
      <div className="flex-1 min-h-0 flex flex-col justify-start px-4 pt-0.5 pb-1">
        {/* 2-Column Image Collage */}
        <div className="flex gap-2 shrink-0">
          {/* LEFT COLUMN (56%): Left Top + Left Bottom */}
          <div className="w-[56%] flex flex-col gap-2">
            {/* Left Top */}
            <div className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs max-h-[145px] sm:max-h-[160px]" style={{ aspectRatio: "4/3.2" }}>
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/a3ac9333a1b224bf22dc85d44e3b9feeaa75f0ba.jpg?updatedAt=1779444088746"
                alt="Guide safari experience"
                fill
                sizes="55vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Left Bottom */}
            <div className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs max-h-[145px] sm:max-h-[160px]" style={{ aspectRatio: "4/3.2" }}>
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/ef3ac0de8a37a7eb9faaee524bd1ee5cdbb8a407.jpg?updatedAt=1779444108780"
                alt="Wildlife adventure"
                fill
                sizes="55vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* RIGHT COLUMN (44%): Right Top + Right Bottom */}
          <div className="w-[44%] flex flex-col gap-2">
            {/* Right Top */}
            <div className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs max-h-[155px] sm:max-h-[170px]" style={{ aspectRatio: "1/1.2" }}>
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/1c534064664004f7db0d086c11a293e2d7e65a07%20(1).jpg?updatedAt=1779444093113"
                alt="Local safari guide"
                fill
                sizes="45vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Right Bottom */}
            <div className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs max-h-[140px] sm:max-h-[155px]" style={{ aspectRatio: "1/1.04" }}>
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/01a653844eb9f5e6476eae7031681e355179aea1.jpg?updatedAt=1779444068245"
                alt="Authentic landscapes"
                fill
                sizes="45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Text Section — closely paired below images */}
        <div className="w-[85%] mt-4 sm:mt-5 mb-1">
          <h1 className="text-[28px] sm:text-[32px] font-black text-black tracking-tight leading-[1.08] mb-1.5">
            Find your<br />perfect guide
          </h1>
          <p className="text-stone-700 text-[13px] sm:text-[14px] font-normal leading-[1.38]">
            Browse verified local guides with deep knowledge of Zimbabwe&apos;s hidden
            gems, wildlife, culture, and history. Read reviews from fellow travellers and
            find your ideal match.
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="shrink-0 mt-auto">
        <ScreenFooter
          hasBackButton={true}
          onBack={onBack}
          onNext={onNext}
          nextText="Next"
          stepIndex={1}
          totalSteps={3}
          onStepChange={onStepChange}
        />
        <IosHomeIndicator theme="dark" />
      </div>
    </div>
  );
}
