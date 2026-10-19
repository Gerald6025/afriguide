"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  getToursFromDb,
  createTourInDb,
  updateTourInDb,
  deleteTourFromDb,
} from "@/services/dbService";
import {
  ArrowLeft,
  Award,
  Clock,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";

export interface TourItem {
  id: string;
  title: string;
  pricePerPerson: number;
  duration: string;
  status: "Active" | "Draft";
  image: string;
}

interface GuideToursScreenProps {
  onBack: () => void;
  avatarUrl?: string;
  guideName?: string;
  onAddNewTour?: () => void;
}

const DEFAULT_TOURS: TourItem[] = [
  {
    id: "tour_1",
    title: "Victoria Falls Rainforest & Gorge Walk",
    pricePerPerson: 120,
    duration: "4 hours",
    status: "Active",
    image: "/images/zambezi_river_sunset.jpg",
  },
  {
    id: "tour_2",
    title: "Sunset Safari & Big 5 Tracking",
    pricePerPerson: 180,
    duration: "5 hours",
    status: "Active",
    image: "/images/safari_guide_elephants.jpg",
  },
  {
    id: "tour_3",
    title: "Livingstone Island & Devil's Pool",
    pricePerPerson: 210,
    duration: "3 hours",
    status: "Active",
    image: "/images/hero_giraffe.jpg",
  },
  {
    id: "tour_4",
    title: "Hwange Full-Day Elephant Expedition",
    pricePerPerson: 240,
    duration: "8 hours",
    status: "Active",
    image: "/images/experience_elephant.jpg",
  },
  {
    id: "tour_5",
    title: "Matobo Hills Rhino Expedition",
    pricePerPerson: 180,
    duration: "6 hours",
    status: "Active",
    image: "/images/experience_walking_guide.jpg",
  },
  {
    id: "tour_6",
    title: "Zambezi Canoe & Wildlife Safari",
    pricePerPerson: 150,
    duration: "4 hours",
    status: "Draft",
    image: "/images/zebras_safari.jpg",
  },
];

export function GuideToursScreen({
  onBack,
  avatarUrl = "/images/desire_avatar.jpg",
  guideName = "Desire",
  onAddNewTour,
}: GuideToursScreenProps) {
  const [tours, setTours] = useState<TourItem[]>(DEFAULT_TOURS);
  const [filter, setFilter] = useState<"all" | "active" | "drafts">("all");
  const [editingTour, setEditingTour] = useState<TourItem | null>(null);
  const [showNewTourModal, setShowNewTourModal] = useState<boolean>(false);

  useEffect(() => {
    async function loadTours() {
      try {
        const dbTours = await getToursFromDb();
        if (dbTours && dbTours.length > 0) {
          setTours(
            dbTours.map((t) => ({
              id: t.id,
              title: t.title,
              pricePerPerson: Number(t.price_per_person),
              duration: t.duration || "4 hours",
              status: t.status === "active" ? "Active" : "Draft",
              image: t.image_url || "/images/safari_guide_elephants.jpg",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load tours from Supabase:", err);
      }
    }
    loadTours();
  }, []);

  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("230");
  const [newDuration, setNewDuration] = useState("4 hours");

  const filteredTours = tours.filter((t) => {
    if (filter === "active") return t.status === "Active";
    if (filter === "drafts") return t.status === "Draft";
    return true;
  });

  const handleDeleteTour = async (id: string) => {
    if (confirm("Are you sure you want to delete this tour listing?")) {
      setTours((prev) => prev.filter((t) => t.id !== id));
      if (!id.startsWith("tour_")) {
        await deleteTourFromDb(id);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTour) return;
    const updated = editingTour;
    setTours((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setEditingTour(null);
    if (!updated.id.startsWith("tour_")) {
      await updateTourInDb(updated.id, {
        title: updated.title,
        price_per_person: updated.pricePerPerson,
        duration: updated.duration,
        status: updated.status === "Active" ? "active" : "draft",
      });
    }
  };

  const handleCreateTour = async () => {
    if (!newTitle.trim()) {
      alert("Please enter a tour title");
      return;
    }
    const title = newTitle.trim();
    const price = parseInt(newPrice, 10) || 150;
    const duration = newDuration.trim() || "4 hours";

    try {
      const dbTour = await createTourInDb({
        title,
        price_per_person: price,
        duration,
        category: "Safari & Wildlife",
        description: "Curated guided tour with experienced local guides.",
        max_group_size: 8,
        location: "Victoria Falls, Zimbabwe",
        image_url: "/images/safari_guide_elephants.jpg",
        guide_name: guideName || "Desire Sibanda",
        guide_avatar: avatarUrl || "/images/desire_avatar.jpg",
        status: "active",
      });

      const newTour: TourItem = {
        id: dbTour?.id || `tour_${Date.now()}`,
        title,
        pricePerPerson: price,
        duration,
        status: "Active",
        image: "/images/safari_guide_elephants.jpg",
      };
      setTours((prev) => [newTour, ...prev]);
    } catch (err) {
      console.error("Error creating tour:", err);
    }

    setShowNewTourModal(false);
    setNewTitle("");
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F9FAF9] text-black relative select-none overflow-hidden">
      {/* iOS Status Bar */}
      <div className="px-5 pt-3 pb-1 shrink-0">
        <IosStatusBar />
      </div>

      {/* Top Header Bar */}
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
          My tours
        </h1>

        {/* Guide Avatar on Top Right */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-stone-200 border border-stone-200/80 shadow-xs">
          <Image
            src={avatarUrl}
            alt={guideName}
            width={36}
            height={36}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-32 space-y-4 scrollbar-none">
        {/* Performance Insight Banner Card */}
        <div className="w-full bg-white rounded-[22px] p-4 border border-stone-200/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-start justify-between gap-3">
          <div className="flex-1 pr-1">
            <h2 className="text-[16px] font-black text-black tracking-tight leading-snug">
              Performance insight
            </h2>
            <p className="text-[12.5px] font-normal text-stone-500 mt-1 leading-snug">
              Track how your tours are performing in real time.
            </p>
          </div>

          <div className="w-8 h-8 flex items-center justify-center shrink-0 text-[#1B3D2F] mt-0.5">
            <Award className="w-7 h-7 stroke-[1.8]" />
          </div>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "all"
                ? "bg-[#DDE6E0] text-[#1E3F32]"
                : "bg-[#F1F3F2] text-stone-800 hover:bg-stone-200"
            }`}
          >
            All tours
          </button>

          <button
            type="button"
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "active"
                ? "bg-[#DDE6E0] text-[#1E3F32]"
                : "bg-[#F1F3F2] text-stone-800 hover:bg-stone-200"
            }`}
          >
            Active
          </button>

          <button
            type="button"
            onClick={() => setFilter("drafts")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === "drafts"
                ? "bg-[#DDE6E0] text-[#1E3F32]"
                : "bg-[#F1F3F2] text-stone-800 hover:bg-stone-200"
            }`}
          >
            Drafts
          </button>
        </div>

        {/* 2-Columns Tours Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-[22px] p-3 border border-stone-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div>
                {/* Tour Image */}
                <div className="w-full h-[115px] rounded-[16px] overflow-hidden bg-stone-100 relative mb-2">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 430px) 50vw, 200px"
                    unoptimized
                  />
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                    tour.status === "Active"
                      ? "bg-[#DCE7E1] text-[#1E3F32]"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {tour.status}
                </span>

                {/* Tour Title */}
                <h3 className="text-[13.5px] font-bold text-black leading-tight mt-1 line-clamp-2">
                  {tour.title}
                </h3>

                {/* Price */}
                <p className="text-[12px] font-semibold text-stone-700 mt-1">
                  ${tour.pricePerPerson}/person
                </p>

                {/* Duration */}
                <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600 mt-0.5">
                  <Clock className="w-3.5 h-3.5 stroke-[2]" />
                  <span>{tour.duration}</span>
                </div>
              </div>

              {/* Action Icons: Edit & Delete */}
              <div className="flex items-center justify-end gap-3 pt-3 mt-1 border-t border-stone-100/80">
                <button
                  type="button"
                  onClick={() => setEditingTour(tour)}
                  aria-label="Edit tour"
                  className="text-stone-700 hover:text-black transition-colors cursor-pointer p-1"
                >
                  <Pencil className="w-4 h-4 stroke-[2]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTour(tour.id)}
                  aria-label="Delete tour"
                  className="text-stone-700 hover:text-red-600 transition-colors cursor-pointer p-1"
                >
                  <Trash2 className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating "+ New tour" Action Button */}
      <div className="absolute bottom-22 right-5 z-40">
        <button
          type="button"
          onClick={() => {
            if (onAddNewTour) onAddNewTour();
            else setShowNewTourModal(true);
          }}
          className="bg-white/95 backdrop-blur-md text-black font-extrabold text-[12.5px] px-3.5 py-2 rounded-full border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center gap-1.5 cursor-pointer hover:bg-stone-50 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New tour</span>
        </button>
      </div>

      {/* Edit Tour Modal */}
      {editingTour && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-[17px] font-bold text-black">Edit Tour Listing</h3>
              <button
                type="button"
                onClick={() => setEditingTour(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 block">Tour Title</label>
                <input
                  type="text"
                  value={editingTour.title}
                  onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                  className="w-full bg-stone-100 px-3.5 py-2 rounded-xl text-sm font-medium border border-transparent focus:border-[#1E3F32] focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-stone-700 mb-1 block">Price ($/person)</label>
                  <input
                    type="number"
                    value={editingTour.pricePerPerson}
                    onChange={(e) =>
                      setEditingTour({ ...editingTour, pricePerPerson: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full bg-stone-100 px-3.5 py-2 rounded-xl text-sm font-medium border border-transparent focus:border-[#1E3F32] focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 mb-1 block">Duration</label>
                  <input
                    type="text"
                    value={editingTour.duration}
                    onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                    className="w-full bg-stone-100 px-3.5 py-2 rounded-xl text-sm font-medium border border-transparent focus:border-[#1E3F32] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 block">Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTour({ ...editingTour, status: "Active" })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                      editingTour.status === "Active"
                        ? "bg-[#1E3F32] text-white"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTour({ ...editingTour, status: "Draft" })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                      editingTour.status === "Draft"
                        ? "bg-[#1E3F32] text-white"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveEdit}
                className="w-full py-3 bg-[#1E3F32] hover:bg-[#163325] text-white font-bold text-sm rounded-full mt-2 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Tour Modal */}
      {showNewTourModal && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full bg-white rounded-t-[30px] p-5 pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-[17px] font-bold text-black">Create New Tour</h3>
              <button
                type="button"
                onClick={() => setShowNewTourModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1 block">Tour Title</label>
                <input
                  type="text"
                  placeholder="e.g. Victoria Falls Private Sunset Cruise"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-stone-100 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-transparent focus:border-[#1E3F32] focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-stone-700 mb-1 block">Price ($/person)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-stone-100 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-transparent focus:border-[#1E3F32] focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 mb-1 block">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-stone-100 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-transparent focus:border-[#1E3F32] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateTour}
                className="w-full py-3 bg-[#1E3F32] hover:bg-[#163325] text-white font-bold text-sm rounded-full mt-3 cursor-pointer"
              >
                Publish Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
