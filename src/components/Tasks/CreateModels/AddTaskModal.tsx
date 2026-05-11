import { useTranslation } from "react-i18next";
import { X, Plus } from "lucide-react";
import { useAddTaskModal } from "@/hooks/Tasks/CreateModels/useCreateTaskModal";
import TaskForm from "./TaskForm";

const AddTaskModal = ({ isOpen, onClose, listId, workspaceId  }) => {
  const { t } = useTranslation();

  const { data, formData, setFormData, handleSubmit, isLoading } =
    useAddTaskModal({
      isOpen,
      onClose,
      workspaceId
    });

  if (!isOpen) return null;

  // 🔥 inject list + workspace into formData once modal opens
  // (prevent overwriting every render)
  if (
    isOpen &&
    (formData.list !== listId || formData.workspace !== workspaceId)
  ) {
    setFormData((prev) => ({
      ...prev,
      list: listId || "",
      workspace: workspaceId || "",
    }));
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-3xl">
        <div className="max-h-[88vh]  rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:my-8 sm:max-h-none sm:rounded-[32px]">
          {/* HEADER */}
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200/70 pb-4">
              <div>
                <div className="mb-2 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <Plus className="me-1 h-3 w-3" />
                  {t("tasks.newTask")}
                </div>

                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {t("tasks.createTask")}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {t("tasks.fillDetails")}
                </p>
              </div>

              <button
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* BODY */}
            <TaskForm
              mode="task"
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              t={t}
              staffData={data?.data}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
