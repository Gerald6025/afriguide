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
    <div className="relative w-full min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <ScreenHeader onSkip={onSkip} />

      {/* ── 2-Row Staggered Image Grid with Flex-Reverse on Bottom Row ── */}
      <div className="px-2 pt-1 flex flex-col">
        {/* Top Row: Left (Wide) + Right (Narrow) */}
        <div
          style={{ display: "flex", flexDirection: "row", gap: 10, alignItems: "flex-start" }}
        >
          {/* Top-Left */}
          <div
            style={{ position: "relative", width: 234, height: 170, borderRadius: 22, overflow: "hidden", marginTop: 11 }}
            className="bg-stone-100 shrink-0"
          >
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
          <div
            style={{ position: "relative", flex: 1, height: 175, borderRadius: 22, overflow: "hidden", marginTop: 0 }}
            className="bg-stone-100 min-w-0"
          >
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
        <div
          style={{ display: "flex", flexDirection: "row-reverse", gap: 10, alignItems: "flex-start", marginTop: 10 }}
        >
          {/* Bottom-Right */}
          <div
            style={{ position: "relative", width: 234, height: 170, borderRadius: 22, overflow: "hidden" }}
            className="bg-stone-100 shrink-0"
          >
            <Image
              src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/d42d3fedcf8a05889bbab96a4bb5d920513661d5.jpg?updatedAt=1779444082986"
              alt="African safari elephants"
              fill
              sizes="55vw"
              className="object-cover"
            />
          </div>

          {/* Bottom-Left */}
          <div
            style={{ position: "relative", flex: 1, height: 187, borderRadius: 22, overflow: "hidden", marginTop: 0 }}
            className="bg-stone-100 min-w-0"
          >
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

      {/* Text Section */}
      <div className="px-5 mt-5 mb-2">
        <h1 className="text-[34px] font-black text-black tracking-tight leading-[1.06] mb-3">
          Your story<br />starts here
        </h1>
        <p className="text-stone-600 text-[14px] leading-[1.5] max-w-[320px]">
          Whether you&apos;re looking for adventure or culture, Afriguide brings the
          continent to your fingertips. Join a community of storytellers and explorers.
        </p>
      </div>

      {/* Footer — stepIndex 2: [dot][dot][pill] */}
      <div className="mt-auto">
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
