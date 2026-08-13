import { useState } from "react";

import { toast } from "@/hooks/use-toast";

import {
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from "@/rtk/Tasks/workspaceApi";

import {
  useDeleteFolderMutation,
  useUpdateFolderMutation,
} from "@/rtk/Tasks/folderApi";

import {
  useDeleteListMutation,
  useUpdateListMutation,
} from "@/rtk/Tasks/listApi";

type DeleteType = "workspace" | "folder" | "list";

export const useFolderSidebarController = ({ refetchTree }) => {
  const [deleteState, setDeleteState] = useState<{
    open: boolean;
    id?: string;
    type?: DeleteType;
    workspaceId?: string;
    folderId?: string;
    name?: string;
  }>({
    open: false,
  });

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [updateWorkspace] = useUpdateWorkspaceMutation();
  const [updateFolder] = useUpdateFolderMutation();
  const [updateList] = useUpdateListMutation();

  const [deleteWorkspace] = useDeleteWorkspaceMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const [deleteList] = useDeleteListMutation();

  /* =========================
     RENAME
  ========================= */

  const handleRename = async ({
    id,
    type,
    name,
    workspaceId,
    folderId,
    cancelRename,
  }) => {
    try {
      if (!name?.trim()) {
        toast({
          title: "Invalid Name",
          description: "Name cannot be empty.",
          variant: "destructive",
        });

        return;
      }

      if (type === "workspace") {
        await updateWorkspace({
          id,
          data: { name },
        }).unwrap();
      }

      if (type === "folder") {
        await updateFolder({
          workspaceId,
          folderId,
          data: { name },
        }).unwrap();
      }

      if (type === "list") {
        await updateList({
          workspaceId,
          id,
          folderId,
          data: { name },
        }).unwrap();
      }

      cancelRename?.();

      toast({
        title: "Updated",
        description: `${type} renamed successfully.`,
      });

      refetchTree?.();
    } catch (err) {
      console.log(err);

      toast({
        title: "Rename Failed",
        description: "Something went wrong while updating.",
        variant: "destructive",
      });
    }
  };

  /* =========================
     DELETE VALIDATION
  ========================= */

  const validateDelete = ({ type, item }) => {
    if (type === "workspace") {
      if (item?.folders?.length > 0) {
        return {
          allowed: false,
          reason: "Cannot delete workspace because it contains folders.",
        };
      }
    }

    if (type === "folder") {
      if (item?.lists?.length > 0) {
        return {
          allowed: false,
          reason: "Cannot delete folder because it contains lists.",
        };
      }
    }

    return {
      allowed: true,
    };
  };

  /* =========================
     OPEN DELETE MODAL
  ========================= */

  const requestDelete = ({ type, item, workspaceId, folderId }) => {
    const validation = validateDelete({
      type,
      item,
    });

    if (!validation.allowed) {
      toast({
        title: "Delete Blocked",
        description: validation.reason,
        variant: "destructive",
      });

      return;
    }

    setDeleteState({
      open: true,
      id: item._id,
      type,
      folderId,
      workspaceId,
      name: item.name,
    });
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async () => {
    try {
      if (!deleteState.id || !deleteState.type) return;

      setDeleteLoading(true);

      if (deleteState.type === "workspace") {
        await deleteWorkspace(deleteState.id).unwrap();
      }

      if (deleteState.type === "folder") {
        await deleteFolder({
          workspaceId: deleteState.workspaceId,
          id: deleteState.id,
        }).unwrap();
      }

      if (deleteState.type === "list") {
        await deleteList({
          workspaceId: deleteState.workspaceId,
          folderId: deleteState.folderId,
          id: deleteState.id,
        }).unwrap();
      }

      toast({
        title: "Deleted",
        description: `${deleteState.type} deleted successfully.`,
      });

      setDeleteState({
        open: false,
      });

      refetchTree?.();
    } catch (err) {
      console.log(err);

      toast({
        title: "Delete Failed",
        description: "Something went wrong while deleting.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    deleteState,
    setDeleteState,
    deleteLoading,

    handleRename,
    handleDelete,
    requestDelete,
  };
};
