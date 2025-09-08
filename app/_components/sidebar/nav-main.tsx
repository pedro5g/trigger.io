"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar";
import type { ReactElement } from "react";
import { LORDICON_THEMES } from "@/constants";

import Link from "next/link";
import { AnimateIcon } from "../animate-icons/animation-icon";
import { usePathname } from "next/navigation";

export const MAIN_LINKS: {
  title: string;
  href: string;
  icon: ReactElement;
}[] = [
  {
    title: "Broadcast",
    href: "/broadcast",
    icon: (
      <AnimateIcon
        src="inbox"
        colors={LORDICON_THEMES.dark}
        speed={5}
        size={20}
        target="a"
        trigger="hover"
      />
    ),
  },

  {
    title: "Projects",
    href: "/projects",
    icon: (
      <AnimateIcon
        src="assignment"
        colors={LORDICON_THEMES.dark}
        speed={5}
        size={20}
        target="a"
        trigger="hover"
      />
    ),
  },
  {
    title: "API keys",
    href: "/api-keys",
    icon: (
      <AnimateIcon
        src="lockClosed"
        colors={LORDICON_THEMES.dark}
        speed={5}
        size={20}
        target="a"
        trigger="hover"
      />
    ),
  },
  {
    title: "Webhooks",
    href: "/webhooks",
    icon: (
      <AnimateIcon
        src="swap"
        colors={LORDICON_THEMES.dark}
        speed={5}
        size={20}
        target="a"
        trigger="hover"
      />
    ),
  },
  {
    title: "Domais",
    href: "/domais",
    icon: (
      <AnimateIcon
        src="globe"
        colors={LORDICON_THEMES.dark}
        speed={5}
        size={20}
        target="a"
        trigger="hover"
      />
    ),
  },
  {
    title: "Metrics",
    href: "/metrics",
    icon: (
      <AnimateIcon
        src="metrics"
        colors={LORDICON_THEMES.dark}
        speed={5}
        size={20}
        target="a"
        trigger="hover"
      />
    ),
  },
  {
    title: "Settings",
    href: "/settings",
    icon: (
      <AnimateIcon
        src="settings"
        colors={LORDICON_THEMES.dark}
        speed={5}
        size={20}
        target="a"
        trigger="hover"
      />
    ),
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Features</SidebarGroupLabel>
      <SidebarMenu>
        {MAIN_LINKS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
