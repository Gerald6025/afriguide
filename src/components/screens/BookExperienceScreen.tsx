"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, Star, User, Calendar as CalendarIcon, Check } from "lucide-react";
import { IosStatusBar } from "../IosStatusBar";
import { TourPreviewData } from "./TourPreviewScreen";

export interface BookingDetails {
  tour: TourPreviewData;
  date: string;
  time: string;
  peopleCount: number;
  totalPrice: number;
}

interface BookExperienceScreenProps {
  tour?: TourPreviewData;
  onBack: () => void;
  onConfirmBooking?: (details: BookingDetails) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_ABBRS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Weekday headers matching the design
const WEEK_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function BookExperienceScreen({
  tour,
  onBack,
  onConfirmBooking,
}: BookExperienceScreenProps) {
  // Tour fallback details matching mockup
  const tourTitle = tour?.title || "Hwange Safari Trip";
  const guideName = tour?.guideName || "Mthabisi M";
  const rating = tour?.rating || 4.5;
  const pricePerPerson = tour?.pricePerPerson || 90;
  const imageUrl = tour?.imageUrl || "/images/experience_elephant.jpg";

  // Dynamic Year & Month State (defaults to April 2026 as in mockup)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(3); // 0-indexed: 3 = April
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);

  // Selected date state
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>({
    year: 2026,
    month: 3,
    day: 22,
  });

  const [dateNotice, setDateNotice] = useState<string | null>(null);

  // Time Slot Selection (matching screenshot: 9:41 AM slots, plus realistic slots)
  const timeSlots = ["9:41 AM", "11:00 AM", "1:30 PM", "3:45 PM", "5:00 PM"];
  const [selectedTime, setSelectedTime] = useState<string>("9:41 AM");

  // People Counter
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const maxPeople = 15;

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  // Determine availability for any month
  const getUnavailableDays = (year: number, month: number): number[] => {
    if (year === 2026 && month === 3) {
      // April 2026: exact days from mockup
      return [9, 10, 11];
    }
    // Dynamic realistic unavailable dates for other months (e.g. second weekend)
    return [8, 9, 15];
  };

  const getAvailableDays = (year: number, month: number): number[] => {
    if (year === 2026 && month === 3) {
      // April 2026: exact days from mockup
      return [22, 23, 24, 25, 26, 27];
    }
    // Dynamic available dates for other months
    return [18, 19, 20, 21, 22, 23, 24];
  };

  const unavailableDays = getUnavailableDays(currentYear, currentMonthIndex);
  const availableDays = getAvailableDays(currentYear, currentMonthIndex);

  // Calculate real days in the selected month & starting day of week
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = SUN

  // Build grid cells with leading nulls
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const handleDateClick = (day: number) => {
    if (unavailableDays.includes(day)) {
      setDateNotice(
        `${MONTH_NAMES[currentMonthIndex]} ${day} is fully booked.`
      );
      setTimeout(() => setDateNotice(null), 2500);
      return;
    }
    setSelectedDate({ year: currentYear, month: currentMonthIndex, day });
    setDateNotice(null);
  };

  const handleConfirm = () => {
    const activeTour: TourPreviewData = tour || {
      id: "exp-hwange",
      title: tourTitle,
      location: "Hwange National Park, Zimbabwe",
      rating,
      pricePerPerson,
      imageUrl,
      guideName,
    };

    onConfirmBooking?.({
      tour: activeTour,
      date: `${MONTH_NAMES[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`,
      time: selectedTime,
      peopleCount,
      totalPrice: pricePerPerson * peopleCount,
    });
  };

  return (
    <div className="relative w-full h-full min-h-full bg-[#FDFDFD] flex flex-col justify-between overflow-x-hidden overflow-y-auto select-none">
      {/* ── Top iOS Status Bar (Null-safe) ── */}
      <IosStatusBar theme="dark" />

      {/* ── Header Bar with Back Arrow and Centered Title ── */}
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
          Book experience
        </h1>

        <div className="w-10" aria-hidden="true" />
      </div>

      {/* ── Main Scrollable Body ── */}
      <div className="flex-1 w-full px-5 pb-6 overflow-y-auto max-w-[430px] mx-auto">
        {/* 1. Tour Summary Card */}
        <div className="w-full bg-white rounded-[20px] p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-stone-100 flex items-center gap-3.5 mb-4">
          <div className="relative w-[92px] h-[76px] rounded-[16px] overflow-hidden shrink-0 bg-stone-100">
            <Image
              src={imageUrl}
              alt={tourTitle}
              fill
              className="object-cover"
              sizes="92px"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h2 className="text-[17px] font-black text-black tracking-tight leading-snug truncate">
              {tourTitle}
            </h2>

            <div className="flex items-center gap-1.5 mt-1 text-stone-600 text-[13px] font-medium">
              <div className="w-4 h-4 rounded-full border border-stone-400 flex items-center justify-center shrink-0">
                <User className="w-2.5 h-2.5 text-stone-600 stroke-[2.4]" />
              </div>
              <span className="truncate">Guide: {guideName}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-[13px]">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
              <span className="font-bold text-black">{rating.toFixed(1)}</span>
              <span className="text-stone-500 font-normal">(126 Reviews)</span>
            </div>
          </div>
        </div>

        {/* 2. Calendar Card */}
        <div className="w-full bg-white rounded-[22px] p-4 shadow-[0_2px_14px_rgba(0,0,0,0.05)] border border-stone-100 mb-3 relative">
          {/* Calendar Header with Month Selector and Navigation Arrows */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={() => setShowMonthPicker((prev) => !prev)}
              className="flex items-center gap-1.5 text-[17px] font-bold text-black tracking-tight hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <span>
                {MONTH_NAMES[currentMonthIndex]} {currentYear}
              </span>
              <ChevronRight
                className={`w-4 h-4 text-sky-600 stroke-[3] transition-transform ${
                  showMonthPicker ? "rotate-90" : ""
                }`}
              />
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center text-black hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.4]" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center text-black hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.4]" />
              </button>
            </div>
          </div>

          {/* Quick Month Selector Overlay */}
          {showMonthPicker && (
            <div className="mb-4 p-3 bg-stone-50 rounded-[18px] border border-stone-200/80 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2.5 px-2">
                <span className="text-[13px] font-bold text-stone-700">Select Month</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentYear((y) => y - 1)}
                    className="p-1 hover:bg-stone-200 rounded text-stone-700 font-bold"
                  >
                    ‹
                  </button>
                  <span className="text-[13px] font-extrabold text-black">{currentYear}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentYear((y) => y + 1)}
                    className="p-1 hover:bg-stone-200 rounded text-stone-700 font-bold"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {MONTH_ABBRS.map((abbr, idx) => {
                  const isActive = currentMonthIndex === idx;
                  return (
                    <button
                      key={abbr}
                      type="button"
                      onClick={() => {
                        setCurrentMonthIndex(idx);
                        setShowMonthPicker(false);
                      }}
                      className={`py-2 text-[13px] font-bold rounded-[10px] transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#1E3F32] text-white shadow-xs"
                          : "bg-white hover:bg-stone-200 text-stone-700"
                      }`}
                    >
                      {abbr}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weekday Row */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {WEEK_DAYS.map((day) => (
              <span
                key={day}
                className="text-[11px] font-bold text-stone-400 tracking-wider"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-2 place-items-center">
            {calendarCells.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="w-10 h-10" />;
              }

              const isUnavailable = unavailableDays.includes(day);
              const isAvailableBadge = availableDays.includes(day);
              const isSelected =
                selectedDate.year === currentYear &&
                selectedDate.month === currentMonthIndex &&
                selectedDate.day === day;
              const isDayOne = day === 1;

              // Style matching the exact Figma mockup
              let cellClasses =
                "w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold transition-all ";

              if (isSelected) {
                cellClasses +=
                  "bg-[#1E3F32] text-white shadow-sm ring-2 ring-[#1E3F32] ring-offset-2 scale-105 cursor-pointer";
              } else if (isUnavailable) {
                cellClasses +=
                  "bg-[#FFEBD6] text-[#D86F24] cursor-not-allowed opacity-90";
              } else if (isAvailableBadge) {
                cellClasses +=
                  "bg-[#D6EBE3] text-[#1E3F32] hover:scale-105 cursor-pointer";
              } else {
                cellClasses += isDayOne
                  ? "text-sky-600 hover:bg-stone-100 cursor-pointer"
                  : "text-stone-800 hover:bg-stone-100 cursor-pointer";
              }

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  aria-label={`${MONTH_NAMES[currentMonthIndex]} ${day}, ${currentYear}`}
                  className={cellClasses}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Date Notice Feedback */}
          {dateNotice && (
            <p className="mt-2 text-center text-[12px] font-semibold text-[#D86F24] animate-fadeIn">
              {dateNotice}
            </p>
          )}

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 pt-2 border-t border-stone-100 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3F32]" />
              <span className="text-[12.5px] font-medium text-stone-700">
                Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E27D33]" />
              <span className="text-[12.5px] font-medium text-stone-700">
                Unavailable
              </span>
            </div>
          </div>
        </div>

        {/* 3. Select Time Section */}
        <div className="w-full mt-4">
          <h3 className="text-[17px] font-black text-black tracking-tight mb-2.5">
            Select Time
          </h3>

          <div className="flex flex-wrap items-center gap-2.5">
            {timeSlots.map((time, idx) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={`${time}-${idx}`}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2.5 rounded-[20px] text-[14px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-black text-white shadow-xs scale-102"
                      : "bg-[#EDEDED] text-stone-800 hover:bg-stone-200"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Number of people Section */}
        <div className="w-full mt-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[17px] font-black text-black tracking-tight leading-tight">
                Number of people
              </h3>
              <p className="text-stone-500 text-[13px] font-normal leading-tight mt-0.5">
                Max {maxPeople} people/ group
              </p>
            </div>

            {/* Stepper Counter */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPeopleCount((c) => Math.max(1, c - 1))}
                disabled={peopleCount <= 1}
                aria-label="Decrease people"
                className="w-10 h-10 rounded-[12px] border border-stone-200 bg-[#FBFBFB] hover:bg-stone-100 flex items-center justify-center font-bold text-[18px] text-black active:scale-95 disabled:opacity-30 cursor-pointer transition-colors"
              >
                −
              </button>

              <span className="text-[17px] font-black text-black min-w-[24px] text-center">
                {peopleCount}
              </span>

              <button
                type="button"
                onClick={() => setPeopleCount((c) => Math.min(maxPeople, c + 1))}
                disabled={peopleCount >= maxPeople}
                aria-label="Increase people"
                className="w-10 h-10 rounded-[12px] border border-stone-200 bg-[#FBFBFB] hover:bg-stone-100 flex items-center justify-center font-bold text-[18px] text-black active:scale-95 disabled:opacity-30 cursor-pointer transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 5. Booking CTA Section */}
        <div className="w-full mt-7 pt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-stone-500 text-[14px]">
              Selected: {MONTH_NAMES[selectedDate.month].slice(0, 3)} {selectedDate.day}, {selectedDate.year} at {selectedTime}
            </span>
            <span className="text-[20px] font-black text-black tracking-tight">
              ${pricePerPerson * peopleCount}
              <span className="text-stone-400 text-[13px] font-normal ml-1">
                (${pricePerPerson} × {peopleCount})
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full h-[54px] rounded-[28px] bg-[#1E3F32] hover:bg-[#163026] active:scale-[0.98] text-white font-bold text-[16px] tracking-tight transition-all shadow-md flex items-center justify-center cursor-pointer"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
