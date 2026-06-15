// UpdateTaskTimeLogModal.tsx

import { useMemo, useState } from "react";

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

const UpdateTaskTimeLogModal = ({ isOpen, onClose, entity }) => {
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

  if (!isOpen) return null;

  return (
    <div className="bg-white border rounded-2xl shadow-2xl overflow-hidden">
      {/* HEADER */}
      <div className="px-5 py-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Clock3 className="w-4 h-4 text-blue-600" />
          </div>

          <div>
            <h2 className="text-sm font-semibold">Time Tracker</h2>
            <p className="text-[11px] text-slate-500">
              Track and save sessions
            </p>
          </div>
        </div>

        <button onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* MODE */}
      <div className="p-4 border-b">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setMode("tracked")}
            className={`flex-1 py-2 rounded-xl text-sm ${
              mode === "tracked" ? "bg-white shadow text-blue-600" : ""
            }`}
          >
            Timer
          </button>

          <button
            onClick={() => setMode("manual")}
            className={`flex-1 py-2 rounded-xl text-sm ${
              mode === "manual" ? "bg-white shadow text-blue-600" : ""
            }`}
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
              <div className="flex items-center justify-between">
                {/* TEXT */}
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                    Current Session
                  </div>

                  <div className="text-2xl font-semibold tracking-tight text-slate-900">
                    {formattedTime}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">
                  {!isRunning ? (
                    <button
                      onClick={start}
                      className="w-10 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={pause}
                      className="w-10 h-10 rounded-2xl bg-red-500 hover:bg-red-400 text-white flex items-center justify-center transition"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={reset}
                    className="w-10 h-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center transition"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SESSIONS */}
          <div className="px-5 pb-5">
            {/* <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold">Sessions</h3>
              <span className="text-xs text-slate-400">
                {unsavedSessions.length} items
              </span>
            </div> */}

            {/* SCROLL FIX */}
            <div className="space-y-3 mt-3  overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              {!unsavedSessions.length && (
                <div className="border border-dashed rounded-2xl py-10 text-center bg-slate-50">
                  <Clock3 className="w-5 h-5 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">No sessions yet</p>
                </div>
              )}

              {unsavedSessions.map((session) => (
                <div
                  key={session.id}
                  className="group relative rounded-2xl border bg-white p-4 transition hover:shadow-md"
                >
                  <div className="flex justify-between gap-3">
                    {/* INFO */}
                    <div className="flex-1">
                      <div className="text-[11px] text-slate-500 space-y-1">
                        <div>From: {formatDate(session.from)}</div>
                        <div>To: {formatDate(session.to)}</div>
                      </div>

                      <div className="font-semibold mt-1">
                        {formatDuration(session.duration)}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleSaveSession(session)}
                        className="w-7 h-7 border rounded-lg hover:bg-emerald-50 flex items-center justify-center"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteSession(session.id)}
                        className="w-7 h-7 border rounded-lg hover:bg-red-50 flex items-center justify-center"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 🟠 NOTE ON HOVER ONLY */}
                  <div
                    className="
                      mt-3 hidden group-hover:block
                      animate-in fade-in duration-150
                    "
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] text-slate-400">
                        Session note
                      </span>
                    </div>

                    <textarea
                      placeholder="Add note..."
                      value={sessionNotes[session.id] || ""}
                      onChange={(e) =>
                        handleSessionNoteChange(session.id, e.target.value)
                      }
                      className="flex-1 border border-slate-200/60 rounded-2xl p-3 outline-none bg-white focus:ring-2 focus:ring-blue-100 w-full"
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
        <div className="p-5 space-y-3">
          <input
            type="datetime-local"
            className="w-full border p-2 rounded-xl"
            value={manualForm.from}
            onChange={(e) =>
              setManualForm((p) => ({ ...p, from: e.target.value }))
            }
          />

          <input
            type="datetime-local"
            className="w-full border p-2 rounded-xl"
            value={manualForm.to}
            onChange={(e) =>
              setManualForm((p) => ({ ...p, to: e.target.value }))
            }
          />

          <textarea
            className="flex-1 w-full border border-slate-200/60 rounded-2xl p-3 outline-none bg-white focus:ring-2 focus:ring-blue-100 "
            placeholder="Note..."
            value={manualForm.note}
            onChange={(e) =>
              setManualForm((p) => ({ ...p, note: e.target.value }))
            }
          />
        </div>
      )}
    </div>
  );
};

export default UpdateTaskTimeLogModal;
