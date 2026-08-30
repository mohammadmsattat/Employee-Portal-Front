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
import {
  Calendar as CalendarIcon,
  Users,
  ListChecks,
  AlertCircle,
  UserMinus,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import MemberSearchSelect from "@/components/ui/MemberSearchSelect";

type Mode = "task" | "subtask";

interface Props {
  mode: Mode;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;

  handleFieldChange?: (field: string, value: any) => void;

  assignedTo?: string[];
  addAssignee?: (userId: string) => void;
  removeAssignee?: (userId: string) => void;
  toggleAssignee?: (userId: string) => void;

  onSubmit: () => void;
  isLoading?: boolean;
  t: any;
  staffData?: any[];
  lists?: any[];
  onClose?: () => void;
  errors?: any;
}

const TaskForm = ({
  mode,
  formData,
  setFormData,
  handleFieldChange,

  assignedTo,
  addAssignee,
  removeAssignee,

  onSubmit,
  isLoading,
  t,
  staffData = [],
  lists = [],
  onClose,
  errors = {},
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

  // Use handleFieldChange from props or fallback to direct setFormData
  const onFieldChange =
    handleFieldChange ||
    ((field: string, value: any) => {
      setFormData((p: any) => ({ ...p, [field]: value }));
    });

  const assignedMemberIds: string[] = Array.isArray(assignedTo)
    ? assignedTo
    : Array.isArray(formData.assignedTo)
      ? formData.assignedTo
      : [];

  const staffList = Array.isArray(staffData) ? staffData : [];

  const availableStaff = staffList.filter(
    (staff) => !assignedMemberIds.includes(staff._id),
  );

  const handleAddAssignee = (userId: string) => {
    if (!userId) return;

    if (addAssignee) {
      addAssignee(userId);
      return;
    }

    const nextAssignedTo = Array.from(new Set([...assignedMemberIds, userId]));

    onFieldChange("assignedTo", nextAssignedTo);
  };

  const handleRemoveAssignee = (userId: string) => {
    if (removeAssignee) {
      removeAssignee(userId);
      return;
    }

    const nextAssignedTo = assignedMemberIds.filter((id) => id !== userId);

    onFieldChange("assignedTo", nextAssignedTo);
  };

  return (
    <div className="grid gap-4 sm:gap-5">
      {/* LIST SELECT - Only for task mode */}
      {mode === "task" && (
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-slate-700">
            <ListChecks className="mr-1.5 inline h-4 w-4 text-blue-500" />
            List <span className="text-red-500">*</span>
          </Label>

          <Select
            value={formData.list || ""}
            onValueChange={(value) => onFieldChange("list", value)}
          >
            <SelectTrigger
              className={`h-11 w-full rounded-2xl border ${
                errors.list
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200"
              } bg-white text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:rounded-lg`}
            >
              <SelectValue
                placeholder={t("tasks.selectList") || "Select a list..."}
              />
            </SelectTrigger>

            <SelectContent className="z-[9999] rounded-2xl border-slate-200 bg-white sm:rounded-lg max-h-[300px]">
              {lists.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  {t("tasks.noListsFound") || "No lists found"}
                </div>
              ) : (
                lists.map((list) => (
                  <SelectItem key={list._id} value={list._id}>
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-blue-500" />
                      <span>{list.name}</span>
                      {list._id === formData.list && (
                        <span className="ml-auto text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {errors.list && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.list}
            </p>
          )}
        </div>
      )}

      {/* TITLE */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium text-slate-700">
          {t("tasks.title")} <span className="text-red-500">*</span>
        </Label>

        <input
          className={`h-11 w-full rounded-2xl border ${
            errors.title
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200"
          } bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:rounded-lg`}
          placeholder={t("tasks.titlePlaceholder") || "Enter task title..."}
          value={formData.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
        />

        {errors.title && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />
            {errors.title}
          </p>
        )}
      </div>

      {/* STATUS + PRIORITY */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
        {/* STATUS */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("tasks.status")} <span className="text-red-500">*</span>
          </Label>

          <Select
            value={formData.status}
            onValueChange={(value) => onFieldChange("status", value)}
          >
            <SelectTrigger
              className={`h-11 w-full rounded-2xl border ${
                errors.status
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200"
              } bg-white text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:rounded-lg`}
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="z-[9999] rounded-2xl border-slate-200 bg-white sm:rounded-lg">
              {["todo", "in_progress", "review", "done", "cancelled"].map(
                (status) => (
                  <SelectItem
                    key={status}
                    value={status}
                    className="capitalize"
                  >
                    <span className={`inline-flex items-center gap-2`}>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          status === "todo"
                            ? "bg-slate-400"
                            : status === "in_progress"
                              ? "bg-blue-500"
                              : status === "review"
                                ? "bg-amber-500"
                                : status === "done"
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                        }`}
                      />
                      {status.replace("_", " ")}
                    </span>
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          {errors.status && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.status}
            </p>
          )}
        </div>

        {/* PRIORITY */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("tasks.priority")} <span className="text-red-500">*</span>
          </Label>

          <Select
            value={formData.priority}
            onValueChange={(value) => onFieldChange("priority", value)}
          >
            <SelectTrigger
              className={`h-11 w-full rounded-2xl border ${
                errors.priority
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-slate-200"
              } bg-white text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:rounded-lg`}
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="z-[9999] rounded-2xl border-slate-200 bg-white sm:rounded-lg">
              {["low", "medium", "high", "urgent"].map((priority) => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="capitalize"
                >
                  <span className={`inline-flex items-center gap-2`}>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        priority === "low"
                          ? "bg-slate-400"
                          : priority === "medium"
                            ? "bg-blue-500"
                            : priority === "high"
                              ? "bg-amber-500"
                              : "bg-red-500"
                      }`}
                    />
                    {priority}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.priority && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.priority}
            </p>
          )}
        </div>
      </div>

      {/* DATES */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
        {/* START DATE */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("tasks.startDate") || "Start Date"}{" "}
            <span className="text-red-500">*</span>
          </Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-11 w-full justify-start rounded-2xl border ${
                  errors.startDate
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200"
                } bg-white text-slate-900 hover:bg-slate-50 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:rounded-lg`}
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
                onSelect={(date) => onFieldChange("startDate", date)}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {errors.startDate && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.startDate}
            </p>
          )}
        </div>

        {/* DUE DATE */}
        <div>
          <Label className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("tasks.dueDate")} <span className="text-red-500">*</span>
          </Label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-11 w-full justify-start rounded-2xl border ${
                  errors.dueDate
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-slate-200"
                } bg-white text-slate-900 hover:bg-slate-50 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:rounded-lg`}
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
                onSelect={(date) => onFieldChange("dueDate", date)}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {errors.dueDate && (
            <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      {/* ASSIGN TO */}
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <Label className="block text-sm font-medium text-slate-700">
            <Users className="mr-1.5 inline h-4 w-4 text-blue-500" />

            {t("tasks.assignTo")}

            <span className="ml-1 text-red-500">*</span>
          </Label>

          {assignedMemberIds.length > 0 && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
              {assignedMemberIds.length}
            </span>
          )}
        </div>

        {/* SEARCH AND ADD */}
        {availableStaff.length > 0 ? (
          <div
            className={
              errors.assignedTo
                ? `
              rounded-2xl border border-red-300
              focus-within:ring-4
              focus-within:ring-red-100
              sm:rounded-lg
            `
                : ""
            }
          >
            <MemberSearchSelect
              options={availableStaff}
              selectedValue=""
              onChange={(userId) => {
                if (userId) {
                  handleAddAssignee(userId);
                }
              }}
              placeholder="Search employee..."
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500 sm:rounded-lg">
            {staffList.length === 0
              ? "No employees available"
              : "All employees are assigned"}
          </div>
        )}

        {/* SELECTED MEMBERS */}
        {assignedMemberIds.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {assignedMemberIds.map((userId) => {
              const staff = staffList.find((item) => item._id === userId);

              const displayName =
                staff?.fullName || staff?.email || "Selected employee";

              return (
                <div
                  key={userId}
                  className="
              flex max-w-full items-center gap-2
              rounded-full border border-blue-100
              bg-blue-50 px-3 py-1.5
              text-xs font-medium text-blue-700
            "
                >
                  <span className="max-w-[180px] truncate">{displayName}</span>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleRemoveAssignee(userId)}
                    aria-label={`Remove ${displayName}`}
                    className="
                flex h-5 w-5 shrink-0
                items-center justify-center
                rounded-full text-red-500
                transition
                hover:bg-red-100
                hover:text-red-600
                active:scale-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {errors.assignedTo && (
          <p className="mt-1.5 flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />

            {errors.assignedTo}
          </p>
        )}
      </div>

      {/* DESCRIPTION - No validation */}
      <div>
        <Label className="mb-1.5 block text-sm font-medium text-slate-700">
          {t("tasks.description")}
        </Label>

        <Textarea
          rows={4}
          className="min-h-[100px] resize-none rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:rounded-lg"
          placeholder={
            t("tasks.descriptionPlaceholder") || "Enter task description..."
          }
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
            className="h-11 w-full rounded-2xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 sm:w-auto sm:rounded-lg"
          >
            {t("buttons.cancel") || "Cancel"}
          </Button>
        )}

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="h-11 w-full rounded-2xl bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto sm:rounded-lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {t("buttons.creating") || "Creating..."}
            </span>
          ) : mode === "task" ? (
            t("buttons.create") || "Create Task"
          ) : (
            t("tasks.addSubtask") || "Add Subtask"
          )}
        </Button>
      </div>
    </div>
  );
};

export default TaskForm;
