import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar as CalendarIcon, X, Plus } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useAddTaskModal } from "@/hooks/Tasks/useAddTaskModal";

const AddTaskModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const { formData, setFormData, handleSubmit, isLoading } = useAddTaskModal({
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center">
      <div className="w-full sm:max-w-3xl">
        <div className="max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:my-8 sm:max-h-none sm:rounded-[32px]">
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
            <div className="space-y-5">
              {/* TITLE */}
              <div className="space-y-2">
                <Label>{t("tasks.title")} *</Label>
                <Input
                  className="h-12 rounded-2xl border-slate-200"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label>{t("tasks.description")}</Label>
                <Textarea
                  rows={4}
                  className="rounded-2xl border-slate-200"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* STATUS + PRIORITY */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("tasks.status")}</Label>

                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((p) => ({ ...p, status: value }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent className="z-[9999] bg-white">
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("tasks.priority")}</Label>

                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData((p) => ({ ...p, priority: value }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent className="z-[9999] bg-white">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ASSIGN */}
              <div className="space-y-2">
                <Label>{t("tasks.assignTo")}</Label>

                <Select
                  value={formData.assignedTo}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, assignedTo: value }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="z-[9999] bg-white">
                    <SelectItem value="me">Me</SelectItem>
                    <SelectItem value="ahmad">Ahmad</SelectItem>
                    <SelectItem value="sara">Sara</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* DATE */}
              <div className="space-y-2">
                <Label>{t("tasks.dueDate")}</Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start rounded-2xl border-slate-200"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                      {formData.dueDate
                        ? formData.dueDate.toDateString()
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="z-[9999] w-auto rounded-2xl p-2 bg-white">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) =>
                        setFormData((p) => ({ ...p, dueDate: date }))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* TAGS */}
              <div className="space-y-2">
                <Label>{t("tasks.tags")}</Label>
                <Input
                  className="h-12 rounded-2xl border-slate-200"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, tags: e.target.value }))
                  }
                />
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="h-12 rounded-2xl border-slate-200"
                >
                  {t("buttons.cancel")}
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="h-12 rounded-2xl bg-blue-600 text-white"
                >
                  {t("buttons.create")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
