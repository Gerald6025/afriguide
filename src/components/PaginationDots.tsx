import React from "react";

interface PaginationDotsProps {
  total?: number;
  activeIndex: number; // 0, 1, 2
  onChange?: (index: number) => void;
  className?: string;
}

export function PaginationDots({
  total = 3,
  activeIndex,
  onChange,
  className = "",
}: PaginationDotsProps) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange?.(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              isActive
                ? "w-7 bg-[#CBD5E1] shadow-xs"
                : "w-2.5 bg-[#D5D9DE] hover:bg-[#B0B8C2]"
            }`}
          />
        );
      })}
    </div>
  );
}
