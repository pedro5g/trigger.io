"use client";

import { Avatar, AvatarFallback } from "@/app/_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/_components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getInitials } from "@/lib/utils";
import { LORDICON_THEMES } from "@/constants";
import { useServerAction } from "zsa-react";
import { logoutAction } from "@/app/_actions/logout";
import { AnimateIcon } from "../animate-icons/aniamtion-icon";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, isAuthenticated } = useCurrentUser();
  const { execute, isPending: isLogoutPending } = useServerAction(logoutAction);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:text-sidebar-accent-foreground hover:bg-blue-950/20 data-[state=open]:bg-blue-950/20"
            >
              {isAuthenticated && (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-blue-950/60">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </>
              )}

              <AnimateIcon
                src="threeDots"
                colors={LORDICON_THEMES.dark}
                speed={5}
                size={16}
                target="button"
                trigger="loop-on-hover"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              {isAuthenticated && (
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <AnimateIcon
                  src="user"
                  colors={LORDICON_THEMES.dark}
                  size={20}
                  target="div"
                  trigger="hover"
                />
                My profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <AnimateIcon
                  src="bell"
                  colors={LORDICON_THEMES.dark}
                  size={20}
                  target="div"
                  trigger="hover"
                />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AnimateIcon
                  src="list"
                  colors={LORDICON_THEMES.dark}
                  size={20}
                  target="div"
                  trigger="hover"
                />
                Onboarding
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => execute()}
              disabled={isLogoutPending}
            >
              <AnimateIcon
                src="exitRoom"
                colors={LORDICON_THEMES.dark}
                size={20}
                target="div"
                trigger="hover"
              />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
