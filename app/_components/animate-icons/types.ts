export interface LordIconProps {
  src: string;
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
  stroke?: number;
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
}

export interface LordIconButtonProps extends Omit<LordIconProps, "size"> {
  children?: React.ReactNode;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  loadingIcon?: string;
}

export interface LordIconElement extends HTMLElement {
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
