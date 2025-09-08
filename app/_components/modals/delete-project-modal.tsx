"use client";

import {
  Button,
  ButtonKbd,
  ButtonLabel,
  ButtonLoader,
} from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { useModalState } from "@/hooks/use-modal-state";
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
  const { openChange, target, close, isOpen } = useModalState(
    MODAL_NAMES.DISABLE_PROJECT,
  );
  const [projectId, projectName] = (target || "").split("&");

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
  console.log("render");
  return (
    <Dialog modal open={isOpen} onOpenChange={openChange}>
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
                disabled={inputValue !== CONFIRMATION_TEXT}
                variant={"destructive"}
                size="sm"
                loading={isPending}
              >
                <ButtonLabel>Delete Project</ButtonLabel>
                <ButtonLoader />
                <ButtonKbd>↩</ButtonKbd>
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" size="sm">
                  <ButtonLabel>Cancel</ButtonLabel>
                  <ButtonKbd>Esc</ButtonKbd>
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
