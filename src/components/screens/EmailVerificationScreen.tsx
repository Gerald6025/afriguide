"use client";

import React, { useState } from "react";
import { Mail, X, ArrowLeft } from "lucide-react";
import { IosHomeIndicator } from "../IosStatusBar";
import { AfriGuideLogoBadge } from "../AfriGuideLogo";

interface EmailVerificationScreenProps {
  initialEmail?: string;
  onBack?: () => void;
  onSendCode?: (email: string) => void;
  onSignIn?: () => void;
  isLoading?: boolean;
}

export function EmailVerificationScreen({
  initialEmail = "",
  onBack,
  onSendCode,
  onSignIn,
  isLoading = false,
}: EmailVerificationScreenProps) {
  const [email, setEmail] = useState<string>(initialEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSendCode?.(email.trim());
  };

  const handleClear = () => {
    setEmail("");
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#FDFDFD] flex flex-col justify-between overflow-hidden px-4 sm:px-5 pt-1 pb-1 select-none">
      {/* Top Header Bar with Back Arrow and Centered AfriGuide Logo Badge */}
      <div className="relative flex items-center justify-between pt-1 pb-2 w-full min-h-[40px] shrink-0">
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
        <div className="text-center mb-7">
          <h1 className="text-[32px] font-black text-black tracking-tight leading-[1.1] mb-2">
            Lets get started
          </h1>
          <p className="text-stone-700 text-[14.5px] font-normal leading-snug max-w-[320px] mx-auto">
            Enter your email address, we will send you a 4-digit verification code there
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          {/* Email Input Field */}
          <div className="relative w-full h-[56px] mb-3">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
              <Mail className="w-5 h-5 stroke-[2]" />
            </div>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full h-full pl-12 pr-11 rounded-[18px] bg-[#F7F8F9] border border-stone-200/80 text-[16px] font-semibold text-black placeholder:text-stone-400 focus:outline-none focus:border-[#1E3F32] focus:ring-1 focus:ring-[#1E3F32] transition-colors shadow-2xs font-sans"
            />

            {email && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear email"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Already have an account ? Sign In */}
          <div className="mb-6 pl-0.5 text-[13.5px] text-stone-800">
            Already have an account ?{" "}
            <button
              type="button"
              onClick={onSignIn}
              className="text-[#E8622A] font-semibold hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>

          {/* Send Code CTA Button */}
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full py-4 rounded-[24px] bg-[#1E3F32] hover:bg-[#163325] active:scale-[0.98] disabled:opacity-50 text-white font-bold text-[16px] tracking-normal transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                <span>Sending code...</span>
              </>
            ) : (
              "Send code"
            )}
          </button>
        </form>
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />
    </div>
  );
}
