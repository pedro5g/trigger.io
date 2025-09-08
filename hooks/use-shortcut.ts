"use client";
import { useEffect } from "react";

export function useShortcut(builder: (e: KeyboardEvent) => void) {
  useEffect(() => {
    function handleSortCut(e: KeyboardEvent) {
      builder(e);
    }
    window.addEventListener("keydown", handleSortCut);
    return () => {
      window.removeEventListener("keydown", handleSortCut);
    };
  }, [builder]);
}
