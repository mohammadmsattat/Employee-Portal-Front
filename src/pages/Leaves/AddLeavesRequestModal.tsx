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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  Upload,
  FileText,
  X,
  Paperclip,
} from "lucide-react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useAddLeaveRequestModal } from "@/hooks/Leaves/useAddLeaveRequest";

const AddLeaveRequestModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const {
    formData,
    setFormData,
    isSubmitting,
    leaveTypesData,
    isLeaveTypesLoading,
    numberOfDays,
    handleDateSelect,
    handleSubmit,
    isHoliday,
    group,
    getLeaveTypeName,
    selectedLeave,
  } = useAddLeaveRequestModal({ isOpen, onClose });

  if (!isOpen) return null;

  const remainingDays = selectedLeave?.remainingDays ?? 0;
  const totalAllowed = selectedLeave?.totalAllowed ?? 0;

  const dateFields = ["startDate", "endDate"] as const;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-950/55 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-20px_80px_rgba(15,23,42,0.28)] sm:max-w-3xl sm:rounded-2xl">
        {/* Header with Gradient matching Layout */}
        <div className="relative overflow-hidden px-5 py-4 sm:px-7 sm:py-5" style={{
          background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.12), rgba(244, 247, 251, 0))'
        }}>
          {/* Decorative blur elements */}
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl" />
          <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-indigo-200/20 blur-2xl" />

          <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-blue-200/40 sm:hidden" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:rounded-xl bg-blue-100/60 text-blue-600 ring-1 ring-blue-200/40">
                <FileText className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-blue-600/80">
                  {selectedLeave
                    ? t("leaveModal.editLeaveRequest") || "Edit Leave Request"
                    : t("buttons.requestLeave") || "Request Leave"}
                </p>

                <h3 className="text-lg font-bold text-blue-900">
                  {selectedLeave
                    ? t("leaveModal.editLeaveRequest") || "Edit Leave Request"
                    : t("buttons.requestLeave") || "Request Leave"}
                </h3>
              </div>
            </div>

            <button
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-white/60 text-slate-400 transition hover:bg-white/80 hover:text-slate-600 backdrop-blur-sm"
              onClick={onClose}
              type="button"
              aria-label={t("buttons.cancel")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {formData.leaveType && (
            <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200/30 backdrop-blur-sm">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>
                {remainingDays} / {totalAllowed}{" "}
                {t("leaveModal.daysRemaining") || "days remaining"}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-4">
            {/* Leave Type */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("leaveModal.leaveType") || "Leave Type"}{" "}
                <span className="text-red-500">*</span>
              </Label>

              <Select
                value={formData.leaveType}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, leaveType: v }))
                }
                disabled={isLeaveTypesLoading}
              >
                <SelectTrigger className="h-11 rounded-2xl sm:rounded-lg border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500">
                  <SelectValue
                    placeholder={
                      isLeaveTypesLoading
                        ? t("overtimeModal.loading") || "Loading..."
                        : t("leaveModal.selectLeaveType") || "Select leave type"
                    }
                  />
                </SelectTrigger>

                <SelectContent className="rounded-2xl sm:rounded-lg border-slate-200">
                  {leaveTypesData?.data?.map((type) => (
                    <SelectItem key={type._id} value={type._id}>
                      {getLeaveTypeName(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              {dateFields.map((field) => (
                <div key={field}>
                  <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {field === "startDate"
                      ? t("leaveModal.startDate") || "Start Date"
                      : t("leaveModal.endDate") || "End Date"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-11 w-full justify-start rounded-2xl sm:rounded-lg border-slate-200 bg-white text-left font-medium text-slate-900 hover:bg-slate-50",
                          !formData[field] && "text-slate-400",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                        {formData[field]
                          ? format(formData[field], "P")
                          : field === "startDate"
                            ? t("leaveModal.selectStartDate") ||
                              "Select start date"
                            : t("leaveModal.selectEndDate") ||
                              "Select end date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="z-[1000] w-auto rounded-2xl sm:rounded-lg border-slate-200 p-2 shadow-lg"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={formData[field]}
                        onSelect={(date) => handleDateSelect(field, date)}
                        initialFocus
                        className="pointer-events-auto"
                        modifiers={{
                          holiday: (date) =>
                            group?.calendarRules?.some((rule) => {
                              if (rule.effectType !== "FULL_DAY_OFF")
                                return false;

                              const target = new Date(date);

                              if (rule.patternType === "SINGLE_DATE") {
                                return isSameDay(
                                  target,
                                  new Date(rule.startDate),
                                );
                              }

                              if (rule.patternType === "RECURRING_WEEKLY") {
                                const weekDays = [
                                  "Sunday",
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                ];

                                return rule.daysOfWeek?.includes(
                                  weekDays[target.getDay()],
                                );
                              }

                              if (rule.patternType === "DATE_RANGE") {
                                const start = new Date(rule.startDate);
                                const end = new Date(rule.endDate);

                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                target.setHours(0, 0, 0, 0);

                                return target >= start && target <= end;
                              }

                              if (rule.patternType === "RECURRING_MONTHLY") {
                                const dayOfMonth = rule.dayOfMonth;
                                return target.getDate() === dayOfMonth;
                              }

                              return false;
                            }),
                        }}
                        modifiersClassNames={{
                          holiday: "bg-red-100 text-red-700 rounded-full",
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>

            {/* Number of Days */}
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl sm:rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <CalendarIcon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700">
                      {t("leaveModal.numberOfDays") || "Number of Days"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 truncate">
                      {formData.startDate && formData.endDate
                        ? `${format(formData.startDate, "PP")} - ${format(
                            formData.endDate,
                            "PP",
                          )}`
                        : t("leaveModal.selectStartDate") ||
                          "Select start date"}
                    </p>
                  </div>
                </div>

                <Input
                  value={numberOfDays}
                  readOnly
                  className="h-10 w-full rounded-2xl sm:rounded-lg border-slate-200 bg-white text-center text-base font-bold text-blue-900 shadow-none sm:w-[100px]"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("leaveModal.reason") || "Reason"}{" "}
                <span className="text-red-500">*</span>
              </Label>

              <Textarea
                placeholder={
                  t("leaveModal.provideReason") ||
                  "Provide a reason for your leave request"
                }
                value={formData.reason}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, reason: e.target.value }))
                }
                rows={4}
                className="min-h-[100px] resize-none rounded-2xl sm:rounded-lg border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            {/* Attachment */}
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("leaveModal.attachment") || "Attachment"}{" "}
                <span className="text-xs font-normal text-slate-400">
                  ({t("leaveModal.optional") || "optional"})
                </span>
              </Label>

              <div
                className="cursor-pointer rounded-2xl sm:rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition hover:border-blue-300 hover:bg-blue-50/30"
                onClick={() => document.getElementById("file-input")?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file)
                    setFormData((prev) => ({ ...prev, attachment: file }));
                }}
              >
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file)
                      setFormData((prev) => ({ ...prev, attachment: file }));
                  }}
                />

                {!formData.attachment ? (
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                      <Upload className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700">
                        {t("leaveModal.clickUploadOrDrag") ||
                          "Click to upload or drag & drop"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        PDF, JPG, PNG
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:rounded-lg bg-blue-50 text-blue-600">
                        <Paperclip className="h-4 w-4" />
                      </div>

                      <span className="truncate text-sm font-medium text-slate-700">
                        {formData.attachment.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData((prev) => ({
                          ...prev,
                          attachment: null,
                        }));
                      }}
                      aria-label={t("buttons.cancel")}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-11 w-full rounded-2xl sm:rounded-lg border-slate-200 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              {t("buttons.cancel") || "Cancel"}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-11 w-full rounded-2xl sm:rounded-lg bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting
                ? t("buttons.submitting") || "Submitting..."
                : t("buttons.submitRequest") || "Submit Request"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeaveRequestModal;