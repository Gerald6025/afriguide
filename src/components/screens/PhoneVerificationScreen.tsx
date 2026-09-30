"use client";

import React, { useState, useMemo } from "react";
import { X, Search, ChevronDown, Check, ArrowLeft } from "lucide-react";
import { IosHomeIndicator } from "../IosStatusBar";
import { AfriGuideLogoBadge } from "../AfriGuideLogo";

interface CountryOption {
  name: string;
  code: string;
  iso: string;
  placeholder: string;
}

const COUNTRIES: CountryOption[] = [
  // Southern & Eastern Africa (Core)
  { name: "Zimbabwe", code: "+263", iso: "ZW", placeholder: "78 413 8081" },
  { name: "South Africa", code: "+27", iso: "ZA", placeholder: "82 123 4567" },
  { name: "Botswana", code: "+267", iso: "BW", placeholder: "71 234 567" },
  { name: "Zambia", code: "+260", iso: "ZM", placeholder: "97 123 4567" },
  { name: "Namibia", code: "+264", iso: "NA", placeholder: "81 123 4567" },
  { name: "Mozambique", code: "+258", iso: "MZ", placeholder: "84 123 4567" },
  { name: "Kenya", code: "+254", iso: "KE", placeholder: "712 345 678" },
  { name: "Tanzania", code: "+255", iso: "TZ", placeholder: "712 345 678" },
  { name: "Rwanda", code: "+250", iso: "RW", placeholder: "788 123 456" },
  { name: "Uganda", code: "+256", iso: "UG", placeholder: "772 123 456" },
  { name: "Malawi", code: "+265", iso: "MW", placeholder: "991 234 567" },
  { name: "Mauritius", code: "+230", iso: "MU", placeholder: "5251 2345" },
  { name: "Seychelles", code: "+248", iso: "SC", placeholder: "2 512 345" },
  { name: "Eswatini", code: "+268", iso: "SZ", placeholder: "7612 3456" },
  { name: "Lesotho", code: "+266", iso: "LS", placeholder: "5812 3456" },
  { name: "Angola", code: "+244", iso: "AO", placeholder: "923 123 456" },
  { name: "DR Congo", code: "+243", iso: "CD", placeholder: "812 345 678" },
  { name: "Madagascar", code: "+261", iso: "MG", placeholder: "32 12 345 67" },

  // Rest of Africa
  { name: "Nigeria", code: "+234", iso: "NG", placeholder: "802 123 4567" },
  { name: "Ghana", code: "+233", iso: "GH", placeholder: "24 123 4567" },
  { name: "Ethiopia", code: "+251", iso: "ET", placeholder: "91 123 4567" },
  { name: "Egypt", code: "+20", iso: "EG", placeholder: "100 123 4567" },
  { name: "Morocco", code: "+212", iso: "MA", placeholder: "612 345 678" },
  { name: "Senegal", code: "+221", iso: "SN", placeholder: "77 123 45 67" },
  { name: "Ivory Coast", code: "+225", iso: "CI", placeholder: "07 12 34 56" },
  { name: "Cameroon", code: "+237", iso: "CM", placeholder: "6 71 23 45 67" },

  // Key International Origin Markets for African Tourism
  { name: "United Kingdom", code: "+44", iso: "GB", placeholder: "7911 123456" },
  { name: "United States", code: "+1", iso: "US", placeholder: "(555) 000-0000" },
  { name: "Canada", code: "+1", iso: "CA", placeholder: "(555) 000-0000" },
  { name: "Australia", code: "+61", iso: "AU", placeholder: "412 345 678" },
  { name: "Germany", code: "+49", iso: "DE", placeholder: "151 23456789" },
  { name: "France", code: "+33", iso: "FR", placeholder: "6 12 34 56 78" },
  { name: "Netherlands", code: "+31", iso: "NL", placeholder: "6 12345678" },
  { name: "Switzerland", code: "+41", iso: "CH", placeholder: "79 123 45 67" },
  { name: "Ireland", code: "+353", iso: "IE", placeholder: "85 123 4567" },
  { name: "Italy", code: "+39", iso: "IT", placeholder: "312 345 6789" },
  { name: "Spain", code: "+34", iso: "ES", placeholder: "612 34 56 78" },
  { name: "Portugal", code: "+351", iso: "PT", placeholder: "912 345 678" },
  { name: "Belgium", code: "+32", iso: "BE", placeholder: "470 12 34 56" },
  { name: "Austria", code: "+43", iso: "AT", placeholder: "664 1234567" },
  { name: "Sweden", code: "+46", iso: "SE", placeholder: "70 123 45 67" },
  { name: "Norway", code: "+47", iso: "NO", placeholder: "912 34 567" },
  { name: "Denmark", code: "+45", iso: "DK", placeholder: "20 12 34 56" },
  { name: "Finland", code: "+358", iso: "FI", placeholder: "40 123 4567" },
  { name: "Poland", code: "+48", iso: "PL", placeholder: "512 345 678" },
  { name: "Czech Republic", code: "+420", iso: "CZ", placeholder: "601 123 456" },
  { name: "Greece", code: "+30", iso: "GR", placeholder: "691 234 5678" },
  { name: "Turkey", code: "+90", iso: "TR", placeholder: "532 123 4567" },

  // Middle East & Asia Pacific
  { name: "United Arab Emirates", code: "+971", iso: "AE", placeholder: "50 123 4567" },
  { name: "Saudi Arabia", code: "+966", iso: "SA", placeholder: "50 123 4567" },
  { name: "Qatar", code: "+974", iso: "QA", placeholder: "3312 3456" },
  { name: "Israel", code: "+972", iso: "IL", placeholder: "50 123 4567" },
  { name: "India", code: "+91", iso: "IN", placeholder: "98123 45678" },
  { name: "China", code: "+86", iso: "CN", placeholder: "138 0000 0000" },
  { name: "Japan", code: "+81", iso: "JP", placeholder: "90 1234 5678" },
  { name: "South Korea", code: "+82", iso: "KR", placeholder: "10 1234 5678" },
  { name: "Singapore", code: "+65", iso: "SG", placeholder: "8123 4567" },
  { name: "Malaysia", code: "+60", iso: "MY", placeholder: "12 345 6789" },
  { name: "New Zealand", code: "+64", iso: "NZ", placeholder: "21 123 4567" },
  { name: "Brazil", code: "+55", iso: "BR", placeholder: "11 91234-5678" },
];

// Crisp circular Zimbabwe Flag SVG
function ZimbabweFlag({ size = 22 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      style={{ width: `${size}px`, height: `${size}px` }}
      className="rounded-full overflow-hidden shrink-0 shadow-2xs"
    >
      <defs>
        <clipPath id="zw-flag-circle">
          <circle cx="16" cy="16" r="16" />
        </clipPath>
      </defs>
      <g clipPath="url(#zw-flag-circle)">
        <rect x="0" y="0" width="32" height="4.57" fill="#006400" />
        <rect x="0" y="4.57" width="32" height="4.57" fill="#FFD200" />
        <rect x="0" y="9.14" width="32" height="4.57" fill="#D40000" />
        <rect x="0" y="13.71" width="32" height="4.57" fill="#000000" />
        <rect x="0" y="18.28" width="32" height="4.57" fill="#D40000" />
        <rect x="0" y="22.85" width="32" height="4.57" fill="#FFD200" />
        <rect x="0" y="27.42" width="32" height="4.58" fill="#006400" />
        <polygon points="0,0 15,16 0,32" fill="#FFFFFF" stroke="#000000" strokeWidth="0.8" />
        <polygon
          points="5.5,13.2 6.6,15.2 8.8,15.4 7.1,16.8 7.6,19 5.5,17.8 3.4,19 3.9,16.8 2.2,15.4 4.4,15.2"
          fill="#D40000"
        />
        <path
          d="M5 14.5 C5.5 14 6.2 14.2 6.5 15 C6.7 15.5 6.5 16.5 5.8 17 C5.3 17.3 4.8 16.8 5 15.8 Z"
          fill="#FFD200"
        />
      </g>
    </svg>
  );
}

// Universal Country Flag Component (renders actual official flag image for all countries)
function CountryFlag({ iso, name, size = 22 }: { iso: string; name: string; size?: number }) {
  if (iso === "ZW") {
    return <ZimbabweFlag size={size} />;
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${iso.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${iso.toLowerCase()}.png 2x`}
      alt={`${name} flag`}
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className="rounded-full object-cover shrink-0 shadow-2xs border border-black/10"
      loading="lazy"
    />
  );
}

interface PhoneVerificationScreenProps {
  onBack?: () => void;
  onSendCode?: (fullNumber: string) => void;
  onSignIn?: () => void;
}

export function PhoneVerificationScreen({
  onBack,
  onSendCode,
  onSignIn,
}: PhoneVerificationScreenProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.iso.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendCode?.(`${selectedCountry.code} ${phoneNumber}`);
  };

  const handleClear = () => {
    setPhoneNumber("");
  };

  const handleSelectCountry = (country: CountryOption) => {
    setSelectedCountry(country);
    setIsPickerOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative w-full h-full min-h-full bg-[#FDFDFD] flex flex-col justify-between overflow-x-hidden overflow-y-auto px-5 pt-2 pb-2 select-none">
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
        <div className="text-center mb-7">
          <h1 className="text-[32px] font-black text-black tracking-tight leading-[1.1] mb-2">
            Lets get started
          </h1>
          <p className="text-stone-700 text-[14.5px] font-normal leading-snug max-w-[300px] mx-auto">
            Enter your phone number, we will send you a comfirmation code there
          </p>
        </div>

        {/* Phone Number Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          {/* Row: Interactive Country Code Selector + Phone Number Input */}
          <div className="flex items-center gap-2.5 w-full mb-3">
            {/* Country Selector Button with Visual Flag */}
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="h-[56px] px-3.5 rounded-[18px] bg-[#F7F8F9] hover:bg-stone-100 border border-stone-200/80 flex items-center gap-2 shrink-0 shadow-2xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <CountryFlag iso={selectedCountry.iso} name={selectedCountry.name} size={22} />
              <span className="text-[15px] font-semibold text-black tracking-tight">
                {selectedCountry.code}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 stroke-[2.5]" />
            </button>

            {/* Phone Number Input with Clear Button */}
            <div className="relative flex-1 h-[56px]">
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={selectedCountry.placeholder}
                className="w-full h-full px-4 pr-11 rounded-[18px] bg-[#F7F8F9] border border-stone-200/80 text-[16px] font-semibold text-black placeholder:text-stone-400 focus:outline-none focus:border-[#1E3F32] focus:ring-1 focus:ring-[#1E3F32] transition-colors shadow-2xs font-sans"
              />
              {phoneNumber && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear phone number"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              )}
            </div>
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
            className="w-full py-4 rounded-[24px] bg-[#1E3F32] hover:bg-[#163325] active:scale-[0.98] text-white font-bold text-[16px] tracking-normal transition-all cursor-pointer shadow-sm text-center"
          >
            Send code
          </button>
        </form>
      </div>

      {/* iOS Home Indicator Bar */}
      <IosHomeIndicator theme="dark" />

      {/* ── Country Code Selection Sheet / Modal ── */}
      {isPickerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select Country Code"
          className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsPickerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-t-[28px] max-h-[80vh] flex flex-col shadow-2xl p-5 animate-in slide-in-from-bottom duration-200"
          >
            {/* Header with Title and Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-[18px] font-bold text-black tracking-tight">
                Select Country Code
              </h3>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative my-3">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 stroke-[2.5]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or dial code..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-stone-100 text-[14.5px] text-black placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#1E3F32]"
              />
            </div>

            {/* Scrollable Countries List */}
            <div className="overflow-y-auto max-h-[50vh] divide-y divide-stone-50">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <button
                    key={`${c.iso}-${c.code}`}
                    type="button"
                    onClick={() => handleSelectCountry(c)}
                    className="w-full py-3 px-2 flex items-center justify-between hover:bg-stone-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <CountryFlag iso={c.iso} name={c.name} size={24} />
                      <span className="text-[15px] font-medium text-black">
                        {c.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-stone-600">
                        {c.code}
                      </span>
                      {selectedCountry.iso === c.iso && (
                        <Check className="w-4 h-4 text-[#1E3F32] stroke-[3]" />
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-stone-400 text-[14px]">
                  No countries found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
