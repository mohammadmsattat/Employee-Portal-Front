// TaskForm.jsx - نسخة محسنة بتصميم متطابق مع المنصة

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { Calendar as CalendarIcon, Users, Tag, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import MemberSearchSelect from "@/components/ui/MemberSearchSelect";

type Mode = "task" | "subtask";

interface Props {
  mode: Mode;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  isLoading?: boolean;
  t: any;
  staffData?: any[];
  onClose?: () => void;
}

const TaskForm = ({
  mode,
  formData,
  setFormData,
  onSubmit,
  isLoading,
  t,
  staffData = [],
  onClose,
}: Props) => {
  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      todo: "bg-slate-100 text-slate-700",
      in_progress: "bg-blue-100 text-blue-700",
      review: "bg-amber-100 text-amber-700",
      done: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-slate-100 text-slate-700";
  };

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-slate-100 text-slate-600",
      medium: "bg-blue-100 text-blue-600",
      high: "bg-amber-100 text-amber-600",
      urgent: "bg-red-100 text-red-600",
    };
    return colors[priority] || "bg-slate-100 text-slate-600";
  };

  return (
    <div className="grid gap-4 sm:gap-5">
      {/* TITLE */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium text-slate-700">
          {t("tasks.title")} <span className="text-red-500">*</span>
        </Label>

        <input
          className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:rounded-lg"
          placeholder={t("tasks.titlePlaceholder") || "Enter task title..."}
          value={formData.title}
          onChange={(e) =>
            setFormData((p) => ({ ...p, title: e.target.value }))
          }
        />
      </div>

      {/* STATUS + PRIORITY */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
        {/* STATUS */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("tasks.status")}
          </Label>

          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData((p) => ({ ...p, status: value }))
            }
          >
            <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 sm:rounded-lg">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="z-[9999] rounded-2xl border-slate-200 bg-white sm:rounded-lg">
              {["todo", "in_progress", "review", "done", "cancelled"].map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  <span className={`inline-flex items-center gap-2`}>
                    <span className={`h-2 w-2 rounded-full ${
                      status === "todo" ? "bg-slate-400" :
                      status === "in_progress" ? "bg-blue-500" :
                      status === "review" ? "bg-amber-500" :
                      status === "done" ? "bg-emerald-500" :
                      "bg-red-500"
                    }`} />
                    {status.replace("_", " ")}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* PRIORITY */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("tasks.priority")}
          </Label>

          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData((p) => ({ ...p, priority: value }))
            }
          >
            <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 sm:rounded-lg">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="z-[9999] rounded-2xl border-slate-200 bg-white sm:rounded-lg">
              {["low", "medium", "high", "urgent"].map((priority) => (
                <SelectItem key={priority} value={priority} className="capitalize">
                  <span className={`inline-flex items-center gap-2`}>
                    <span className={`h-2 w-2 rounded-full ${
                      priority === "low" ? "bg-slate-400" :
                      priority === "medium" ? "bg-blue-500" :
                      priority === "high" ? "bg-amber-500" :
                      "bg-red-500"
                    }`} />
                    {priority}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DATES */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
        {/* START DATE */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("tasks.startDate") || "Start Date"}
          </Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full justify-start rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50 sm:rounded-lg"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                {formData.startDate ? (
                  formatDate(formData.startDate)
                ) : (
                  <span className="text-slate-400">Select start date</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="z-[9999] w-auto rounded-2xl border-slate-200 bg-white p-2 shadow-lg sm:rounded-lg">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) =>
                  setFormData((p) => ({ ...p, startDate: date }))
                }
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* DUE DATE */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("tasks.dueDate")}
          </Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full justify-start rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50 sm:rounded-lg"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                {formData.dueDate ? (
                  formatDate(formData.dueDate)
                ) : (
                  <span className="text-slate-400">Select due date</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="z-[9999] w-auto rounded-2xl border-slate-200 bg-white p-2 shadow-lg sm:rounded-lg">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) =>
                  setFormData((p) => ({ ...p, dueDate: date }))
                }
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* ASSIGN TO */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium text-slate-700">
          <Users className="mr-1.5 inline h-4 w-4 text-blue-500" />
          {t("tasks.assignTo")}
        </Label>

        <MemberSearchSelect
          options={staffData || []}
          selectedValue={formData.assignedTo?.[0] || ""}
          onChange={(id) =>
            setFormData((prev) => ({
              ...prev,
              assignedTo: id ? [id] : [],
            }))
          }
          placeholder="Search employee..."
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium text-slate-700">
          {t("tasks.description")}
        </Label>

        <Textarea
          rows={4}
          className="min-h-[100px] resize-none rounded-2xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 sm:rounded-lg"
          placeholder={t("tasks.descriptionPlaceholder") || "Enter task description..."}
          value={formData.description}
          onChange={(e) =>
            setFormData((p) => ({
              ...p,
              description: e.target.value,
            }))
          }
        />
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:gap-3 sm:justify-end">
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            className="h-11 w-full rounded-2xl border-slate-200 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto sm:rounded-lg"
          >
            {t("buttons.cancel") || "Cancel"}
          </Button>
        )}

        <Button
          onClick={onSubmit}
          disabled={isLoading || !formData.title?.trim()}
          className="h-11 w-full rounded-2xl bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto sm:rounded-lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {t("buttons.creating") || "Creating..."}
            </span>
          ) : (
            mode === "task" ? t("buttons.create") || "Create Task" : "Add Subtask"
          )}
        </Button>
      </div>
    </div>
  );
};

export default TaskForm;