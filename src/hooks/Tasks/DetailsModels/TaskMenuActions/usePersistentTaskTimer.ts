import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "active-task-timers";

const createEmptyTimer = () => ({
  isRunning: false,
  startedAt: null,
  currentSession: null,
  sessions: [],
});

const getAllTimers = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const savedTimers = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    if (
      !savedTimers ||
      typeof savedTimers !== "object" ||
      Array.isArray(savedTimers)
    ) {
      return {};
    }

    return savedTimers;
  } catch {
    return {};
  }
};

const saveAllTimers = (timers) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));

  window.dispatchEvent(new CustomEvent("task-timer-updated"));
};

const generateSessionId = () => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
};

const formatDuration = (milliseconds = 0) => {
  const validMilliseconds = Number.isFinite(milliseconds)
    ? Math.max(0, milliseconds)
    : 0;

  const totalSeconds = Math.floor(validMilliseconds / 1000);

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");

  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0",
  );

  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const pauseStoredTimer = (timerId, allTimers) => {
  const currentTimer = allTimers[timerId];

  if (!currentTimer?.isRunning) {
    return;
  }

  const sessionStart =
    currentTimer.currentSession?.from || currentTimer.startedAt;

  const startTimestamp = new Date(sessionStart).getTime();

  const nowTimestamp = Date.now();
  const now = new Date(nowTimestamp).toISOString();

  const sessions = Array.isArray(currentTimer.sessions)
    ? currentTimer.sessions
    : [];

  const validStartTimestamp = Number.isFinite(startTimestamp);

  const duration = validStartTimestamp
    ? Math.max(0, nowTimestamp - startTimestamp)
    : 0;

  const nextSessions = validStartTimestamp
    ? [
        ...sessions,
        {
          id: generateSessionId(),
          from: sessionStart,
          to: now,
          duration,
          createdAt: now,
          saved: false,
        },
      ]
    : sessions;

  allTimers[timerId] = {
    ...currentTimer,
    isRunning: false,
    startedAt: null,
    currentSession: null,
    sessions: nextSessions,
  };
};

export const usePersistentTaskTimer = (taskId) => {
  const [tick, setTick] = useState(Date.now());

  /*
   * تحديث البيانات عند تغيير المهمة.
   */
  useEffect(() => {
    setTick(Date.now());
  }, [taskId]);

  /*
   * تحديث الوقت كل ثانية.
   */
  useEffect(() => {
    if (!taskId) return undefined;

    const interval = window.setInterval(() => {
      setTick(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [taskId]);

  /*
   * المزامنة بين المكونات والتبويبات.
   */
  useEffect(() => {
    const syncTimer = () => {
      setTick(Date.now());
    };

    window.addEventListener("storage", syncTimer);
    window.addEventListener("task-timer-updated", syncTimer);

    return () => {
      window.removeEventListener("storage", syncTimer);
      window.removeEventListener("task-timer-updated", syncTimer);
    };
  }, []);

  const timer = useMemo(() => {
    if (!taskId) {
      return createEmptyTimer();
    }

    const allTimers = getAllTimers();
    const storedTimer = allTimers[taskId];

    if (!storedTimer) {
      return createEmptyTimer();
    }

    return {
      ...createEmptyTimer(),
      ...storedTimer,
      sessions: Array.isArray(storedTimer.sessions) ? storedTimer.sessions : [],
    };
  }, [taskId, tick]);

  const start = () => {
    if (!taskId) return;

    const allTimers = getAllTimers();

    /*
     * نوقف أي مؤقت يعمل لمهمة أخرى.
     */
    Object.keys(allTimers).forEach((timerId) => {
      if (allTimers[timerId]?.isRunning) {
        pauseStoredTimer(timerId, allTimers);
      }
    });

    const currentTimer = allTimers[taskId] || createEmptyTimer();

    const now = new Date().toISOString();

    allTimers[taskId] = {
      ...createEmptyTimer(),
      ...currentTimer,
      isRunning: true,
      startedAt: now,
      currentSession: {
        from: now,
      },
      sessions: Array.isArray(currentTimer.sessions)
        ? currentTimer.sessions
        : [],
    };

    saveAllTimers(allTimers);
    setTick(Date.now());
  };

  const pause = () => {
    if (!taskId) return null;

    const allTimers = getAllTimers();

    pauseStoredTimer(taskId, allTimers);
    saveAllTimers(allTimers);
    setTick(Date.now());

    return allTimers[taskId] || null;
  };

  const deleteSession = (sessionId) => {
    if (!taskId || !sessionId) return;

    const allTimers = getAllTimers();
    const currentTimer = allTimers[taskId];

    if (!currentTimer) return;

    const currentSessions = Array.isArray(currentTimer.sessions)
      ? currentTimer.sessions
      : [];

    allTimers[taskId] = {
      ...currentTimer,
      sessions: currentSessions.filter((session) => session.id !== sessionId),
    };

    saveAllTimers(allTimers);
    setTick(Date.now());
  };

  const reset = () => {
    if (!taskId) return;

    const allTimers = getAllTimers();

    delete allTimers[taskId];

    saveAllTimers(allTimers);
    setTick(Date.now());
  };

  const removeSavedSession = (sessionId) => {
    deleteSession(sessionId);
  };

  const elapsedMs = useMemo(() => {
    if (!timer.isRunning || !timer.startedAt) {
      return 0;
    }

    const startedTimestamp = new Date(timer.startedAt).getTime();

    if (!Number.isFinite(startedTimestamp)) {
      return 0;
    }

    return Math.max(0, tick - startedTimestamp);
  }, [timer.isRunning, timer.startedAt, tick]);

  const totalTrackedMs = useMemo(() => {
    return timer.sessions.reduce((total, session) => {
      const duration = Number(session?.duration);

      return total + (Number.isFinite(duration) ? duration : 0);
    }, 0);
  }, [timer.sessions]);

  return {
    isRunning: timer.isRunning,
    currentSession: timer.currentSession,
    sessions: timer.sessions,

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
