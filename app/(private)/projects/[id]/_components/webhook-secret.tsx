"use client";

import { useState } from "react";
import { Input } from "@/app/_components/ui/input";
import { AnimateIcon } from "@/app/_components/animate-icons/animation-icon";
import { Button } from "@/app/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { LORDICON_THEMES } from "@/constants";
import { useCopy } from "@/hooks/use-copy";
import {
  SwapIcons,
  SwapIconsEnd,
  SwapIconsStart,
} from "@/app/_components/animate-icons/swap-icons";

interface WebhookSecretProps {
  webhookSecret: string;
}

export const WebhookSecret = ({ webhookSecret }: WebhookSecretProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { handleCopy, copied } = useCopy();

  return (
    <div className="flex gap-2">
      <div className="relative w-full">
        <Input
          readOnly
          value={webhookSecret}
          className="w-full pe-9 font-extrabold"
          placeholder="Password"
          type={isVisible ? "text" : "password"}
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          <SwapIcons trigger="controlled" isSwapping={isVisible} delay={800}>
            <SwapIconsStart>
              <AnimateIcon
                src="eye"
                size={16}
                colors={LORDICON_THEMES.dark}
                trigger="hover"
                state="hover-eye-lashes"
                aria-hidden="true"
                target="button"
              />
            </SwapIconsStart>
            <SwapIconsEnd>
              <AnimateIcon
                src="eye"
                size={16}
                colors={LORDICON_THEMES.dark}
                trigger="mount-loop"
                aria-hidden="true"
                target="button"
              />
            </SwapIconsEnd>
          </SwapIcons>
        </button>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleCopy(webhookSecret)}
              variant="outline"
              size={"icon"}
              aria-label={copied ? "Copied" : "Copy to clipboard"}
              disabled={copied}
              className="disabled:opacity-100"
            >
              <SwapIcons trigger="controlled" isSwapping={copied}>
                <SwapIconsStart>
                  <AnimateIcon
                    className="z-10"
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
                    className="z-10"
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
            Copy webhook secret
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
