import { useEffect, useMemo, useState } from "react";
import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "@/rtk/Tasks/commentsApi";
import {
  useGetAttachmentsQuery,
  useAddAttachmentMutation,
} from "@/rtk/Tasks/attachmentsApi";

export const useTaskDetailsModal = ({ task, onClose }) => {
  const taskId = task?._id;
  console.log(task);

  const [openPanel, setOpenPanel] = useState(null);
  const [position, setPosition] = useState("bottom");
  const [anchorRect, setAnchorRect] = useState(null);

  const [updateTask] = useUpdateTaskMutation();

  /* =========================
     DATA FETCH (STRICT TASK ID)
  ========================== */
  const {
    data: commentsData,
    isFetching: commentsFetching,
    isError: commentsError,
    refetch: refetchComments,
  } = useGetCommentsQuery(
    { taskId },
    { skip: !taskId, refetchOnMountOrArgChange: true },
  );

  const {
    data: attachmentsData,
    isFetching: attachmentsFetching,
    isError: attachmentsError,
    refetch: refetchAttachments,
  } = useGetAttachmentsQuery(
    { taskId },
    { skip: !taskId, refetchOnMountOrArgChange: true },
  );

  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [createAttachment] = useAddAttachmentMutation();

  /* =========================
     FORM STATE (RESET ON TASK CHANGE)
  ========================== */
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  });

  useEffect(() => {
    if (!taskId) return;

    //  HARD RESET (prevents old UI flash)
    setForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
    });

    setOpenPanel(null);
    setAnchorRect(null);
    setPosition("bottom");
  }, [taskId]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveTask = async () => {
    await updateTask({
      id: taskId,
      data: form,
    });
    onClose();
  };

  /* =========================
     COMMENTS
  ========================== */
  const addComment = async (text) => {
    if (!text.trim() || !taskId) return;

    await createComment({
      content: text,
      task: taskId,
    }).unwrap();
  };

  const removeComment = async (id) => {
    await deleteComment(id).unwrap();
  };

  /* =========================
     SAFE ACTIVITY (NO STALE DATA)
  ========================== */
  const activity = useMemo(() => {
    if (!task?._id) return []; //  HARD RESET

    const comments = (commentsData || [])
      .filter((c) => c.task === task._id)
      .map((c) => ({
        type: "comment",
        data: c,
        date: new Date(c.createdAt),
      }));

    const attachments = (attachmentsData?.data || [])
      .filter((a) => a.task === task._id)
      .map((a) => ({
        type: "attachment",
        data: a,
        date: new Date(a.createdAt),
      }));

    return [...comments, ...attachments].sort((a, b) => a.date - b.date);
  }, [commentsData, attachmentsData, task?._id]);

  /* =========================
     LOADING (REAL SAFE STATE)
  ========================== */
  const activityLoading = !taskId || commentsFetching || attachmentsFetching;

  /* =========================
     ERROR
  ========================== */
  const activityError =
    (!!commentsError && !commentsData) ||
    (!!attachmentsError && !attachmentsData);

  /* =========================
     REFRESH
  ========================== */
  const refetchActivity = () => {
    if (!taskId) return;
    refetchComments?.();
    refetchAttachments?.();
  };

  /* =========================
     POPUP STATE
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
  };
};
