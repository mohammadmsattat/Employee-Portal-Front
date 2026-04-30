    import { useState } from "react";
    import { useCreateFolderMutation } from "@/rtk/Tasks/folderApi";

    interface Props {
    workspaceId: string | null;
    onClose?: () => void;
    }

    export const useCreateFolder = ({ workspaceId, onClose }: Props) => {
    const [createFolder, { isLoading }] = useCreateFolderMutation();

    const [name, setName] = useState("");

    const reset = () => {
        setName("");
    };

    const submit = async () => {
        if (!name.trim() || !workspaceId) return;

        await createFolder({
        name: name.trim(),
        workspace: workspaceId,
        }).unwrap();

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