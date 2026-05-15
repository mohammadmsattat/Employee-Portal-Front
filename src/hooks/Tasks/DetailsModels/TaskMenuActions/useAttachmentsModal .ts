import { Task } from "@/interfaces/tasks";
import {
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetAttachmentsQuery,
} from "@/rtk/Tasks/attachmentsApi";

export const useAttachmentsModal = ({ task }: { task: Task }) => {
  const { data, isLoading, isError } = useGetAttachmentsQuery({
    taskId: task._id,
  });

  const [addAttachmentMutation] = useAddAttachmentMutation();
  const [deleteAttachmentMutation] = useDeleteAttachmentMutation();

  const attachments = data?.data || [];

  const addAttachment = async (url: string) => {
    if (!url.trim()) return;

    try {
      await addAttachmentMutation({
        taskId: task._id,
        url,
      }).unwrap();
    } catch (err) {
      console.error("Add attachment failed", err);
    }
  };

  const removeAttachment = async (id: string) => {
    try {
      await deleteAttachmentMutation(id).unwrap();
    } catch (err) {
      console.error("Delete attachment failed", err);
    }
  };

  return {
    attachments,
    isLoading,
    isError,
    addAttachment,
    removeAttachment,
  };
};
