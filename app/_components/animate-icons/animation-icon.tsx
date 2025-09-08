"use client";

import {
  createElement,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { AnimateIconElement, AnimateIconProps } from "./types";
import { cn } from "@/lib/utils";
import { ANIMATE_ICON_VARIANTS } from "@/constants";
import Script from "next/script";

export const AnimateIcon = memo(
  ({
    src,
    trigger = "hover",
    colors,
    size = 32,
    delay = 0,
    stroke,
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
    loading,
    state,
    children,
    ref,
    ...props
  }: AnimateIconProps) => {
    const iconRef = useRef<AnimateIconElement>(null);
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

    const buildColorsString = useCallback(
      (colors?: AnimateIconProps["colors"]) => {
        if (!colors) return undefined;

        const colorEntries = Object.entries(colors)
          .filter(([_, value]) => value)
          .map(([key, value]) => `${key}:${value}`);

        return colorEntries.length > 0 ? colorEntries.join(",") : undefined;
      },
      [],
    );

    const actualTrigger =
      trigger === "mount" || trigger === "mount-loop" ? "hover" : trigger;

    const IconElement = useCallback(() => {
      return createElement(
        "lord-icon",
        {
          ref: iconRef,
          src: ANIMATE_ICON_VARIANTS[src],
          trigger: actualTrigger,
          colors: buildColorsString(colors),
          delay: delay > 0 ? delay : undefined,
          stroke,
          scale,
          axis,
          state,
          direction: direction !== 1 ? direction : undefined,
          speed: speed !== 1 ? speed : undefined,
          style: {
            width: `${size}px`,
            height: `${size}px`,
            ...style,
          },
          loading,
          target,
          className: cn("inline-block", className),
          onClick,
          ...props,
        },
        [children],
      );
    }, [
      src,
      state,
      actualTrigger,
      delay,
      stroke,
      scale,
      axis,
      direction,
      speed,
      target,
      className,
      onClick,
      props,
    ]);

    return (
      <>
        {/* i serve my proprietary instance lordicon lib, this instance has some changes  */}
        <Script src="/scripts/lordicon.js" strategy="afterInteractive" />
        <IconElement />
      </>
    );
  },
);
