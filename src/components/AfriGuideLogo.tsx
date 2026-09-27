import React from "react";
import Image from "next/image";

/**
 * AfriGuide Compass SVG — precisely matches the official brand emblem:
 * - Segmented dark-green ring (#1E3F32) with 4 cardinal triangular pointer ticks
 * - Dynamic NE-pointing dual-tone arrow:
 *   - Vibrant orange forward arrowhead (#EA5A24) extending beyond the outer ring
 *   - Split tail: top facet in orange (#EA5A24), bottom facet in deep forest green (#1E3F32)
 *   - Clean chevron notch separating the arrowhead and the tail
 */
export function AfriGuideCompass({
  className = "",
  size = 28,
  withBackground = false,
  bgFill = "#F1F3F2",
}: {
  className?: string;
  size?: number;
  withBackground?: boolean;
  bgFill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Optional soft circular background badge */}
      {withBackground && (
        <circle cx="50" cy="50" r="48" fill={bgFill} />
      )}

      {/* ── Segmented Compass Ring (#1E3F32) ── */}
      <g stroke="#1E3F32" strokeWidth="2.5" strokeLinecap="round">
        {/* Top-Right Arc (North to East) */}
        <path d="M 55.2 23.5 A 27 27 0 0 1 76.5 44.9" />
        {/* Bottom-Right Arc (East to South) */}
        <path d="M 76.5 55.2 A 27 27 0 0 1 55.2 76.5" />
        {/* Bottom-Left Arc (South to West) */}
        <path d="M 44.8 76.5 A 27 27 0 0 1 23.5 55.2" />
        {/* Top-Left Arc (West to North) */}
        <path d="M 23.5 44.9 A 27 27 0 0 1 44.8 23.5" />
      </g>

      {/* ── 4 Cardinal Triangular Ticks (#1E3F32) ── */}
      <g fill="#1E3F32">
        {/* North tick (pointing UP) */}
        <polygon points="50,17 46.5,23.5 53.5,23.5" />
        {/* East tick (pointing RIGHT) */}
        <polygon points="83,50 76.5,46.5 76.5,53.5" />
        {/* South tick (pointing DOWN) */}
        <polygon points="50,83 46.5,76.5 53.5,76.5" />
        {/* West tick (pointing LEFT) */}
        <polygon points="17,50 23.5,46.5 23.5,53.5" />
      </g>

      {/* ── Central Dynamic Dual-Tone Arrow (Rotated 48° to NE) ── */}
      <g transform="rotate(48 50 50)">
        {/* Front Arrowhead (Solid Orange, extends beyond the ring) */}
        <polygon
          points="50,13.5 60,39.5 50,32.5 40,39.5"
          fill="#EA5A24"
        />

        {/* Tail Upper Facet (Orange) */}
        <polygon
          points="50,36 44.5,41.5 50,81"
          fill="#EA5A24"
        />

        {/* Tail Lower Facet (Dark Forest Green) */}
        <polygon
          points="50,36 55.5,41.5 50,81"
          fill="#1E3F32"
        />
      </g>
    </svg>
  );
}

/**
 * Circular emblem badge used on Screen 1 (loading splash):
 * Styled exactly like the provided logo with the official brand image.
 */
export function AfriGuideCircularEmblem({
  className = "",
  size = 84,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <Image
        src="https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/Logo%20(1).png?updatedAt=1779444032373"
        alt="AfriGuide Logo"
        width={size}
        height={size}
        priority
        unoptimized
        className="w-full h-full object-contain"
      />
    </div>
  );
}

const BRAND_HORIZONTAL_LOGO_URL =
  "https://ik.imagekit.io/c0x52ylk1/afriguide%20resources/Logo%20(2).png?updatedAt=1779444036200";

/**
 * Header logo badge — horizontal AfriGuide brand logo (Logo 2).
 * Used in screens 3, 4, 5, 7, 8, 9.
 */
export function AfriGuideLogoBadge({
  className = "",
  size = "normal",
}: {
  className?: string;
  size?: "small" | "normal" | "large";
}) {
  const height = size === "small" ? 28 : size === "large" ? 42 : 34;
  const width = Math.round(height * (182 / 52));

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src={BRAND_HORIZONTAL_LOGO_URL}
        alt="AfriGuide"
        width={width}
        height={height}
        priority
        unoptimized
        className="h-auto w-auto object-contain"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}

/**
 * Large centered brand logo for Screen 2 (logo splash).
 */
export function AfriGuideBrandPill({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <Image
        src={BRAND_HORIZONTAL_LOGO_URL}
        alt="AfriGuide"
        width={200}
        height={57}
        priority
        unoptimized
        className="h-auto w-auto max-w-[220px] object-contain"
        style={{ height: "57px" }}
      />
    </div>
  );
}
