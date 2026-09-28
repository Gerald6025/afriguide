"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { IosHomeIndicator } from "../IosStatusBar";
import { AfriGuideLogoBadge } from "../AfriGuideLogo";

interface OtpVerificationScreenProps {
  email?: string;
  phoneNumber?: string;
  codeLength?: number;
  onBack?: () => void;
  onVerified?: (code: string) => void;
  onResend?: () => void;
  isLoading?: boolean;
}

export function OtpVerificationScreen({
  email,
  phoneNumber = "+263 78 413 8081",
  codeLength = 4,
  onBack,
  onVerified,
  onResend,
  isLoading = false,
}: OtpVerificationScreenProps) {
  const [code, setCode] = useState<string[]>(() => Array(codeLength).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal) {
      const nextCode = [...code];
      nextCode[index] = "";
      setCode(nextCode);
      return;
    }

    const nextCode = [...code];
    nextCode[index] = cleanVal.slice(-1);
    setCode(nextCode);

    // Auto advance to next input
    if (index < codeLength - 1 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, codeLength);
    if (pasted) {
      const nextCode = [...code];
      for (let i = 0; i < pasted.length; i++) {
        nextCode[i] = pasted[i];
      }
      setCode(nextCode);
      const targetFocus = Math.min(pasted.length, codeLength - 1);
      inputRefs.current[targetFocus]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onVerified?.(code.join(""));
  };

  const handleResend = () => {
    onResend?.();
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FDFDFD] flex flex-col justify-between overflow-x-hidden px-5 pt-3 pb-3 select-none">
      {/* Top Header with Back Arrow and Centered AfriGuide Logo Badge */}
      <div className="relative flex items-center justify-between pt-1 pb-3 w-full min-h-[44px]">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 flex items-center justify-center -ml-2 text-black active:scale-95 transition-transform cursor-pointer z-10"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AfriGuideLogoBadge size="normal" />
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center max-w-[380px] mx-auto py-2">
        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-black text-black tracking-tight leading-[1.1] mb-2">
            Verify Code
          </h1>
          <p className="text-stone-700 text-[14.5px] font-normal leading-snug">
            Please enter the 4-digit code sent to
          </p>
          <p className="text-[#E8622A] font-bold text-[15.5px] leading-snug mt-0.5 tracking-wide break-all">
            {email || phoneNumber}
          </p>
        </div>

        {/* 4-Digit OTP Code Inputs */}
        <form onSubmit={handleVerify} className="w-full flex flex-col items-center">
          <div className="flex justify-center gap-3.5 sm:gap-4 mb-8 w-full">
            {code.map((digit, index) => (
              <div
                key={index}
                className="relative w-[58px] h-[64px]"
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-full h-full text-center text-[24px] font-bold rounded-[16px] border-2 border-black bg-white text-black outline-none focus:ring-2 focus:ring-black/15 transition-all shadow-2xs select-none font-mono"
                />
                {!digit && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
                    <span className="w-4 h-[2.5px] bg-black rounded-full block" />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Resend Section */}
          <div className="text-center mb-8">
            <p className="text-[13.5px] text-stone-800 font-normal">
              Didn&apos;t receive OTP?
            </p>
            <button
              type="button"
              onClick={handleResend}
              className="text-[14px] font-bold text-black underline underline-offset-3 hover:text-[#E8622A] transition-colors cursor-pointer mt-0.5 inline-block"
            >
              resend code
            </button>
          </div>

          {/* Verify Account CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-[26px] bg-[#1E3F32] hover:bg-[#163325] active:scale-[0.98] text-white font-bold text-[16px] tracking-normal transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                <span>Verifying...</span>
              </>
            ) : (
              "Verify account"
            )}
          </button>
        </form>
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />
    </div>
  );
}

