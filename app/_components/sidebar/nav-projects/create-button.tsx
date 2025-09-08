"use client";

import { useModalState } from "@/hooks/use-modal-state";
import { Button } from "../../ui/button";
import { LORDICON_THEMES, MODAL_NAMES } from "@/constants";
import { AnimateIcon } from "../../animate-icons/animation-icon";

export const CreateButton = () => {
  const { open } = useModalState(MODAL_NAMES.CREATE_PROJECT);

  return (
    <Button
      onClick={() => open()}
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
