import { useEffect, useState } from "react";
import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useGetCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation } from "@/rtk/Tasks/commentsApi";

export const useTaskDetailsModal = ({ task }) => {
  const [updateTask] = useUpdateTaskMutation();

  const { data } = useGetCommentsQuery(
    { taskId: task?._id },
    { skip: !task?._id }
  );

  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
      });
    }
  }, [task]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveTask = async () => {
    await updateTask({
      id: task._id,
      data: form,
    });
  };

  // 🔥 comments logic
  const addComment = async (text) => {
    if (!text.trim()) return;

    await createComment({
      content: text,
      task: task._id,
    }).unwrap();
  };

  const removeComment = async (id) => {
    await deleteComment(id).unwrap();
  };

  return {
    form,
    updateField,
    saveTask,
    comments: data || [],
    addComment,
    removeComment,
  };
};