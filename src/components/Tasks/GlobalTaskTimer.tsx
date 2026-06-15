// GlobalTaskTimer.tsx

import { useEffect, useMemo, useRef, useState } from "react";

import { Clock3, Pause } from "lucide-react";

import { usePersistentTaskTimer } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/usePersistentTaskTimer";

const STORAGE_KEY = "active-task-timers";

const getTimers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const GlobalTaskTimer = ({ tasksMap }) => {
  const [open, setOpen] = useState(false);

  const [timers, setTimers] = useState({});

  const panelRef = useRef(null);

  /* =========================
     SYNC
  ========================= */
  useEffect(() => {
    const sync = () => {
      setTimers(getTimers());
    };

    sync();

    window.addEventListener("storage", sync);

    window.addEventListener("task-timer-updated", sync);

    const interval = setInterval(sync, 1000);

    return () => {
      window.removeEventListener("storage", sync);

      window.removeEventListener("task-timer-updated", sync);

      clearInterval(interval);
    };
  }, []);

  /* =========================
     OUTSIDE CLICK
  ========================= */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  /* =========================
     ONLY RUNNING TIMER
  ========================= */
  const activeTimer = useMemo(() => {
    const runningEntry = Object.entries(timers).find(
      ([_, timer]) => timer?.isRunning,
    );

    if (!runningEntry) return null;

    const [taskId, data] = runningEntry;

    return {
      taskId,
      ...data,
    };
  }, [timers]);

  /* =========================
   AUTO CLOSE WHEN NO TIMER
========================= */
  useEffect(() => {
    setOpen(false);
  }, [activeTimer?.taskId]);
  const { formattedTime, pause } = usePersistentTaskTimer(
    activeTimer?.taskId || "",
  );
  if (!activeTimer) return null;

  return (
    <div className="fixed top-3 right-6 z-[998]">
      {/* BUTTON */}
      <div
        // onClick={() => setOpen((p) => !p)}
        className="
          flex items-center gap-3
          rounded-2xl
          border border-slate-200
          bg-white
          px-4 py-3
          shadow-lg
        "
      >
        {/* <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50"
          onClick={pause}
        >
          <Clock3 className="h-5 w-5 text-blue-600" />
        </div> */}
        <button
          onClick={pause}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-amber-600"
        >
          <Pause className="h-3.5 w-3.5" />
        </button>
        {/* <div className="flex flex-col items-start leading-tight">
          <span className="text-[11px] font-medium text-slate-400">
            Active Timer
          </span>

          <span className="text-sm font-semibold text-slate-800">
            1 Running
          </span>
        </div> */}{" "}
        {formattedTime}
      </div>

      {/* PANEL */}
      {open && (
        <div
          ref={panelRef}
          className="
            absolute bottom-16 right-0
            w-[360px]
            overflow-hidden
            rounded-3xl
            border border-slate-200
            bg-white
            shadow-2xl
          "
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Active Timer
            </h3>
          </div>

          <div className="p-4 bg-slate-50/70">
            <TimerRow
              taskId={activeTimer.taskId}
              taskTitle={tasksMap?.[activeTimer.taskId] || "Untitled Task"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const TimerRow = ({ taskId, taskTitle }) => {
  const { formattedTime, isRunning, pause } = usePersistentTaskTimer(taskId);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-slate-800">
            {taskTitle}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[11px] font-medium text-emerald-600">
              Running
            </span>
          </div>
        </div>

        <button
          onClick={pause}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600"
        >
          <Pause className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
        <div className="text-[10px] uppercase tracking-wide text-slate-400">
          Elapsed
        </div>

        <div className="mt-1 text-xl font-bold tracking-wide text-slate-900">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default GlobalTaskTimer;
