import React from "react";

export function IosStatusBar({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const textColor = isDark ? "text-black" : "text-white";
  const iconFill = isDark ? "#000000" : "#FFFFFF";

  return (
    <div className={`w-full pt-3.5 pb-2 px-8 flex items-center justify-between select-none shrink-0 ${textColor}`}>
      {/* Time */}
      <span className="text-[15px] font-bold tracking-tight">9:41</span>

      {/* Status Icons */}
      <div className="flex items-center gap-1.5">
        {/* Cellular Signal (4 bars) */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="8" width="2.5" height="3.5" rx="0.8" fill={iconFill} />
          <rect x="5" y="5.5" width="2.5" height="6" rx="0.8" fill={iconFill} />
          <rect x="9.5" y="3" width="2.5" height="8.5" rx="0.8" fill={iconFill} />
          <rect x="14" y="0.5" width="2.5" height="11" rx="0.8" fill={iconFill} />
        </svg>

        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 2.2C10.6 2.2 13 3.2 14.8 4.8L16 3.5C13.8 1.6 11 0.5 8 0.5C5 0.5 2.2 1.6 0 3.5L1.2 4.8C3 3.2 5.4 2.2 8 2.2ZM8 5.6C9.7 5.6 11.3 6.3 12.5 7.4L13.7 6.1C12.2 4.7 10.2 3.9 8 3.9C5.8 3.9 3.8 4.7 2.3 6.1L3.5 7.4C4.7 6.3 6.3 5.6 8 5.6ZM8 9C9 9 9.8 9.4 10.4 10L11.6 8.7C10.7 7.8 9.4 7.3 8 7.3C6.6 7.3 5.3 7.8 4.4 8.7L5.6 10C6.2 9.4 7 9 8 9ZM8 12C8.6 12 9 11.6 9 11C9 10.4 8.6 10 8 10C7.4 10 7 10.4 7 11C7 11.6 7.4 12 8 12Z"
            fill={iconFill}
          />
        </svg>

        {/* Battery */}
        <div className="flex items-center ml-0.5">
          <div
            className={`w-[23px] h-[12px] rounded-[4.5px] border-[1.5px] ${
              isDark ? "border-black" : "border-white"
            } p-[1.5px] flex items-center`}
          >
            <div className={`h-full w-[82%] rounded-[1.8px] ${isDark ? "bg-black" : "bg-white"}`} />
          </div>
          <div
            className={`w-[1.5px] h-[4.5px] rounded-r-[1px] ml-[0.5px] ${
              isDark ? "bg-black" : "bg-white"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export function IosHomeIndicator({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  return (
    <div className="w-full pb-2 pt-1 flex justify-center shrink-0">
      <div className={`w-36 h-[5px] rounded-full ${isDark ? "bg-black" : "bg-white"}`} />
    </div>
  );
}
