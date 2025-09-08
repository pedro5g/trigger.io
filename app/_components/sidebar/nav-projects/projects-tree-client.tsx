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
import { FolderOpenIcon } from "lucide-react";
import { Tree, TreeItem, TreeItemLabel } from "@/app/_components/ui/tree";
import { LORDICON_THEMES, MODAL_NAMES } from "@/constants";
import { Input } from "../../ui/input";
import { useServerAction } from "zsa-react";
import { changeProjectNameAction } from "./actions/change-project-name";
import { buttonVariants } from "../../ui/button";
import { cn } from "@/lib/utils";
import { useModalState } from "@/hooks/use-modal-state";
import { AnimateIcon } from "../../animate-icons/animation-icon";

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

    return [keys[1]]; // using position 1, because 0 refer to root id
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

  if (projects.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3 rounded-lg px-5 py-2 text-center shadow">
        <AnimateIcon
          src="folderPlus"
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
          return (
            <TreeItem
              className="bg-transparent hover:bg-transparent in-data-[selected=false]:bg-transparent"
              item={item}
              key={item.getId()}
            >
              <FolderItem isError={isError} item={item} />
            </TreeItem>
          );
        })}
      </Tree>
    </div>
  );
}

interface FolderItemProps {
  item: ItemInstance<TreeItem>;
  isError: boolean;
}

const FolderItem = ({ item, isError }: FolderItemProps) => {
  const itemData = item.getItemData();
  const isFolder = itemData.type === "root" || itemData.type === "project";

  const getItemIcon = useCallback((item: ItemInstance<TreeItem>) => {
    const itemData = item.getItemData();

    if (itemData.type === "root" || itemData.type === "project") {
      return item.isExpanded() ? (
        <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
      ) : (
        <AnimateIcon
          src="folder"
          colors={LORDICON_THEMES.dark}
          size={16}
          trigger="hover"
          target="span"
        />
      );
    } else if (itemData.type === "details") {
      return (
        <AnimateIcon
          src="document"
          colors={LORDICON_THEMES.dark}
          size={16}
          trigger="hover"
          target="span"
        />
      );
    } else if (itemData.type === "webhook") {
      return (
        <AnimateIcon
          src="swap"
          colors={LORDICON_THEMES.dark}
          size={16}
          trigger="hover"
          target="span"
        />
      );
    } else if (itemData.type === "apikey") {
      return (
        <AnimateIcon
          src="lockClosed"
          colors={LORDICON_THEMES.dark}
          size={16}
          trigger="hover"
          target="span"
        />
      );
    }

    return null;
  }, []);

  const handleRenameClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    item.startRenaming();
  }, []);

  const isRenaming = item.isRenaming();

  return (
    <TreeItemLabel className="inline-flex w-full items-center bg-transparent">
      <span className="peer flex w-fit items-center gap-2">
        {getItemIcon(item)}
        {isRenaming ? (
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
        <div className="ml-auto inline-flex items-center gap-2">
          <DeleteActionButton
            itemId={item.getId()}
            itemName={item.getItemName()}
          />
          <EditProjectName onClick={handleRenameClick} />
        </div>
      )}
    </TreeItemLabel>
  );
};

interface DeleteActionButtonProps {
  itemId: string;
  itemName: string;
}

const DeleteActionButton = ({ itemId, itemName }: DeleteActionButtonProps) => {
  const { open } = useModalState(MODAL_NAMES.DISABLE_PROJECT);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      open(itemId + "&" + itemName);
    },
    [itemId, itemName],
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
      <AnimateIcon
        src="delete"
        colors={LORDICON_THEMES.error}
        size={16}
        trigger="loop-on-hover"
        target="span"
        stroke="bold"
      />
      <span className="sr-only">Delete project</span>
    </span>
  );
};

interface EditProjectNameProps {
  onClick: (e: React.MouseEvent) => void;
}

const EditProjectName = ({ onClick }: EditProjectNameProps) => {
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
      onClick={onClick}
    >
      <AnimateIcon
        src="edit"
        colors={LORDICON_THEMES.dark}
        size={16}
        trigger="hover"
        target="span"
      />
      <span className="sr-only">Edit project name</span>
    </span>
  );
};
