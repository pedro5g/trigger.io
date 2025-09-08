"use client";

import { AnimateIcon } from "@/app/_components/animate-icons/animation-icon";
import {
  SwapIcons,
  SwapIconsEnd,
  SwapIconsStart,
} from "@/app/_components/animate-icons/swap-icons";
import { Button } from "@/app/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { LORDICON_THEMES } from "@/constants";
import { useCopy } from "@/hooks/use-copy";

interface CopyIdProps {
  id: string;
}

export const CopyId = ({ id }: CopyIdProps) => {
  const { handleCopy, copied } = useCopy();

  return (
    <div className="group col-span-2 flex w-fit items-end gap-2 p-2">
      <div className="space-y-2 [&_span]:block">
        <span className="text-muted-foreground/60">Project ID</span>
        <span className="truncate font-mono">{id}</span>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleCopy(id)}
              variant="outline"
              size={"icon"}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex size-7 items-center justify-center rounded-e-md border-none opacity-0 transition-[color,box-shadow] duration-500 ease-in-out outline-none group-hover:opacity-100 focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100 dark:bg-transparent"
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              disabled={copied}
            >
              <SwapIcons trigger="controlled" isSwapping={copied}>
                <SwapIconsStart>
                  <AnimateIcon
                    src="copy"
                    colors={LORDICON_THEMES.dark}
                    trigger="mount-loop"
                    target="button"
                    size={20}
                    aria-hidden={true}
                  />
                </SwapIconsStart>
                <SwapIconsEnd>
                  <AnimateIcon
                    src="success"
                    colors={LORDICON_THEMES.success}
                    trigger="mount-loop"
                    target="button"
                    size={20}
                    aria-hidden={true}
                  />
                </SwapIconsEnd>
              </SwapIcons>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs text-white">
            Copy project Id
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
