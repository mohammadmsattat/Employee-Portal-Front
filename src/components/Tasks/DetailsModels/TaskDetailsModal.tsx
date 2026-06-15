import { useState } from "react";
import { X, ChevronRight } from "lucide-react";

import { useTaskDetailsModal } from "@/hooks/Tasks/DetailsModels/useTaskDetailsModal";
import TaskEditor from "./TaskEditor";
import TaskActivity from "./TaskActivity";

export default function TaskDetailsModal({
  entity,
  isOpen,
  onClose,
  workspace,
  folderName,
  listName,
  permissions,
  refetchTasks,
}) {
  const {
    form,
    updateField,
    saveTask,
    activity,
    addComment,
    openPanel,
    handleOpen,
    closeSubModal,
    popoverStyle,
    activityLoading,
    activityError,
    refetchActivity,
  } = useTaskDetailsModal({
    entity,
    onClose,
    workspaceId: workspace?._id,
    listId: listName?._id,
  });
  console.log(entity);

  const [commentText, setCommentText] = useState("");

  if (!isOpen || !entity) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
      <div className="w-[90%] bg-white/95 rounded-[28px] shadow-xl flex flex-col h-[90%] overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between">
          <div>
            <div className="text-sm font-semibold">Task Details</div>

            <div className="text-xs text-slate-400 flex gap-1 mt-1">
              <span>{workspace?.name}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{folderName}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{listName?.name}</span>
            </div>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">
          <TaskEditor
            form={form}
            updateField={updateField}
            saveTask={saveTask}
            entity={entity}
            openPanel={openPanel}
            handleOpen={handleOpen}
            popoverStyle={popoverStyle}
            closeSubModal={closeSubModal}
            workspaceId={workspace?._id}
            refetchTasks={refetchTasks}
            listId={listName?._id}
          />

          <TaskActivity
            activity={activity}
            commentText={commentText}
            setCommentText={setCommentText}
            addComment={addComment}
            loading={activityLoading}
            error={activityError}
            refetch={refetchActivity}
            
          />
        </div>
      </div>
    </div>
  );
}
