import React from "react";
import { ArrowLeft } from "lucide-react";
import { PaginationDots } from "./PaginationDots";

interface ScreenFooterProps {
  hasBackButton?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  nextText?: string;
  stepIndex?: number;
  totalSteps?: number;
  onStepChange?: (index: number) => void;
  className?: string;
}

export function ScreenFooter({
  hasBackButton = false,
  onBack,
  onNext,
  nextText = "Next",
  stepIndex = 0,
  totalSteps = 3,
  onStepChange,
  className = "",
}: ScreenFooterProps) {
  return (
    <div className={`w-full flex flex-col gap-6 px-6 pt-2 pb-3 ${className}`}>
      {/* Centered Pagination Dots */}
      <div className="flex justify-center w-full">
        <PaginationDots
          total={totalSteps}
          activeIndex={stepIndex}
          onChange={onStepChange}
        />
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between gap-3 w-full">
        {hasBackButton ? (
          <>
            <button
              type="button"
              onClick={onBack}
              aria-label="Previous screen"
              className="w-16 h-16 rounded-[20px] bg-[#F7F8F9] hover:bg-[#EFF0F2] active:scale-95 transition-all flex items-center justify-center border border-stone-200/50 shadow-2xs text-stone-900 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="flex-1 h-16 rounded-[20px] bg-[#1E3F32] hover:bg-[#163327] active:scale-[0.98] text-white font-bold text-[17px] flex items-center justify-center shadow-xs transition-all focus:outline-none cursor-pointer"
            >
              {nextText}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="ml-auto w-[148px] h-14 rounded-[20px] bg-[#1E3F32] hover:bg-[#163327] active:scale-[0.98] text-white font-bold text-[17px] flex items-center justify-center shadow-xs transition-all focus:outline-none cursor-pointer"
          >
            {nextText}
          </button>
        )}
      </div>
    </div>
  );
}
