import type { ProjectStatus as ProjectStatusType } from "@/lib/api/endpoints/endpoints.types";
import { cn } from "@/lib/utils";

interface ProjectStatusProps {
  status: ProjectStatusType;
  className?: string;
}

export const ProjectStatus = ({ status, className }: ProjectStatusProps) => {
  return (
    <div className={cn("flex items-center text-xs capitalize", className)}>
      <div
        aria-hidden={true}
        data-status={status}
        className="mr-1 size-2 rounded-full bg-gray-600 shadow data-[status='active']:bg-green-600 data-[status='inactive']:bg-yellow-600 data-[status='suspended']:bg-red-600"
      />
      <span aria-label="project-status">{status}</span>
    </div>
  );
};
