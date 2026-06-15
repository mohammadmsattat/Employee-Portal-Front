import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "active-task-timers";

const getAllTimers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveAllTimers = (timers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));

  window.dispatchEvent(new Event("task-timer-updated"));
};

const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
};

export const usePersistentTaskTimer = (taskId) => {
  const [tick, setTick] = useState(Date.now());

  /* =========================
     RERENDER
  ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     STORAGE SYNC
  ========================= */
  useEffect(() => {
    const sync = () => {
      setTick(Date.now());
    };

    window.addEventListener("storage", sync);

    window.addEventListener("task-timer-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);

      window.removeEventListener("task-timer-updated", sync);
    };
  }, []);

  /* =========================
     TIMER STATE
  ========================= */
  const timer = useMemo(() => {
    const all = getAllTimers();

    return (
      all[taskId] || {
        isRunning: false,

        startedAt: null,

        currentSession: null,

        sessions: [],
      }
    );
  }, [taskId, tick]);

  /* =========================
     INTERNAL PAUSE
  ========================= */
  const pauseTimer = (id, allTimers) => {
    const current = allTimers[id];

    if (!current?.isRunning) return;

    const now = new Date().toISOString();

    const duration = Date.now() - new Date(current.startedAt).getTime();

    const session = {
      id: generateSessionId(),

      from: current?.currentSession?.from,

      to: now,

      duration,

      createdAt: now,
    };

    allTimers[id] = {
      ...current,

      isRunning: false,

      startedAt: null,

      currentSession: null,

      sessions: [...(current.sessions || []), session],
    };
  };

  /* =========================
     START
  ========================= */
  const start = () => {
    const allTimers = getAllTimers();

    // stop all timers
    Object.keys(allTimers).forEach((id) => {
      if (allTimers[id]?.isRunning) {
        pauseTimer(id, allTimers);
      }
    });

    const now = new Date().toISOString();

    allTimers[taskId] = {
      ...timer,

      isRunning: true,

      startedAt: now,

      currentSession: {
        from: now,
      },
    };

    saveAllTimers(allTimers);

    setTick(Date.now());
  };

  /* =========================
     PAUSE
  ========================= */
  const pause = () => {
    const allTimers = getAllTimers();

    pauseTimer(taskId, allTimers);

    saveAllTimers(allTimers);

    setTick(Date.now());

    return allTimers[taskId];
  };

  /* =========================
     DELETE SESSION
  ========================= */
  const deleteSession = (sessionId) => {
    const allTimers = getAllTimers();

    const current = allTimers[taskId];

    if (!current) return;

    allTimers[taskId] = {
      ...current,

      sessions: current.sessions.filter((s) => s.id !== sessionId),
    };

    saveAllTimers(allTimers);

    setTick(Date.now());
  };

  /* =========================
     CLEAR ALL
  ========================= */
  const reset = () => {
    const allTimers = getAllTimers();

    delete allTimers[taskId];

    saveAllTimers(allTimers);

    setTick(Date.now());
  };

  /* =========================
     REMOVE SAVED SESSION
  ========================= */
  const removeSavedSession = (sessionId) => {
    deleteSession(sessionId);
  };

  /* =========================
     CURRENT TIMER
  ========================= */
  const elapsedMs = useMemo(() => {
    if (!timer.isRunning || !timer.startedAt) {
      return 0;
    }

    return Date.now() - new Date(timer.startedAt).getTime();
  }, [timer, tick]);

  /* =========================
     TOTAL TRACKED
  ========================= */
  const totalTrackedMs = useMemo(() => {
    return (timer.sessions || []).reduce(
      (acc, session) => acc + (session.duration || 0),
      0,
    );
  }, [timer.sessions]);

  /* =========================
     FORMATTER
  ========================= */
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);

    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");

    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );

    const secs = String(totalSeconds % 60).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  };

  return {
    isRunning: timer.isRunning,

    currentSession: timer.currentSession,

    sessions: timer.sessions || [],

    elapsedMs,

    formattedTime: formatDuration(elapsedMs),

    totalTrackedMs,

    totalTrackedFormatted: formatDuration(totalTrackedMs),

    start,
    pause,
    reset,

    deleteSession,

    removeSavedSession,

    formatDuration,
  };
};
