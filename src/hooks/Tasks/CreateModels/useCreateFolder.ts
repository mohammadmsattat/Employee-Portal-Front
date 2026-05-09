import { useState } from "react";
import { useCreateFolderMutation } from "@/rtk/Tasks/folderApi";

interface Props {
  workspaceId: string | null;
  onClose?: () => void;
  refetchTree?: () => void;
}

export const useCreateFolder = ({
  workspaceId,
  onClose,
  refetchTree,
}: Props) => {
  const [createFolder, { isLoading }] = useCreateFolderMutation();

  const [name, setName] = useState("");

  const reset = () => {
    setName("");
  };

  const submit = async () => {
    if (!name.trim() || !workspaceId) return;

    await createFolder({
      data: {
        name: name.trim(),
        workspace: workspaceId,
      },
      workspaceId,
    }).unwrap();
    await refetchTree();
    reset();
    onClose?.();
  };

  return {
    name,
    setName,
    submit,
    isLoading,
    reset,
  };
};
