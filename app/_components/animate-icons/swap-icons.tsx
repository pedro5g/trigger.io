import { cn } from "@/lib/utils";

type SwapIconsProps =
  | { trigger?: "hover"; isSwapping?: "off"; delay?: number }
  | { trigger: "controlled"; isSwapping: boolean; delay?: number };

function SwapIcons({
  className,
  trigger = "hover",
  isSwapping = "off",
  delay = 0,
  ...props
}: React.ComponentProps<"div"> & SwapIconsProps) {
  const delayClass = delay ? `delay-[${delay}ms]` : "";
  return (
    <div
      data-comp="swap-icon-wrapper"
      data-swap-trigger={isSwapping}
      className={cn(
        "group relative",
        trigger === "hover" &&
          "[&>div[data-comp='swap-icon-end']]:group-hover:scale-100 [&>div[data-comp='swap-icon-end']]:group-hover:opacity-100 [&>div[data-comp='swap-icon-start']]:group-hover:scale-0 [&>div[data-comp='swap-icon-start']]:group-hover:opacity-0",
        trigger === "controlled" &&
          "data-[swap-trigger=true]:[&>div[data-comp='swap-icon-end']]:scale-100 data-[swap-trigger=true]:[&>div[data-comp='swap-icon-end']]:opacity-100 data-[swap-trigger=true]:[&>div[data-comp='swap-icon-start']]:scale-0 data-[swap-trigger=true]:[&>div[data-comp='swap-icon-start']]:opacity-0",
        delay &&
          `[&>div[data-comp='swap-icon-end']]:${delayClass}! [&>div[data-comp='swap-icon-start']]:${delayClass}!`,
        className,
      )}
      {...props}
    />
  );
}

function SwapIconsStart({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-comp="swap-icon-start"
      className={cn(
        "absolute top-1/2 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 scale-100 items-center justify-center opacity-100 transition-all",
        className,
      )}
      {...props}
    />
  );
}

function SwapIconsEnd({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-comp="swap-icon-end"
      className={cn(
        "absolute top-1/2 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center opacity-0 transition-all",
        className,
      )}
      {...props}
    />
  );
}

export { SwapIcons, SwapIconsStart, SwapIconsEnd };
