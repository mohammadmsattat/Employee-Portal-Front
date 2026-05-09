import { useEffect, useState } from "react";
import { X, Clock, Play, Pause, RotateCcw } from "lucide-react";

import { usePersistentTaskTimer } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/usePersistentTaskTimer";
import { useCreateTimeLogMutation } from "@/rtk/Tasks/timeTrackingApi";
type TimeLogPayload = {
  task: string;
  workspaceId?: string;
  from: string;
  to: string;
  note?: string;
  type: "manual" | "tracked";
};
const UpdateTaskTimeLogModal = ({ isOpen, onClose, task, workspaceId }) => {
  const [mode, setMode] = useState("tracked");

  const [form, setForm] = useState({
    from: "",
    to: "",
    note: "",
  });

  const [createTimeLog, { isLoading }] = useCreateTimeLogMutation();

  const {
    isRunning,
    elapsedSeconds,
    formattedTime,
    start,
    pause,
    reset,
    from: timerFrom,
    to: timerTo,
  } = usePersistentTaskTimer(task?._id);

  /* =========================
     AUTO SYNC FORM (tracked only)
  ========================= */
  useEffect(() => {
    if (mode !== "tracked") return;

    setForm((prev) => ({
      ...prev,
      from: timerFrom || prev.from,
      to: timerTo || prev.to,
    }));
  }, [timerFrom, timerTo, mode]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* =========================
     NORMALIZE SAFE DATE
  ========================= */
  const safeDate = (v) => {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  /* =========================
     BUILD PAYLOAD (FINAL RULES)
  ========================= */
  const buildPayload = (): TimeLogPayload => {
    if (mode === "tracked") {
      const now = new Date().toISOString();

      return {
        task: task?._id,
        workspaceId,

        from: safeDate(timerFrom)!,

        to: isRunning ? now : safeDate(timerTo)!,

        note: form.note,

        type: "tracked",
      };
    }

    return {
      task: task?._id,
      workspaceId,

      from: safeDate(form.from)!,

      to: safeDate(form.to)!,

      note: form.note,

      type: "manual",
    };
  };

  /* =========================
     SAVE
  ========================= */
  const handleSave = async () => {
    try {
      const payload = buildPayload();

      if (!payload.from || !payload.to) {
        throw new Error("Invalid date range");
      }

      await createTimeLog(payload).unwrap();

      // 🔥 reset everything after success
      reset();

      setForm({
        from: "",
        to: "",
        note: "",
      });

      onClose();
    } catch (err) {
      console.error("TimeLog save error:", err);
    }
  };

  if (!isOpen) return null;

return (
  <div className="w-[320px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5">
    {/* HEADER */}
    <div className="flex justify-between mb-4">
      <div className="flex items-center gap-2 font-semibold text-slate-800">
        <Clock className="w-4 h-4 text-slate-600" />
        Time Tracker
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-slate-100 transition"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </div>

    {/* MODE SWITCH */}
    <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-2xl">
      <button
        onClick={() => setMode("tracked")}
        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
          mode === "tracked"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Timer
      </button>

      <button
        onClick={() => setMode("manual")}
        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
          mode === "manual"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Manual
      </button>
    </div>

    {/* TIMER */}
    {mode === "tracked" && (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl py-6 text-center mb-4">
        <div className="text-3xl font-semibold text-slate-800 tracking-wider">
          {formattedTime}
        </div>
      </div>
    )}

    {/* ACTIONS */}
    {mode === "tracked" && (
      <div className="flex gap-2 mb-5">
        {!isRunning ? (
          <button
            onClick={start}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl flex justify-center gap-2 font-medium transition"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="flex-1 bg-amber-400 hover:bg-amber-500 text-white py-2 rounded-xl flex justify-center gap-2 font-medium transition"
          >
            <Pause className="w-4 h-4" />
            Pause
          </button>
        )}

        <button
          onClick={reset}
          className="px-4 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    )}

    {/* FORM */}
    <div className="space-y-3">
      <input
        type="datetime-local"
        value={form.from}
        onChange={(e) => handleChange("from", e.target.value)}
        disabled={mode === "tracked"}
        className="w-full border border-slate-200 p-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />

      <input
        type="datetime-local"
        value={form.to}
        onChange={(e) => handleChange("to", e.target.value)}
        disabled={mode === "tracked"}
        className="w-full border border-slate-200 p-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />

      <textarea
        placeholder="Note..."
        value={form.note}
        onChange={(e) => handleChange("note", e.target.value)}
        className="w-full border border-slate-200 p-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />
    </div>

    {/* SAVE */}
    <div className="mt-5 flex gap-2">
      <button
        disabled={isLoading}
        onClick={handleSave}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
      >
        Save
      </button>

      <button
        onClick={onClose}
        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-medium transition"
      >
        Cancel
      </button>
    </div>
  </div>
);
};

export default UpdateTaskTimeLogModal;
