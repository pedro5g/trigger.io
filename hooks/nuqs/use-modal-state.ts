"use client";
import { MODAL_NAMES, type ModalNames } from "@/constants";
import { useQueryState, parseAsStringEnum, parseAsString } from "nuqs";

export function useModalState() {
  const [modal, setModal] = useQueryState(
    "modal",
    parseAsStringEnum(Object.values(MODAL_NAMES)).withOptions({
      clearOnDefault: true,
      shallow: true, // shallow: true prevent that page will be refetch when change URL query state
    }),
  );

  const [target, setTarget] = useQueryState(
    "target",
    parseAsString
      .withOptions({
        clearOnDefault: true,
        shallow: true,
      })
      .withDefault(""),
  );

  const openChange = (isOpen: boolean, name: ModalNames) => {
    setModal(isOpen ? name : null);
    if (!isOpen) setTarget(null);
  };

  const open = (name: ModalNames | null, target: string | null = null) => {
    setModal(name);
    setTarget(target);
  };

  const close = () => {
    setModal(null);
    setTarget(null);
  };

  return {
    modal,
    target,
    isOpen: modal !== null,
    openChange,
    open,
    close,
  };
}
