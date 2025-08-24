"use client";

import { CircleAlertIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { useModalState } from "@/hooks/nuqs/use-modal-state";
import { MODAL_NAMES } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deleteProjectSchema,
  type DeleteProjectSchemaType,
} from "./schemas/delete-project.schema";
import { Form } from "../rhf/form";
import { InputField } from "../rhf/input";
import { Label } from "../ui/label";
import { useServerAction } from "zsa-react";
import { toast } from "../ui/sonner";
import { sleep } from "@/lib/utils";
import { deleteProjectAction } from "./actions/delete-project";

const CONFIRMATION_TEXT = "DELETE";

export const DeleteProjectModal = () => {
  const { isOpen, openChange, target, close } = useModalState();
  const [projectId, projectName] = target.split("&");

  const methods = useForm({
    resolver: zodResolver(deleteProjectSchema),
    defaultValues: {
      confirmationText: "" as "DELETE", // nesting type
      projectId,
    },
  });

  const { execute, isPending } = useServerAction(deleteProjectAction, {
    async onSuccess() {
      toast.success("Project deleted successfully");
      await sleep();
      close();
    },
  });

  const inputValue = methods.watch("confirmationText");

  const onSubmit = async ({
    confirmationText,
    projectId,
  }: DeleteProjectSchemaType) => {
    if (isPending) return;
    await execute({
      confirmationText,
      projectId,
    });
  };

  return (
    <Dialog
      modal
      open={isOpen}
      onOpenChange={(isOpen) => openChange(isOpen, MODAL_NAMES.DISABLE_PROJECT)}
    >
      <DialogContent className="rounded-3xl border-4 border-red-950/40 bg-zinc-950 before:absolute before:inset-0 before:-z-10 before:bg-red-950/10">
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Delete project confirmation
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Are you sure you want to delete the <strong>{projectName}</strong>{" "}
              project?
              <strong className="text-red-500">This can not be undone.</strong>.
            </DialogDescription>
          </DialogHeader>
        </div>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-5">
            <div className="*:not-first:mt-2">
              <Label htmlFor="confirmation_text" className="font-light">
                Type <strong className="font-bold">DELETE</strong> to confirm
              </Label>
              <InputField<DeleteProjectSchemaType>
                className="selection:bg-red-400 selection:text-red-100 focus-visible:border-red-500 focus-visible:ring-0"
                autoComplete="off"
                name="confirmationText"
                id="confirmation_text"
              />
            </div>
            <DialogFooter className="flex-col sm:justify-start">
              <Button
                type="button"
                className="relative gap-1 bg-red-500 px-3 text-red-100 hover:bg-red-500/90 disabled:cursor-not-allowed"
                disabled={inputValue !== CONFIRMATION_TEXT}
                size="sm"
              >
                <span
                  data-loading={isPending}
                  className="absolute inset-0 flex w-full items-center justify-center data-[loading='false']:invisible"
                >
                  <span className="inline-flex items-center gap-1">
                    <span className="animate-plop h-1 w-1 rounded-full bg-red-200"></span>
                    <span className="animate-plop2 h-1 w-1 rounded-full bg-red-200"></span>
                    <span className="animate-plop3 h-1 w-1 rounded-full bg-red-200"></span>
                  </span>
                </span>
                <span
                  data-loading={isPending}
                  className="inline-flex min-w-0 items-center justify-center gap-1 truncate data-[loading='true']:invisible"
                >
                  Delete Project
                </span>
                <div
                  data-loading={isPending}
                  className="flex items-center gap-1 pl-1 data-[loading='true']:invisible"
                >
                  <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-red-400 px-1 text-base font-normal text-red-100 uppercase select-none">
                    ↩
                  </kbd>
                </div>
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1 px-3"
                >
                  <span className="visible inline-flex min-w-0 items-center justify-center gap-1 truncate">
                    Cancel
                  </span>
                  <div className="flex items-center gap-1 pl-1">
                    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-zinc-800/80 px-1 text-xs font-normal text-zinc-200 select-none">
                      Esc
                    </kbd>
                  </div>
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
