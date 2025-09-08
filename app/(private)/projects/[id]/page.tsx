import { Settings } from "lucide-react";
import type { Project } from "@/lib/api/endpoints/endpoints.types";
import { ApiGetProject } from "@/lib/api/endpoints/endpoints.server";
import { redirect } from "next/navigation";
import { AnimateIcon } from "@/app/_components/animate-icons/animation-icon";
import { LORDICON_THEMES } from "@/constants";
import { EditForm } from "./_components/form";
import { CopyId } from "./_components/copy-id";
import { WebhookSecret } from "./_components/webhook-secret";

export default async function Project({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const projectId = (await params).id;
  const [err, data] = await ApiGetProject({ projectId });

  if (err) {
    redirect("/projects");
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-center text-gray-300">
        <Settings className="mx-auto mb-4 h-12 w-12 text-gray-500" />
        <div>
          <h3 className="text-lg font-semibold text-white">
            Project not found
          </h3>
          <p>The requested project could not be found in your workspace.</p>
        </div>
      </div>
    );
  }

  const { project } = data;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 text-gray-200">
      <EditForm project={project} />
      <div className="space-y-3">
        <h2 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <AnimateIcon
            src="speed"
            colors={LORDICON_THEMES.dark}
            trigger="mount-loop"
            target="h2"
            size={24}
            aria-hidden={true}
          />
          Rate Limits
        </h2>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col text-center">
            <span className="text-muted-foreground/60">Per Minute</span>
            <span className="font-mono">{project.rate_limit_per_minute}</span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-muted-foreground/60">Per Hour</span>
            <span className="font-mono">{project.rate_limit_per_hour}</span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-muted-foreground/60">Per Day</span>
            <span className="font-mono">{project.rate_limit_per_day}</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <AnimateIcon
            src="verified"
            colors={LORDICON_THEMES.dark}
            trigger="mount-loop"
            target="h2"
            size={24}
            aria-hidden={true}
          />
          Webhook Secret
        </h2>
        <WebhookSecret webhookSecret={project.webhook_secret} />
      </div>
      <div className="space-y-3">
        <h2 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <AnimateIcon
            src="menu"
            colors={LORDICON_THEMES.dark}
            trigger="mount-loop"
            size={24}
            target="h2"
            aria-hidden={true}
          />
          Project Metadata
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <CopyId id={project.id} />
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground/60 flex items-center gap-2">
                <AnimateIcon
                  src="clock"
                  colors={LORDICON_THEMES.dark}
                  trigger="mount-loop"
                  target="span"
                  size={20}
                  aria-hidden={true}
                />
                Created
              </span>
              <span className="ml-2">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
            {project.updated_at && (
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground/60 flex items-center gap-2">
                  <AnimateIcon
                    src="clock"
                    colors={LORDICON_THEMES.dark}
                    trigger="mount-loop"
                    target="span"
                    size={20}
                    aria-hidden={true}
                  />
                  Updated
                </span>
                <span className="ml-2">
                  {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
