"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  FileCheck2,
  DollarSign,
  Camera,
  MapPin,
  Crosshair,
  CheckCircle2,
  Plus,
  Minus,
  Upload,
  Lightbulb,
  Check,
  X,
  Compass,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";
import { createTourInDb } from "@/services/dbService";

interface AddNewTourScreenProps {
  onBack: () => void;
  onPublish: (tour: {
    title: string;
    price: number;
    duration: string;
    description: string;
    meetingPoint: string;
    included: string[];
    minGroup: number;
    maxGroup: number;
    cancellation: string;
    photos: string[];
  }) => void;
}

export function AddNewTourScreen({ onBack, onPublish }: AddNewTourScreenProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Basic Information
  const [tourTitle, setTourTitle] = useState("");
  const [category, setCategory] = useState("Nature and Adventure");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [duration, setDuration] = useState("4 hours");
  const [locationCity, setLocationCity] = useState("Victoria Falls, Zimbabwe");

  // Step 2: Tour Details
  const [description, setDescription] = useState(
    "Experience the thundering wonder of Victoria Falls up close. Guided rainforest walking tour, panoramic viewpoints, wildlife spotting, and rich historical commentary on the local traditions and geological marvels of the Zambezi."
  );
  const [meetingPoint, setMeetingPoint] = useState("Victoria Falls, Zimbabwe");
  const [includedItems, setIncludedItems] = useState<string[]>([
    "Transportation in 4x4 vehicle",
    "Professional Guide",
    "Snacks and drinks",
  ]);
  const [newItemText, setNewItemText] = useState("");
  const [showAddItemInput, setShowAddItemInput] = useState(false);

  // Step 3: Pricing
  const [pricePerPerson, setPricePerPerson] = useState<number>(120);
  const [minGroupSize, setMinGroupSize] = useState<number>(2);
  const [maxGroupSize, setMaxGroupSize] = useState<number>(8);
  const [offerDiscounts, setOfferDiscounts] = useState<boolean>(true);
  const [discount34, setDiscount34] = useState<number>(5);
  const [discount5Plus, setDiscount5Plus] = useState<number>(10);
  const [cancellationPolicy, setCancellationPolicy] = useState<"flexible" | "moderate">("flexible");

  // Step 4: Photos
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([
    "/images/zambezi_river_sunset.jpg",
    "/images/safari_guide_elephants.jpg",
    "/images/hero_giraffe.jpg",
  ]);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    setIncludedItems((prev) => [...prev, newItemText.trim()]);
    setNewItemText("");
    setShowAddItemInput(false);
  };

  const handleRemoveItem = (index: number) => {
    setIncludedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await createTourInDb({
        title: tourTitle,
        category: "Safari & Wildlife",
        description,
        duration: duration || "Full day",
        price_per_person: pricePerPerson,
        max_group_size: maxGroupSize,
        location: meetingPoint || "Victoria Falls, Zimbabwe",
        image_url: selectedPhotos[0] || "/images/safari_guide_elephants.jpg",
        guide_name: "Kristin Watson",
        status: "active",
      });
    } catch (err) {
      console.error("Error creating tour in Supabase:", err);
    }
    setIsPublishing(false);
    setPublishSuccess(true);
    setTimeout(() => {
      onPublish({
        title: tourTitle,
        price: pricePerPerson,
        duration,
        description,
        meetingPoint,
        included: includedItems,
        minGroup: minGroupSize,
        maxGroup: maxGroupSize,
        cancellation: cancellationPolicy,
        photos: selectedPhotos,
      });
    }, 1200);
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
          onClick={() => {
            if (currentStep > 1) {
              setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
            } else {
              onBack();
            }
          }}
          aria-label="Back"
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-[20px] font-black text-black tracking-tight text-center absolute left-1/2 -translate-x-1/2">
          Add new tour
        </h1>

        <div className="w-9 h-9" />
      </div>

      {/* 4-Segments Progress Bar */}
      <div className="px-5 py-2 grid grid-cols-4 gap-2 shrink-0">
        <div
          className={`h-1 rounded-full transition-colors ${
            currentStep >= 1 ? "bg-[#1E3F32]" : "bg-stone-200"
          }`}
        />
        <div
          className={`h-1 rounded-full transition-colors ${
            currentStep >= 2 ? "bg-[#1E3F32]" : "bg-stone-200"
          }`}
        />
        <div
          className={`h-1 rounded-full transition-colors ${
            currentStep >= 3 ? "bg-[#1E3F32]" : "bg-stone-200"
          }`}
        />
        <div
          className={`h-1 rounded-full transition-colors ${
            currentStep >= 4 ? "bg-[#1E3F32]" : "bg-stone-200"
          }`}
        />
      </div>

      {/* Step Content Container */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-28 scrollbar-none">
        {/* STEP 1: Basic Information (Exact Mockup Match) */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Step Capsule Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#F0F5F2] flex items-center justify-center text-[#1E3F32] shrink-0">
                <FileCheck2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-[17px] font-black text-black leading-tight">
                  Basic Information
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Tell the tourists about your experience
                </p>
              </div>
            </div>

            {/* Tour Title */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Tour title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tourTitle}
                onChange={(e) => setTourTitle(e.target.value)}
                placeholder="Eg.Sunset walk on the falls"
                className="w-full bg-[#F8F9F8] px-4 py-3.5 rounded-2xl text-xs font-medium text-black placeholder:text-stone-400 border border-stone-100 outline-none focus:bg-white focus:ring-1 focus:ring-[#1E3F32]"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="bg-[#F8F9F8] rounded-2xl p-3.5 border border-stone-100">
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell tourists about your experience..."
                  maxLength={500}
                  className="w-full bg-transparent text-xs text-stone-800 font-normal leading-relaxed outline-none resize-none"
                />
                <div className="text-right text-[11px] text-stone-400 font-medium pt-1">
                  {description.length}/500
                </div>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Category<span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown((prev) => !prev)}
                className="w-full bg-[#F8F9F8] px-4 py-3.5 rounded-2xl text-xs font-medium text-stone-800 border border-stone-100 flex items-center justify-between cursor-pointer hover:bg-stone-100/70 transition-colors"
              >
                <span>{category}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-700 transition-transform ${
                    showCategoryDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-stone-200 shadow-lg z-30 overflow-hidden divide-y divide-stone-100 animate-in fade-in duration-150">
                  {[
                    "Nature and Adventure",
                    "Wildlife Safari & Game Drive",
                    "Victoria Falls Rainforest Walk",
                    "Zambezi River Boat & Canoe",
                    "Cultural & Historical Tour",
                  ].map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-800 hover:bg-[#F0F5F2] hover:text-[#1E3F32] cursor-pointer flex items-center justify-between"
                    >
                      <span>{cat}</span>
                      {category === cat && <Check className="w-3.5 h-3.5 text-[#1E3F32]" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Field */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-between bg-[#F8F9F8] px-4 py-3.5 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2.5 flex-1 mr-2">
                  <MapPin className="w-4 h-4 text-stone-700 shrink-0" />
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="e.g. Victoria Falls, Zimbabwe"
                    className="w-full bg-transparent text-xs font-semibold outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setLocationCity("Victoria Falls, Zimbabwe")}
                  aria-label="Use current location"
                  className="text-stone-700 hover:text-black cursor-pointer p-0.5"
                >
                  <Crosshair className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* Tips for a great tour Card */}
            <div className="bg-[#F8F9F8] rounded-2xl p-4 border border-stone-100 flex items-start gap-3 mt-1">
              <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black">Tips for a great tour</h4>
                <p className="text-[11.5px] text-stone-600 mt-0.5 leading-snug">
                  Choose a clea title and description that tells tourists what makes your tour special
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Tour Details (User Image 2) */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Step Capsule Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#F0F5F2] flex items-center justify-center text-[#1E3F32] shrink-0">
                <FileCheck2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-[17px] font-black text-black leading-tight">
                  Tour details
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Tell tourists abut your experience
                </p>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="bg-[#F8F9F8] rounded-2xl p-3.5 border border-stone-100">
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell tourists about your experience..."
                  maxLength={500}
                  className="w-full bg-transparent text-xs text-stone-800 font-normal leading-relaxed outline-none resize-none"
                />
                <div className="text-right text-[11px] text-stone-400 font-medium pt-1">
                  {description.length}/500
                </div>
              </div>
            </div>

            {/* Meeting Point Field */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Meeting point <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-between bg-[#F8F9F8] px-4 py-3 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2.5 flex-1 mr-2">
                  <MapPin className="w-4 h-4 text-stone-700 shrink-0" />
                  <input
                    type="text"
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    placeholder="Enter meeting point"
                    className="w-full bg-transparent text-xs font-semibold outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setMeetingPoint("Victoria Falls, Zimbabwe")}
                  aria-label="Use current location"
                  className="text-stone-700 hover:text-black cursor-pointer p-0.5"
                >
                  <Crosshair className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>

            {/* What's included Field */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                What’s included <span className="text-red-500">*</span>
              </label>

              <div className="bg-[#F8F9F8] rounded-2xl p-3 border border-stone-100 space-y-3">
                {includedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1 group"
                  >
                    <span className="text-xs font-semibold text-stone-800">
                      {item}
                    </span>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-stone-800 stroke-[2]" />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {showAddItemInput ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
                    <input
                      type="text"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddItem();
                      }}
                      placeholder="e.g. Park entrance fees"
                      className="flex-1 bg-white px-3 py-2 rounded-xl text-xs outline-none border border-stone-200"
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-2 bg-[#1E3F32] text-white text-xs font-bold rounded-xl"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddItemInput(false)}
                      className="p-2 text-stone-400 hover:text-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddItemInput(true)}
                    className="w-full py-2.5 bg-[#E5ECE9] hover:bg-[#d8e2de] text-black font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add item</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing (User Image 3) */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Step Capsule Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#F0F5F2] flex items-center justify-center text-[#1E3F32] shrink-0">
                <DollarSign className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-[17px] font-black text-black leading-tight">
                  Pricing
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Set your price and tour preferences
                </p>
              </div>
            </div>

            {/* Price per person (USD) */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Price per person (USD) <span className="text-red-500">*</span>
              </label>
              <div className="bg-[#F8F9F8] rounded-2xl p-3.5 border border-stone-100 flex items-center gap-2 text-[20px] font-black text-black">
                <span className="text-stone-700 text-lg">$</span>
                <input
                  type="number"
                  value={pricePerPerson}
                  onChange={(e) => setPricePerPerson(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-transparent font-black outline-none"
                />
              </div>
              <p className="text-[11.5px] text-stone-500 font-normal mt-1">
                This the base price per person
              </p>
            </div>

            {/* Group size */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-1.5">
                Group size <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Minimum */}
                <div>
                  <span className="text-[11px] font-medium text-stone-500 block mb-1">
                    Minimum
                  </span>
                  <div className="bg-[#F8F9F8] rounded-2xl p-2.5 border border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 ml-1">
                      👤 {minGroupSize}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setMinGroupSize((prev) => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-stone-700 hover:bg-stone-100 shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMinGroupSize((prev) => prev + 1)}
                        className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-stone-700 hover:bg-stone-100 shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Maximum */}
                <div>
                  <span className="text-[11px] font-medium text-stone-500 block mb-1">
                    Maximum
                  </span>
                  <div className="bg-[#F8F9F8] rounded-2xl p-2.5 border border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 ml-1">
                      👤 {maxGroupSize}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setMaxGroupSize((prev) => Math.max(minGroupSize, prev - 1))}
                        className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-stone-700 hover:bg-stone-100 shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMaxGroupSize((prev) => prev + 1)}
                        className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-stone-700 hover:bg-stone-100 shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Offer group discounts */}
            <div className="pt-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-black">Offer group discounts</h3>
                  <p className="text-[11.5px] text-stone-500">
                    Attract more customers with group discounts
                  </p>
                </div>
                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => setOfferDiscounts((prev) => !prev)}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                    offerDiscounts ? "bg-[#1E3F32] justify-end" : "bg-stone-300 justify-start"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                </button>
              </div>

              {offerDiscounts && (
                <div className="bg-[#F8F9F8] rounded-2xl p-3 border border-stone-100 divide-y divide-stone-200/60 mt-2 space-y-2">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-stone-800">3-4 people</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={discount34}
                        onChange={(e) => setDiscount34(parseInt(e.target.value, 10) || 0)}
                        className="w-14 bg-white px-2.5 py-1 rounded-xl text-center font-bold text-xs border border-stone-200 outline-none"
                      />
                      <span className="text-xs font-semibold text-stone-600">%Off</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-stone-800">5+ people</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={discount5Plus}
                        onChange={(e) => setDiscount5Plus(parseInt(e.target.value, 10) || 0)}
                        className="w-14 bg-white px-2.5 py-1 rounded-xl text-center font-bold text-xs border border-stone-200 outline-none"
                      />
                      <span className="text-xs font-semibold text-stone-600">%Off</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cancelation Policy */}
            <div className="pt-1">
              <h3 className="text-sm font-bold text-black mb-2">Cancelation Policy</h3>
              <div className="space-y-2">
                {/* Flexible */}
                <div
                  onClick={() => setCancellationPolicy("flexible")}
                  className={`bg-[#F8F9F8] rounded-2xl p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                    cancellationPolicy === "flexible" ? "border-[#1E3F32]" : "border-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        cancellationPolicy === "flexible"
                          ? "border-[#1E3F32]"
                          : "border-stone-400"
                      }`}
                    >
                      {cancellationPolicy === "flexible" && (
                        <div className="w-2 h-2 rounded-full bg-[#1E3F32]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black">Flexible</h4>
                      <p className="text-[11px] text-stone-500">
                        Full refund up to 24 hours before tour starts
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-stone-800 stroke-[2]" />
                </div>

                {/* Moderate */}
                <div
                  onClick={() => setCancellationPolicy("moderate")}
                  className={`bg-[#F8F9F8] rounded-2xl p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                    cancellationPolicy === "moderate" ? "border-[#1E3F32]" : "border-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        cancellationPolicy === "moderate"
                          ? "border-[#1E3F32]"
                          : "border-stone-400"
                      }`}
                    >
                      {cancellationPolicy === "moderate" && (
                        <div className="w-2 h-2 rounded-full bg-[#1E3F32]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black">Moderate</h4>
                      <p className="text-[11px] text-stone-500">
                        Full refund up to 7 days before tour starts
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-stone-800 stroke-[2]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Add photos (User Image 1) */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Step Capsule Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#F0F5F2] flex items-center justify-center text-[#1E3F32] shrink-0">
                <Camera className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-[17px] font-black text-black leading-tight">
                  Add photos
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Great photos help tourists choose you tour
                </p>
              </div>
            </div>

            {/* Dashed Orange Upload Box */}
            <div className="border-2 border-dashed border-[#F59E0B] rounded-2xl p-6 flex flex-col items-center justify-center bg-white text-center">
              <Upload className="w-8 h-8 text-[#D97706] stroke-[2] mb-1" />
              <span className="text-xs font-bold text-[#D97706]">Upload file</span>
              <p className="text-xs text-stone-500 mt-1">Upload photos here</p>

              <button
                type="button"
                onClick={() => {
                  // add sample photo to preview
                  const sampleImages = [
                    "/images/experience_safari_jeep.jpg",
                    "/images/experience_walking_guide.jpg",
                    "/images/camel_desert_sunset.jpg",
                  ];
                  const nextImg = sampleImages[selectedPhotos.length % sampleImages.length];
                  if (!selectedPhotos.includes(nextImg)) {
                    setSelectedPhotos((prev) => [...prev, nextImg]);
                  }
                  alert("Photo selected! You can upload up to 10 photos.");
                }}
                className="mt-4 px-8 py-3 bg-[#1B3D2F] hover:bg-[#143226] text-white font-bold text-xs rounded-full transition-all cursor-pointer shadow-xs"
              >
                Upload photos
              </button>
            </div>

            <p className="text-[11.5px] text-stone-500 font-normal leading-relaxed">
              Upload atleast 3 images max(10), use high quality images that showcase your tour.
            </p>

            {/* Photo Previews */}
            {selectedPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {selectedPhotos.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-20 rounded-xl overflow-hidden border border-stone-200 group"
                  >
                    <Image
                      src={img}
                      alt={`Tour photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPhotos((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-[10px] cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Photo tips Card */}
            <div className="bg-[#F8F9F8] rounded-2xl p-4 border border-stone-100 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-black">Photo tips</h4>
                <p className="text-[11.5px] text-stone-600 mt-0.5 leading-snug">
                  Good photos can get you up to 3x more bookings. Show the real experience!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="absolute bottom-5 left-5 right-5 z-30">
        {currentStep === 1 ? (
          /* Step 1: Full-Width Next Button (Exact Mockup Match) */
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="w-full py-4 px-6 rounded-full bg-[#1B3D2F] hover:bg-[#143226] text-white font-bold text-sm text-center shadow-xs transition-colors cursor-pointer"
          >
            Next: Tour details
          </button>
        ) : (
          /* Steps 2, 3, 4: Back + Next/Publish Buttons */
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#F8F9F8] hover:bg-stone-100 text-black font-bold text-xs text-center border border-stone-200/60 transition-colors cursor-pointer"
            >
              Back
            </button>

            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-[1.4] py-3.5 px-6 rounded-full bg-[#1B3D2F] hover:bg-[#143226] text-white font-bold text-xs text-center shadow-xs transition-colors cursor-pointer"
              >
                Next: Pricing
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex-[1.4] py-3.5 px-6 rounded-full bg-[#1B3D2F] hover:bg-[#143226] text-white font-bold text-xs text-center shadow-xs transition-colors cursor-pointer"
              >
                Next: Add photos
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-[1.4] py-3.5 px-6 rounded-full bg-[#1B3D2F] hover:bg-[#143226] text-white font-bold text-xs text-center shadow-xs transition-colors cursor-pointer disabled:opacity-70"
              >
                {isPublishing ? "Publishing..." : "Publsih tour"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {publishSuccess && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-[320px] bg-white rounded-[28px] p-6 text-center space-y-3 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#1E3F32] flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h3 className="text-base font-black text-black">Tour Published!</h3>
            <p className="text-xs text-stone-500">
              Your tour &quot;{tourTitle}&quot; has been published successfully and is now active for bookings!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
