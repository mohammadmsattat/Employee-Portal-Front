import { useMemo, useState, useEffect } from "react";
import {
  X,
  Clock3,
  Play,
  Pause,
  RotateCcw,
  Save,
  Trash,
  StickyNote,
} from "lucide-react";
import { usePersistentTaskTimer } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/usePersistentTaskTimer";
import { useCreateTimeLogMutation } from "@/rtk/Tasks/timeTrackingApi";

// ==================== HELPERS ====================
const formatDuration = (ms = 0) => {
  const totalSeconds = Math.floor(ms / 1000);
  return `${String(Math.floor(totalSeconds / 3600)).padStart(2, "0")}:${String(
    Math.floor((totalSeconds % 3600) / 60),
  ).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

// ==================== MAIN COMPONENT ====================
const UpdateTaskTimeLogModal = ({ isOpen, onClose, entity, isMobile = false }) => {
  const [mode, setMode] = useState("tracked");
  const [sessionNotes, setSessionNotes] = useState({});
  const [manualForm, setManualForm] = useState({
    from: "",
    to: "",
    note: "",
  });

  const [createTimeLog, { isLoading }] = useCreateTimeLogMutation();

  const {
    isRunning,
    formattedTime,
    start,
    pause,
    reset,
    sessions,
    deleteSession,
  } = usePersistentTaskTimer(entity?.data?._id);

  const unsavedSessions = useMemo(
    () => (sessions || []).filter((s) => !s.saved),
    [sessions],
  );

  const handleSessionNoteChange = (id, value) => {
    setSessionNotes((p) => ({ ...p, [id]: value }));
  };

  const handleSaveSession = async (session) => {
    try {
      const payload = {
        task: entity?.type === "task" ? entity?.data?._id : undefined,
        subTask: entity?.type === "subtask" ? entity?.data?._id : undefined,
        from: session.from,
        to: session.to,
        note: sessionNotes[session.id] || "",
        type: "tracked",
      };

      await createTimeLog(payload).unwrap();
      deleteSession(session.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualSave = async () => {
    try {
      const payload = {
        task: entity?.type === "task" ? entity?.data?._id : undefined,
        subTask: entity?.type === "subtask" ? entity?.data?._id : undefined,
        from: manualForm.from,
        to: manualForm.to,
        note: manualForm.note || "",
        type: "manual",
      };

      await createTimeLog(payload).unwrap();
      setManualForm({ from: "", to: "", note: "" });
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`
      bg-white border rounded-2xl shadow-2xl overflow-hidden
      ${isMobile ? "w-full max-w-[320px]" : "w-[350px]"}
    `}>
      {/* HEADER */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`${isMobile ? "h-8 w-8" : "h-9 w-9"} rounded-2xl bg-blue-50 flex items-center justify-center`}>
            <Clock3 className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} text-blue-600`} />
          </div>

          <div>
            <h2 className={`${isMobile ? "text-sm" : "text-sm"} font-semibold`}>Time Tracker</h2>
            <p className="text-[11px] text-slate-500">Track and save sessions</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className={isMobile ? "p-1 hover:bg-slate-100 rounded-lg transition" : "hover:bg-slate-100 rounded-lg p-1 transition"}
        >
          <X className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
        </button>
      </div>

      {/* MODE */}
      <div className="p-3 sm:p-4 border-b">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setMode("tracked")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              mode === "tracked" ? "bg-white shadow text-blue-600" : "text-slate-600"
            } ${isMobile ? "text-xs py-2.5" : "text-sm"}`}
          >
            Timer
          </button>

          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              mode === "manual" ? "bg-white shadow text-blue-600" : "text-slate-600"
            } ${isMobile ? "text-xs py-2.5" : "text-sm"}`}
          >
            Manual
          </button>
        </div>
      </div>

      {/* TRACKED */}
      {mode === "tracked" && (
        <>
          {/* TIMER */}
          <div className="p-3 border-b bg-slate-50/50">
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                {/* TEXT */}
                <div className="text-left min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                    Current Session
                  </div>

                  <div className={`font-semibold tracking-tight text-slate-900 ${isMobile ? "text-xl" : "text-2xl"}`}>
                    {formattedTime}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {!isRunning ? (
                    <button
                      onClick={start}
                      className={`${isMobile ? "w-9 h-9" : "w-10 h-10"} rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition active:scale-95`}
                    >
                      <Play className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
                    </button>
                  ) : (
                    <button
                      onClick={pause}
                      className={`${isMobile ? "w-9 h-9" : "w-10 h-10"} rounded-2xl bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition active:scale-95`}
                    >
                      <Pause className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
                    </button>
                  )}

                  <button
                    onClick={reset}
                    className={`${isMobile ? "w-9 h-9" : "w-10 h-10"} rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition active:scale-95`}
                  >
                    <RotateCcw className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} text-slate-600`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SESSIONS */}
          <div className="px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="space-y-3 mt-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {!unsavedSessions.length && (
                <div className="border border-dashed rounded-2xl py-8 text-center bg-slate-50">
                  <Clock3 className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} mx-auto text-slate-300 mb-2`} />
                  <p className={`${isMobile ? "text-xs" : "text-sm"} text-slate-500`}>No sessions yet</p>
                </div>
              )}

              {unsavedSessions.map((session) => (
                <div
                  key={session.id}
                  className="group relative rounded-2xl border bg-white p-3 sm:p-4 transition hover:shadow-md"
                >
                  <div className="flex justify-between gap-3">
                    {/* INFO */}
                    <div className="flex-1 min-w-0">
                      <div className={`${isMobile ? "text-[10px]" : "text-[11px]"} text-slate-500 space-y-0.5`}>
                        <div>From: {formatDate(session.from)}</div>
                        <div>To: {formatDate(session.to)}</div>
                      </div>

                      <div className={`font-semibold mt-1 ${isMobile ? "text-sm" : "text-base"}`}>
                        {formatDuration(session.duration)}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => handleSaveSession(session)}
                        className={`${isMobile ? "w-8 h-8" : "w-7 h-7"} border rounded-lg hover:bg-emerald-50 flex items-center justify-center transition active:scale-95`}
                      >
                        <Save className={`${isMobile ? "w-4 h-4" : "w-3.5 h-3.5"}`} />
                      </button>

                      <button
                        onClick={() => deleteSession(session.id)}
                        className={`${isMobile ? "w-8 h-8" : "w-7 h-7"} border rounded-lg hover:bg-red-50 flex items-center justify-center transition active:scale-95`}
                      >
                        <Trash className={`${isMobile ? "w-4 h-4" : "w-3.5 h-3.5"}`} />
                      </button>
                    </div>
                  </div>

                  {/* NOTE ON HOVER */}
                  <div className="mt-3 hidden group-hover:block animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 mb-1">
                      <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] text-slate-400">Session note</span>
                    </div>

                    <textarea
                      placeholder="Add note..."
                      value={sessionNotes[session.id] || ""}
                      onChange={(e) =>
                        handleSessionNoteChange(session.id, e.target.value)
                      }
                      className={`w-full border border-slate-200/60 rounded-2xl p-3 outline-none bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition resize-none
                        ${isMobile ? "text-sm min-h-[60px]" : "text-sm min-h-[50px]"}
                      `}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MANUAL */}
      {mode === "manual" && (
        <div className={`p-3 sm:p-4 space-y-3`}>
          <div className="space-y-1.5">
            <label className={`${isMobile ? "text-xs" : "text-xs"} font-medium text-slate-600`}>
              From
            </label>
            <input
              type="datetime-local"
              className={`w-full border rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition
                ${isMobile ? "p-3 text-sm" : "p-2.5 text-sm"}
              `}
              value={manualForm.from}
              onChange={(e) =>
                setManualForm((p) => ({ ...p, from: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className={`${isMobile ? "text-xs" : "text-xs"} font-medium text-slate-600`}>
              To
            </label>
            <input
              type="datetime-local"
              className={`w-full border rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition
                ${isMobile ? "p-3 text-sm" : "p-2.5 text-sm"}
              `}
              value={manualForm.to}
              onChange={(e) =>
                setManualForm((p) => ({ ...p, to: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className={`${isMobile ? "text-xs" : "text-xs"} font-medium text-slate-600`}>
              Note
            </label>
            <textarea
              className={`w-full border border-slate-200/60 rounded-xl p-3 outline-none bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition resize-none
                ${isMobile ? "text-sm min-h-[80px]" : "text-sm min-h-[60px]"}
              `}
              placeholder="Add note..."
              value={manualForm.note}
              onChange={(e) =>
                setManualForm((p) => ({ ...p, note: e.target.value }))
              }
            />
          </div>

          <button
            onClick={handleManualSave}
            disabled={!manualForm.from || !manualForm.to}
            className={`
              w-full bg-blue-600 text-white rounded-xl font-medium
              hover:bg-blue-700 transition active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600
              ${isMobile ? "py-3 text-sm" : "py-2.5 text-sm"}
            `}
          >
            {isLoading ? "Saving..." : "Save Manual Entry"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateTaskTimeLogModal;