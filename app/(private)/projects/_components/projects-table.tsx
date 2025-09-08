import { AnimateIcon } from "@/app/_components/animate-icons/animation-icon";
import {
  Table,
  TBody,
  Td,
  TFooter,
  Th,
  THead,
  Tr,
} from "@/app/_components/table/custom-table";
import { LORDICON_THEMES } from "@/constants";
import { HoverPrefetchLink } from "@/app/_components/ui/hover-prefetch-link";
import { Input } from "@/app/_components/ui/input";
import { ApiListProjects } from "@/lib/api/endpoints/endpoints.server";
import { Button } from "@/app/_components/ui/button";
import {
  InfoBox,
  InfoBoxAuxiliaryText,
  InfoBoxTitle,
} from "@/app/_components/table/info-box";
import { ProjectStatus } from "@/app/_components/ui/project-status";

export const ProjectsTable = async () => {
  const [err, data] = await ApiListProjects();

  if (err) {
    return (
      <InfoBox>
        <InfoBoxTitle>
          Something went wrong while loading your projects
        </InfoBoxTitle>
        <InfoBoxAuxiliaryText>
          Please try again in a moment
        </InfoBoxAuxiliaryText>
      </InfoBox>
    );
  }

  if (data.projects.length === 0) {
    return (
      <InfoBox>
        <InfoBoxTitle>No projects found</InfoBoxTitle>
        <InfoBoxAuxiliaryText>
          Get started by creating your first project
        </InfoBoxAuxiliaryText>
      </InfoBox>
    );
  }
  console.log("render render");
  return (
    <div className="space-y-4">
      <div className="inline-flex w-full items-center justify-between">
        <div className="relative w-full max-w-xl">
          <AnimateIcon
            src="search"
            colors={LORDICON_THEMES.dark}
            trigger="mount"
            target="div"
            size={20}
            className="absolute start-3 top-1/2 -translate-y-1/2"
            aria-hidden={true}
          />
          <Input className="h-8 rounded-lg pl-10" placeholder="Search..." />
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          className="size-8 hover:opacity-90"
        >
          <AnimateIcon
            src="download"
            colors={LORDICON_THEMES.dark}
            trigger="mount"
            target="button"
            size={20}
            aria-hidden={true}
          />
        </Button>
      </div>
      <Table>
        <THead>
          <Tr className="hover:bg-transparent">
            <Th>Project</Th>
            <Th>Domain</Th>
            <Th>Status</Th>
            <Th>Created</Th>
          </Tr>
        </THead>
        <TBody>
          {data.projects.map((project) => (
            <Tr key={project.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="hidden size-8 items-center justify-center rounded-lg text-sm lg:flex">
                    {project.icon || "📦"}
                  </div>
                  <div>
                    <HoverPrefetchLink
                      href={`/projects/${project.id}?modal.create-project=true`}
                    >
                      <div className="text-foreground font-medium underline-offset-2 hover:underline">
                        {project.project_name}
                      </div>
                    </HoverPrefetchLink>
                    {project.description && (
                      <div className="text-muted-foreground hidden max-w-xs truncate text-sm lg:block">
                        {project.description}
                      </div>
                    )}
                  </div>
                </div>
              </Td>
              <Td>
                <div className="flex items-center">
                  {project.domain ? (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <AnimateIcon
                        src="globe"
                        colors={LORDICON_THEMES.dark}
                        trigger="mount"
                        target="td"
                        size={16}
                      />

                      {project.domain}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </div>
              </Td>
              <Td>
                <ProjectStatus status={project.status} />
              </Td>

              <Td>
                <div className="flex items-center">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <AnimateIcon
                      src="clock"
                      colors={LORDICON_THEMES.dark}
                      trigger="mount"
                      target="td"
                      size={16}
                    />
                    {new Date(project.created_at).toLocaleString()}
                  </div>
                </div>
              </Td>
            </Tr>
          ))}
        </TBody>
        <TFooter>
          <Tr>
            <Td colSpan={4}>
              <div className="inline-flex items-center justify-between">
                <span className="text-xs font-normal text-zinc-200">
                  Page 1 – 1 of {data.projects.length} Projects
                </span>
              </div>
            </Td>
          </Tr>
        </TFooter>
      </Table>
    </div>
  );
};
