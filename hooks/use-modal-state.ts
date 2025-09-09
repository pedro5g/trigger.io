"use client";
import { type ModalNames } from "@/constants";
import { useCallback, useMemo, useRef } from "react";
import { useQueryState } from "./query-state/use-query-state";
import { qsParserBoolean, qsParserString } from "./query-state/parsers";

type FnArgs = {
  isOpen: boolean;
  target?: string | null;
  modalName: string;
};

type UseModalCallbacks = {
  onOpen?: (args: FnArgs) => void;
  onClose?: (args: FnArgs) => void;
};

export function useModalState(
  modalName: ModalNames,
  callbacks?: UseModalCallbacks,
) {
  const modalKey = `modal.${modalName}` as const;
  const targetKey = `target.${modalName}` as const;

  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const [isModalOpen, setIsModalOpen] = useQueryState<boolean>(
    modalKey,
    qsParserBoolean
      .defineOptions({
        removeIfDefault: true,
        shallow: true,
      })
      .withDefault(false),
  );

  const [modalTarget, setModalTarget] = useQueryState(
    targetKey,
    qsParserString
      .defineOptions({
        removeIfDefault: true,
        shallow: true,
      })
      .withDefault(null),
  );

  const isOpen = isModalOpen ?? false;
  const target = modalTarget ?? null;

  const open = useCallback(
    (newTarget: string | null = null) => {
      setIsModalOpen(true);
      if (newTarget !== null) {
        setModalTarget(newTarget);
      }
      callbacksRef.current?.onOpen?.({
        isOpen: true,
        target: newTarget,
        modalName,
      });
    },
    [modalName, setIsModalOpen, setModalTarget],
  );

  const close = useCallback(() => {
    const currentTarget = target;

    setIsModalOpen(false);
    if (target) {
      setModalTarget(null);
    }

    callbacksRef.current?.onClose?.({
      isOpen: false,
      target: currentTarget,
      modalName,
    });
  }, [modalName, target, setIsModalOpen, setModalTarget]);

  const openChange = useCallback(
    (shouldOpen: boolean) => {
      if (shouldOpen) {
        open();
      } else {
        close();
      }
    },
    [open, close],
  );

  return useMemo(
    () => ({
      target,
      isOpen,
      openChange,
      open,
      close,
    }),
    [target, isOpen, openChange, open, close],
  );
}
