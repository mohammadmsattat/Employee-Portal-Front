import {
  Save,
  CalendarDays,
  Users,
  ArrowRight,
  Archive,
  Clock,
} from "lucide-react";

import UpdateTaskMembersModal from "./TaskMenuActoions/MembersModal";
import UpdateTaskStatusModal from "./TaskMenuActoions/StatusModal ";
import UpdateTaskDatesModal from "./TaskMenuActoions/DatesModal ";
import UpdateTaskTimeLogModal from "./TaskMenuActoions/TimeLogModal";

export default function TaskEditor({
  form,
  updateField,
  saveTask,
  entity,
  openPanel,
  handleOpen,
  popoverStyle,
  closeSubModal,
  workspaceId,
  refetchTasks,
}) {
  const actionBtn =
    "flex items-center gap-2 px-3 py-2 text-sm rounded-2xl bg-white/80 border border-slate-200/60 text-slate-700 hover:bg-white hover:shadow-sm transition backdrop-blur-sm";

  return (
    <div className="w-1/2 border-r border-slate-200/50 flex flex-col bg-slate-50/40">
      {/* TITLE */}
      <div className="p-6">
        <input
          value={form?.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full text-lg font-semibold border border-slate-200/60 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        />
      </div>

      {/* ACTIONS */}
      <div className="px-6 pb-4 flex gap-2 flex-wrap border-b border-slate-200/50">
        <div>
          <button
            className={actionBtn}
            onClick={(e) => handleOpen(e, "status")}
          >
            <ArrowRight className="w-4 h-4" /> Move
          </button>

          {openPanel === "status" && (
            <div style={popoverStyle()}>
              <UpdateTaskStatusModal
                entity={entity}
                isOpen
                onClose={closeSubModal}
                workspaceId={workspaceId}
                refetchTasks={refetchTasks}
              />
            </div>
          )}
        </div>

        <div>
          <button
            className={actionBtn}
            onClick={(e) => handleOpen(e, "members")}
          >
            <Users className="w-4 h-4" /> Members
          </button>

          {openPanel === "members" && (
            <div style={popoverStyle()}>
              <UpdateTaskMembersModal
                entity={entity}
                isOpen
                onClose={closeSubModal}
                workspaceId={workspaceId}
                refetchTasks={refetchTasks}
              />
            </div>
          )}
        </div>

        <div>
          <button className={actionBtn} onClick={(e) => handleOpen(e, "dates")}>
            <CalendarDays className="w-4 h-4" /> Dates
          </button>

          {openPanel === "dates" && (
            <div style={popoverStyle()}>
              <UpdateTaskDatesModal
                entity={entity}
                isOpen
                onClose={closeSubModal}
                workspaceId={workspaceId}
                refetchTasks={refetchTasks}
              />
            </div>
          )}
        </div>

        <div>
          <button className={actionBtn} onClick={(e) => handleOpen(e, "time")}>
            <Clock className="w-4 h-4" /> Time
          </button>

          {openPanel === "time" && (
            <div style={popoverStyle()}>
              <UpdateTaskTimeLogModal
                entity={entity}
                isOpen
                onClose={closeSubModal}
                workspaceId={workspaceId}
                // refetchTasks={refetchTasks}
              />
            </div>
          )}
        </div>

        <button className={actionBtn}>
          <Archive className="w-4 h-4" /> Archive
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="p-6 flex-1 flex flex-col">
        <textarea
          value={form?.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="flex-1 border border-slate-200/60 rounded-2xl p-3 outline-none bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* SAVE */}
      <div className="p-6 border-t border-slate-200/50 flex justify-end bg-slate-50/40">
        <button
          onClick={saveTask}
          className="bg-blue-600 text-white px-6 py-2 rounded-2xl shadow-sm hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  );
}
