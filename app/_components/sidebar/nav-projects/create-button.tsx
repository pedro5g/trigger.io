"use client";

import { useModalState } from "@/hooks/nuqs/use-modal-state";
import { Button } from "../../ui/button";
import { LORDICON_LIBRARY, LORDICON_THEMES, MODAL_NAMES } from "@/constants";
import { FolderPlus } from "lucide-react";
import { LordIcon } from "../../animate-icons/lord-icon";

export const CreateButton = () => {
  const { open } = useModalState();

  return (
    <Button
      onClick={() => open(MODAL_NAMES.CREATE_PROJECT)}
      variant="outline"
      size="icon"
      className="ml-2 size-7"
    >
      <LordIcon
        src={LORDICON_LIBRARY.folderPlus}
        colors={LORDICON_THEMES.dark}
        size={16}
        trigger="hover"
        target="span"
      />
      <span className="sr-only">Create new project</span>
    </Button>
  );
};
