import { useEffect, useRef, useState } from "react";
import PortalCard from "@/components/portal/PortalCard";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  MoreVertical,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import AddSubTaskModal from "./AddSubTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";
import SubTaskDetailsModal from "./SubTaskDetailsModal";
import TaskMenu from "./TaskMenu";
import useTasksBoard from "@/hooks/Tasks/useTasksBoard";
import UpdateTaskMembersModal from "./TaskMenuActoions/MembersModal";
import UpdateTaskStatusModal from "./TaskMenuActoions/StatusModal ";
import UpdateTaskAttachmentsModal from "./TaskMenuActoions/AttachmentsModal";
import UpdateTaskCommentsModal from "./TaskMenuActoions/CommentsModal";
import UpdateTaskDatesModal from "./TaskMenuActoions/DatesModal ";

const TasksBoard = ({ tasks = [], setModalOpen }) => {
  const {
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
  } = useTasksBoard(tasks);

  return (
    <PortalCard>
      <div className="grid grid-cols-1 gap-4 px-5 py-6 lg:grid-cols-4 ">
        {STATUSES.map((status) => (
          <div key={status} className="rounded-2xl border bg-slate-50 p-3">
            {/* HEADER */}
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700">
                {STATUS_LABELS[status]}
              </h4>

              <span
                className="text-xs text-slate-500 text-blue cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
                <Plus className="me-2 h-4 w-4" />{" "}
              </span>
            </div>

            {/* TASKS */}
            <div className="space-y-3">
              {grouped[status].map((task) => {
                const taskSubTasks = task.subTasks || [];

                const doneCount = taskSubTasks.filter(
                  (s) => s.status === "done",
                ).length;

                const overdue = isOverdue(task.dueDate);

                return (
                  <div
                    key={task._id}
                    className={`
    group abslout rounded-xl border p-3 shadow-sm transition
    ${openMenuId === task._id ? "z-[60] bg-white shadow-lg" : "z-0 bg-white"}
  `}
                  >
                    {/* TASK HEADER */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h5 className="text-sm font-semibold text-slate-900">
                          {task.title}
                        </h5>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span
                            className={
                              overdue ? "text-red-500 font-medium" : ""
                            }
                          >
                            {getDueLabel(task.dueDate)}
                          </span>

                          <span>•</span>
                          <span className="capitalize">{task.priority}</span>
                          {/* 
                          {overdue && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                overdue
                              </span>
                            </>
                          )} */}
                        </div>
                      </div>

                      {/* MENU */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === task._id ? null : task._id,
                            );
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-200 text-slate-500 hover:text-slate-700 hover:shadow-md hover:border-slate-300 transition active:scale-95"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <TaskMenu
                          task={task}
                          isOpen={openMenuId === task._id}
                          openPanel={openPanel}
                          setOpenPanel={setOpenPanel}
                          onClose={onTaskMenuClose}
                          onView={openTaskDetails}
                          onAddSubtask={openAddSubTask}
                          onChangeMembers={() => setMembersTask(task)}
                          onChangeDates={() => setDatesTask(task)}
                          onChangeComments={() => setCommentsTask(task)}
                          onChangeAttachments={() => setAttachmentsTask(task)}
                          onChangeStatus={() => setStatusTask(task)}
                        />
                      </div>
                    </div>

                    {/* PROGRESS */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Progress</span>
                        <span>{task.progress || 0}%</span>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-slate-200">
                        <div
                          className="h-1.5 rounded-full bg-blue-600"
                          style={{ width: `${task.progress || 0}%` }}
                        />
                      </div>

                      {/* SUBTASKS */}
                      {/* <div className="relative">
                        <div className="mt-3 h-0 overflow-hidden opacity-0 transition-all group-hover:h-auto group-hover:opacity-100">
                          <div className="mt-3 space-y-2 border-t pt-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-semibold text-slate-600">
                                Subtasks
                              </p>

                              <span className="text-[10px] text-slate-400">
                                {doneCount}/{taskSubTasks.length}
                              </span>
                            </div>

                            {taskSubTasks.slice(0, 3).map((sub) => (
                              <div
                                key={sub._id}
                                onClick={() => openSubTaskDetails(task, sub)}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                              >
                                {sub.status === "done" ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Circle className="h-4 w-4 text-slate-300" />
                                )}

                                <span
                                  className={
                                    sub.status === "done"
                                      ? "text-slate-400 line-through"
                                      : "text-slate-700"
                                  }
                                >
                                  {sub.title}
                                </span>
                              </div>
                            ))}

                            {taskSubTasks.length === 0 && (
                              <p className="text-xs text-slate-400">
                                No subtasks
                              </p>
                            )}
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                );
              })}

              {grouped[status].length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <AddSubTaskModal
        isOpen={isSubTaskOpen}
        onClose={closeSubTask}
        taskId={selectedTaskId}
      />

      <TaskDetailsModal
        task={selectedTask}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <SubTaskDetailsModal
        task={selectedTask}
        subTask={selectedSubTask}
        isOpen={isSubTaskDetailsOpen}
        onClose={() => setIsSubTaskDetailsOpen(false)}
      />

      {/* {membersTask && (
        <UpdateTaskMembersModal
          task={membersTask}
          isOpen={!!membersTask}
          onClose={() => setMembersTask(null)}
        />
      )}

      {datesTask && (
        <UpdateTaskDatesModal
          task={datesTask}
          isOpen={!!datesTask}
          onClose={() => setDatesTask(null)}
        />
      )}

      {commentsTask && (
        <UpdateTaskCommentsModal
          task={commentsTask}
          isOpen={!!commentsTask}
          onClose={() => setCommentsTask(null)}
        />
      )}

      {attachmentsTask && (
        <UpdateTaskAttachmentsModal
          task={attachmentsTask}
          isOpen={!!attachmentsTask}
          onClose={() => setAttachmentsTask(null)}
        />
      )}

      {statusTask && (
        <UpdateTaskStatusModal
          task={statusTask}
          isOpen={!!statusTask}
          onClose={() => setStatusTask(null)}
        />
      )} */}
    </PortalCard>
  );
};

export default TasksBoard;
