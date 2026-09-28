"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { IosHomeIndicator } from "../IosStatusBar";
import { AfriGuideLogoBadge } from "../AfriGuideLogo";

interface SignInScreenProps {
  initialEmail?: string;
  onBack?: () => void;
  onSignUp?: () => void;
  onForgotPassword?: () => void;
  onLogin?: (data: { email: string; password: string }) => void;
}

// Apple Brand Icon
function AppleIcon() {
  return (
    <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.02-.49 2.64-1.24z" />
    </svg>
  );
}

// Facebook Brand Icon
function FacebookIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M14.5 12.5H12.7V18H10.4V12.5H9.3V10.5H10.4V9.2C10.4 8.2 10.9 6.7 13 6.7L14.8 6.7V8.6H13.5C13.1 8.6 12.7 8.8 12.7 9.4V10.5H14.8L14.5 12.5Z"
        fill="white"
      />
    </svg>
  );
}

// Google Brand Icon
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function SignInScreen({
  initialEmail = "",
  onBack,
  onSignUp,
  onForgotPassword,
  onLogin,
}: SignInScreenProps) {
  const [email, setEmail] = useState<string>(initialEmail);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.({ email, password });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FDFDFD] flex flex-col justify-between overflow-x-hidden px-5 pt-3 pb-3 select-none">
      {/* Top Header Bar with Back Arrow and Centered AfriGuide Logo Badge */}
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
        <div className="text-center mb-6">
          <h1 className="text-[32px] font-black text-black tracking-tight leading-[1.1] mb-2">
            Welcome back
          </h1>
          <p className="text-stone-700 text-[15px] font-normal leading-snug">
            Sign In to continue your curated<br />African journey
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-[14px] font-bold text-black mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@email.com"
              className="w-full px-4 py-3.5 rounded-[16px] bg-white border border-stone-200/90 text-stone-900 placeholder:text-stone-400 text-[15px] focus:outline-none focus:border-[#1E3F32] focus:ring-1 focus:ring-[#1E3F32] transition-colors font-sans shadow-2xs"
            />
          </div>

          {/* Password with Eye toggle */}
          <div className="flex flex-col">
            <label className="text-[14px] font-bold text-black mb-1.5">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3.5 pr-12 rounded-[16px] bg-white border border-stone-200/90 text-stone-900 placeholder:text-stone-400 text-[15px] focus:outline-none focus:border-[#1E3F32] focus:ring-1 focus:ring-[#1E3F32] transition-colors font-sans shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-700 hover:text-black cursor-pointer p-1"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 stroke-[2]" />
                ) : (
                  <EyeOff className="w-5 h-5 stroke-[2]" />
                )}
              </button>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[#E8622A] text-[13.5px] font-bold hover:underline cursor-pointer"
              >
                Forgot password
              </button>
            </div>
          </div>

          {/* Login CTA Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-[22px] bg-[#1E3F32] hover:bg-[#163325] active:scale-[0.98] text-white font-bold text-[16px] tracking-normal transition-all cursor-pointer shadow-sm text-center mt-3"
          >
            Login
          </button>
        </form>

        {/* Divider: or Sign up with */}
        <div className="flex items-center gap-3 w-full my-5">
          <div className="h-[1px] bg-stone-200/90 flex-1" />
          <span className="text-[13px] text-stone-700 font-medium">
            or Sign up with
          </span>
          <div className="h-[1px] bg-stone-200/90 flex-1" />
        </div>

        {/* Social Login Buttons: Apple, Facebook, Google */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <button
            type="button"
            aria-label="Sign in with Apple"
            className="h-[52px] rounded-[18px] bg-white border border-stone-200/80 flex items-center justify-center hover:bg-stone-50 active:scale-[0.97] transition-all cursor-pointer shadow-2xs"
          >
            <AppleIcon />
          </button>
          <button
            type="button"
            aria-label="Sign in with Facebook"
            className="h-[52px] rounded-[18px] bg-white border border-stone-200/80 flex items-center justify-center hover:bg-stone-50 active:scale-[0.97] transition-all cursor-pointer shadow-2xs"
          >
            <FacebookIcon />
          </button>
          <button
            type="button"
            aria-label="Sign in with Google"
            className="h-[52px] rounded-[18px] bg-white border border-stone-200/80 flex items-center justify-center hover:bg-stone-50 active:scale-[0.97] transition-all cursor-pointer shadow-2xs"
          >
            <GoogleIcon />
          </button>
        </div>

        {/* Sign Up Link Footer */}
        <div className="text-center mt-6 mb-1 text-[13.5px] text-stone-800">
          Don’t have an account ?{" "}
          <button
            type="button"
            onClick={onSignUp}
            className="text-[#E8622A] font-semibold hover:underline cursor-pointer ml-1 inline-block"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />
    </div>
  );
}
