// hooks/useTasksBoard.js
import { useState, useMemo } from "react";

const getDueLabel = (date) => {
  if (!date) return "No due date";

  const d = new Date(date);
  const now = new Date();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));

  if (diff > 0) return "Overdue";
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";

  return d.toLocaleDateString();
};

const isOverdue = (date) => new Date(date) < new Date();

const STATUSES = ["todo", "in_progress", "review", "done"];

const STATUS_LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};
const useTasksBoard = (tasks = []) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedSubTask, setSelectedSubTask] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubTaskDetailsOpen, setIsSubTaskDetailsOpen] = useState(false);

  const [isSubTaskOpen, setIsSubTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [membersTask, setMembersTask] = useState(null);
  const [datesTask, setDatesTask] = useState(null);
  const [commentsTask, setCommentsTask] = useState(null);
  const [attachmentsTask, setAttachmentsTask] = useState(null);
  const [statusTask, setStatusTask] = useState(null);

  const [openPanel, setOpenPanel] = useState(null);

  // grouping (memoized = important performance fix)
  const grouped = useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    }, {});
  }, [tasks]);

  // actions
  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
    setOpenMenuId(null);
  };

  const openSubTaskDetails = (task, subTask) => {
    setSelectedTask(task);
    setSelectedSubTask(subTask);
    setIsSubTaskDetailsOpen(true);
  };

  const openAddSubTask = (taskId) => {
    setSelectedTaskId(taskId);
    setIsSubTaskOpen(true);
  };

  const closeSubTask = () => {
    setIsSubTaskOpen(false);
    setSelectedTaskId(null);
  };

  const onTaskMenuClose = () => {
    setOpenMenuId(null);
    setOpenPanel(null);
  };
  return {
    STATUSES,
    STATUS_LABELS,
    isOverdue,
    getDueLabel,
    // state
    grouped,
    selectedTask,
    selectedSubTask,
    isDetailsOpen,
    isSubTaskDetailsOpen,
    isSubTaskOpen,
    selectedTaskId,
    openMenuId,
    setOpenMenuId,
    membersTask,
    setMembersTask,
    datesTask,
    setDatesTask,
    commentsTask,
    setCommentsTask,
    attachmentsTask,
    setAttachmentsTask,
    statusTask,
    setStatusTask,
    openPanel,
    setOpenPanel,

    // actions
    openTaskDetails,
    openSubTaskDetails,
    openAddSubTask,
    closeSubTask,
    setIsDetailsOpen,
    setIsSubTaskDetailsOpen,
    onTaskMenuClose,
  };
};

export default useTasksBoard;
