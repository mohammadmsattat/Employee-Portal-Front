import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "active-task-timers";

const getAllTimers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveAllTimers = (timers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
};

const getLocalDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 16);
};

export const usePersistentTaskTimer = (taskId) => {
  const [tick, setTick] = useState(0);

  const [timerData, setTimerData] = useState({
    isRunning: false,
    startedAt: null,
    pausedSeconds: 0,
    from: "",
    to: "",
  });

  /* LOAD */
  useEffect(() => {
    if (!taskId) return;

    const timers = getAllTimers();
    if (timers[taskId]) setTimerData(timers[taskId]);
  }, [taskId]);

  /* SYNC */
  useEffect(() => {
    const sync = () => {
      const timers = getAllTimers();
      if (timers[taskId]) setTimerData(timers[taskId]);
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [taskId]);

  /* TICK */
  useEffect(() => {
    const interval = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsedSeconds = useMemo(() => {
    if (!timerData.isRunning) return timerData.pausedSeconds;

    return (
      timerData.pausedSeconds +
      Math.floor((Date.now() - timerData.startedAt) / 1000)
    );
  }, [tick, timerData]);

  const updateStorage = (newData) => {
    const timers = getAllTimers();
    timers[taskId] = newData;
    saveAllTimers(timers);
    setTimerData(newData);
  };

  const start = () => {
    if (timerData.isRunning) return;

    updateStorage({
      ...timerData,
      isRunning: true,
      startedAt: Date.now(),
      from: timerData.from || getLocalDateTime(),
    });
  };

  const pause = () => {
    const total =
      timerData.pausedSeconds +
      Math.floor((Date.now() - timerData.startedAt) / 1000);

    updateStorage({
      ...timerData,
      isRunning: false,
      startedAt: null,
      pausedSeconds: total,
      to: getLocalDateTime(),
    });
  };

  const reset = () => {
    const timers = getAllTimers();
    delete timers[taskId];
    saveAllTimers(timers);

    setTimerData({
      isRunning: false,
      startedAt: null,
      pausedSeconds: 0,
      from: "",
      to: "",
    });
  };

  const formattedTime = useMemo(() => {
    const h = Math.floor(elapsedSeconds / 3600);
    const m = Math.floor((elapsedSeconds % 3600) / 60);
    const s = elapsedSeconds % 60;

    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  }, [elapsedSeconds]);

  return {
    isRunning: timerData.isRunning,
    elapsedSeconds,
    formattedTime,
    from: timerData.from,
    to: timerData.to,
    start,
    pause,
    reset,
  };
};