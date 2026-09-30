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

export function OnboardingScreen3({
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
      <div className="flex-1 min-h-0 flex flex-col justify-start px-4 pt-0.5 pb-1">
        <div className="flex flex-col gap-2 shrink-0">
          {/* Top Wide Banner */}
          <div className="relative w-full aspect-[16/9.2] max-h-[190px] sm:max-h-[210px] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-stone-100 shadow-xs shrink-0">
            <Image
              src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/0c75cb3f783e96198f21a9b4cebc8494fa4cf01d.jpg?updatedAt=1779444108491"
              alt="Discover hidden gems"
              fill
              sizes="(max-width: 430px) 100vw, 420px"
              className="object-cover"
              priority
            />
          </div>

          {/* 2-Image Row: Left (Bottom-Left) + Right (Bottom-Right) */}
          <div className="flex gap-2 items-start">
            {/* Bottom-Left Image */}
            <div className="flex-1 relative aspect-[1/0.92] max-h-[140px] sm:max-h-[155px] rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs">
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/ce19c9517c9e18ee2668242bdabd85ee882fd96a.jpg?updatedAt=1779444151536"
                alt="African adventure"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>

            {/* Bottom-Right Image */}
            <div
              className="flex-1 relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-stone-100 shadow-xs max-h-[145px] sm:max-h-[160px]"
              style={{ aspectRatio: "1/1.04" }}
            >
              <Image
                src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/1c534064664004f7db0d086c11a293e2d7e65a07.jpg?updatedAt=1779444091358"
                alt="Safari landscape"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Text Section — closely paired below images */}
        <div className="w-[85%] mt-4 sm:mt-5 mb-1">
          <h1 className="text-[28px] sm:text-[32px] font-black text-black tracking-tight leading-[1.08] mb-1.5">
            Discover<br />Hidden Gems
          </h1>
          <p className="text-stone-700 text-[13px] sm:text-[14px] font-normal leading-[1.38]">
            Connect with local storytellers who reveal the secrets of Africa&apos;s most
            breathtaking landscapes.
          </p>
        </div>
      </div>

      {/* Footer Controls (No Back Button on Image 4, matching screenshot exactly) */}
      <div className="shrink-0 mt-auto">
        <ScreenFooter
          hasBackButton={false}
          onBack={onBack}
          onNext={onNext}
          nextText="Next"
          stepIndex={0} // Dot 1 active in Image 4
          totalSteps={3}
          onStepChange={onStepChange}
        />
        <IosHomeIndicator theme="dark" />
      </div>
    </div>
  );
}
