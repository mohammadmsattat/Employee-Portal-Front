import {
  X,
  Save,
  MessageSquare,
  Paperclip,
  CalendarDays,
  Users,
  ArrowBigRightDash,
  Archive,
} from "lucide-react";

import { useState } from "react";
import { useTaskDetailsModal } from "@/hooks/Tasks/useTaskDetailsModal";

import UpdateTaskMembersModal from "./TaskMenuActoions/MembersModal";
import UpdateTaskAttachmentsModal from "./TaskMenuActoions/AttachmentsModal";
import UpdateTaskStatusModal from "./TaskMenuActoions/StatusModal ";
import UpdateTaskDatesModal from "./TaskMenuActoions/DatesModal ";

const TaskDetailsModal = ({ task, isOpen, onClose }) => {
  const { form, updateField, saveTask, comments, addComment } =
    useTaskDetailsModal({ task });

  const [commentText, setCommentText] = useState("");
  const [openPanel, setOpenPanel] = useState(null);
  const [position, setPosition] = useState("bottom");

  if (!isOpen || !task) return null;

  /* ================= DESIGN SYSTEM ================= */

  const actionBtn =
    "flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition";

  const primaryBtn =
    "bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition";

  const handleOpen = (e, panel) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    setPosition(spaceBelow < 250 ? "top" : "bottom");
    setOpenPanel(openPanel === panel ? null : panel);
  };

  const getPositionClass = () =>
    position === "top" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center bg-slate-900/40 p-4 pt-[6em] backdrop-blur-sm">
      <div className="w-full max-w-6xl bg-white/95 rounded-[28px] shadow-[0_24px_80px_rgba(15,23,42,0.18)] flex flex-col h-[55vh] ">
        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-600">
            Task Details
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="flex flex-1 overflow-hidden">
          {/* ================= LEFT ================= */}
          <div className="w-1/2 border-r border-slate-200 flex flex-col">
            {/* TITLE */}
            <div className="p-5">
              <input
                value={form?.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="text-lg font-semibold w-full border border-slate-200 rounded-2xl p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Task title..."
              />
            </div>

            {/* ACTIONS */}
            <div className="px-5 pb-3 flex flex-wrap gap-2 border-b border-slate-200">
              <div className="relative">
                <button
                  className={actionBtn}
                  onClick={(e) => handleOpen(e, "status")}
                >
                  <ArrowBigRightDash className="w-4 h-4" />
                  Move
                </button>

                {openPanel === "status" && (
                  <div
                    className={`absolute left-0 w-64 bg-white shadow-lg rounded-2xl p-3 z-50 ${getPositionClass()}`}
                  >
                    <UpdateTaskStatusModal
                      task={task}
                      isOpen
                      onClose={() => setOpenPanel(null)}
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className={actionBtn}
                  onClick={(e) => handleOpen(e, "members")}
                >
                  <Users className="w-4 h-4" />
                  Members
                </button>

                {openPanel === "members" && (
                  <div
                    className={`absolute left-0 w-64 bg-white shadow-lg rounded-2xl p-3 z-50 ${getPositionClass()}`}
                  >
                    <UpdateTaskMembersModal
                      task={task}
                      isOpen
                      onClose={() => setOpenPanel(null)}
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className={actionBtn}
                  onClick={(e) => handleOpen(e, "dates")}
                >
                  <CalendarDays className="w-4 h-4" />
                  Dates
                </button>

                {openPanel === "dates" && (
                  <div
                    className={`absolute left-0 w-64 bg-white shadow-lg rounded-2xl p-3 z-50 ${getPositionClass()}`}
                  >
                    <UpdateTaskDatesModal
                      task={task}
                      isOpen
                      onClose={() => setOpenPanel(null)}
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  className={actionBtn}
                  onClick={(e) => handleOpen(e, "attachments")}
                >
                  <Paperclip className="w-4 h-4" />
                  Files
                </button>

                {openPanel === "attachments" && (
                  <div
                    className={`absolute left-0 w-64 bg-white shadow-lg rounded-2xl p-3 z-50 ${getPositionClass()}`}
                  >
                    <UpdateTaskAttachmentsModal
                      task={task}
                      isOpen
                      onClose={() => setOpenPanel(null)}
                    />
                  </div>
                )}
              </div>

              <button className={actionBtn}>
                <Archive className="w-4 h-4" />
                Archive
              </button>
            </div>

            {/* DESCRIPTION */}
            <div className="p-5 flex-1 flex flex-col">
              <span className="text-xs font-medium text-slate-500 mb-2">
                Description
              </span>

              <textarea
                value={form?.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="flex-1 w-full border border-slate-200 rounded-2xl p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Task description..."
              />
            </div>

            {/* SAVE */}
            <div className="p-5 border-t border-slate-200 flex justify-end">
              <button onClick={saveTask} className={primaryBtn}>
                <Save className="w-4 h-4" />
                Save changes
              </button>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="w-1/2 flex flex-col p-5 bg-slate-50/40">
            <div className="text-xs font-medium text-slate-500 mb-3">
              Comments
            </div>

            {/* INPUT */}
            <div className="flex gap-2 mb-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Write a comment..."
              />

              <button
                onClick={() => {
                  if (!commentText.trim()) return;
                  addComment(commentText);
                  setCommentText("");
                }}
                className="bg-blue-600 text-white px-3 rounded-xl text-sm hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {comments.map((c) => (
                <div
                  key={c._id}
                  className="bg-white border border-slate-200 p-3 rounded-xl text-sm"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xs text-slate-400">
                        {c.createdBy?.fullName}
                      </div>
                      <div className="text-slate-800">{c.content}</div>
                    </div>

                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
