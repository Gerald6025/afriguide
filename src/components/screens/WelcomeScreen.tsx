"use client";

import React from "react";
import Image from "next/image";
import { IosHomeIndicator } from "../IosStatusBar";

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  onBack?: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] bg-white flex flex-col justify-between overflow-hidden px-5 pt-2 pb-2 select-none">
      {/* Centered Logo at Top */}
      <div className="flex justify-center pt-1 pb-1 shrink-0">
        <div className="relative w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] flex items-center justify-center">
          <Image
            src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/Logo%20(1).png?updatedAt=1779444032373"
            alt="AfriGuide Logo"
            width={52}
            height={52}
            priority
            unoptimized
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Two Wide Stacked Cards */}
      <div className="flex flex-col gap-2.5 w-full my-auto shrink min-h-0">
        {/* Top Image */}
        <div className="relative w-full aspect-[16/9.2] max-h-[155px] sm:max-h-[180px] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-stone-100 shadow-xs">
          <Image
            src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/a1b3c2dc8ceb851f86be3393c8f8ed3e5ae16b50.jpg?updatedAt=1779444084736"
            alt="Safari guide with elephants"
            fill
            sizes="(max-width: 430px) 100vw, 400px"
            className="object-cover"
            priority
          />
        </div>

        {/* Bottom Image */}
        <div className="relative w-full aspect-[16/9.2] max-h-[155px] sm:max-h-[180px] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-stone-100 shadow-xs">
          <Image
            src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/f32bed25e5383fbb8c1f964b0db83804e3c05a21.jpg?updatedAt=1779444109386"
            alt="Desert safari adventure"
            fill
            sizes="(max-width: 430px) 100vw, 400px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Bottom Content Area: Branding, Description, Dots, Action Button */}
      <div className="w-full flex flex-col items-center mt-auto shrink-0 pb-1">
        {/* AfriGuide Brand Title */}
        <h1 className="text-[32px] sm:text-[36px] font-black tracking-tight leading-none mb-2">
          <span style={{ color: "#234D3D" }}>Afri</span>
          <span style={{ color: "#E8622A" }}>Guide</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="text-[#1C1C1E] text-[13.5px] sm:text-[15px] font-normal text-center leading-[1.4] max-w-[320px] mb-3 sm:mb-4">
          Embark on a digital journey through Zimbabwe&apos;s breathtaking landscapes and hidden cultural gems
        </p>

        {/* 2 Pagination Dots: Dot 1 active, Dot 2 inactive */}
        <div className="flex items-center justify-center gap-2 mb-3.5 sm:mb-4">
          <div className="w-2 h-2 rounded-full bg-black" />
          <div className="w-2 h-2 rounded-full bg-[#C7C7CC]" />
        </div>

        {/* Full-width "Get Started" Button */}
        <button
          onClick={onGetStarted}
          className="w-full py-3.5 sm:py-4 rounded-full bg-[#1E3F32] hover:bg-[#163026] active:scale-[0.98] text-white font-semibold text-[16px] sm:text-[17px] tracking-normal transition-all shadow-md cursor-pointer flex items-center justify-center"
        >
          Get Started
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />
    </div>
  );
}
