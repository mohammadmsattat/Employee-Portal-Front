import { useEffect, useState } from "react";
import { X, Clock, Play, Pause, RotateCcw } from "lucide-react";

import { usePersistentTaskTimer } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/usePersistentTaskTimer";
import { useCreateTimeLogMutation } from "@/rtk/Tasks/timeTrackingApi";

type TimeLogPayload = {
  task?: string;
  subTask?: string;
  from: string;
  to: string;
  note?: string;
  type: "manual" | "tracked";
};

const UpdateTaskTimeLogModal = ({ isOpen, onClose, entity, workspaceId }) => {
  const [mode, setMode] = useState("tracked");

  const [form, setForm] = useState({
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
    from: timerFrom,
    to: timerTo,
  } = usePersistentTaskTimer(entity?.data?._id);

  /* =========================
     AUTO SYNC (tracked only)
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

  const safeDate = (v) => {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  /* =========================
     BUILD PAYLOAD (Task vs SubTask)
  ========================= */
const buildPayload = (): TimeLogPayload => {
  const from = timerFrom || form.from;
  const to = timerTo || form.to;

  const safeFrom = from ? new Date(from).toISOString() : null;
  const safeTo = to
    ? isRunning
      ? new Date().toISOString()
      : new Date(to).toISOString()
    : null;

  if (!safeFrom || !safeTo) {
    throw new Error("Missing valid time range");
  }

  const base = {
    from: safeFrom,
    to: safeTo,
    note: form.note,
    type: "tracked",
  };

  const id = entity?.data?._id;

  if (!id || !entity?.type) {
    throw new Error("Missing entity");
  }

  if (entity.type === "task") {
    return {
      ...base,
      task: id,
    };
  }

  if (entity.type === "subtask") {
    return {
      ...base,
      subTask: id,
    };
  }

  throw new Error("Invalid entity type");
};

  const handleSave = async () => {
    try {
      const payload = buildPayload();

      if (!payload.from || !payload.to) {
        throw new Error("Invalid date range");
      }

      await createTimeLog(payload).unwrap();

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

        <button onClick={onClose}>
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* MODE */}
      <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setMode("tracked")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
            mode === "tracked" ? "bg-white text-blue-600" : "text-slate-500"
          }`}
        >
          Timer
        </button>

        <button
          onClick={() => setMode("manual")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold ${
            mode === "manual" ? "bg-white text-blue-600" : "text-slate-500"
          }`}
        >
          Manual
        </button>
      </div>

      {/* TIMER */}
      {mode === "tracked" && (
        <div className="bg-slate-50 border rounded-2xl py-6 text-center mb-4">
          <div className="text-3xl font-semibold">{formattedTime}</div>
        </div>
      )}

      {/* ACTIONS */}
      {mode === "tracked" && (
        <div className="flex gap-2 mb-5">
          {!isRunning ? (
            <button
              onClick={start}
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
            >
              <Play className="w-4 h-4 inline" /> Start
            </button>
          ) : (
            <button
              onClick={pause}
              className="flex-1 bg-blue-500 text-white py-2 rounded-xl"
            >
              <Pause className="w-4 h-4 inline" /> Pause
            </button>
          )}

          <button onClick={reset} className="px-4 bg-slate-100 rounded-xl">
            <RotateCcw className="w-4 h-4" />
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
          className="w-full border p-2 rounded-xl text-sm"
        />

        <input
          type="datetime-local"
          value={form.to}
          onChange={(e) => handleChange("to", e.target.value)}
          disabled={mode === "tracked"}
          className="w-full border p-2 rounded-xl text-sm"
        />

        <textarea
          placeholder="Note..."
          value={form.note}
          onChange={(e) => handleChange("note", e.target.value)}
          className="w-full border p-2 rounded-xl text-sm"
        />
      </div>

      {/* SAVE */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
        >
          Save
        </button>

        <button
          onClick={onClose}
          className="flex-1 bg-slate-100 py-2 rounded-xl"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskTimeLogModal;
