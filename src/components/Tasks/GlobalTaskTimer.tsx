import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
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

  // 🔄 sync from localStorage
  useEffect(() => {
    const sync = () => {
      setTimers(getTimers());
    };

    sync();

    window.addEventListener("storage", sync);

    // مهم: لأن نفس التبويب لا يطلق storage event
    const interval = setInterval(sync, 1000);

    return () => {
      window.removeEventListener("storage", sync);
      clearInterval(interval);
    };
  }, []);

  const activeTimers = Object.entries(timers)
    .filter(([_, t]) => t.isRunning)
    .map(([taskId, data]) => ({
      taskId,
      ...data,
    }));

  if (activeTimers.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg"
      >
        <Clock className="w-4 h-4" />
        <span className="text-sm font-semibold">
          Timers ({activeTimers.length})
        </span>
      </button>

      {/* MODAL */}
      {open && (
        <div className="absolute bottom-14 right-0 w-80 bg-white border rounded-2xl shadow-2xl p-4 space-y-3 max-h-[400px] overflow-y-auto">
          <div className="text-sm font-semibold text-slate-700">
            Active Timers
          </div>

          <div className="space-y-3">
            {activeTimers.map((t) => (
              <TimerRow
                key={t.taskId}
                taskId={t.taskId}
                taskTitle={tasksMap?.[t.taskId] || "Task"}
              />
            ))}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-full text-xs text-slate-500 pt-2"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
 
const TimerRow = ({ taskId, taskTitle }) => {
  const { formattedTime } = usePersistentTaskTimer(taskId);

  return (
    <div className="border rounded-xl p-3 bg-slate-50">
      <div className="text-sm font-semibold truncate">{taskTitle}</div>
      <div className="text-xl font-bold">{formattedTime}</div>
    </div>
  );
};

export default GlobalTaskTimer;