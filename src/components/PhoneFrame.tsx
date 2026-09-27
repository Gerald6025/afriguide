import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
  isFrameVisible?: boolean;
}

export function PhoneFrame({ children, isFrameVisible = true }: PhoneFrameProps) {
  if (!isFrameVisible) {
    return (
      <div className="w-full max-w-[430px] min-h-[850px] bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200">
        {children}
      </div>
    );
  }

  return (
    <div className="relative mx-auto transition-all duration-300">
      {/* Outer Titanium Phone Shell */}
      <div className="relative w-[390px] sm:w-[420px] h-[860px] bg-[#1F2124] rounded-[52px] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3)] ring-1 ring-white/15">
        {/* Side physical buttons (simulated) */}
        {/* Silent / Action Button */}
        <div className="absolute -left-[13px] top-[115px] w-[3.5px] h-[26px] bg-[#32363b] rounded-l-sm" />
        {/* Volume Up */}
        <div className="absolute -left-[13px] top-[160px] w-[3.5px] h-[48px] bg-[#32363b] rounded-l-sm" />
        {/* Volume Down */}
        <div className="absolute -left-[13px] top-[220px] w-[3.5px] h-[48px] bg-[#32363b] rounded-l-sm" />
        {/* Power Button */}
        <div className="absolute -right-[13px] top-[170px] w-[3.5px] h-[72px] bg-[#32363b] rounded-r-sm" />

        {/* Inner Screen Display */}
        <div className="relative w-full h-full bg-white rounded-[42px] overflow-hidden flex flex-col shadow-inner select-none">
          {/* Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="w-[110px] h-[30px] bg-black rounded-full flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#081829] ring-1 ring-white/10" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="relative w-full h-full flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
