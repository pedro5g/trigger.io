"use client";

import { useCallback, useRef, useState } from "react";

export type FormFields = HTMLInputElement | HTMLTextAreaElement;

export function useCopy<T extends FormFields = any>() {
  const [copied, setCopied] = useState(false);
  const ref = useRef<T | null>(null);

  const handleCopy = useCallback(
    (text?: string) => {
      if (!text && ref.current) {
        navigator.clipboard.writeText(ref.current.value);
        setCopied(true);
      } else if (text) {
        navigator.clipboard.writeText(text);
        setCopied(true);
      }

      setTimeout(() => setCopied(false), 1500);
    },
    [ref, setCopied],
  );

  return {
    copied,
    handleCopy,
    target: ref,
  };
}
