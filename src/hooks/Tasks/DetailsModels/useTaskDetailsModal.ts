import { useEffect, useMemo, useState } from "react";

import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useUpdateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "@/rtk/Tasks/commentsApi";

import {
  useGetAttachmentsQuery,
  useAddAttachmentMutation,
} from "@/rtk/Tasks/attachmentsApi";

export const useTaskDetailsModal = ({
  entity,
  onClose,
  workspaceId,
  listId,
}) => {
  const data = entity?.data;
  const type = entity?.type;

  const isSubTask = type === "subtask";
  const id = data?._id;

  const parentTaskId = data?.parentTaskId;
console.log(data);

  const [openPanel, setOpenPanel] = useState(null);
  const [position, setPosition] = useState("bottom");
  const [anchorRect, setAnchorRect] = useState(null);

  const [updateTask] = useUpdateTaskMutation();
  const [updateSubTask] = useUpdateSubTaskMutation();

  /* =========================
     COMMENTS / ATTACHMENTS
  ========================== */

  const queryParams = useMemo(() => {
    if (!id) return {};

    return isSubTask ? { subTaskId: id } : { taskId: id };
  }, [id, isSubTask]);

  const {
    data: commentsData,
    isFetching: commentsFetching,
    isError: commentsError,
    refetch: refetchComments,
  } = useGetCommentsQuery(queryParams, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: attachmentsData,
    isFetching: attachmentsFetching,
    isError: attachmentsError,
    refetch: refetchAttachments,
  } = useGetAttachmentsQuery(queryParams, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [createAttachment] = useAddAttachmentMutation();

  /* =========================
     FORM
  ========================== */

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  });

  useEffect(() => {
    if (!id || !data) return;

    setForm({
      title: data.title || "",
      description: data.description || "",
      status: data.status || "todo",
      priority: data.priority || "medium",
    });

    setOpenPanel(null);
    setAnchorRect(null);
    setPosition("bottom");
  }, [id]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* =========================
     SAVE (TASK / SUBTASK)
  ========================== */

  const saveTask = async () => {
    if (isSubTask) {
      const res = await updateSubTask({
        taskId: entity?.parentTaskId,
        subTaskId: id,
        data: form,
      });
      console.log(res);
    } else {
      const res = await updateTask({
        listId,
        id,
        data: form,
      });
      console.log(res);
    }

    // onClose();
  };

  /* =========================
     COMMENTS
  ========================== */

  const addComment = async (text) => {
    if (!text.trim() || !id) return;

    await createComment({
      content: text,
      task: isSubTask ? undefined : id,
      subTask: isSubTask ? id : undefined,
    }).unwrap();
  };

  const removeComment = async (commentId) => {
    await deleteComment(commentId).unwrap();
  };

  /* =========================
     ACTIVITY (TASK + SUBTASK SAFE)
  ========================== */

  const activity = useMemo(() => {
    if (!id) return [];

    const comments = (commentsData || []).map((c) => ({
      type: "comment",
      data: c,
      date: new Date(c.createdAt),
    }));

    const attachments = (attachmentsData?.data || []).map((a) => ({
      type: "attachment",
      data: a,
      date: new Date(a.createdAt),
    }));

    return [...comments, ...attachments].sort((a, b) => a.date - b.date);
  }, [commentsData, attachmentsData, id]);

  /* =========================
     LOADING / ERROR
  ========================== */

  const activityLoading = !id || commentsFetching || attachmentsFetching;

  const activityError =
    (!!commentsError && !commentsData) ||
    (!!attachmentsError && !attachmentsData);

  const refetchActivity = () => {
    if (!id) return;
    refetchComments?.();
    refetchAttachments?.();
  };

  /* =========================
     UI STATE (POPOVER)
  ========================== */

  const handleOpen = (e, panel) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);

    const spaceBelow = window.innerHeight - rect.bottom;
    setPosition(spaceBelow < 280 ? "top" : "bottom");

    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  const closeSubModal = () => setOpenPanel(null);

  const popoverStyle = () => {
    if (!anchorRect) return {};

    return {
      position: "fixed",
      left: anchorRect.left + anchorRect.width * 1.8,
      top: position === "bottom" ? anchorRect.bottom + 10 : anchorRect.top - 10,
      transform: "translateX(-50%)",
      zIndex: 9999,
      width: "min(320px, 90vw)",
      maxHeight: "70vh",
      overflowY: "auto",
    };
  };

  return {
    form,
    updateField,
    saveTask,

    activity,
    addComment,
    removeComment,

    openPanel,
    handleOpen,
    closeSubModal,
    popoverStyle,

    activityLoading,
    activityError,
    refetchActivity,

    isSubTask,
    id,
  };
};
