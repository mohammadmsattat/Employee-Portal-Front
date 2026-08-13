// AddTaskModal.jsx - النسخة المُصححة

import { useTranslation } from "react-i18next";
import { X, Plus, ClipboardList, ListChecks } from "lucide-react";
import { useAddTaskModal } from "@/hooks/Tasks/CreateModels/useCreateTaskModal";
import TaskForm from "./TaskForm";
import { useEffect } from "react";

const AddTaskModal = ({ isOpen, onClose, listId, workspaceId, allLists }) => {
  const { t } = useTranslation();

  const {
    data,
    formData,
    setFormData,
    handleFieldChange,
    handleSubmit,
    isLoading,
    errors,
  } = useAddTaskModal({
    isOpen,
    onClose,
    listId,
  });

  // ✅ استخدام useEffect بدلاً من التنفيذ المباشر
  useEffect(() => {
    if (isOpen && workspaceId && formData.workspace !== workspaceId) {
      setFormData((prev) => ({
        ...prev,
        workspace: workspaceId || "",
      }));
    }
  }, [isOpen, workspaceId, formData.workspace, setFormData]);

  // ✅ تحديث الـ List عند تغيير الـ workspace أو listId
  useEffect(() => {
    if (isOpen && listId && formData.list !== listId) {
      setFormData((prev) => ({
        ...prev,
        list: listId || "",
      }));
    }
  }, [isOpen, listId, formData.list, setFormData]);

  if (!isOpen) return null;

  // الحصول على الـ List الحالية
  const currentList = allLists?.find((l) => l._id === formData.list);

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-4 md:p-6">
      <div className="flex max-h-[96vh] w-full flex-col rounded-t-[28px] bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-h-[92vh] sm:max-w-3xl sm:rounded-2xl">
        {/* ===== HEADER ===== */}
        <div
          className="relative shrink-0 overflow-hidden px-4 py-3.5 sm:px-6 sm:py-4 md:px-7 md:py-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(37, 99, 235, 0.12), rgba(244, 247, 251, 0))",
          }}
        >
          {/* Decorative blur elements */}
          <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full bg-blue-200/20 blur-2xl sm:-right-10 sm:-top-12 sm:h-32 sm:w-32" />
          <div className="absolute -left-8 top-6 h-20 w-20 rounded-full bg-indigo-200/20 blur-2xl sm:-left-10 sm:top-8 sm:h-24 sm:w-24" />

          {/* Mobile handle */}
          <div className="mx-auto mb-2.5 h-1 w-12 rounded-full bg-slate-300/60 sm:hidden" />

          <div className="relative flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100/60 text-blue-600 ring-1 ring-blue-200/40 sm:h-11 sm:w-11 sm:rounded-xl">
                <ClipboardList className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-blue-600/80 sm:text-xs">
                  {t("tasks.newTask")}
                </p>

                <h3 className="text-base font-bold text-blue-900 sm:text-lg">
                  {t("tasks.createTask")}
                </h3>

                {currentList && (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <ListChecks className="h-3 w-3" />
                    {t("tasks.inList") || "In list"}: {currentList.name}
                    {currentList.folderName && (
                      <span className="text-slate-400">
                        ({currentList.folderName})
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-slate-600 backdrop-blur-sm sm:h-9 sm:w-9 sm:rounded-lg"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 md:px-7 md:py-6">
          <TaskForm
            mode="task"
            formData={formData}
            setFormData={setFormData}
            handleFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            t={t}
            staffData={data?.data}
            lists={allLists || []}
            onClose={onClose}
            errors={errors}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
