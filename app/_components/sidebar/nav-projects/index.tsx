import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarSeparator,
} from "@/app/_components/ui/sidebar";
import { CreateButton } from "./create-button";
import { Suspense } from "react";
import { ProjectsTree } from "./projects-tree";
import { ProjectsTreeSkeleton } from "./projects-tree-skeleton";
import Link from "next/link";

export function NavProjects() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="inline-flex items-center">
        <Link href="/projects">Projects</Link>
        <CreateButton />
      </SidebarGroupLabel>
      <SidebarSeparator className="my-2" />
      <SidebarMenu>
        <Suspense fallback={<ProjectsTreeSkeleton />}>
          <ProjectsTree />
        </Suspense>
      </SidebarMenu>
    </SidebarGroup>
  );
}
