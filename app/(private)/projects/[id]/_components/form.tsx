"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editProjectSchema, type EditProjectSchemaType } from "../schema";
import type { Project } from "@/lib/api/endpoints/endpoints.types";
import { Form } from "@/app/_components/rhf/form";
import { EmojiSelector } from "@/app/_components/rhf/emoji-selector";
import { ProjectStatus } from "@/app/_components/ui/project-status";
import { Label } from "@/app/_components/ui/label";
import { AnimateIcon } from "@/app/_components/animate-icons/animation-icon";
import { LORDICON_THEMES, MODAL_NAMES } from "@/constants";
import { InputField } from "@/app/_components/rhf/input";
import { TextareaField } from "@/app/_components/rhf/textarea";
import { sleep } from "@/lib/utils";
import { Button, ButtonKbd, ButtonLabel } from "@/app/_components/ui/button";
import { useRef, useState } from "react";
import { useShortcut } from "@/hooks/use-shortcut";
import { useModalState } from "@/hooks/use-modal-state";

interface EditFormProps {
  project: Project;
}

const CANCEL_EDIT_KEYBIND = "Escape";
const SAVE_EDITIONS_KEYBIND = "Enter";
const EDIT_KEYBIND = "E";
const DELETE_PROJECT = "D";

export const EditForm = ({ project }: EditFormProps) => {
  const [editing, setEditing] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { open } = useModalState(MODAL_NAMES.DISABLE_PROJECT);

  const methods = useForm({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      projectId: project.id,
      projectName: project.project_name,
      description: project.description,
      domain: project.domain,
      icon: project.icon,
    },
  });

  useShortcut((e) => {
    if (editing) {
      if (e.key === CANCEL_EDIT_KEYBIND) {
        setEditing(false);
      }
      if (
        e.ctrlKey &&
        e.key === SAVE_EDITIONS_KEYBIND &&
        methods.formState.isDirty
      ) {
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    } else {
      if (e.ctrlKey && e.key === EDIT_KEYBIND) {
        setEditing(true);
      }
      if (e.ctrlKey && e.key === DELETE_PROJECT) {
        e.preventDefault();
        open(project.id + "&" + project.project_name);
      }
    }
  });

  const onSubmit = async ({
    projectId,
    projectName,
    description,
    domain,
    icon,
  }: EditProjectSchemaType) => {
    console.log({
      projectId,
      projectName,
      description,
      domain,
      icon,
    });
    await sleep(5000000);
  };

  return (
    <Form {...methods}>
      <form
        className="space-y-6"
        ref={formRef}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div>
              <EmojiSelector<EditProjectSchemaType>
                className="size-15 text-2xl"
                name="icon"
                readOnly={!editing}
              />
              <span className="sr-only">Icon indicator</span>
            </div>

            <div>
              <Label
                htmlFor="project_label"
                className="text-muted-foreground text-base leading-relaxed font-normal tracking-wide"
              >
                Project
              </Label>
              <InputField<EditProjectSchemaType>
                id="project_label"
                name="projectName"
                autoComplete="off"
                readOnly={!editing}
                className="data-[readonly=false]:dark:bg-input/20 h-fit rounded-md border-none p-0 transition-all duration-300 ease-in-out data-[readonly=false]:px-2 data-[readonly=false]:text-xl data-[readonly=false]:font-bold data-[readonly=false]:shadow-2xl data-[readonly=true]:border-none data-[readonly=true]:p-0 data-[readonly=true]:text-xl data-[readonly=true]:font-bold data-[readonly=true]:dark:bg-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-muted-foreground/60 text-sm leading-relaxed font-medium tracking-wide">
                Status
              </p>
              <ProjectStatus status={project.status} className="mr-2" />
            </div>
            <div className="inline-flex items-center gap-2">
              {editing ? (
                <>
                  <Button
                    type="submit"
                    size={"sm"}
                    disabled={!methods.formState.isDirty}
                  >
                    <ButtonLabel>Save</ButtonLabel>
                    <ButtonKbd>Ctrl</ButtonKbd>
                    <ButtonKbd>↩</ButtonKbd>
                  </Button>
                  <Button
                    onClick={() => setEditing(false)}
                    type="button"
                    size={"sm"}
                    variant="outline"
                  >
                    <ButtonLabel>Cancel</ButtonLabel>
                    <ButtonKbd>ESC</ButtonKbd>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    size={"sm"}
                    onClick={() => setEditing(true)}
                  >
                    <ButtonLabel>Edit</ButtonLabel>
                    <ButtonKbd>Ctrl</ButtonKbd>
                    <ButtonKbd>E</ButtonKbd>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size={"sm"}
                    onClick={() =>
                      open(project.id + "&" + project.project_name)
                    }
                  >
                    <ButtonLabel>Delete</ButtonLabel>
                    <ButtonKbd>Ctrl</ButtonKbd>
                    <ButtonKbd>D</ButtonKbd>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <Label
            htmlFor="description_label"
            className="text-muted-foreground/60 text-xs"
          >
            Description
          </Label>

          <TextareaField<EditProjectSchemaType>
            id="description_label"
            name="description"
            readOnly={!editing}
            className="data-[readonly=false]:dark:bg-input/20 h-fit min-h-10 rounded-md border-none p-0 text-sm font-light transition-all duration-300 ease-in-out data-[readonly=false]:min-h-30 data-[readonly=false]:px-2 data-[readonly=false]:shadow-2xl data-[readonly=true]:border-none data-[readonly=true]:p-0 dark:bg-transparent"
            autoComplete="off"
            placeholder="project description..."
          />
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label
              htmlFor="domain_label"
              className="text-muted-foreground/60 text-xs"
            >
              Domain
            </Label>
            <div className="relative">
              <InputField<EditProjectSchemaType>
                id="domain_label"
                name="domain"
                readOnly={!editing}
                className="data-[readonly=false]:dark:bg-input/20 h-fit rounded-md border-none text-sm font-light transition-all duration-300 ease-in-out data-[readonly=false]:w-full data-[readonly=false]:max-w-md data-[readonly=false]:px-2 data-[readonly=false]:pt-2 data-[readonly=false]:shadow-2xl data-[readonly=true]:border-none data-[readonly=true]:p-0 data-[readonly=true]:pl-6 dark:bg-transparent"
                placeholder="http://google.com..."
                autoComplete="off"
              />
              {!editing && (
                <AnimateIcon
                  src="globe"
                  colors={LORDICON_THEMES.dark}
                  className="absolute start-0 top-0.5 opacity-80"
                  trigger="mount-loop"
                  target="div"
                  size={16}
                  aria-hidden={true}
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
