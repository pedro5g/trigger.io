import { Suspense } from "react";
import { ProjectsTable } from "./_components/projects-table";
import { ProjectsTableSkeleton } from "./_components/projects-table-skeleton";
import { AnimateIcon } from "@/app/_components/animate-icons/animation-icon";
import { LORDICON_THEMES } from "@/constants";
import { CreateProject } from "./_components/create-project";

export default function Projects() {
  return (
    <div className="relative space-y-4">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="inline-flex w-full items-center justify-between">
              <h1 className="inline-flex items-center text-4xl font-bold">
                Projects{" "}
                <AnimateIcon
                  src="assignment"
                  colors={LORDICON_THEMES.dark}
                  trigger="mount"
                  target="h1"
                  delay={20}
                  aria-hidden={true}
                  className="ml-2"
                />
              </h1>
              <CreateProject />
            </div>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage your API projects and configurations
            </p>
          </div>
        </div>
      </div>
      <Suspense fallback={<ProjectsTableSkeleton />}>
        <ProjectsTable />
      </Suspense>
    </div>
  );
}
