import { Task } from "@/interfaces/tasks";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
} from "@/rtk/Tasks/commentsApi";

export const useCommentsModal = ({ task }: { task: Task }) => {
  console.log(task);
  
  const { data, isLoading, isError } = useGetCommentsQuery({
    taskId: task._id,
  });
console.log("comments",data);

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();

  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const comments = data || [];
const addComment = async (text: string) => {
  if (!text.trim()) return;

  try {
    await createComment({
      content: text,   // ✅ بدل text
      task: task._id,  // ✅ بدل taskId
    }).unwrap();
  } catch (err) {
    console.error("Add comment failed", err);
  }
};
  const removeComment = async (id: string) => {
    try {
      await deleteComment(id).unwrap();
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  return {
    comments,
    isLoading,
    isError,
    isCreating,
    isDeleting,
    addComment,
    removeComment,
  };
};
