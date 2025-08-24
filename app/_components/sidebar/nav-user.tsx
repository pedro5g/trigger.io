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
import { LordIcon } from "../animate-icons/lord-icon";
import { LORDICON_LIBRARY, LORDICON_THEMES } from "@/constants";
import { useServerAction } from "zsa-react";
import { logoutAction } from "@/app/_actions/logout";

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
              <LordIcon
                colors={LORDICON_THEMES.dark}
                src={LORDICON_LIBRARY.menu}
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
                <LordIcon
                  colors={LORDICON_THEMES.dark}
                  src={LORDICON_LIBRARY.user}
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
                <LordIcon
                  colors={LORDICON_THEMES.dark}
                  src={LORDICON_LIBRARY.bell}
                  size={20}
                  target="div"
                  trigger="hover"
                />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LordIcon
                  colors={LORDICON_THEMES.dark}
                  src={LORDICON_LIBRARY.list}
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
              <LordIcon
                colors={LORDICON_THEMES.dark}
                src={LORDICON_LIBRARY.exitRoom}
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
