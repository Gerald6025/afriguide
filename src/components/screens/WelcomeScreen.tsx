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
    <div className="relative w-full min-h-screen bg-white flex flex-col justify-between overflow-hidden px-5 pt-3 pb-2 select-none">
      {/* Centered Logo at Top */}
      <div className="flex justify-center pt-1 pb-2">
        <div className="relative w-[52px] h-[52px] flex items-center justify-center">
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
      <div className="flex flex-col gap-3 w-full my-auto">
        {/* Top Image */}
        <div className="relative w-full aspect-[16/9.6] rounded-[24px] overflow-hidden bg-stone-100 shadow-xs">
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
        <div className="relative w-full aspect-[16/9.6] rounded-[24px] overflow-hidden bg-stone-100 shadow-xs">
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
      <div className="w-full flex flex-col items-center mt-3 pb-1">
        {/* AfriGuide Brand Title */}
        <h1 className="text-[38px] font-black tracking-tight leading-none mb-3">
          <span style={{ color: "#234D3D" }}>Afri</span>
          <span style={{ color: "#E8622A" }}>Guide</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="text-[#1C1C1E] text-[15px] font-normal text-center leading-[1.45] max-w-[320px] mb-5">
          Embark on a digital journey through Zimbabwe&apos;s breathtaking landscapes and hidden cultural gems
        </p>

        {/* 2 Pagination Dots: Dot 1 active, Dot 2 inactive */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full bg-black" />
          <div className="w-2 h-2 rounded-full bg-[#C7C7CC]" />
        </div>

        {/* Full-width "Get Started" Button */}
        <button
          onClick={onGetStarted}
          className="w-full py-4 rounded-full bg-[#1E3F32] hover:bg-[#163026] active:scale-[0.98] text-white font-semibold text-[17px] tracking-normal transition-all shadow-md cursor-pointer flex items-center justify-center"
        >
          Get Started
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />
    </div>
  );
}
