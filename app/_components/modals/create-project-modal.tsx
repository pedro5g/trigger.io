"use client";
import { useModalState } from "@/hooks/nuqs/use-modal-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LORDICON_THEMES, MODAL_NAMES } from "@/constants";
import { Form } from "../rhf/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProjectSchema,
  type CreateProjectSchemaType,
} from "./schemas/create-project.schema";
import { InputField } from "../rhf/input";
import { TextareaField } from "../rhf/textarea";
import { EmojiSelector } from "../rhf/emoji-selector";
import { useServerAction } from "zsa-react";
import { createProjectAction } from "./actions/create-project";
import { Loader2 } from "lucide-react";
import { toast } from "../ui/sonner";
import { sleep } from "@/lib/utils";
import { AnimateIcon } from "../animate-icons/aniamtion-icon";

export const CreateProjectModal = () => {
  const { isOpen, openChange, close } = useModalState();

  const methods = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      description: "",
      domain: "",
      icon: "",
    },
  });

  const { execute, isPending, isSuccess } = useServerAction(
    createProjectAction,
    {
      async onSuccess() {
        toast.success("Project create successfully");
        await sleep();
        close();
      },
    },
  );

  const onSubmit = ({
    projectName,
    description,
    domain,
    icon,
  }: CreateProjectSchemaType) => {
    if (isPending) return;
    execute({
      projectName,
      description,
      domain,
      icon,
    });
  };

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={(isOpen) => openChange(isOpen, MODAL_NAMES.CREATE_PROJECT)}
    >
      <DialogContent className="rounded-3xl border-4 border-blue-950/40 bg-zinc-950 before:absolute before:inset-0 before:-z-10 before:bg-blue-950/10">
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Spin up a new project 🚀
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Give your project a name, and optionally add a description, domain
              and icon. You can tweak these settings later.
            </DialogDescription>
          </DialogHeader>
        </div>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div className="inline-flex w-full items-center gap-2">
                <div className="flex-80">
                  <InputField<CreateProjectSchemaType>
                    name="projectName"
                    label="Enter with project name"
                  />
                </div>
                <div className="mt-[13.8px] flex flex-10 items-baseline">
                  <EmojiSelector<CreateProjectSchemaType> name="icon" />
                </div>
              </div>
              <TextareaField<CreateProjectSchemaType>
                name="description"
                label="Project description"
                className="h-20 md:min-h-40"
              />
              <InputField<CreateProjectSchemaType>
                name="domain"
                label="Project domain"
                placeholder="https://google.com"
              />
            </div>
            <Button
              disabled={isPending || isSuccess}
              type="submit"
              className="w-full text-white"
            >
              Register
              {isPending && <Loader2 className="animate-spin" />}
              {isSuccess && (
                <AnimateIcon
                  src="success"
                  size={20}
                  colors={LORDICON_THEMES.success}
                  speed={0.5}
                  trigger="mount"
                />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
