"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
  renamingFeature,
  type ItemInstance,
} from "@headless-tree/core";
import { AssistiveTreeDescription, useTree } from "@headless-tree/react";
import { FolderOpenIcon, FolderPlus } from "lucide-react";
import { Tree, TreeItem, TreeItemLabel } from "@/app/_components/ui/tree";
import { LordIcon } from "../../animate-icons/lord-icon";
import { LORDICON_LIBRARY, LORDICON_THEMES, MODAL_NAMES } from "@/constants";
import { Input } from "../../ui/input";
import { useServerAction } from "zsa-react";
import { changeProjectNameAction } from "./actions/change-project-name";
import { buttonVariants } from "../../ui/button";
import { cn } from "@/lib/utils";
import { useModalState } from "@/hooks/nuqs/use-modal-state";

interface ProjectData {
  id: string;
  project_name: string;
  description: string | null;
  domain: string | null;
  icon: string | null;
  status: "active" | "inactive" | "suspended";
  created_at: Date;
  updated_at: Date | null;
}

interface TreeItem {
  name: string;
  type: "root" | "project" | "webhook" | "apikey" | "details";
  children?: string[];
}

const indent = 20;

interface ProjectsTreeClientProps {
  projects: ProjectData[];
}

export function ProjectsTreeClient({ projects }: ProjectsTreeClientProps) {
  const { execute, isPending, isError } = useServerAction(
    changeProjectNameAction,
  );

  const items = useMemo(() => {
    const treeItems: Record<string, TreeItem> = {
      root: {
        name: "Projects",
        type: "root",
        children: projects.map((p) => p.id),
      },
    };

    projects.forEach((project) => {
      const detailsId = `${project.id}-details`;
      const webhookId = `${project.id}-webhook`;
      const apikeyId = `${project.id}-apikeys`;

      treeItems[project.id] = {
        name: project.project_name,
        type: "project",
        children: [detailsId, webhookId, apikeyId],
      };

      treeItems[detailsId] = { name: "Details", type: "details" };
      treeItems[webhookId] = { name: "Webhook", type: "webhook" };
      treeItems[apikeyId] = { name: "API Key", type: "apikey" };
    });

    return treeItems;
  }, [projects]);

  const dataLoader = useMemo(
    () => ({
      getItem: (id: string) => items[id],
      getChildren: (id: string) => items[id]?.children ?? [],
    }),
    [items],
  );

  const expandedItem = useMemo(() => {
    const keys = Object.keys(items);
    if (keys.length === 0) return [];

    return [keys[1]]; // position 1 because 0 refer to root id
  }, [items]);

  const onRename = useCallback(
    async (item: ItemInstance<TreeItem>, newName: string) => {
      if (!isPending && item.getItemData().name !== newName.trim()) {
        await execute({
          projectId: item.getId(),
          projectName: newName,
        });
        item.getItemData().name = newName;
      }
    },
    [execute, isPending],
  );

  const tree = useTree<TreeItem>({
    indent,
    rootItemId: "root",
    initialState: {
      expandedItems: expandedItem,
    },
    getItemName: useCallback((item) => item.getItemData().name, []),
    isItemFolder: useCallback((item) => {
      const itemData = item.getItemData();
      return itemData.type === "root" || itemData.type === "project";
    }, []),
    canReorder: true,
    dataLoader,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      renamingFeature,
    ],
    onRename,
  });

  useEffect(() => {
    tree.rebuildTree();
  }, [projects, tree]);

  const getItemIcon = useCallback((item: ItemInstance<TreeItem>) => {
    const itemData = item.getItemData();

    if (itemData.type === "root" || itemData.type === "project") {
      return item.isExpanded() ? (
        <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
      ) : (
        <LordIcon
          src={LORDICON_LIBRARY.folder}
          colors={LORDICON_THEMES.dark}
          size={16}
          trigger="hover"
          target="span"
        />
      );
    } else if (itemData.type === "details") {
      return (
        <LordIcon
          src={LORDICON_LIBRARY.document}
          colors={LORDICON_THEMES.dark}
          size={16}
          trigger="hover"
          target="span"
        />
      );
    } else if (itemData.type === "webhook") {
      return (
        <LordIcon
          src={LORDICON_LIBRARY.swap}
          colors={LORDICON_THEMES.dark}
          size={16}
          trigger="hover"
          target="span"
        />
      );
    } else if (itemData.type === "apikey") {
      return (
        <LordIcon
          src={LORDICON_LIBRARY.lockClosed}
          colors={LORDICON_THEMES.dark}
          size={16}
          trigger="hover"
          target="span"
        />
      );
    }

    return null;
  }, []);

  const handleRenameClick = useCallback(
    (itemId: string) => {
      const item = tree.getItems().find((i) => i.getId() === itemId);
      if (item) {
        item.startRenaming();
      }
    },
    [tree],
  );

  if (projects.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3 rounded-md bg-blue-950/15 px-5 py-2 text-center">
        <LordIcon
          src={LORDICON_LIBRARY.folderPlus}
          colors={LORDICON_THEMES.dark}
          size={26}
          trigger="hover"
          target="div"
        />
        <p className="text-sm">No project found</p>
        <span className="text-xs">Tip: create your first project</span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 *:first:grow">
      <Tree indent={indent} tree={tree}>
        <AssistiveTreeDescription tree={tree} />
        {tree.getItems().map((item) => {
          const itemData = item.getItemData();
          const isFolder =
            itemData.type === "root" || itemData.type === "project";

          return (
            <TreeItem
              className="bg-transparent hover:bg-transparent in-data-[selected=false]:bg-transparent"
              key={item.getId()}
              item={item}
            >
              <TreeItemLabel className="inline-flex w-full items-center bg-transparent hover:bg-blue-950/20 in-data-[selected=true]:bg-blue-950/15">
                <span className="peer flex w-fit items-center gap-2">
                  {getItemIcon(item)}
                  {item.isRenaming() ? (
                    <div
                      style={{
                        marginLeft: `${item.getItemMeta().level * 20}px`,
                      }}
                    >
                      <Input
                        data-error={isError}
                        className="h-auto rounded py-0 text-sm focus:ring-0 focus-visible:border-blue-500 focus-visible:ring-0 data-[error='true']:focus-visible:border-red-400"
                        {...item.getRenameInputProps()}
                      />
                    </div>
                  ) : (
                    item.getItemName()
                  )}
                </span>
                {isFolder && (
                  <ActionButtons
                    itemId={item.getId()}
                    itemName={item.getItemName()}
                    onRenameClick={handleRenameClick}
                  />
                )}
              </TreeItemLabel>
            </TreeItem>
          );
        })}
      </Tree>
    </div>
  );
}

interface DeleteActionButtonProps {
  itemId: string;
  itemName: string;
}

export const DeleteActionButton = ({
  itemId,
  itemName,
}: DeleteActionButtonProps) => {
  const { open } = useModalState();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      open(MODAL_NAMES.DISABLE_PROJECT, itemId + "&" + itemName);
    },
    [itemId, itemName, open],
  );

  return (
    <span
      role="button"
      tabIndex={0}
      className={cn(
        buttonVariants({
          size: "icon",
          variant: "outline",
        }),
        "size-6 hover:bg-transparent",
      )}
      onClick={handleClick}
    >
      <LordIcon
        src={LORDICON_LIBRARY.delete}
        colors={LORDICON_THEMES.error}
        size={16}
        trigger="loop-on-hover"
        target="span"
        stroke={0}
      />
      <span className="sr-only">Delete project</span>
    </span>
  );
};

const ActionButtons = ({
  itemId,
  itemName,
  onRenameClick,
}: {
  itemId: string;
  itemName: string;
  onRenameClick: (itemId: string) => void;
}) => {
  const handleRenameClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onRenameClick(itemId);
    },
    [itemId, onRenameClick],
  );

  return (
    <div className="ml-auto inline-flex items-center gap-2">
      <span
        role="button"
        tabIndex={0}
        className={cn(
          buttonVariants({
            size: "icon",
            variant: "outline",
          }),
          "size-6 hover:bg-transparent",
        )}
        onClick={handleRenameClick}
      >
        <LordIcon
          src={LORDICON_LIBRARY.edit}
          colors={LORDICON_THEMES.dark}
          size={16}
          trigger="hover"
          target="span"
          stroke={0}
        />
        <span className="sr-only">Edit project name</span>
      </span>
      <DeleteActionButton itemId={itemId} itemName={itemName} />
    </div>
  );
};
