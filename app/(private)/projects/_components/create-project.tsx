"use client";

import { Button, ButtonKbd, ButtonLabel } from "@/app/_components/ui/button";
import { MODAL_NAMES } from "@/constants";
import { useModalState } from "@/hooks/use-modal-state";

import { useShortcut } from "@/hooks/use-shortcut";

const KEY_BIND = ["+", "="];

export const CreateProject = () => {
  const { open } = useModalState(MODAL_NAMES.CREATE_PROJECT);

  useShortcut((e) => {
    if (e.ctrlKey && KEY_BIND.includes(e.key)) {
      e.preventDefault(); // prevent window zoo
      open();
    }
  });

  return (
    <Button size={"sm"} className="relative" onClick={() => open()}>
      <ButtonLabel>Create Project</ButtonLabel>
      <ButtonKbd>Ctrl</ButtonKbd>
      <ButtonKbd>+</ButtonKbd>
    </Button>
  );
};
