import {
  Archive,
  ArrowBigRightDash,
  CalendarDays,
  Eye,
  MessageSquare,
  Paperclip,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";

import UpdateTaskDatesModal from "./TaskMenuActoions/DatesModal ";
import UpdateTaskMembersModal from "./TaskMenuActoions/MembersModal";
import UpdateTaskAttachmentsModal from "./TaskMenuActoions/AttachmentsModal";
import UpdateTaskCommentsModal from "./TaskMenuActoions/CommentsModal";
import UpdateTaskStatusModal from "./TaskMenuActoions/StatusModal ";

const TaskMenu = ({
  task,
  isOpen,
  openPanel,
  setOpenPanel,
  onClose,
  onView,
  onAddSubtask,
}) => {
  const [position, setPosition] = useState("bottom"); // bottom | top

  if (!isOpen) return null;

  const baseBtn =
    "flex gap-2 w-fit px-3 py-2 text-left text-sm bg-white hover:bg-slate-100 rounded-lg transition-all duration-200 ease-out hover:scale-[1.08]";

  const handleOpen = (e, panel) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    setPosition(spaceBelow < 250 ? "top" : "bottom");

    setOpenPanel(openPanel === panel ? null : panel);
  };

  const getPositionClass = () =>
    position === "top" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <>
      {/* OVERLAY */}
      <div onClick={onClose} className="fixed inset-0 bg-black/20 z-10" />

      {/* MENU */}
      <div className="flex flex-col gap-1 absolute left-[2.4em] top-0 mt-2 w-max z-50">
        {/* STATUS */}
        <div className="relative">
          <button onClick={(e) => handleOpen(e, "status")} className={baseBtn}>
            <ArrowBigRightDash className="h-4 w-4 text-slate-500" />
            Move
          </button>

          {openPanel === "status" && (
            <div
              className={`absolute left-0 w-64 bg-white shadow-lg rounded-lg p-3 z-50 ${getPositionClass()}`}
            >
              <UpdateTaskStatusModal
                task={task}
                isOpen={true}
                onClose={() => setOpenPanel(null)}
                onCloseModal={onClose}
              />
            </div>
          )}
        </div>

        {/* VIEW */}
        <button
          onClick={() => {
            onView(task);
            onClose();
          }}
          className={baseBtn}
        >
          <Eye className="h-4 w-4 text-slate-500" />
          Open Task
        </button>

        {/* ADD SUBTASK */}
        <button
          onClick={() => {
            onAddSubtask(task._id);
            onClose();
          }}
          className="flex gap-2 w-fit px-3 py-2 text-left text-sm text-blue-600 bg-white hover:bg-slate-100 rounded-lg transition-all duration-200 ease-out hover:scale-[1.08]"
        >
          <Plus className="h-4 w-4" />
          Add Subtask
        </button>

        {/* MEMBERS */}
        <div className="relative">
          <button className={baseBtn} onClick={(e) => handleOpen(e, "members")}>
            <Users className="h-4 w-4 text-slate-500" />
            Change members
          </button>

          {openPanel === "members" && (
            <div
              className={`absolute left-0 w-64 bg-white shadow-lg rounded-lg p-3 z-50 ${getPositionClass()}`}
            >
              <UpdateTaskMembersModal
                task={task}
                isOpen={true}
                onClose={() => setOpenPanel(null)}
              />
            </div>
          )}
        </div>

        {/* DATES */}
        <div className="relative">
          <button className={baseBtn} onClick={(e) => handleOpen(e, "dates")}>
            <CalendarDays className="h-4 w-4 text-slate-500" />
            Edit Dates
          </button>

          {openPanel === "dates" && (
            <div
              className={`absolute left-0 w-64 bg-white shadow-lg rounded-lg p-3 z-50 ${getPositionClass()}`}
            >
              <UpdateTaskDatesModal
                task={task}
                isOpen={true}
                onClose={() => setOpenPanel(null)}
              />
            </div>
          )}
        </div>

        {/* ATTACHMENTS */}
        <div className="relative">
          <button
            className={baseBtn}
            onClick={(e) => handleOpen(e, "attachments")}
          >
            <Paperclip className="h-4 w-4 text-slate-500" />
            Attachments
          </button>

          {openPanel === "attachments" && (
            <div
              className={`absolute left-0 w-64 bg-white shadow-lg rounded-lg p-3 z-50 ${getPositionClass()}`}
            >
              <UpdateTaskAttachmentsModal
                task={task}
                isOpen={true}
                onClose={() => setOpenPanel(null)}
              />
            </div>
          )}
        </div>

        {/* COMMENTS */}
        <div className="relative">
          <button
            className={baseBtn}
            onClick={(e) => handleOpen(e, "comments")}
          >
            <MessageSquare className="h-4 w-4 text-slate-500" />
            Comments
          </button>

          {openPanel === "comments" && (
            <div
              className={`absolute left-0 w-64 bg-white shadow-lg rounded-lg p-3 z-50 ${getPositionClass()}`}
            >
              <UpdateTaskCommentsModal
                task={task}
                isOpen={true}
                onClose={() => setOpenPanel(null)}
              />
            </div>
          )}
        </div>

        {/* ARCHIVE */}
        <button className={baseBtn}>
          <Archive className="h-4 w-4 text-slate-500" />
          Archive
        </button>
      </div>
    </>
  );
};

export default TaskMenu;
