import type { AnimateIconVariants } from "@/constants";
import type Image from "next/image";

export interface AnimateIconElement extends HTMLElement {
  playerInstance: {
    play: () => void;
    pause: () => void;
    stop: () => void;
    setSpeed: (speed: number) => void;
    setDirection: (direction: number) => void;
    getCurrentFrame: () => number;
    getTotalFrames: () => number;
  };
}

export interface AnimateIconRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  element: AnimateIconElement | null;
}

export interface AnimateIconProps {
  src: AnimateIconVariants;
  trigger?:
    | "hover"
    | "click"
    | "loop"
    | "loop-on-hover"
    | "morph"
    | "boomerang"
    | "mount"
    | "mount-loop";
  colors?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    quaternary?: string;
  };
  size?: number;
  delay?: number;
  stroke?: "light" | "regular" | "bold";
  scale?: number;
  axis?: "x" | "y";
  direction?: 1 | -1;
  speed?: number;
  className?: string;
  target?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onComplete?: () => void;
  onReady?: () => void;
  playOnMount?: boolean;
  mountDelay?: number;
  loading?: "lazy" | "interaction";
  state?: string;
  children?: React.ReactNode;
  ref?: React.Ref<AnimateIconRef>;
}

export interface AnimateIconFallbackProps
  extends Partial<Omit<React.ComponentProps<typeof Image>, "src">> {
  src?: AnimateIconVariants;
}
