import { useCallback, useEffect, useMemo, useState } from "react";

import { useUpdateTaskMutation } from "@/rtk/Tasks/tasksApi";
import { useUpdateSubTaskMutation } from "@/rtk/Tasks/subTasksApi";

import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "@/rtk/Tasks/commentsApi";

import { useGetAttachmentsQuery } from "@/rtk/Tasks/attachmentsApi";

export const useTaskDetailsModal = ({
  entity,
  entityType,
  onClose,
  listId,
  canEdit,
}) => {
  /* =========================
     ENTITY
  ========================= */

  const data = entity;

  const isSubTask = entityType === "subtask";

  const id = data?._id || null;

  const parentTaskId = useMemo(() => {
    if (!isSubTask) return null;

    if (typeof data?.task === "object") {
      return data.task?._id || null;
    }

    return data?.task || data?.parentTaskId || null;
  }, [isSubTask, data?.task, data?.parentTaskId]);

  /* =========================
     UI STATE
  ========================= */

  const [openPanel, setOpenPanel] = useState(null);
  const [position, setPosition] = useState("bottom");
  const [anchorRect, setAnchorRect] = useState(null);

  /* =========================
     SAVE STATE
  ========================= */

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  /* =========================
     MUTATIONS
  ========================= */

  const [updateTask] = useUpdateTaskMutation();
  const [updateSubTask] = useUpdateSubTaskMutation();

  const [createComment] = useCreateCommentMutation();

  const [deleteComment] = useDeleteCommentMutation();

  /* =========================
     QUERY PARAMETERS
  ========================= */

  const queryParams = useMemo(() => {
    if (!id) return {};

    if (isSubTask) {
      return {
        subTaskId: id,
      };
    }

    return {
      taskId: id,
    };
  }, [id, isSubTask]);

  /* =========================
     COMMENTS
  ========================= */

  const {
    data: commentsData,
    isFetching: commentsFetching,
    isError: commentsError,
    refetch: refetchComments,
  } = useGetCommentsQuery(queryParams, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  /* =========================
     ATTACHMENTS
  ========================= */

  const {
    data: attachmentsData,
    isFetching: attachmentsFetching,
    isError: attachmentsError,
    refetch: refetchAttachments,
  } = useGetAttachmentsQuery(queryParams, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  /* =========================
     NORMALIZED RESPONSE DATA
  ========================= */

  const commentsList = useMemo(() => {
    if (Array.isArray(commentsData)) {
      return commentsData;
    }

    if (Array.isArray(commentsData?.data)) {
      return commentsData.data;
    }

    return [];
  }, [commentsData]);

  const attachmentsList = useMemo(() => {
    if (Array.isArray(attachmentsData)) {
      return attachmentsData;
    }

    if (Array.isArray(attachmentsData?.data)) {
      return attachmentsData.data;
    }

    return [];
  }, [attachmentsData]);

  /* =========================
     FORM
  ========================= */

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (!id || !data) return;

    setForm({
      title: data.title || "",
      description: data.description || "",
    });

    setSaveError(null);
    setOpenPanel(null);
    setAnchorRect(null);
    setPosition("bottom");
  }, [id, data?.title, data?.description]);

  /* =========================
     UPDATE FIELD
  ========================= */

  const updateField = useCallback(
    (key, value) => {
      if (!canEdit) return;

      setForm((previous) => ({
        ...previous,
        [key]: value,
      }));

      setSaveError(null);
    },
    [canEdit],
  );

  /* =========================
     SAVE TASK / SUBTASK
  ========================= */

  const saveTask = useCallback(async () => {
    if (!canEdit) {
      setSaveError("You don't have permission to update this item.");

      return false;
    }

    if (!id) {
      setSaveError("Task ID is missing.");
      return false;
    }

    const trimmedTitle = form.title?.trim();

    if (!trimmedTitle) {
      setSaveError("Task title is required.");
      return false;
    }

    if (isSubTask && !parentTaskId) {
      setSaveError("Parent task ID is missing.");
      return false;
    }

    if (!isSubTask && !listId) {
      setSaveError("List ID is missing.");
      return false;
    }

    const payload = {
      title: trimmedTitle,
      description: form.description || "",
    };

    try {
      setIsSaving(true);
      setSaveError(null);

      if (isSubTask) {
        await updateSubTask({
          taskId: parentTaskId,
          subTaskId: id,
          data: payload,
        }).unwrap();
      } else {
        await updateTask({
          listId,
          id,
          data: payload,
        }).unwrap();
      }

      onClose?.();

      return true;
    } catch (error) {
      const message =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Failed to save changes.";

      setSaveError(message);

      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    canEdit,
    id,
    form.title,
    form.description,
    isSubTask,
    parentTaskId,
    listId,
    updateTask,
    updateSubTask,
    onClose,
  ]);

  /* =========================
     ADD COMMENT
  ========================= */

  const addComment = useCallback(
    async (text) => {
      const content = text?.trim();

      if (!content || !id) return null;

      if (isSubTask && !parentTaskId) {
        throw new Error("Parent task ID is missing.");
      }

      const result = await createComment({
        content,

        task: isSubTask ? parentTaskId : id,

        subTask: isSubTask ? id : undefined,
      }).unwrap();

      return result;
    },
    [id, isSubTask, parentTaskId, createComment],
  );

  /* =========================
     REMOVE COMMENT
  ========================= */

  const removeComment = useCallback(
    async (commentId) => {
      if (!commentId) return false;

      await deleteComment(commentId).unwrap();

      return true;
    },
    [deleteComment],
  );

  /* =========================
     ACTIVITY
  ========================= */

  const activity = useMemo(() => {
    if (!id) return [];

    const comments = commentsList.map((comment) => ({
      type: "comment",
      data: comment,
      date: new Date(comment.createdAt || 0),
    }));

    const attachments = attachmentsList.map((attachment) => ({
      type: "attachment",
      data: attachment,
      date: new Date(attachment.createdAt || 0),
    }));

    return [...comments, ...attachments].sort(
      (firstItem, secondItem) =>
        firstItem.date.getTime() - secondItem.date.getTime(),
    );
  }, [commentsList, attachmentsList, id]);

  /* =========================
     ACTIVITY LOADING / ERROR
  ========================= */

  const activityLoading =
    Boolean(id) && (commentsFetching || attachmentsFetching);

  const activityError = Boolean(
    (commentsError && !commentsData) || (attachmentsError && !attachmentsData),
  );

  /* =========================
     REFETCH ACTIVITY
  ========================= */

  const refetchActivity = useCallback(async () => {
    if (!id) return;

    const requests = [];

    if (refetchComments) {
      requests.push(refetchComments());
    }

    if (refetchAttachments) {
      requests.push(refetchAttachments());
    }

    await Promise.allSettled(requests);
  }, [id, refetchComments, refetchAttachments]);

  /* =========================
     OPEN POPOVER
  ========================= */

  const handleOpen = useCallback((event, panel) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setAnchorRect(rect);

    const spaceBelow = window.innerHeight - rect.bottom;

    setPosition(spaceBelow < 280 ? "top" : "bottom");

    setOpenPanel((previous) => (previous === panel ? null : panel));
  }, []);

  /* =========================
     CLOSE POPOVER
  ========================= */

  const closeSubModal = useCallback(() => {
    setOpenPanel(null);
  }, []);

  /* =========================
     POPOVER POSITION
  ========================= */

  const popoverStyle = useCallback(() => {
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
  }, [anchorRect, position]);

  return {
    /* FORM */
    form,
    updateField,
    saveTask,

    /* SAVE */
    isSaving,
    saveError,

    /* ACTIVITY */
    activity,
    addComment,
    removeComment,
    activityLoading,
    activityError,
    refetchActivity,

    /* POPOVER */
    openPanel,
    handleOpen,
    closeSubModal,
    popoverStyle,

    /* ENTITY */
    isSubTask,
    id,
    parentTaskId,
  };
};
