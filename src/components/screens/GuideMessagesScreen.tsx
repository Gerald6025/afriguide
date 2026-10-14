"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  sendMessageToDb,
  getMessagesFromDb,
  subscribeToRealtimeMessages,
  DbMessage,
} from "@/services/dbService";
import {
  ArrowLeft,
  Search,
  Mic,
  Phone,
  Video,
  Send,
  X,
  Camera,
  Paperclip,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online?: boolean;
}

const DEFAULT_CHATS: ChatThread[] = [
  {
    id: "chat_dianne_russell",
    name: "Dianne Russell",
    avatar: "/images/user_avatar.png",
    lastMessage: "Hey man thanks again for the tour it was super amazing will be sure to leave a.....",
    time: "11:00",
    unreadCount: 0,
    online: true,
  },
  {
    id: "chat_eleanor_pena",
    name: "Eleanor Pena",
    avatar: "/images/user_avatar.png",
    lastMessage: "Hey man thanks again for the tour it was super amazing will be sure to leave a.....",
    time: "11:00",
    unreadCount: 0,
    online: true,
  },
  {
    id: "chat_kristin_watson",
    name: "Kristin Watson",
    avatar: "/images/user_avatar.png",
    lastMessage: "Welcome to Zimbabwe! Excited to guide your upcoming adventure.",
    time: "10:30",
    unreadCount: 1,
    online: true,
  },
  {
    id: "chat_desire_sibanda",
    name: "Desire Sibanda",
    avatar: "/images/desire_avatar.jpg",
    lastMessage: "Looking forward to showing you the Victoria Falls and safari wildlife!",
    time: "09:45",
    unreadCount: 1,
    online: true,
  },
];

interface GuideMessagesScreenProps {
  onBack: () => void;
  avatarUrl?: string;
  guideName?: string;
  initialChatWith?: string;
}

export function GuideMessagesScreen({
  onBack,
  avatarUrl = "/images/desire_avatar.jpg",
  guideName = "Desire",
  initialChatWith,
}: GuideMessagesScreenProps) {
  const [chats, setChats] = useState<ChatThread[]>(DEFAULT_CHATS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState<ChatThread | null>(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Record<string, Array<{ id: string; text: string; sender: "me" | "them"; time: string }>>
  >({
    chat_dianne_russell: [
      { id: "1", text: "Hi! We loved the Victoria Falls sunset walking tour.", sender: "them", time: "10:55" },
      { id: "2", text: "It was an absolute pleasure hosting your group!", sender: "me", time: "10:58" },
      { id: "3", text: "Hey thanks again for the tour it was super amazing!", sender: "them", time: "11:00" },
    ],
    chat_kristin_watson: [
      { id: "1", text: "Hello! Welcome to Zimbabwe, ready for your safari?", sender: "them", time: "10:30" },
    ],
    chat_desire_sibanda: [
      { id: "1", text: "Welcome! Feel free to ask any questions about pick-up and timing.", sender: "them", time: "09:45" },
    ],
  });

  // Load message history from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialMessages() {
      try {
        const dbMsgs = await getMessagesFromDb();
        if (!isMounted || !dbMsgs || dbMsgs.length === 0) return;

        const messagesByChat: Record<
          string,
          Array<{ id: string; text: string; sender: "me" | "them"; time: string }>
        > = {};
        const threadsMap: Record<string, ChatThread> = {};

        dbMsgs.forEach((m) => {
          const isMe = m.sender_name.trim().toLowerCase() === guideName.trim().toLowerCase();
          const counterpart = isMe ? m.receiver_name : m.sender_name;
          const counterpartAvatar = isMe ? "/images/user_avatar.png" : (m.sender_avatar || "/images/user_avatar.png");
          const chatId = `chat_${counterpart.trim().toLowerCase().replace(/\s+/g, "_")}`;
          const msgTime = new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          if (!messagesByChat[chatId]) {
            messagesByChat[chatId] = [];
          }
          messagesByChat[chatId].push({
            id: m.id,
            text: m.content,
            sender: isMe ? "me" : "them",
            time: msgTime,
          });

          threadsMap[chatId] = {
            id: chatId,
            name: counterpart,
            avatar: counterpartAvatar,
            lastMessage: m.content,
            time: msgTime,
            unreadCount: isMe ? 0 : 0,
            online: true,
          };
        });

        const liveThreads = Object.values(threadsMap);
        setChats((prev) => {
          const merged = [
            ...liveThreads,
            ...prev.filter((c) => !liveThreads.some((lt) => lt.name.toLowerCase() === c.name.toLowerCase())),
          ];
          return merged;
        });

        setChatMessages((prev) => ({
          ...prev,
          ...messagesByChat,
        }));
      } catch (err) {
        console.warn("Failed to load live messages:", err);
      }
    }

    loadInitialMessages();

    // Subscribe to Realtime messages from Supabase
    const unsubscribe = subscribeToRealtimeMessages((newDbMsg) => {
      const isMe = newDbMsg.sender_name.trim().toLowerCase() === guideName.trim().toLowerCase();
      const counterpart = isMe ? newDbMsg.receiver_name : newDbMsg.sender_name;
      const counterpartAvatar = isMe ? "/images/user_avatar.png" : (newDbMsg.sender_avatar || "/images/user_avatar.png");
      const chatId = `chat_${counterpart.trim().toLowerCase().replace(/\s+/g, "_")}`;
      const msgTime = new Date(newDbMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const newMsgItem = {
        id: newDbMsg.id,
        text: newDbMsg.content,
        sender: (isMe ? "me" : "them") as "me" | "them",
        time: msgTime,
      };

      setChatMessages((prev) => {
        const existing = prev[chatId] || [];
        if (existing.some((m) => m.id === newDbMsg.id)) return prev;
        return {
          ...prev,
          [chatId]: [...existing, newMsgItem],
        };
      });

      setChats((prev) => {
        const exists = prev.some((c) => c.id === chatId);
        if (exists) {
          return prev.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  lastMessage: newDbMsg.content,
                  time: msgTime,
                  unreadCount: !isMe ? c.unreadCount + 1 : c.unreadCount,
                }
              : c
          );
        } else {
          return [
            {
              id: chatId,
              name: counterpart,
              avatar: counterpartAvatar,
              lastMessage: newDbMsg.content,
              time: msgTime,
              unreadCount: isMe ? 0 : 1,
              online: true,
            },
            ...prev,
          ];
        }
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [guideName]);

  // Open initialChatWith if requested
  useEffect(() => {
    if (initialChatWith && initialChatWith.trim()) {
      const targetName = initialChatWith.trim();
      const chatId = `chat_${targetName.toLowerCase().replace(/\s+/g, "_")}`;
      const existing = chats.find((c) => c.name.toLowerCase() === targetName.toLowerCase());
      if (existing) {
        setActiveChat(existing);
      } else {
        const newThread: ChatThread = {
          id: chatId,
          name: targetName,
          avatar: "/images/desire_avatar.jpg",
          lastMessage: "Hello! Looking forward to guiding your tour.",
          time: "Just now",
          unreadCount: 0,
          online: true,
        };
        setChats((prev) => [newThread, ...prev]);
        setActiveChat(newThread);
      }
    }
  }, [initialChatWith]);

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenChat = (chat: ChatThread) => {
    // Mark as read
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
    setActiveChat(chat);
  };

  const handleSendMessage = async () => {
    if (!typedMessage.trim() || !activeChat) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const content = typedMessage.trim();
    const tempId = `msg_${Date.now()}`;
    const newMsg = {
      id: tempId,
      text: content,
      sender: "me" as const,
      time: now,
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
    }));

    // Update last message in thread
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id ? { ...c, lastMessage: content, time: now } : c
      )
    );

    setTypedMessage("");

    try {
      const sent = await sendMessageToDb({
        sender_name: guideName,
        sender_avatar: avatarUrl,
        receiver_name: activeChat.name,
        content,
      });

      if (sent) {
        setChatMessages((prev) => ({
          ...prev,
          [activeChat.id]: (prev[activeChat.id] || []).map((m) =>
            m.id === tempId ? { ...m, id: sent.id } : m
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to send message to Supabase:", err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white text-black relative select-none overflow-hidden">
      {/* iOS Status Bar */}
      <div className="px-5 pt-3 pb-1 shrink-0">
        <IosStatusBar />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-2 shrink-0 relative">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to dashboard"
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-[20px] font-black text-black tracking-tight text-center absolute left-1/2 -translate-x-1/2">
          Chats
        </h1>

        {/* Guide Avatar on Top Right (Exact Mockup Match) */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-stone-200 border border-stone-200/80 shadow-xs">
          <Image
            src={avatarUrl}
            alt={guideName}
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Rounded Pill Search Bar with Mic Icon (Exact Mockup Match) */}
      <div className="px-5 py-2.5 shrink-0">
        <div className="w-full bg-[#F8F9F8] rounded-full px-4 py-3 border border-stone-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Search className="w-4 h-4 text-stone-400 stroke-[2] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations"
              className="w-full bg-transparent text-sm font-medium text-stone-800 placeholder:text-stone-400 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => alert("Voice search activated")}
            aria-label="Voice search"
            className="text-stone-500 hover:text-black cursor-pointer p-0.5 shrink-0"
          >
            <Mic className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-32 divide-y divide-stone-100 scrollbar-none">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleOpenChat(chat)}
            className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/70 transition-colors active:bg-stone-100/60 rounded-2xl px-1"
          >
            {/* Avatar & Message Content */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {/* Traveler Avatar */}
              <div className="w-13 h-13 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative">
                <Image
                  src={chat.avatar}
                  alt={chat.name}
                  width={52}
                  height={52}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name & Snippet */}
              <div className="min-w-0 flex-1 pr-2">
                <h3 className="text-[15.5px] font-black text-black leading-snug">
                  {chat.name}
                </h3>
                <p className="text-[12.5px] text-stone-500 font-normal leading-snug line-clamp-2 mt-0.5">
                  {chat.lastMessage}
                </p>
              </div>
            </div>

            {/* Timestamp & Unread Badge (Exact Mockup Match) */}
            <div className="flex flex-col items-end shrink-0 gap-1 pl-1">
              <span className="text-[11.5px] font-semibold text-stone-900">
                {chat.time}
              </span>
              {chat.unreadCount > 0 ? (
                <div className="w-5 h-5 rounded-full bg-[#1B3D2F] text-white text-[11px] font-black flex items-center justify-center shadow-2xs">
                  {chat.unreadCount}
                </div>
              ) : (
                <div className="w-5 h-5" />
              )}
            </div>
          </div>
        ))}

        {filteredChats.length === 0 && (
          <div className="py-12 text-center text-stone-400 text-xs font-semibold">
            No conversations found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Active Chat Screen / Slide-in Drawer */}
      {activeChat && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-right duration-250">
          {/* iOS Status Bar in Chat */}
          <div className="px-5 pt-3 pb-1 shrink-0 bg-white">
            <IosStatusBar />
          </div>

          {/* Chat Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-stone-100 bg-white shadow-2xs shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveChat(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-100 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
              </button>

              <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 border border-stone-200">
                <Image
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-sm font-black text-black leading-tight">
                  {activeChat.name}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  Online
                </span>
              </div>
            </div>

            {/* Call / Video Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => alert(`Calling ${activeChat.name}...`)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <Phone className="w-4 h-4 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={() => alert(`Starting video call with ${activeChat.name}...`)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <Video className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F9FAF9]">
            {(chatMessages[activeChat.id] || [
              { id: "1", text: activeChat.lastMessage, sender: "them", time: activeChat.time },
            ]).map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "me" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                    msg.sender === "me"
                      ? "bg-[#1B3D2F] text-white rounded-br-none shadow-xs"
                      : "bg-white text-stone-900 border border-stone-200/70 rounded-bl-none shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3 bg-white border-t border-stone-100 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => alert("Upload photo or tour itinerary")}
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
              placeholder={`Message ${activeChat.name}...`}
              className="flex-1 bg-stone-100 px-4 py-2.5 rounded-full text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-[#1B3D2F]"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              className="w-9 h-9 rounded-full bg-[#1B3D2F] hover:bg-[#143226] text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
