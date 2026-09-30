"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  BookOpen,
  MessageSquare,
  Compass,
  ChevronRight,
  LogOut,
  Heart,
  Check,
  X,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";

export const DEFAULT_USER_AVATAR = "/images/user_avatar.png";

interface ProfileScreenProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  createdAt?: string;
  role?: "tourist" | "guide";
  onBack: () => void;
  onLogout?: () => void;
  onBecomeGuide?: () => void;
  onUpdateName?: (newName: string) => void;
  onUpdateAvatar?: (newAvatar: string) => void;
}

function formatJoinedDate(dateStr?: string): string {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    if (isNaN(d.getTime())) return "Joined September 2026";
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    return `Joined ${month} ${year}`;
  } catch {
    return "Joined September 2026";
  }
}

export function ProfileScreen({
  userName: initialName = "Gerald Chibanda",
  userEmail = "geraldgchibanda6025@gmail.com",
  avatarUrl: propAvatarUrl,
  createdAt,
  role = "tourist",
  onBack,
  onLogout,
  onBecomeGuide,
  onUpdateName,
  onUpdateAvatar,
}: ProfileScreenProps) {
  const [currentAvatar, setCurrentAvatar] = useState<string>(() => {
    if (propAvatarUrl && propAvatarUrl.trim()) return propAvatarUrl;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("afriguide_user_avatar");
      if (stored) return stored;
    }
    return DEFAULT_USER_AVATAR;
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCurrentAvatar(result);
          if (typeof window !== "undefined") {
            localStorage.setItem("afriguide_user_avatar", result);
          }
          onUpdateAvatar?.(result);
          showToast("Profile photo updated!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [currentName, setCurrentName] = useState<string>(() => {
    if (initialName && initialName.trim()) return initialName;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("afriguide_user_name");
      if (stored) return stored;
    }
    return "Gerald Chibanda";
  });

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(currentName);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const joinedText = formatJoinedDate(
    createdAt || (typeof window !== "undefined" ? localStorage.getItem("afriguide_account_created") || undefined : undefined)
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setCurrentName(trimmed);
    setIsEditingName(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("afriguide_user_name", trimmed);
    }
    onUpdateName?.(trimmed);
    showToast("Profile name updated successfully!");
  };

  return (
    <div className="relative w-full h-full min-h-full bg-[#FDFDFD] flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none">
      {/* ── Top iOS Status Bar (Null-safe) ── */}
      <IosStatusBar theme="dark" />

      {/* ── Header Bar ── */}
      <div className="relative w-full px-5 pt-3 pb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-black hover:bg-stone-100 active:scale-95 transition-transform cursor-pointer z-10"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h1 className="text-[20px] font-black text-black tracking-tight leading-tight">
            Profile
          </h1>
          <span className="text-[12.5px] font-medium text-stone-500 leading-tight capitalize">
            ({role === "tourist" ? "Tourist" : "Guide"})
          </span>
        </div>

        <div className="w-10" aria-hidden="true" />
      </div>

      {/* ── Main Scrollable Body ── */}
      <div className="flex-1 w-full px-5 pb-8 overflow-y-auto max-w-[430px] mx-auto">
        {/* 1. Profile Hero Card */}
        <div className="w-full bg-white rounded-[24px] p-5 border border-stone-100 shadow-[0_2px_14px_rgba(0,0,0,0.04)] flex flex-col items-center text-center mb-3.5">
          {/* Avatar with Edit Badge */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm bg-stone-100">
              <img
                src={currentAvatar}
                alt={currentName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Edit pencil badge to change avatar */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Change photo"
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-stone-200 shadow-xs flex items-center justify-center text-black hover:bg-stone-50 active:scale-90 transition-transform cursor-pointer -mr-1 -mb-1"
              title="Change profile picture"
            >
              <Pencil className="w-3 h-3 stroke-[2.4]" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* User Name (with inline edit) */}
          {isEditingName ? (
            <div className="flex items-center gap-2 mt-3 w-full max-w-[240px]">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                placeholder="Enter full name"
                className="w-full h-9 px-3 rounded-[12px] border border-[#1E3F32] text-[16px] font-bold text-black text-center focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="w-9 h-9 rounded-[10px] bg-[#1E3F32] text-white flex items-center justify-center shrink-0 active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="w-9 h-9 rounded-[10px] bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 active:scale-95"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setNameInput(currentName);
                setIsEditingName(true);
              }}
              className="flex items-center gap-1.5 mt-3 cursor-pointer group"
              title="Click to edit name"
            >
              <h2 className="text-[20px] font-black text-black tracking-tight group-hover:text-[#1E3F32] transition-colors">
                {currentName}
              </h2>
              <Pencil className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#1E3F32] transition-colors" />
            </div>
          )}

          {/* Tourist Status & Joined Date */}
          <div className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-stone-600 mt-1">
            <span className="capitalize">{role === "tourist" ? "Tourist" : "Guide"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{joinedText}</span>
          </div>

          {userEmail && (
            <span className="text-[12px] text-stone-400 font-normal mt-0.5">
              {userEmail}
            </span>
          )}
        </div>

        {/* 2. Stats Row (Tours taken & Reviews given) */}
        <div className="flex items-center gap-3 w-full mb-3.5">
          {/* Tours taken */}
          <div className="flex-1 bg-white rounded-[18px] p-3.5 border border-stone-100 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-800 shrink-0">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[14px] text-black">
              <span>Tours taken</span>
              <span className="text-[15px] font-black">3</span>
            </div>
          </div>

          {/* Reviews given */}
          <div className="flex-1 bg-white rounded-[18px] p-3.5 border border-stone-100 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-800 shrink-0">
              <div className="relative">
                <MessageSquare className="w-4 h-4 stroke-[2.2]" />
                <Heart className="w-2 h-2 text-rose-500 fill-rose-500 absolute -top-1 -right-1" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[14px] text-black">
              <span>Reviews given</span>
              <span className="text-[15px] font-black">12</span>
            </div>
          </div>
        </div>

        {/* 3. Become a Guide Card */}
        <div
          onClick={() => {
            if (onBecomeGuide) onBecomeGuide();
            else showToast("Apply to become an AfriGuide certified guide!");
          }}
          className="w-full bg-white rounded-[18px] p-3.5 border border-stone-100 flex items-center gap-3 shadow-2xs mb-5 cursor-pointer hover:bg-stone-50 active:scale-[0.99] transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-800 shrink-0">
            <Compass className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-bold text-[15px] text-black">
            Become a Guide
          </span>
        </div>

        {/* 4. Preferences Section */}
        <div className="w-full mb-5">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-2.5">
            Preferences
          </h3>

          <div className="bg-white rounded-[20px] border border-stone-100 divide-y divide-stone-100 overflow-hidden shadow-2xs">
            {/* Language */}
            <div
              onClick={() => showToast("Language set to English")}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
            >
              <span className="text-[15px] font-medium text-black">
                Language: English
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400 stroke-[2.4]" />
            </div>

            {/* Currency */}
            <div
              onClick={() => showToast("Currency set to USD ($)")}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
            >
              <span className="text-[15px] font-medium text-black">
                Currency: USD
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400 stroke-[2.4]" />
            </div>

            {/* Notifications */}
            <div
              onClick={() => showToast("Notifications settings")}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
            >
              <span className="text-[15px] font-medium text-black">
                Notifications
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400 stroke-[2.4]" />
            </div>
          </div>
        </div>

        {/* 5. Account Section */}
        <div className="w-full mb-6">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-2.5">
            Account
          </h3>

          <div className="bg-white rounded-[20px] border border-stone-100 divide-y divide-stone-100 overflow-hidden shadow-2xs">
            {/* Payment Methods */}
            <div
              onClick={() => showToast("Payment Methods: VISA & Mastercard saved")}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
            >
              <span className="text-[15px] font-medium text-black">
                Payment Methods
              </span>

              <div className="flex items-center gap-2">
                <span className="font-black italic tracking-tighter text-[#1A1F71] text-[15px] leading-none">
                  VISA
                </span>
                <div className="flex items-center -space-x-1.5 ml-0.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
                </div>
              </div>
            </div>

            {/* Security */}
            <div
              onClick={() => showToast("Security & Password settings")}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
            >
              <span className="text-[15px] font-medium text-black">
                Security
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400 stroke-[2.4]" />
            </div>

            {/* Help and support */}
            <div
              onClick={() => showToast("Connecting to AfriGuide Support...")}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
            >
              <span className="text-[15px] font-medium text-black">
                Help and support
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400 stroke-[2.4]" />
            </div>

            {/* Sign out */}
            <div
              onClick={() => {
                if (onLogout) {
                  onLogout();
                } else {
                  showToast("Signed out successfully.");
                }
              }}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-rose-50/50 transition-colors group"
            >
              <span className="text-[15px] font-bold text-[#E53935]">
                Sign out
              </span>

              <LogOut className="w-4 h-4 text-[#E53935] stroke-[2.4] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Optional Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-[13px] font-bold shadow-lg animate-in fade-in z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
