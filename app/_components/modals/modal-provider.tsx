"use client";

import { useModalState } from "@/hooks/nuqs/use-modal-state";
import { CreateProjectModal } from "./create-project-modal";
import { MODAL_NAMES } from "@/constants";
import { DeleteProjectModal } from "./delete-project-modal";

export function ModalProvider() {
  const { modal } = useModalState();

  if (modal === MODAL_NAMES.CREATE_PROJECT) {
    return <CreateProjectModal />;
  }

  if (modal === MODAL_NAMES.DISABLE_PROJECT) {
    return <DeleteProjectModal />;
  }
}
