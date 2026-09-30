"use client";

import React, { useEffect } from "react";
import { IosHomeIndicator } from "../IosStatusBar";
import { AfriGuideBrandPill } from "../AfriGuideLogo";

interface SplashScreen2Props {
  onNext: () => void;
}

export function SplashScreen2({ onNext }: SplashScreen2Props) {
  // Displays the full AfriGuide logo page for exactly 2 seconds, then moves to onboarding
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div
      onClick={onNext}
      className="relative w-full h-full min-h-full bg-white flex flex-col justify-between select-none cursor-pointer"
    >
      {/* Centered Full AfriGuide Logo Brand Pill */}
      <div className="flex-1 flex items-center justify-center">
        <AfriGuideBrandPill />
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />
    </div>
  );
}
