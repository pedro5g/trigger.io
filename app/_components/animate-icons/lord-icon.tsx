"use client";

import React, { useEffect, useRef, useImperativeHandle, useState } from "react";
import { LordIconProps, LordIconElement } from "./types";
import { cn } from "@/lib/utils";
import Script from "next/script";

interface LordIconRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  element: LordIconElement | null;
}

export const LordIcon = ({
  src,
  trigger = "hover",
  colors,
  size = 32,
  delay = 0,
  stroke = 2,
  scale = 1,
  axis,
  direction = 1,
  speed = 1,
  className,
  style,
  onClick,
  onComplete,
  onReady,
  target,
  playOnMount = false,
  mountDelay = 0,
  ref,
  ...props
}: LordIconProps & { ref?: React.Ref<LordIconRef> }) => {
  const iconRef = useRef<LordIconElement>(null);
  const [isReady, setIsReady] = useState(false);

  useImperativeHandle(ref, () => ({
    play: () => iconRef.current?.playerInstance?.play(),
    pause: () => iconRef.current?.playerInstance?.pause(),
    stop: () => iconRef.current?.playerInstance?.stop(),
    setSpeed: (newSpeed: number) =>
      iconRef.current?.playerInstance?.setSpeed(newSpeed),
    element: iconRef.current,
  }));

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    const handleReady = () => {
      setIsReady(true);
      if (onReady) {
        onReady();
      }
    };

    const handleComplete = () => {
      if (onComplete) {
        onComplete();
      }
    };

    icon.addEventListener("ready", handleReady);
    if (onComplete) {
      icon.addEventListener("complete", handleComplete);
    }

    return () => {
      icon.removeEventListener("ready", handleReady);
      if (onComplete) {
        icon.removeEventListener("complete", handleComplete);
      }
    };
  }, [onComplete, onReady]);

  useEffect(() => {
    if (
      !isReady ||
      (!playOnMount && trigger !== "mount" && trigger !== "mount-loop")
    ) {
      return;
    }

    const icon = iconRef.current;
    if (!icon?.playerInstance) return;

    const timeoutId = setTimeout(() => {
      if (trigger === "mount-loop") {
        icon.setAttribute("trigger", "loop");
      }
      icon.playerInstance.play();
    }, mountDelay);

    return () => clearTimeout(timeoutId);
  }, [isReady, playOnMount, trigger, mountDelay]);

  const buildColorsString = (colors?: LordIconProps["colors"]) => {
    if (!colors) return undefined;

    const colorEntries = Object.entries(colors)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}:${value}`);

    return colorEntries.length > 0 ? colorEntries.join(",") : undefined;
  };

  const IconElement = () =>
    React.createElement("lord-icon", {
      ref: iconRef,
      src,
      trigger: actualTrigger,
      colors: buildColorsString(colors),
      delay: delay > 0 ? delay : undefined,
      stroke,
      scale,
      axis,
      direction: direction !== 1 ? direction : undefined,
      speed: speed !== 1 ? speed : undefined,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      },
      target,
      className: cn("inline-block", className),
      onClick,
      ...props,
    });

  const actualTrigger =
    trigger === "mount" || trigger === "mount-loop" ? "hover" : trigger;

  return (
    <>
      <Script src="/scripts/lordicon.js" strategy="afterInteractive" />
      <IconElement />
    </>
  );
};
