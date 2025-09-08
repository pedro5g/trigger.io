"use client";
import { LORDICON_THEMES } from "@/constants";
import { memo } from "react";
import { AnimateIcon } from "../animate-icons/animation-icon";

interface FieldMessageErrorProps {
  invalid: boolean;
  message?: string;
}

export const FieldMessageError = memo(
  ({ invalid, message }: FieldMessageErrorProps) => {
    return invalid && message ? (
      <p className="text-destructive inline-flex items-center gap-2 text-xs tracking-tight">
        <AnimateIcon
          src="error"
          size={20}
          colors={LORDICON_THEMES.error}
          trigger="mount"
        />
        {message}
      </p>
    ) : null;
  },
);
