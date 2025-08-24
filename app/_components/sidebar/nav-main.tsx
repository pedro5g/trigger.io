"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar";
import { LordIcon } from "../animate-icons/lord-icon";
import type { ReactElement } from "react";
import { LORDICON_LIBRARY, LORDICON_THEMES } from "@/constants";

import Link from "next/link";

export const MAIN_LINKS: {
  title: string;
  href: string;
  icon: ReactElement;
}[] = [
  {
    title: "Broadcast",
    href: "/broadcast",
    icon: (
      <LordIcon
        colors={LORDICON_THEMES.dark}
        src={LORDICON_LIBRARY.inbox}
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
      <LordIcon
        colors={LORDICON_THEMES.dark}
        src={LORDICON_LIBRARY.assignment}
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
      <LordIcon
        colors={LORDICON_THEMES.dark}
        src={LORDICON_LIBRARY.lockClosed}
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
      <LordIcon
        colors={LORDICON_THEMES.dark}
        src={LORDICON_LIBRARY.swap}
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
      <LordIcon
        colors={LORDICON_THEMES.dark}
        src={LORDICON_LIBRARY.globe}
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
      <LordIcon
        colors={LORDICON_THEMES.dark}
        src={LORDICON_LIBRARY.metrics}
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
      <LordIcon
        colors={LORDICON_THEMES.dark}
        src={LORDICON_LIBRARY.settings}
        speed={5}
        size={20}
        target="a"
        trigger="hover"
      />
    ),
  },
];

export function NavMain() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Features</SidebarGroupLabel>
      <SidebarMenu>
        {MAIN_LINKS.map((item) => {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="hover:bg-blue-950/20 focus-visible:bg-blue-950/25"
                asChild
              >
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
