"use client";
import { Button } from "@/app/_components/ui/button";
import { Webhook, Zap } from "lucide-react";
import { Badge } from "../ui/badge";
import { MultiDeviceDemo } from "@/app/_components/landing/multi-device-demo";
import { LORDICON_THEMES } from "@/constants";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimateIcon } from "../animate-icons/aniamtion-icon";

export function HeroSection() {
  const [animating, setAnimating] = useState(false);

  const heroDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimating(true);
          } else {
            setAnimating(false);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0.3],
      },
    );

    if (heroDivRef.current) observer.observe(heroDivRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-20 lg:py-32">
      <div className="relative container mx-auto">
        <div
          ref={heroDivRef}
          className="grid items-center gap-28 lg:grid-cols-2 lg:gap-12"
        >
          <div
            className={cn(
              "-translate-x-12 space-y-8 opacity-0 transition-[transform_0.6s_,_opacity_0.9s] duration-900",
              animating && "translate-x-0 opacity-100 delay-0",
            )}
          >
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="border-blue-700 bg-blue-900/50 text-blue-300 hover:bg-blue-800/50"
              >
                <Zap className="mr-1 h-3 w-3" />
                Smart Push Notifications
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
                Push Notifications
                <span className="text-blue-400"> for Devs</span>
              </h1>

              <p className="max-w-lg text-xl text-gray-300">
                Complete push notifications platform with fine control via
                webhooks. Integrate in minutes, scale to millions.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Start Free
                <AnimateIcon
                  src="arrow"
                  size={16}
                  colors={LORDICON_THEMES.dark}
                  speed={0.5}
                  target="button"
                  trigger="hover"
                  className="ml-2"
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                See Documentation
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Webhook className="h-4 w-4" />
                <span>Advanced Webhooks</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Instant Delivery</span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "relative translate-x-12 space-y-8 opacity-0 transition-[transform_0.6s_,_opacity_0.9s] duration-300",
              animating && "translate-x-0 opacity-100 delay-0",
            )}
          >
            <MultiDeviceDemo animating={animating} />
          </div>
        </div>
      </div>
    </section>
  );
}
