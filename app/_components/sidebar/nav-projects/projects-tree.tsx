import { ApiListProjects } from "@/lib/api/endpoints/endpoints.server";
import { ProjectsTreeClient } from "./projects-tree-client";

export const ProjectsTree = async () => {
  const [, data] = await ApiListProjects();

  return <ProjectsTreeClient projects={data?.projects ?? []} />;
};
