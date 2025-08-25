"use client";
import React, { useEffect, useRef, useState } from "react";
import { Webhook, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { LORDICON_THEMES } from "@/constants";
import { AnimateIcon } from "../animate-icons/aniamtion-icon";

const FEATURES = [
  {
    icon: Webhook,
    title: "Advanced Webhooks",
    description:
      "Complete control over notification lifecycle with customizable webhooks and real-time event handling for seamless integration.",
    badge: "New",
    codeExample: "webhook.on('notification.sent', callback)",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description:
      "Ultra-low latency with our globally distributed infrastructure and edge computing technology for maximum performance.",
    badge: null,
    codeExample: "await push.send({ urgent: true })",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "End-to-end encryption with GDPR compliance and advanced threat protection protocols for enterprise-grade security.",
    badge: null,
    codeExample: "encrypt: 'AES-256-GCM'",
  },
];

export function FeaturesSection() {
  const [animateHeader, setAnimateHeader] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          //@ts-ignore
          const index = parseInt(entry.target.dataset.index);
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActiveCard(index);
          }
        });
      },
      {
        threshold: 0.6,
        rootMargin: "-30% 0px -30% 0px",
      },
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateHeader(true);
          } else {
            setAnimateHeader(false);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0.2, 0.5, 1],
      },
    );

    if (headerRef.current) observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"
      />

      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-400/3 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        <div
          ref={headerRef}
          className={cn(
            "mx-auto mb-24 max-w-3xl translate-y-12 text-center opacity-0 transition-[transform_0.6s_,_opacity_0.9s] duration-1100",
            animateHeader && "translate-y-0 opacity-100 delay-0",
          )}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
            <span className="text-sm text-gray-300">Features</span>
          </div>

          <h1 className="mb-6 text-4xl leading-tight font-bold text-white md:text-6xl">
            Everything you need for
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              {" "}
              push notifications
            </span>
          </h1>

          <p className="text-lg leading-relaxed text-gray-400">
            A complete platform with all the tools developers need to create,
            send and optimize push notifications at scale.
          </p>
        </div>

        <div className="space-y-32">
          {FEATURES.map((feature, index) => {
            const IconComponent = feature.icon;
            const isActive = activeCard === index;

            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) {
                    cardsRef.current[index] = el;
                  }
                }}
                data-index={index}
                className={`transition-all duration-700 ease-out ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-60"
                }`}
              >
                <div className="grid items-center gap-16 lg:grid-cols-2">
                  <div
                    className={`space-y-8 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                          <IconComponent className="h-6 w-6 text-blue-400" />
                        </div>
                        {feature.badge && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                            <div className="h-1 w-1 rounded-full bg-blue-400"></div>
                            {feature.badge}
                          </span>
                        )}
                      </div>

                      <h2 className="text-3xl font-bold text-white md:text-4xl">
                        {feature.title}
                      </h2>

                      <p className="text-lg leading-relaxed text-gray-400">
                        {feature.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-900 transition-colors duration-200 hover:bg-gray-100">
                        Get started
                        <AnimateIcon
                          src="arrowDown"
                          size={16}
                          colors={LORDICON_THEMES.default}
                          speed={0.5}
                          target="button"
                          trigger="hover"
                          className="ml-2 -rotate-90"
                        />
                      </button>
                      <button className="text-gray-400 transition-colors duration-200 hover:text-white">
                        Learn more →
                      </button>
                    </div>
                  </div>

                  <div className={cn(index % 2 === 1 && "lg:order-1")}>
                    <div
                      className={cn(
                        "relative scale-95 transition-all duration-500",
                        isActive && "scale-100",
                      )}
                    >
                      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.07]">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex gap-1.5">
                            <div className="h-3 w-3 rounded-full bg-red-500/60"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500/60"></div>
                          </div>
                          <div className="text-sm text-gray-500">api.ts</div>
                        </div>

                        <div className="rounded-lg bg-black/20 p-4 font-mono text-sm">
                          <div className="mb-2 text-gray-500">
                            // {feature.title}
                          </div>
                          <div className="text-blue-400">
                            <span className="text-purple-400">const</span>{" "}
                            notification ={" "}
                            <span className="text-yellow-300">await</span> push.
                          </div>
                          <div className="ml-4 text-white">
                            {feature.codeExample}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                            <span className="text-xs text-gray-400">
                              Connected
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {index === 0 && "< 1ms response"}
                            {index === 1 && "99.9% uptime"}
                            {index === 2 && "Enterprise ready"}
                          </div>
                        </div>
                      </div>

                      {isActive && (
                        <div className="absolute inset-0 -z-10 rounded-2xl bg-blue-500/10 blur-xl"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
