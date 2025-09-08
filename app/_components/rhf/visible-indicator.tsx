"use client";

import { memo } from "react";
import { AnimateIcon } from "../animate-icons/animation-icon";
import { LORDICON_THEMES } from "@/constants";

interface VisibleIndicatorProps {
  isVisible: boolean;
  toggleVisibility: () => void;
}

export const VisibleIndicator = memo(
  ({ isVisible, toggleVisibility }: VisibleIndicatorProps) => {
    return (
      <button
        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={toggleVisibility}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        aria-controls="password"
      >
        {isVisible ? (
          <AnimateIcon
            src="eye"
            size={16}
            colors={LORDICON_THEMES.dark}
            state="hover-eye-lashes"
            trigger="mount"
            aria-hidden="true"
          />
        ) : (
          <AnimateIcon
            src="eye"
            size={16}
            colors={LORDICON_THEMES.dark}
            trigger="mount"
            aria-hidden="true"
          />
        )}
      </button>
    );
  },
);
