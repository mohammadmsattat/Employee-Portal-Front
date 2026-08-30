import { useEffect, useMemo, useState } from "react";

import {
  Clock3,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Save,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

import { usePersistentTaskTimer } from "@/hooks/Tasks/DetailsModels/TaskMenuActions/usePersistentTaskTimer";

import { useCreateTimeLogMutation } from "@/rtk/Tasks/timeTrackingApi";

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const convertLocalDateToISO = (value) => {
  if (!value) {
    throw new Error("Date and time are required.");
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date and time.");
  }

  return date.toISOString();
};

const UpdateTaskTimeLogModal = ({
  isOpen,
  onClose,
  entity,
  refetchTimeLogs,
}) => {
  const { toast } = useToast();

  const [mode, setMode] = useState("tracked");

  const [sessionNotes, setSessionNotes] = useState({});

  const [manualForm, setManualForm] = useState({
    from: "",
    to: "",
    note: "",
  });

  const [savingSessionId, setSavingSessionId] = useState(null);

  const [isSavingManual, setIsSavingManual] = useState(false);

  const [createTimeLog] = useCreateTimeLogMutation();

  const data = entity?.data || entity;

  const entityType =
    entity?.type === "subtask" || Boolean(data?.task || data?.parentTaskId)
      ? "subtask"
      : "task";

  const entityId = data?._id;

  const {
    isRunning,
    formattedTime,
    totalTrackedFormatted,
    start,
    pause,
    reset,
    sessions,
    deleteSession,
    formatDuration,
  } = usePersistentTaskTimer(entityId);

  const unsavedSessions = useMemo(() => {
    return Array.isArray(sessions)
      ? sessions.filter((session) => !session.saved)
      : [];
  }, [sessions]);

  const isSaving = Boolean(savingSessionId) || isSavingManual;

  /*
   * تنظيف البيانات عند فتح مهمة مختلفة.
   */
  useEffect(() => {
    if (!isOpen) return;

    setMode("tracked");
    setSessionNotes({});
    setManualForm({
      from: "",
      to: "",
      note: "",
    });
    setSavingSessionId(null);
    setIsSavingManual(false);
  }, [isOpen, entityId]);

  const createEntityPayload = () => {
    if (!entityId) {
      throw new Error("Task information is missing.");
    }

    if (entityType === "subtask") {
      return {
        subTask: entityId,
      };
    }

    return {
      task: entityId,
    };
  };

  const refreshLogs = async () => {
    try {
      await Promise.resolve(refetchTimeLogs?.());
    } catch (error) {
      console.error("Failed to refresh time logs", error);
    }
  };

  const handleSessionNoteChange = (sessionId, value) => {
    setSessionNotes((previous) => ({
      ...previous,
      [sessionId]: value,
    }));
  };

  const handleSaveSession = async (session) => {
    if (!session?.id || isSaving) return;

    if (!session.from || !session.to) {
      toast({
        title: "Invalid session",
        description: "The session start or end time is missing.",
        variant: "destructive",
      });

      return;
    }

    setSavingSessionId(session.id);

    try {
      const payload = {
        ...createEntityPayload(),
        from: session.from,
        to: session.to,
        note: sessionNotes[session.id]?.trim() || "",
        type: "tracked",
      };

      await createTimeLog(payload).unwrap();

      /*
       * نحذف الجلسة المحلية فقط بعد نجاح الحفظ.
       */
      deleteSession(session.id);

      setSessionNotes((previous) => {
        const nextNotes = { ...previous };

        delete nextNotes[session.id];

        return nextNotes;
      });

      await refreshLogs();

      toast({
        title: "Session saved",
        description: "The tracked session was saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save session", error);

      toast({
        title: "Save failed",
        description:
          error?.data?.message ||
          error?.message ||
          "Failed to save the tracked session.",
        variant: "destructive",
      });
    } finally {
      setSavingSessionId(null);
    }
  };

  const handleManualSave = async () => {
    if (isSaving) return;

    if (!manualForm.from || !manualForm.to) {
      toast({
        title: "Missing information",
        description: "Please select both start and end time.",
        variant: "destructive",
      });

      return;
    }

    const fromTimestamp = new Date(manualForm.from).getTime();

    const toTimestamp = new Date(manualForm.to).getTime();

    if (!Number.isFinite(fromTimestamp) || !Number.isFinite(toTimestamp)) {
      toast({
        title: "Invalid time",
        description: "Please enter valid start and end times.",
        variant: "destructive",
      });

      return;
    }

    if (toTimestamp <= fromTimestamp) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive",
      });

      return;
    }

    setIsSavingManual(true);

    try {
      const payload = {
        ...createEntityPayload(),
        from: convertLocalDateToISO(manualForm.from),
        to: convertLocalDateToISO(manualForm.to),
        note: manualForm.note.trim(),
        type: "manual",
      };

      await createTimeLog(payload).unwrap();

      setManualForm({
        from: "",
        to: "",
        note: "",
      });

      await refreshLogs();

      toast({
        title: "Time entry saved",
        description: "The manual time entry was saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save manual time entry", error);

      toast({
        title: "Save failed",
        description:
          error?.data?.message ||
          error?.message ||
          "Failed to save the manual entry.",
        variant: "destructive",
      });
    } finally {
      setIsSavingManual(false);
    }
  };

  const handleReset = () => {
    if (!isRunning && unsavedSessions.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Delete the active timer and all unsaved sessions?",
    );

    if (confirmed) {
      reset();
      setSessionNotes({});
    }
  };

  if (!isOpen || !entityId) {
    return null;
  }

  return (
    <div
      className="
    w-[calc(100vw-24px)]
    max-w-[380px]
    max-h-[calc(100vh-24px)]
    overflow-y-auto
    rounded-2xl
    border border-slate-200
    bg-white
    shadow-2xl
  "
    >
      {/* HEADER */}
      <div
        className="
          flex items-center justify-between gap-3
          border-b border-slate-100
          px-4 py-4
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl bg-blue-50
            "
          >
            <Clock3 className="h-4 w-4 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-800">
              {entityType === "subtask"
                ? "Subtask Time Tracker"
                : "Task Time Tracker"}
            </h2>

            <p className="truncate text-[11px] text-slate-400">
              {data.title || "Track working time"}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={onClose}
          aria-label="Close time tracker"
          className="
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-lg text-slate-500
            transition
            hover:bg-slate-100
            hover:text-slate-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* MODE */}
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => setMode("tracked")}
            className={`
              flex-1 rounded-lg px-3 py-2
              text-xs font-medium transition
              ${
                mode === "tracked"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }
            `}
          >
            Timer
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => setMode("manual")}
            className={`
              flex-1 rounded-lg px-3 py-2
              text-xs font-medium transition
              ${
                mode === "manual"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }
            `}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {mode === "tracked" && (
        <>
          {/* TIMER */}
          <div className="bg-slate-50/70 p-4">
            <div
              className="
                rounded-2xl border border-slate-200
                bg-white p-4 shadow-sm
              "
            >
              <div className="text-center">
                <p
                  className="
                    text-[10px] font-medium uppercase
                    tracking-[0.16em] text-slate-400
                  "
                >
                  Current Session
                </p>

                <div
                  className="
                    mt-2 font-mono text-3xl
                    font-semibold tracking-tight
                    text-slate-900
                  "
                >
                  {formattedTime}
                </div>

                <div className="mt-1 text-[11px] text-slate-400">
                  Unsaved total: {totalTrackedFormatted}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {!isRunning ? (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={start}
                    className="
                      flex h-10 flex-1
                      items-center justify-center gap-2
                      rounded-xl bg-blue-600
                      text-sm font-medium text-white
                      transition
                      hover:bg-blue-700
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Start
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={pause}
                    className="
                      flex h-10 flex-1
                      items-center justify-center gap-2
                      rounded-xl bg-red-500
                      text-sm font-medium text-white
                      transition
                      hover:bg-red-600
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <Pause className="h-4 w-4 fill-current" />
                    Pause
                  </button>
                )}

                <button
                  type="button"
                  disabled={
                    isSaving || (!isRunning && unsavedSessions.length === 0)
                  }
                  onClick={handleReset}
                  aria-label="Reset timer"
                  title="Delete timer and unsaved sessions"
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl border border-slate-200
                    bg-white text-slate-600
                    transition
                    hover:border-red-200
                    hover:bg-red-50
                    hover:text-red-600
                    active:scale-95
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* SESSIONS */}
          <div className="border-t border-slate-100 px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-700">
                Unsaved Sessions
              </p>

              <span
                className="
                  rounded-full bg-blue-50
                  px-2 py-0.5
                  text-[10px] font-semibold
                  text-blue-600
                "
              >
                {unsavedSessions.length}
              </span>
            </div>

            <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
              {unsavedSessions.length === 0 ? (
                <div
                  className="
                    rounded-xl border border-dashed
                    border-slate-200 bg-slate-50
                    px-4 py-7 text-center
                  "
                >
                  <Clock3 className="mx-auto h-5 w-5 text-slate-300" />

                  <p className="mt-2 text-xs text-slate-500">
                    Pause the timer to create a session.
                  </p>
                </div>
              ) : (
                unsavedSessions.map((session) => {
                  const savingThisSession = savingSessionId === session.id;

                  return (
                    <div
                      key={session.id}
                      className="
                        rounded-xl border border-slate-200
                        bg-white p-3
                      "
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-base font-semibold text-slate-800">
                            {formatDuration(session.duration)}
                          </div>

                          <div className="mt-1 space-y-0.5 text-[10px] text-slate-400">
                            <p>From: {formatDate(session.from)}</p>

                            <p>To: {formatDate(session.to)}</p>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleSaveSession(session)}
                            aria-label="Save session"
                            className="
                              flex h-8 w-8
                              items-center justify-center
                              rounded-lg border border-emerald-100
                              text-emerald-600
                              transition
                              hover:bg-emerald-50
                              active:scale-95
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {savingThisSession ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => deleteSession(session.id)}
                            aria-label="Delete session"
                            className="
                              flex h-8 w-8
                              items-center justify-center
                              rounded-lg border border-red-100
                              text-red-500
                              transition
                              hover:bg-red-50
                              active:scale-95
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* NOTE — always visible on mobile and desktop */}
                      <div className="mt-3">
                        <div className="mb-1.5 flex items-center gap-1.5">
                          <StickyNote className="h-3.5 w-3.5 text-slate-400" />

                          <span className="text-[11px] text-slate-400">
                            Session note
                          </span>
                        </div>

                        <textarea
                          disabled={isSaving}
                          value={sessionNotes[session.id] || ""}
                          onChange={(event) =>
                            handleSessionNoteChange(
                              session.id,
                              event.target.value,
                            )
                          }
                          placeholder="Add an optional note..."
                          className="
                            min-h-[58px] w-full resize-none
                            rounded-xl border border-slate-200
                            bg-white p-2.5
                            text-xs text-slate-700
                            outline-none transition
                            placeholder:text-slate-300
                            focus:border-blue-300
                            focus:ring-2 focus:ring-blue-100
                            disabled:cursor-not-allowed
                            disabled:bg-slate-50
                          "
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {mode === "manual" && (
        <div className="space-y-4 p-4">
          <div className="space-y-1.5">
            <label
              htmlFor="time-log-from"
              className="text-xs font-medium text-slate-600"
            >
              From
            </label>

            <input
              id="time-log-from"
              type="datetime-local"
              disabled={isSaving}
              value={manualForm.from}
              onChange={(event) =>
                setManualForm((previous) => ({
                  ...previous,
                  from: event.target.value,
                }))
              }
              className="
                h-10 w-full rounded-xl
                border border-slate-200
                bg-white px-3
                text-sm text-slate-700
                outline-none transition
                focus:border-blue-300
                focus:ring-2 focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="time-log-to"
              className="text-xs font-medium text-slate-600"
            >
              To
            </label>

            <input
              id="time-log-to"
              type="datetime-local"
              disabled={isSaving}
              min={manualForm.from || undefined}
              value={manualForm.to}
              onChange={(event) =>
                setManualForm((previous) => ({
                  ...previous,
                  to: event.target.value,
                }))
              }
              className="
                h-10 w-full rounded-xl
                border border-slate-200
                bg-white px-3
                text-sm text-slate-700
                outline-none transition
                focus:border-blue-300
                focus:ring-2 focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="time-log-note"
              className="text-xs font-medium text-slate-600"
            >
              Note
            </label>

            <textarea
              id="time-log-note"
              disabled={isSaving}
              value={manualForm.note}
              onChange={(event) =>
                setManualForm((previous) => ({
                  ...previous,
                  note: event.target.value,
                }))
              }
              placeholder="Add an optional note..."
              className="
                min-h-[80px] w-full resize-none
                rounded-xl border border-slate-200
                bg-white p-3
                text-sm text-slate-700
                outline-none transition
                placeholder:text-slate-300
                focus:border-blue-300
                focus:ring-2 focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-slate-50
              "
            />
          </div>

          <button
            type="button"
            disabled={isSaving || !manualForm.from || !manualForm.to}
            onClick={handleManualSave}
            className="
              flex h-10 w-full
              items-center justify-center gap-2
              rounded-xl bg-blue-600
              text-sm font-medium text-white
              transition
              hover:bg-blue-700
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSavingManual ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Manual Entry
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateTaskTimeLogModal;
