"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { IosHomeIndicator } from "../IosStatusBar";

interface SplashScreen1Props {
  onNext: () => void;
}

export function SplashScreen1({ onNext }: SplashScreen1Props) {
  // Loading page: displays for ~1.8s then transitions to full logo page
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div
      onClick={onNext}
      className="relative w-full h-full min-h-screen bg-white flex flex-col justify-between select-none cursor-pointer"
    >
      {/* Centered Compass Loading Icon using exact image */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-[84px] h-[84px] flex items-center justify-center">
          <Image
            src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/Logo%20(1).png?updatedAt=1779444032373"
            alt="AfriGuide Logo"
            width={84}
            height={84}
            priority
            unoptimized
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />
    </div>
  );
}
