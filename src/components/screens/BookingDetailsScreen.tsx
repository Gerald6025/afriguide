"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Check,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  CreditCard,
  Car,
  Ticket,
  User,
  Coffee,
  CalendarCheck,
  MessageSquare,
  Send,
  X,
  Phone,
  Video,
  ExternalLink,
  Paperclip,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";
import { TourPreviewData } from "./TourPreviewScreen";
import { BookingDetails } from "./BookExperienceScreen";
import { PaymentInfo } from "./BookingRequestedScreen";
import {
  sendMessageToDb,
  getMessagesFromDb,
  subscribeToRealtimeMessages,
} from "@/services/dbService";

interface BookingDetailsScreenProps {
  tour?: TourPreviewData;
  bookingDetails?: BookingDetails;
  paymentInfo?: PaymentInfo;
  currentUserName?: string;
  currentUserAvatar?: string;
  currentUserEmail?: string;
  onBack: () => void;
  onMessageGuide?: (guideName?: string) => void;
}

export function BookingDetailsScreen({
  tour: propTour,
  bookingDetails,
  paymentInfo,
  currentUserName = "Traveler",
  currentUserAvatar = "/images/user_avatar.png",
  currentUserEmail,
  onBack,
  onMessageGuide,
}: BookingDetailsScreenProps) {
  const activeTour = bookingDetails?.tour || propTour;

  const tourTitle = activeTour?.title || "Hwange Elephant Walk";
  const location = activeTour?.location || "Hwange National Park";
  const imageUrl = activeTour?.imageUrl || "/images/experience_elephant.jpg";
  const pricePerPerson = activeTour?.pricePerPerson || 80;
  const guestCount = bookingDetails?.peopleCount || 4;
  const tourDate = bookingDetails?.date || "Tuesday, 22 July, 2026";
  const bookingId = "#VVF -7843957";
  const guideName = activeTour?.guideName || "Desire Sibanda";
  const guideAvatar =
    guideName.toLowerCase().includes("desire")
      ? "/images/desire_avatar.jpg"
      : "/images/user_avatar.png";

  const totalCharged = paymentInfo?.totalAmount
    ? `$${paymentInfo.totalAmount}`
    : bookingDetails?.totalPrice
    ? `$${bookingDetails.totalPrice + 12 + 15 * guestCount}`
    : `$${pricePerPerson * guestCount + 12 + 15 * guestCount}`;

  const [calendarAdded, setCalendarAdded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-Screen Live Chat State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; text: string; sender: "me" | "them"; time: string }>
  >([
    {
      id: "welcome_1",
      text: `Hello! I am ${guideName}, your guide for the ${tourTitle}. Feel free to ask me anything about departure time, pickup point, or what to bring!`,
      sender: "them",
      time: "10:00 AM",
    },
  ]);

  // Load live messages from Supabase when chat is opened
  useEffect(() => {
    if (!isChatOpen) return;

    let isMounted = true;
    async function loadChat() {
      try {
        const dbMsgs = await getMessagesFromDb();
        if (!isMounted || !dbMsgs || dbMsgs.length === 0) return;

        const myName = (currentUserName || "").trim().toLowerCase();
        const myEmail = (currentUserEmail || "").trim().toLowerCase();
        const gName = (guideName || "").trim().toLowerCase();

        const relevant = dbMsgs.filter((m) => {
          const sName = (m.sender_name || "").trim().toLowerCase();
          const rName = (m.receiver_name || "").trim().toLowerCase();

          const isFromMeToGuide =
            (sName === myName || (myEmail && sName === myEmail)) &&
            (rName.includes(gName) || gName.includes(rName));
          const isFromGuideToMe =
            (sName.includes(gName) || gName.includes(sName)) &&
            (rName === myName || (myEmail && rName === myEmail));

          return isFromMeToGuide || isFromGuideToMe;
        });

        if (relevant.length > 0) {
          setChatMessages((prev) => {
            const welcomeMsgs = prev.filter((m) => m.id.startsWith("welcome_"));
            const dbMsgsFormatted = relevant.map((m) => {
              const sName = (m.sender_name || "").trim().toLowerCase();
              const isMe = sName === myName || (myEmail && sName === myEmail);
              return {
                id: m.id,
                text: m.content,
                sender: (isMe ? "me" : "them") as "me" | "them",
                time: new Date(m.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              };
            });
            const all = [...welcomeMsgs, ...dbMsgsFormatted];
            const seen = new Set<string>();
            return all.filter((m) => {
              if (seen.has(m.id)) return false;
              seen.add(m.id);
              return true;
            });
          });
        }
      } catch (err) {
        console.warn("Could not load booking chat history:", err);
      }
    }

    loadChat();

    const unsubscribe = subscribeToRealtimeMessages((newMsg) => {
      const myName = (currentUserName || "").trim().toLowerCase();
      const myEmail = (currentUserEmail || "").trim().toLowerCase();
      const gName = (guideName || "").trim().toLowerCase();
      const sName = (newMsg.sender_name || "").trim().toLowerCase();
      const rName = (newMsg.receiver_name || "").trim().toLowerCase();

      const isForMe =
        (rName === myName || (myEmail && rName === myEmail)) &&
        (sName.includes(gName) || gName.includes(sName));

      if (isForMe) {
        playChime();
        setChatMessages((prev) => {
          if (
            prev.some(
              (m) =>
                m.id === newMsg.id ||
                (m.sender === "them" && m.text === newMsg.content)
            )
          ) {
            return prev;
          }
          return [
            ...prev,
            {
              id: newMsg.id,
              text: newMsg.content,
              sender: "them",
              time: new Date(newMsg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ];
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isChatOpen, currentUserName, currentUserEmail, guideName, tourTitle]);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio playback restrictions fallback
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || typedMessage).trim();
    if (!content || isSending) return;

    setIsSending(true);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const tempId = `msg_${Date.now()}`;

    const newMsg = {
      id: tempId,
      text: content,
      sender: "me" as const,
      time: now,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setTypedMessage("");
    playChime();

    try {
      await sendMessageToDb({
        sender_name: currentUserName || "Traveler",
        sender_avatar: currentUserAvatar || "/images/user_avatar.png",
        receiver_name: guideName,
        content,
      });
    } catch (err) {
      console.warn("Notice: Saved message locally:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleAddToCalendar = () => {
    setCalendarAdded(true);
    setToastMessage("Added to your device calendar!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMessage = () => {
    setIsChatOpen(true);
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

        <h1 className="absolute inset-0 flex items-center justify-center pointer-events-none text-[20px] font-black text-black tracking-tight">
          Booking details
        </h1>

        <div className="w-10" aria-hidden="true" />
      </div>

      {/* ── Main Scrollable Body ── */}
      <div className="flex-1 w-full px-5 pb-24 overflow-y-auto max-w-[430px] mx-auto">
        {/* 1. Status & Booking ID Card */}
        <div className="w-full bg-[#F8F9FA] rounded-[18px] p-3.5 border border-stone-200/70 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#1E3F32] flex items-center justify-center text-white shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-[15px] font-black text-black leading-tight">
                Confirmed
              </h2>
              <p className="text-stone-500 text-[12px] leading-tight mt-0.5">
                This booking was confirmed
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[12.5px] font-bold text-black leading-tight">
              Booking ID
            </div>
            <div className="text-[#E27D33] font-bold text-[13.5px] tracking-tight leading-tight mt-0.5">
              {bookingId}
            </div>
          </div>
        </div>

        {/* 2. Tour Experience Section */}
        <div className="w-full mb-5">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-3">
            Tour experience
          </h3>

          <div className="w-full bg-white rounded-[20px] p-3.5 border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] flex items-center gap-3.5">
            <div className="relative w-[110px] h-[85px] rounded-[16px] overflow-hidden shrink-0 bg-stone-100">
              <Image
                src={imageUrl}
                alt={tourTitle}
                fill
                className="object-cover"
                sizes="110px"
                unoptimized
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
              <h4 className="text-[16px] font-black text-black tracking-tight leading-snug truncate">
                {tourTitle}
              </h4>

              <div className="flex items-center gap-1.5 text-stone-600 text-[12.5px] font-medium truncate">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span className="truncate">{location}</span>
              </div>

              <div className="flex items-center gap-1.5 text-stone-600 text-[12.5px] font-medium">
                <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>July 22, 2026</span>
              </div>

              <div className="flex items-center gap-1.5 text-stone-600 text-[12.5px] font-medium">
                <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>{guestCount} Guests</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Booking Information Section */}
        <div className="w-full mb-5">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-3">
            Booking information
          </h3>

          <div className="w-full bg-[#F9FAFB] rounded-[20px] p-2 border border-stone-100 divide-y divide-stone-200/60">
            {/* Row 1: Tour Date */}
            <div className="flex items-center gap-3.5 p-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                <Calendar className="w-4 h-4 text-stone-800 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-bold text-black leading-tight">
                  {tourDate}
                </div>
                <div className="text-stone-500 text-[12px] leading-tight mt-0.5">
                  Tour date
                </div>
              </div>
            </div>

            {/* Row 2: Guests */}
            <div className="flex items-center gap-3.5 p-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                <Users className="w-4 h-4 text-stone-800 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-bold text-black leading-tight">
                  {guestCount} Guests
                </div>
              </div>
            </div>

            {/* Row 3: Tour Title & Park */}
            <div className="flex items-center gap-3.5 p-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                <MapPin className="w-4 h-4 text-stone-800 stroke-[2.2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-bold text-black leading-tight truncate">
                  {tourTitle}
                </div>
                <div className="text-stone-500 text-[12px] leading-tight mt-0.5 truncate">
                  {location}
                </div>
              </div>
            </div>

            {/* Row 4: Total Amount */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                  <DollarSign className="w-4 h-4 text-stone-800 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-bold text-black leading-tight">
                    Total amount
                  </div>
                  <div className="text-stone-500 text-[12px] leading-tight mt-0.5">
                    ${pricePerPerson}/person ({guestCount} {guestCount === 1 ? "guest" : "guests"})
                  </div>
                </div>
              </div>

              <span className="text-[17px] font-black text-black tracking-tight">
                {totalCharged}
              </span>
            </div>

            {/* Row 5: Payment Method */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-2xs shrink-0">
                  <CreditCard className="w-4 h-4 text-stone-800 stroke-[2.2]" />
                </div>
                <div className="text-[14.5px] font-bold text-black leading-tight">
                  Payment Method
                </div>
              </div>

              {paymentInfo?.method === "ecocash" ? (
                <div className="flex items-center gap-1.5 font-bold text-[14px]">
                  <span className="text-[#0284C7] font-black">Eco</span>
                  <span className="text-[#E11D48] font-black">Cash</span>
                  <span className="text-[12px] text-stone-500 font-medium">(Mobile)</span>
                </div>
              ) : paymentInfo?.method === "cash" ? (
                <span className="text-[13px] font-bold text-black">
                  Cash / Local
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-black italic tracking-tighter text-[#1A1F71] text-[15px] leading-none">
                    VISA
                  </span>
                  <span className="text-[13px] font-bold text-black">
                    •••• 4346
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. What's Included Section */}
        <div className="w-full mb-3">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-3">
            What’s included
          </h3>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {/* Transportation */}
            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4 text-stone-800 stroke-[2.2] shrink-0" />
              <span className="text-[14px] font-bold text-black">
                Transportation
              </span>
            </div>

            {/* Park fees */}
            <div className="flex items-center gap-2.5">
              <Ticket className="w-4 h-4 text-stone-800 stroke-[2.2] shrink-0" />
              <span className="text-[14px] font-bold text-black">
                Park fees
              </span>
            </div>

            {/* Professional guide */}
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-stone-800 stroke-[2.2] shrink-0" />
              <span className="text-[14px] font-bold text-black">
                Professional guide
              </span>
            </div>

            {/* Food & Water */}
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-stone-800 stroke-[2.2] shrink-0" />
              <span className="text-[14px] font-bold text-black">
                Food & Water
              </span>
            </div>
          </div>
        </div>

        {/* Optional Toast Notice */}
        {toastMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-[14px] text-center text-[13px] font-bold text-emerald-800 animate-in fade-in duration-200">
            {toastMessage}
          </div>
        )}
      </div>

      {/* ── Fixed Bottom Actions Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-100 flex justify-center">
        <div className="w-full max-w-[430px] px-5 py-3.5 flex items-center gap-3">
          <button
            type="button"
            onClick={handleMessage}
            className="flex-1 h-[52px] rounded-[28px] border-[1.5px] border-[#1E3F32] bg-white hover:bg-stone-50 active:scale-95 text-[#1E3F32] font-bold text-[15px] tracking-tight transition-all flex items-center justify-center cursor-pointer"
          >
            Message Guide
          </button>

          <button
            type="button"
            onClick={handleAddToCalendar}
            className="flex-1 h-[52px] rounded-[28px] bg-[#1E3F32] hover:bg-[#163026] active:scale-95 text-white font-bold text-[15px] tracking-tight transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {calendarAdded ? (
              <>
                <CalendarCheck className="w-4 h-4 stroke-[2.4]" />
                <span>Added</span>
              </>
            ) : (
              <span>Add to calendar</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Slide-In Live Guide Chat Drawer ── */}
      {isChatOpen && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-right duration-250 select-none">
          {/* iOS Status Bar in Chat */}
          <div className="px-5 pt-3 pb-1 shrink-0 bg-white">
            <IosStatusBar theme="light" />
          </div>

          {/* Chat Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100 bg-white shadow-2xs shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                aria-label="Back to booking details"
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-100 active:scale-95 transition-transform cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
              </button>

              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                <Image
                  src={guideAvatar}
                  alt={guideName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-black text-black leading-tight truncate">
                  {guideName}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
                  Your Guide • Online
                </span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {onMessageGuide && (
                <button
                  type="button"
                  onClick={() => {
                    setIsChatOpen(false);
                    onMessageGuide(guideName);
                  }}
                  title="Open in Messages inbox"
                  className="px-2 py-1 text-[11px] font-bold text-[#1E3F32] bg-[#E6EEEA] hover:bg-[#d8e4df] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Inbox</span>
                  <ExternalLink className="w-3 h-3 stroke-[2.2]" />
                </button>
              )}
              <button
                type="button"
                onClick={() => alert(`Calling guide ${guideName}...`)}
                aria-label="Call guide"
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <Phone className="w-4 h-4 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={() => alert(`Starting video call with guide ${guideName}...`)}
                aria-label="Video call guide"
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <Video className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Tour Context Micro-Banner */}
          <div className="px-4 py-2 bg-[#F6F8F6] border-b border-stone-200/60 flex items-center justify-between text-xs text-stone-600 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-black truncate">{tourTitle}</span>
              <span>•</span>
              <span className="text-stone-500 shrink-0">{tourDate}</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#1E3F32] bg-white px-2 py-0.5 rounded-full border border-stone-200/80 shrink-0">
              {guestCount} Guests
            </span>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-stone-100 shrink-0">
            {[
              "Where is the pickup spot?",
              "What should I bring?",
              "Is water provided?",
              "Can we adjust time?",
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9FAF9]">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "me" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    msg.sender === "me"
                      ? "bg-[#1E3F32] text-white rounded-br-none shadow-xs"
                      : "bg-white text-stone-900 border border-stone-200/80 rounded-bl-none shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3 bg-white border-t border-stone-100 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => alert("Photo / file attachment coming soon")}
              aria-label="Attach file or photo"
              className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-black cursor-pointer"
            >
              <Paperclip className="w-4 h-4 stroke-[2]" />
            </button>

            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder={`Message ${guideName}...`}
              className="flex-1 bg-stone-100 px-4 py-2.5 rounded-full text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-[#1E3F32] transition-all text-black"
            />

            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!typedMessage.trim() || isSending}
              aria-label="Send message"
              className="w-9 h-9 rounded-full bg-[#1E3F32] hover:bg-[#163026] active:scale-95 disabled:opacity-40 text-white flex items-center justify-center shadow-xs cursor-pointer transition-all"
            >
              <Send className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
