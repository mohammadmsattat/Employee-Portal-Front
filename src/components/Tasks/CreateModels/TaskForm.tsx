import { Input } from "@/components/ui/input";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

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
  return (
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
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
      {/* DATES */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* START DATE */}
        <div className="space-y-2">
          <Label>{t("tasks.startDate") || "Start Date"}</Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 w-full justify-start rounded-2xl border-slate-200"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />

                {formData.startDate
                  ? new Date(formData.startDate).toDateString()
                  : "Start date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="z-[9999] w-auto rounded-2xl p-2 bg-white">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) =>
                  setFormData((p) => ({ ...p, startDate: date }))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* DUE DATE */}
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
                  ? new Date(formData.dueDate).toDateString()
                  : "Due date"}
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
      {/* ASSIGN */}
      <div className="space-y-2">
        <Label>{t("tasks.assignTo")}</Label>

        <Select
          value={formData.assignedTo?.[0] || ""}
          onValueChange={(value) =>
            setFormData((p) => ({
              ...p,
              assignedTo: value ? [value] : [],
            }))
          }
        >
          <SelectTrigger className="h-12 rounded-2xl border-slate-200">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>

          <SelectContent className="z-[9999] bg-white">
            <SelectItem value="me">Me</SelectItem>

            {staffData?.map((s) => (
              <SelectItem key={s._id} value={s._id}>
                {s.fullName || s.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TAGS */}
      {/* {mode === "task" && (
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
      )} */}

      {/* ACTIONS */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 rounded-2xl border-slate-200"
          >
            {t("buttons.cancel")}
          </Button>
        )}

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="h-12 rounded-2xl bg-blue-600 text-white"
        >
          {mode === "task" ? t("buttons.create") : "Add Subtask"}
        </Button>
      </div>
    </div>
  );
};

export default TaskForm;
