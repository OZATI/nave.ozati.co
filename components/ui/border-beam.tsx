"use client";

import * as React from "react";
import { motion, type MotionStyle, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BorderBeamProps {
  /**
   * Children elements if BorderBeam is used as a wrapper container.
   */
  children?: React.ReactNode;
  /**
   * The size of the border beam in pixels or preset keyword.
   * @default 200 (or "md")
   */
  size?: number | "sm" | "md" | "lg" | "xl";
  /**
   * Animation duration in seconds.
   * @default 12
   */
  duration?: number;
  /**
   * Delay before the animation starts in seconds.
   * @default 0
   */
  delay?: number;
  /**
   * Presets for common color combinations.
   */
  colorVariant?: "default" | "colorful" | "emerald" | "cyan" | "purple";
  /**
   * Starting gradient color of the beam.
   */
  colorFrom?: string;
  /**
   * Secondary/ending gradient color of the beam.
   */
  colorTo?: string;
  /**
   * Custom transition for motion.
   */
  transition?: Transition;
  /**
   * Additional CSS classes.
   */
  className?: string;
  /**
   * Additional inline styles.
   */
  style?: React.CSSProperties;
  /**
   * Whether to reverse the beam rotation direction.
   * @default false
   */
  reverse?: boolean;
  /**
   * Initial offset distance percentage (0-100).
   * @default 0
   */
  initialOffset?: number;
  /**
   * Border stroke width in pixels.
   * @default 1.5
   */
  borderWidth?: number;
  /**
   * Anchor alignment for legacy compatibility.
   */
  anchor?: number;
}

const SIZE_PRESETS: Record<string, number> = {
  sm: 120,
  md: 200,
  lg: 320,
  xl: 440,
};

const COLOR_PRESETS: Record<string, [string, string]> = {
  default: ["#10b981", "#3b82f6"],
  colorful: ["#10b981", "#06b6d4"],
  emerald: ["#34d399", "#059669"],
  cyan: ["#22d3ee", "#3b82f6"],
  purple: ["#a855f7", "#ec4899"],
};

export const BorderBeam: React.FC<BorderBeamProps> = ({
  children,
  className,
  size = 200,
  delay = 0,
  duration = 12,
  colorVariant = "default",
  colorFrom,
  colorTo,
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1.5,
}) => {
  // Resolve numeric size from presets or number
  const numericSize =
    typeof size === "string" ? SIZE_PRESETS[size] ?? 200 : size;

  // Resolve colors
  const preset = COLOR_PRESETS[colorVariant] ?? COLOR_PRESETS.default;
  const activeColorFrom = colorFrom ?? preset[0];
  const activeColorTo = colorTo ?? preset[1];

  const beamElement = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
      style={{
        borderWidth: `${borderWidth}px`,
        borderStyle: "solid",
      }}
    >
      <motion.div
        className={cn("absolute aspect-square", className)}
        style={
          {
            width: numericSize,
            background: `linear-gradient(to left, ${activeColorFrom}, ${activeColorTo}, transparent)`,
            offsetPath: `rect(0 auto auto 0 round ${numericSize}px)`,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );

  // If children are provided, wrap them so BorderBeam functions as a decorative container
  if (children) {
    return (
      <div className="relative inline-block w-full max-w-full rounded-[inherit]">
        {children}
        {beamElement}
      </div>
    );
  }

  // Otherwise, return beam directly to be placed inside an existing relative container
  return beamElement;
};

export default BorderBeam;
