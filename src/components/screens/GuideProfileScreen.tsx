"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Pencil,
  Star,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  FileText,
  LogOut,
  Smartphone,
  Globe,
  Compass,
  Check,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";
import { uploadImageToSupabase, compressImage, updateProfileAvatar, getProfileAvatar } from "@/services/dbService";

interface GuideProfileScreenProps {
  onBack: () => void;
  guideName?: string;
  guideEmail?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  onSwitchToTourist?: () => void;
  onUpdateAvatar?: (newUrl: string) => void;
}

export function GuideProfileScreen({
  onBack,
  guideName = "Desire Sibanda",
  guideEmail = "desire.safari@afriguide.com",
  avatarUrl = "/images/desire_avatar.jpg",
  onLogout,
  onSwitchToTourist,
  onUpdateAvatar,
}: GuideProfileScreenProps) {
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const emailSpecific = guideEmail
        ? localStorage.getItem(`afriguide_user_avatar_${guideEmail.trim().toLowerCase()}`)
        : null;
      if (emailSpecific && emailSpecific.trim()) return emailSpecific;
      const stored = localStorage.getItem("afriguide_user_avatar");
      if (stored && stored.trim()) return stored;
    }
    return avatarUrl;
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  React.useEffect(() => {
    if (avatarUrl) {
      setCurrentAvatarUrl(avatarUrl);
    }
  }, [avatarUrl]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const compressed = await compressImage(file, 256, 256, 0.85);
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve((evt.target?.result as string) || "");
        reader.onerror = () => resolve("");
        reader.readAsDataURL(compressed);
      });

      let finalAvatar = dataUrl;
      try {
        const uploadedUrl = await uploadImageToSupabase(compressed, "afriguide-media");
        if (uploadedUrl && !uploadedUrl.startsWith("blob:")) {
          finalAvatar = uploadedUrl;
        }
      } catch (uploadErr) {
        console.warn("Storage upload notice (using data URL):", uploadErr);
      }

      if (finalAvatar) {
        setCurrentAvatarUrl(finalAvatar);
        if (guideEmail) {
          await updateProfileAvatar(guideEmail, finalAvatar);
        } else if (typeof window !== "undefined") {
          localStorage.setItem("afriguide_user_avatar", finalAvatar);
        }
        onUpdateAvatar?.(finalAvatar);
      }
    } catch (err) {
      console.warn("Avatar upload error:", err);
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };
  const [activeModal, setActiveModal] = useState<
    "bio" | "languages" | "skills" | "ecocash" | "card" | "history" | null
  >(null);

  // Editable bio state
  const [bioText, setBioText] = useState(
    "Licensed professional safari guide with over 10 years of experience leading expeditions across Victoria Falls, Hwange National Park, and Matobo Hills. Passionate about wildlife tracking, conservation, and authentic Zimbabwean culture."
  );
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(bioText);

  // EcoCash number
  const [ecocashNumber, setEcocashNumber] = useState("+263 78 413 8081");

  return (
    <div className="w-full h-full flex flex-col bg-[#F9FAF9] text-black relative select-none overflow-hidden">
      {/* iOS Status Bar */}
      <div className="px-5 pt-3 pb-1 shrink-0">
        <IosStatusBar />
      </div>

      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-2 shrink-0 relative">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to dashboard"
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
          <h1 className="text-[20px] font-black text-black tracking-tight leading-tight">
            Profile
          </h1>
          <span className="text-[12px] font-medium text-stone-500 leading-tight">
            (Guide)
          </span>
        </div>

        <div className="w-9 h-9" />
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-5 pt-2 pb-32 space-y-4 scrollbar-none">
        {/* Top Hero Guide Card */}
        <div className="w-full bg-white rounded-[24px] p-5 border border-stone-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col items-center">
          {/* Avatar with Edit Pencil */}
          <div className="relative">
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />

            <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-100 border-2 border-white shadow-md relative">
              <Image
                src={currentAvatarUrl}
                alt={guideName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
              />
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Edit avatar"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-700 hover:text-black cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          {/* Guide Full Name */}
          <h2 className="text-[18px] font-black text-black mt-3 leading-snug text-center">
            {guideName}
          </h2>

          {/* ZTA, ZIMPARKS & Verified Badge */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-stone-700">
              ZTA, ZIMPARKS
            </span>

            <div className="inline-flex items-center gap-1 bg-[#E8F2EC] text-[#1E3F32] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 fill-[#1E3F32] text-white" />
              <span>Verified</span>
            </div>
          </div>
        </div>

        {/* Stats Row: Ratings & Earned */}
        <div className="grid grid-cols-2 gap-3">
          {/* Ratings */}
          <div className="bg-white rounded-[20px] p-3.5 border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.02)] flex items-center gap-3">
            <Star className="w-5 h-5 text-stone-800 stroke-[1.8] shrink-0" />
            <div>
              <p className="text-[11.5px] font-medium text-stone-500 leading-tight">
                Ratings
              </p>
              <p className="text-[14.5px] font-black text-black leading-tight mt-0.5">
                4.6
              </p>
            </div>
          </div>

          {/* Earned */}
          <div className="bg-white rounded-[20px] p-3.5 border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.02)] flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-stone-800 stroke-[2] shrink-0" />
            <div className="min-w-0">
              <p className="text-[13.5px] font-black text-black leading-tight truncate">
                1.5K earned
              </p>
            </div>
          </div>
        </div>

        {/* Section: Profile */}
        <div>
          <h3 className="text-[18px] font-black text-black mb-2">Profile</h3>
          <div className="bg-white rounded-[20px] border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-stone-100">
            {/* Bio */}
            <button
              type="button"
              onClick={() => {
                setTempBio(bioText);
                setIsEditingBio(false);
                setActiveModal("bio");
              }}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span className="text-[13.5px] font-semibold text-stone-800">Bio</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Languages spoken */}
            <button
              type="button"
              onClick={() => setActiveModal("languages")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span className="text-[13.5px] font-semibold text-stone-800">Languages spoken</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Specialities and skills */}
            <button
              type="button"
              onClick={() => setActiveModal("skills")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span className="text-[13.5px] font-semibold text-stone-800">Specialities and skills</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Section: Payouts */}
        <div>
          <h3 className="text-[18px] font-black text-black mb-2">Payouts</h3>
          <div className="bg-white rounded-[20px] border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-stone-100">
            {/* Ecocash */}
            <button
              type="button"
              onClick={() => setActiveModal("ecocash")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span className="text-[13.5px] font-semibold text-stone-800">Ecocash</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Visa/Master Card */}
            <button
              type="button"
              onClick={() => setActiveModal("card")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span className="text-[13.5px] font-semibold text-stone-800">Visa/Master Card</span>
              <div className="flex items-center gap-1.5">
                {/* Visa Badge */}
                <span className="text-[11px] font-black italic tracking-tighter text-[#1A1F71] bg-stone-100 px-1.5 py-0.5 rounded font-serif">
                  VISA
                </span>
                {/* Mastercard Overlapping Circles */}
                <span className="flex items-center -space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] inline-block" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B]/90 inline-block" />
                </span>
              </div>
            </button>

            {/* History */}
            <button
              type="button"
              onClick={() => setActiveModal("history")}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <span className="text-[13.5px] font-semibold text-stone-800">History</span>
              <FileText className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Section: Account */}
        <div>
          <h3 className="text-[18px] font-black text-black mb-2">Account</h3>
          <div className="bg-white rounded-[20px] border border-stone-200/60 shadow-[0_1px_6px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-stone-100">
            {/* Switch to Tourist Mode */}
            {onSwitchToTourist && (
              <button
                type="button"
                onClick={onSwitchToTourist}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#1E3F32]" />
                  <span className="text-[13.5px] font-semibold text-stone-800">Switch to Tourist Mode</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            )}

            {/* Sign Out */}
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to log out of your guide account?")) {
                  if (onLogout) onLogout();
                }
              }}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-red-50/50 transition-colors cursor-pointer text-red-600"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span className="text-[13.5px] font-bold">Sign Out</span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Bio Modal */}
      {activeModal === "bio" && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <h3 className="text-[17px] font-black text-black">Guide Bio</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isEditingBio ? (
              <div className="space-y-3">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  rows={5}
                  className="w-full bg-stone-100 p-3.5 rounded-2xl text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-[#1E3F32] resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBioText(tempBio);
                      setIsEditingBio(false);
                    }}
                    className="flex-1 py-2.5 bg-[#1E3F32] text-white text-xs font-bold rounded-full cursor-pointer"
                  >
                    Save Bio
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(false)}
                    className="flex-1 py-2.5 bg-stone-100 text-stone-700 text-xs font-bold rounded-full cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                  {bioText}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingBio(true)}
                  className="w-full py-2.5 bg-[#1E3F32] hover:bg-[#163325] text-white text-xs font-bold rounded-full cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit Bio
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Languages Modal */}
      {activeModal === "languages" && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <h3 className="text-[17px] font-black text-black">Languages Spoken</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { lang: "English", level: "Fluent (Native)", flag: "🇬🇧" },
                { lang: "Shona", level: "Native speaker", flag: "🇿🇼" },
                { lang: "Ndebele", level: "Fluent", flag: "🇿🇼" },
                { lang: "French", level: "Conversational", flag: "🇫🇷" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{item.flag}</span>
                    <span className="font-bold text-black">{item.lang}</span>
                  </div>
                  <span className="font-medium text-stone-500">{item.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills Modal */}
      {activeModal === "skills" && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <h3 className="text-[17px] font-black text-black">Specialities & Skills</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Big 5 Wildlife Tracking",
                "Victoria Falls Gorge Walking",
                "Bush Survival & Wilderness First Aid",
                "Bird Watching & Ornithology",
                "Sunset Boat Cruise Navigation",
                "Shona & Ndebele Cultural Storytelling",
                "Photography Expeditions",
              ].map((skill, i) => (
                <span
                  key={i}
                  className="bg-[#EAF3EE] text-[#1E3F32] font-semibold text-xs px-3.5 py-1.5 rounded-full border border-emerald-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EcoCash Modal */}
      {activeModal === "ecocash" && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <h3 className="text-[17px] font-black text-black">EcoCash Payout Settings</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                Earnings from completed bookings will be deposited directly to your registered EcoCash wallet in USD or ZWG.
              </p>
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  EcoCash Mobile Number
                </label>
                <input
                  type="text"
                  value={ecocashNumber}
                  onChange={(e) => setEcocashNumber(e.target.value)}
                  className="w-full bg-stone-100 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  alert("EcoCash number updated successfully!");
                  setActiveModal(null);
                }}
                className="w-full py-2.5 bg-[#1E3F32] text-white text-xs font-bold rounded-full cursor-pointer"
              >
                Update EcoCash Wallet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {activeModal === "card" && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <h3 className="text-[17px] font-black text-black">Bank Card Payouts</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">AfriGuide Direct Payout</span>
                  <span className="font-black italic text-sm">VISA</span>
                </div>
                <p className="font-mono text-sm tracking-widest mb-2">•••• •••• •••• 4242</p>
                <div className="flex justify-between text-[11px] text-stone-300">
                  <span>DESIRE SIBANDA</span>
                  <span>EXP 08/28</span>
                </div>
              </div>
              <p className="text-xs text-stone-500">Card is active and verified for international guide settlements.</p>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {activeModal === "history" && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <h3 className="text-[17px] font-black text-black">Payout History</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { date: "April 12, 2026", amount: "$340.00", method: "EcoCash", ref: "TXN_782910" },
                { date: "April 05, 2026", amount: "$480.00", method: "Visa Direct", ref: "TXN_781102" },
                { date: "March 28, 2026", amount: "$220.00", method: "EcoCash", ref: "TXN_779341" },
                { date: "March 20, 2026", amount: "$460.00", method: "EcoCash", ref: "TXN_774129" },
              ].map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-200/60"
                >
                  <div>
                    <p className="font-bold text-black">{tx.amount}</p>
                    <p className="text-[11px] text-stone-500">{tx.date} • {tx.method}</p>
                  </div>
                  <span className="text-[10.5px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
