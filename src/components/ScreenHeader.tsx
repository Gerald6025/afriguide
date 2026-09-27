import React from "react";
import { AfriGuideLogoBadge } from "./AfriGuideLogo";

interface ScreenHeaderProps {
  onSkip?: () => void;
  showSkip?: boolean;
  className?: string;
}

export function ScreenHeader({ onSkip, showSkip = true, className = "" }: ScreenHeaderProps) {
  return (
    <div className={`w-full flex items-center justify-between px-6 pt-1 pb-3 ${className}`}>
      <AfriGuideLogoBadge />
      {showSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="text-base font-bold text-black hover:text-stone-600 transition-colors px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          Skip
        </button>
      )}
    </div>
  );
}
