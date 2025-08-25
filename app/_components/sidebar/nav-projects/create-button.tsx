"use client";

import { useModalState } from "@/hooks/nuqs/use-modal-state";
import { Button } from "../../ui/button";
import { LORDICON_THEMES, MODAL_NAMES } from "@/constants";
import { AnimateIcon } from "../../animate-icons/aniamtion-icon";

export const CreateButton = () => {
  const { open } = useModalState();

  return (
    <Button
      onClick={() => open(MODAL_NAMES.CREATE_PROJECT)}
      variant="outline"
      size="icon"
      className="ml-2 size-7"
    >
      <AnimateIcon
        src="folderPlus"
        colors={LORDICON_THEMES.dark}
        size={16}
        trigger="hover"
        target="span"
      />

      <span className="sr-only">Create new project</span>
    </Button>
  );
};
